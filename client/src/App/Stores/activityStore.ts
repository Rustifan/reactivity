import { makeAutoObservable} from "mobx";
import agent from "../Api/agent";
import { Activity } from "../Models/Activity";
import {v4 as uuid } from "uuid"

export default class ActivityStore
{
    
    activityMap = new Map<string, Activity>();

    selectedActivity: Activity | undefined = undefined;
    openForm = false;
    updating = false;
    isLoading = true;
    deletingId: string | null = null;
    
    constructor()
    {
        makeAutoObservable(this);       
    }

    activitiesByDate = ()=>
    {
        const activities = Array.from(this.activityMap.values()).sort((a, b)=>
        {
            return Date.parse(a.date)-Date.parse(b.date);
        });        
        return activities;
    
    }

    loadActivities = async () =>
    {
        this.setLoading(true);

        try
        {
            const res = await agent.Activities.list();
            res.forEach((activity)=>
            {
                activity.date = activity.date.split("T")[0];
                this.activityMap.set(activity.id, activity);
            });
            this.setLoading(false);
        }
        catch(error)
        {
            console.log(error);
            this.setLoading(false);
        }
        
    }

    setLoading = (loading: boolean)=>
    {
        this.isLoading = loading;
    }

    selectActivity = (id: string)=>
    {
        const activity = this.activityMap.get(id);
        this.selectedActivity = activity;
    }

    cancelSelection = () =>
    {
        this.selectedActivity = undefined;
    }

    handleOpenForm = (id? : string)=>
    {
        id? this.selectActivity(id) : this.cancelSelection();
        this.openForm = true;
    }

    handleCloseForm = ()=>
    {
        this.openForm = false;
    }

    setUpdating = (updating: boolean)=>
    {
        this.updating = updating;
    }

    deleteActivity = async (id: string)=>
    {
        this.setUpdating(true);
        this.deletingId = id;
        try
        {
            await agent.Activities.delete(id);
            this.activityMap.delete(id);
            this.setUpdating(false);
            
        }
        catch(error)
        {
            console.log(error);
            this.setUpdating(false);
        }
        
    }
    
    editOrAddActivity = async (activity: Activity)=>
    {
        if(activity.id)
        {
            this.setUpdating(true);
            this.activityMap.set(activity.id, activity);
            
            try
            {
                await agent.Activities.edit(activity);
                
                this.setUpdating(false);
            }
            catch(error)
            {
                console.log(error);
                this.setUpdating(false);
            }
        }
        else
        {
            this.setUpdating(true);
            const id = uuid();
            const newActivity = {...activity, id};
            try
            {
                await agent.Activities.post(newActivity);
                this.activityMap.set(id, newActivity);
                this.setUpdating(false);
            }
            catch(error)
            {
                console.log(error);
                this.setUpdating(false);
            }
        }
        this.handleCloseForm();
    }



}

