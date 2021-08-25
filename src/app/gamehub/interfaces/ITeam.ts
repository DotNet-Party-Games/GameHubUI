import { IUser } from "./IUser";

export interface ITeam{
    id:string;
    name:string;
    teamOwner:string;
    description:string;
    users:IUser[];
}