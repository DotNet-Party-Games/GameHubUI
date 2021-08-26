import { User } from "./user.model";

export interface Team {
  id: string;
  name: string;
  teamOwner: string;
  description: string;
  users: User[];
}