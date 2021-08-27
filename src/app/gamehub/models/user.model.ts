import { Team } from "./team.model";

export interface User {
  id: string;
  username: string;
  email: string;
  picture: string;
  teamId: string;
  team: Team;
}