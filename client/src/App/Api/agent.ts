import axios, { AxiosResponse } from "axios"
import ActivityDashboard from "../../Features/activities/dashboard/ActivityDashboard";
import { Activity } from "../Models/Activity";

const sleep = (time: number)=>{
    return new Promise(resolve=>{
        setTimeout(resolve, time);
    });
}

axios.defaults.baseURL = "http://localhost:5000/api";

axios.interceptors.response.use(async (response) =>{
    try {
        await sleep(1000);
        return response;
    } catch (error) {
        console.log(error);
        return Promise.reject(error);
    }
})
const responseBody = <T>(response: AxiosResponse<T>) => response.data;

const request={
    get: <T>(url: string) => axios.get<T>(url).then(responseBody),
    post: <T>(url: string, body: {}) => axios.post<T>(url, body).then(responseBody),
    put: <T>(url: string, body: {}) => axios.put<T>(url, body).then(responseBody),
    delete: <T>(url: string) => axios.delete<T>(url).then(responseBody)
    
}

const Activities={

    list: ()=>request.get<Activity[]>("/activities"),
    details: (id: string)=>request.get<Activity>(`/activities/${id}`),
    post: (activity: Activity)=>request.post<void>("/activities", activity),
    edit: (activity: Activity)=>request.put<void>("/activities/"+activity.id, activity),
    delete: (id: string)=>request.delete<void>("/activities/"+id)
}

const agent={
    Activities
}

export default agent;