import { Profile } from "./profile";

export interface Activity
{
    id: string;
    title: string;
    date: Date | null;
    description: string;
    category: string;
    venue: string;
    city: string;
    hostUsername: string;
    isCancelled: boolean;
    attendees: Profile[];
    host?: Profile;
    isGoing: Boolean;
    isHost: Boolean;

}

export class Activity implements Activity
{
    constructor(init? : ActivityFormValues)
    {
        Object.assign(this, init);
    }
}

export class ActivityFormValues
{
    id?: string = undefined;
    title: string = "";
    category: string = "";
    description: string = "";
    date: Date | null = null;
    city: string = "";
    venue: string = "";

    constructor(activity?: ActivityFormValues)
    {
        if(activity)
        {
            this.id = activity.id;
            this.title = activity.title;
            this.category = activity.category;
            this.description = activity.description;
            this.date = activity.date;
            this.city = activity.city;
            this.venue = activity.venue;
        }
    }


}