import { makeAutoObservable, runInAction } from "mobx";
import agent from "../Api/agent";
import { Profile } from "../Models/profile";
import { store } from "./store";

export default class ProfileStore
{
    profile: Profile | null = null;
    loadingProfile = false;

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
        this.loadingProfile = true
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
            this.loadingProfile = false;
        }
    }
}