import { ITeam } from "./ITeam";

export interface IUser{
    id:string;
    username:string;
    email:string;
    picture:string;
    teamId:string;
    team:ITeam;
}