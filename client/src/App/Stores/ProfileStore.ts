import { makeAutoObservable, runInAction } from "mobx";
import agent from "../Api/agent";
import { EditProfile, Photo, Profile } from "../Models/profile";
import { store } from "./store";

export default class ProfileStore
{
    profile: Profile | null = null;
    loadingProfile = false;
    uploading = false;
    loading = false;

    constructor()
    {
        makeAutoObservable(this);
    }

    get isCurrentUser()
    {
        if(store.userStore.user && this.profile)
        {
            return store.userStore.user.username === this.profile.userName;
        }
        return false;
    }

    loadProfile = async (username: string)=>
    {
        runInAction(()=>
        {
            this.loadingProfile = true;

        })
        try
        {
            const profile = await agent.Profiles.get(username);
            runInAction(()=>
            {
                this.profile=profile;
            })
           

                
        }
        catch(err)
        {
            console.log(err)
        }
        finally
        {
            runInAction(()=>
            {
                this.loadingProfile = false;

            })
        }
    }

    uploadPhoto = async (file:Blob)=>
    {
        runInAction(()=>
        {
            this.uploading = true;
        })
        

        try
        {
            const response = await agent.Profiles.uploadPhoto(file);
            const photo = response.data;
            runInAction(()=>
            {
                if(this.profile)
                {
                    this.profile.photos?.push(photo);
                    if(photo.isMain && store.userStore.user)
                    {
                        store.userStore.setImage(photo.url);
                        this.profile.image = photo.url;
                    }
                }
                
            });
        }
        catch(err)
        {
            console.log(err);
        }
        finally
        {
            this.uploading = false;
        }
    }

    setMainPhoto= async (photo: Photo)=>
    {
        this.loading = true;

        try
        {
            await agent.Profiles.setMainPhoto(photo.id);
            store.userStore.setImage(photo.url);
            runInAction(()=>
            {
                if(this.profile && this.profile.photos)
                {
                    this.profile.photos.find(p=>p.isMain)!.isMain = false;
                    this.profile.photos.find(p=>p.id===photo.id)!.isMain = true;
                    this.profile.image = photo.url;
                    this.loading = false;
                }
            })
        }
        catch(err)
        {
            console.log(err);
        }
        finally
        {
            runInAction(()=>
            {
             this.loading = false;

            })
        }
    }

    deletePhoto= async (photo: Photo)=>
    {
        this.loading = true;
        try
        {
            await agent.Profiles.deletePhoto(photo.id);
            runInAction(()=>
            {if(this.profile && this.profile.photos)
            {
                this.profile.photos = this.profile.photos.filter(p=>p.id !== photo.id);
            }});
        }
        catch(err)
        {
            console.log(err);
        }
        finally
        {
            runInAction(()=>
            {
                this.loading = false;

            })
        }
    }

    editProfileHandler = async (editProf: EditProfile)=>
    {
        this.loading = true;
        try
        {
            if(this.profile)
            {
                this.profile.bio = editProf.bio;
                this.profile.displayName = editProf.displayName;
                await agent.Profiles.edit(editProf);
            }
        }
        catch(err)
        {
            console.log(err);
        }
        finally
        {
            runInAction(()=>
            {
                this.loading = false;
            })
        }
    }
}