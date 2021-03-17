import { makeAutoObservable, runInAction} from "mobx";
import agent from "../Api/agent";
import { Activity } from "../Models/Activity";

export default class ActivityStore
{
    
    activityMap = new Map<string, Activity>();

    selectedActivity: Activity | undefined = undefined;
    openForm = false;
    updating = false;
    isLoading = false;
    deletingId: string | null = null;
    
    constructor()
    {
        makeAutoObservable(this);       
    }

    activitiesByDate = ()=>
    {
        const activities = Array.from(this.activityMap.values()).sort((a, b)=>
        {
            return a.date!.getTime()-b.date!.getTime();
        });        
        return activities;
    
    }
    
    get groupActivtiesByDate()
    {

        return Object.entries(this.activitiesByDate().reduce((activities, activity)=>
        {
            const date = activity.date!.toISOString().split("T")[0];
            activities[date] = activities[date] ? [...activities[date], activity] : [activity];
            
            return activities;
            
        }, {} as {[key: string]: Activity[]} ))
    }

    getActivity = async (id: string)=>
    {
        let activity = this.activityMap.get(id);
        
        if(activity)
        {
            runInAction(()=>
            {
                this.selectedActivity = activity;
            })
            return activity;

        }
        else
        {
            this.setLoading(true);

            try
            {
                activity = await agent.Activities.details(id);
                
                
                this.insertActivity(activity);
                runInAction(()=>
                {
                    this.selectedActivity = activity;

                });
                this.setLoading(false);
                
                return activity;
            }
            catch(error)
            {
                console.log(error);
                this.setLoading(false);
            }
        }
    }

    insertActivity(activity: Activity)
    {
        activity.date = new Date(activity.date!);
        this.activityMap.set(activity.id, activity);
    }

    loadActivities = async () =>
    {
        this.setLoading(true);

        try
        {
            const res = await agent.Activities.list();
            res.forEach((activity)=>
            {
                activity.date = new Date(activity.date!);
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
    
    editActivity = async(activity: Activity)=>
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

    addActivity = async (activity: Activity)=>
    {
            this.setUpdating(true);
            
            
            
            try
            {
                await agent.Activities.post(activity);
                this.activityMap.set(activity.id, activity);
                this.setUpdating(false);
            }
            catch(error)
            {
                console.log(error);
                this.setUpdating(false);
            }
    }
    
    

}

