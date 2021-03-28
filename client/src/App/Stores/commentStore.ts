import { HubConnection } from "@microsoft/signalr";
import { makeAutoObservable } from "mobx";
import { ChatComment } from "../Models/comment";

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
        
    }
}