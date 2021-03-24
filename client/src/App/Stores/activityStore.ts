import { makeAutoObservable, runInAction} from "mobx";
import agent from "../Api/agent";
import { Activity, ActivityFormValues } from "../Models/Activity";
import { Profile } from "../Models/profile";
import { store } from "./store";


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
        const user = store.userStore.user;
        if(user)
        {
            activity.isGoing = activity.attendees?.some((profile)=>
            {
                return profile.userName === user.username;
            })
            activity.isHost = activity.hostUsername === user.username;
            activity.host = activity.attendees?.find(profile=>
                {
                    return profile.userName === activity.hostUsername;
                })

        }
        

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
                this.insertActivity(activity);
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
    
    editActivity = async(activity: ActivityFormValues)=>
    {
            
        try
        {
            await agent.Activities.edit(activity);
            runInAction(()=>
            {
                if(activity.id)
                {
                    let updatedActivity = {...this.activityMap.get(activity.id), ...activity};
                    this.activityMap.set(activity.id, updatedActivity as Activity);
                    this.selectedActivity = updatedActivity as Activity;
                }
            })
            
            
        }
        catch(error)
        {
            console.log(error);
            
        }
    }

    addActivity = async (activity: ActivityFormValues)=>
    {
            
            
            const user = store.userStore.user;
            const attendee = new Profile(user!);
            
            try
            {
                await agent.Activities.post(activity);
                const newActivity = new Activity(activity);
                newActivity.hostUsername = user!.username;
                newActivity.attendees = [attendee];
                this.insertActivity(newActivity);
                runInAction(()=>
                {
                    this.selectedActivity=newActivity;
                })
                
               
            }
            catch(error)
            {
                console.log(error);
                
            }
    }
    
    updateAttendence = async ()=>
    {
        const user = store.userStore.user;
        this.updating = true;
        try
        {
            await agent.Activities.attend(this.selectedActivity!.id);
            runInAction(()=>
            {
                if(this.selectedActivity?.isGoing)
                {
                    this.selectedActivity.attendees = 
                    this.selectedActivity.attendees?.filter(x=>x.userName !== user?.username);
                    this.selectedActivity.isGoing = false;
                }
                else
                {
                    this.selectedActivity?.attendees?.push(new Profile(user!));
                    this.selectedActivity!.isGoing = true;

                }
                this.activityMap.set(this.selectedActivity!.id, this.selectedActivity!);
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
                this.updating= false;
            })
        }
    }

    cancelActivityToggle = async ()=>
    {
        this.updating = true;
        try
        {
            await agent.Activities.attend(this.selectedActivity!.id);
            runInAction(()=>
            {
                this.selectedActivity!.isCancelled = !this.selectedActivity!.isCancelled;
                this.activityMap.set(this.selectedActivity!.id, this.selectedActivity!);
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
                this.updating = false;
            })
        }
    }

}

