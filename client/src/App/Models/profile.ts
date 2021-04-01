import { User } from "./user";

export interface Profile
{
    userName: string;
    displayName: string;
    image?: string;
    bio?: string;
    photos?: Photo[];
    followingCount: number;
    followersCount: number;
    following: boolean;
}

export class Profile implements Profile
{
    constructor(user: User)
    {
        this.userName = user.username;
        this.displayName = user.displayName;
        this.image = user.image;
    }
}

export interface EditProfile
{
    displayName: string;
    bio: string;
}

export interface Photo
{
    id: string;
    url: string;
    isMain: boolean;
}

export interface UserActivity 
{
    id: string;
    title: string;
    category: string;
    date: Date;
}