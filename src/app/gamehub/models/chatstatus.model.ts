import { User } from "./user.model";

export interface ChatStatus {
  user: User;
  status: string;
}