import { HubConnection, HubConnectionBuilder, LogLevel } from "@microsoft/signalr";
import { makeAutoObservable, runInAction } from "mobx";
import { ChatComment } from "../Models/comment";
import { store } from "./store";

export default class CommentStore
{
    comments: ChatComment[] = [];
    hubConnection: HubConnection | null = null;

    constructor()
    {
        makeAutoObservable(this);
    }

    createHubConnection = (activityId: string)=>
    {
        if(store.activityStore.selectedActivity)
        {
            this.hubConnection = new HubConnectionBuilder()
                .withUrl("http://localhost:5000/chat?activityId="+store.activityStore.selectedActivity.id,
                {
                    accessTokenFactory: ()=>store.userStore.user?.token!
                })
                .withAutomaticReconnect()
                .configureLogging(LogLevel.Information)
                .build();
            this.hubConnection.start().catch(err=>console.log("error establishing connection: ", err));
            this.hubConnection.on("LoadComments", (comments: ChatComment[])=>
            {
                runInAction(()=>
                {
                    
                    this.comments = comments;
                });
            });
            this.hubConnection.on("ReciveComment", (comment: ChatComment)=>
            {
                runInAction(()=>
                {
                    this.comments.push(comment);

                })
            });

        }

        
    }
    stopHubConnection = () =>
    {
        this.hubConnection?.stop().catch(err=>console.log("error closing connection: ", err));
    }
    clearComments = ()=>
    {
        this.comments = [];
        this.stopHubConnection();
    }
    
    addComment = async(values: any)=>
    {
        values.activityId = store.activityStore.selectedActivity?.id;
        try
        {
            await this.hubConnection?.invoke("SendComment", values);
        }
        catch(err)
        {
            console.log(err);
        }
    }
}