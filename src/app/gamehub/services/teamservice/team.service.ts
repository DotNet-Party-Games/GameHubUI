import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ITeam } from '../../interfaces/ITeam';
import { ITeamJoinRequest } from '../../interfaces/ITeamJoinRequest';
import { FormGroup } from '@angular/forms';
import { IUser } from '../../interfaces/IUser';

@Injectable({
  providedIn: 'root'
})
export class TeamService {
  //url referencing the HubAPI
  private url = "https://localhost:44327/";

  

  constructor(private http: HttpClient) { }


  GetUserInfo():Observable<IUser>{
    return this.http.get<IUser>(this.url+"user");
  }

  //Get list of all team (/team). Return Iteam[]
  GetAllTeams(): Observable<ITeam[]>
  {
    return this.http.get<ITeam[]>(this.url +'team');
  }

  // add a new team (/team).  Return Iteam
  CreateTeam(model:FormGroup): Observable<ITeam>
  {
    return this.http.post<ITeam>(this.url +'team',model);
  }

  // get list of team by teamName in case of search (​/team​/{teamName}).  Return Iteam[]
  GetSearchedTeamsByName(teamName:string): Observable<ITeam>
  {
    return this.http.get<ITeam>(this.url +'team/'+ teamName);
  }

  // delete a team by teamname (​/team​/{teamName}).  Return boolean
  DeleteTeamByName(teamName:string) : Observable<boolean>{
    return this.http.delete<boolean>(this.url +'team/'+teamName);
  }

  // get all the request for joining a team (/team/request/{teamName}).  Return IteamJoinRequest[]
  GetAllRequestsForJoinTeam(teamName:string): Observable<ITeamJoinRequest[]>
  {
    return this.http.get<ITeamJoinRequest[]>(this.url +'team/request/'+teamName);
  }

  // update a specific team by teamName (/team/request/{teamName}).  Return IteamJoinRequest
  JoinTeam(teamName:string):Observable<ITeamJoinRequest>{
    return this.http.put<ITeamJoinRequest>(this.url +'team/request/'+teamName,null);
  }

  // Approve or deny a request (/team/request/approve/{requestId})
  ApproveOrDenyRequest(requestId:string, approve?:boolean):Observable<boolean>
  {
    return this.http.put<boolean>(this.url +'team/request/approve/'+requestId,null);
  }

  // leave a team (/team/leave)
  leaveTeam():Observable<boolean>{
    return this.http.put<boolean>(this.url +'team/leave/',null);
  }
  

}
