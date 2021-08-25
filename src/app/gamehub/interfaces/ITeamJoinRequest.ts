import { IUser } from "./IUser";

export interface ITeamJoinRequest{
    id:string;
    teamname:string;
    userId:string;
    user:IUser;
}