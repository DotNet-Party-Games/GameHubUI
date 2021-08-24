import { TeamwindowComponent } from "../components/teamwindow/teamwindow.component";
import { Team } from "./team.model";

export interface User {
  id: string;
  username: string;
  email: string;
  picture: string;
  teamId: string;
  team: Team;
}