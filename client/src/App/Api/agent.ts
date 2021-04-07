import axios, { AxiosError, AxiosResponse } from "axios"
import { toast } from "react-toastify";
import { Activity, ActivityFormValues } from "../Models/Activity";
import {history} from "../../";
import { store } from "../Stores/store";
import { User, UserFormValues } from "../Models/user";
import { EditProfile, Photo, Profile, UserActivity } from "../Models/profile";
import { PaginatedResult } from "../Models/pagination";
import { URLSearchParams } from "node:url";


const sleep = (time: number)=>
{
    return new Promise(resolve=>{
        setTimeout(resolve, time);
    });
}

axios.defaults.baseURL = process.env.REACT_APP_API_URL;


axios.interceptors.request.use((config)=>
{
    const token = store.commonStore.token;
    if(token) config.headers.Authorization = `Bearer ${token}`;
    return config;
})

axios.interceptors.response.use(async (response) =>
{

    if(process.env.NODE_ENV === "development")
    {
        await sleep(1000);

    }
    const pagination = response.headers["pagination"];
    if(pagination)
    {
        response.data = new PaginatedResult(response.data, JSON.parse(pagination));
        return response as AxiosResponse<PaginatedResult<any>>;
    }
    return response;
},(error: AxiosError)=>
{
    const {data, status, config, headers} = error.response!;
    switch(status)
    {
        case 400:
            if(typeof data === "string")
            {
                toast.error(data);
            }
            if(config.method ==="put" && data.errors.hasOwnProperty("id"))
            {
                history.push("/not-found");
            }
            if(data.errors)
            {
                const modalStateErrors = [];
                for(const key in data.errors)
                {
                    if(data.errors[key])
                    {
                        modalStateErrors.push(data.errors[key]);
                    }
                }
                throw modalStateErrors.flat();
            }

            break;
        case 401:
            if(status===401 && headers["www-authenticate"].startsWith('Bearer error="invalid_token"'))
            {
                store.userStore.logout();
                toast.error("Session expired. Please login again");

            }
            break;
        case 404:
            toast.error("not found");
            history.push("/notfound");
            break;
        case 500:
            toast.error("server error");
            store.commonStore.setServerError(data);
            history.push("/server-error");
            break;
    }
    return Promise.reject(error);

})

const responseBody = <T>(response: AxiosResponse<T>) => response.data;

const request=
{
    get: <T>(url: string) => axios.get<T>(url).then(responseBody),
    post: <T>(url: string, body: {}) => axios.post<T>(url, body).then(responseBody),
    put: <T>(url: string, body: {}) => axios.put<T>(url, body).then(responseBody),
    delete: <T>(url: string) => axios.delete<T>(url).then(responseBody)
    
}

const Activities=
{

    list: (params: URLSearchParams)=>axios.get<PaginatedResult<Activity[]>>("/activities", {params}).then(responseBody),
    details: (id: string)=>request.get<Activity>(`/activities/${id}`),
    post: (activity: ActivityFormValues)=>request.post<void>("/activities", activity),
    edit: (activity: ActivityFormValues)=>request.put<void>("/activities/"+activity.id, activity),
    delete: (id: string)=>request.delete<void>("/activities/"+id),
    attend: (id: string)=>request.post<void>(`/activities/${id}/attend`, {})
}

const Account=
{
    current: ()=>request.get<User>("/account"),
    login: (user: UserFormValues)=>request.post<User>("/account/login", user),
    register: (user: UserFormValues)=>request.post<User>("/account/register", user),
    fbLogin: (acessToken: string)=>request.post<User>("/account/fbLogin?accessToken="+acessToken, {}),
    refreshToken: ()=>request.post<User>("/account/refreshToken", {})
}

const Profiles=
{
    get: (username: string)=>request.get<Profile>("/profiles/"+username),
    uploadPhoto: (file: Blob)=>{
        let formData = new FormData();
        formData.append("File", file);
        return axios.post<Photo>("photos", formData, {
            headers: {"Content-type": "multipart/form-data"}
        })
    },
    setMainPhoto: (id: string)=>request.post(`/photos/${id}/setmain`, {}),
    deletePhoto: (id: string)=>request.delete("/photos/"+id),
    edit: (editProfile: EditProfile)=>request.put("/profiles", editProfile),
    updateFollowing: (username: string)=>request.post("/follow/"+username, {}),
    listFollowings: (username: string, predicate: string)=>
        request.get<Profile[]>(`/follow/${username}?predicate=${predicate}`),
    listActivities: (username: string, predicate: string) =>
        request.get<UserActivity[]>(`/profiles/${username}/activities?predicate=${predicate}`)
}

const agent={
    Activities,
    Account,
    Profiles
}

export default agent;