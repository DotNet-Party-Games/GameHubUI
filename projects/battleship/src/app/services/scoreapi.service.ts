import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Observable } from 'rxjs';
import { ITeamLeaderboard } from './TeamLeaderboard';
import { ILeaderboard } from './ILeaderBoard';
import { ITeamScore } from './TeamScore';
import { IUserScore } from './IUserScores';
@Injectable({
  providedIn: 'root'
})
export class ScoreapiService {

  private url = "https://localhost:5001/api/";
  private huburl = "https://revabox.eastus.cloudapp.azure.com/battleshipapi";
  //private huburl = "https://battleship-tsw.azurewebsites.net/api/"

  constructor(private http: HttpClient) { }

  // getUserStats(userId: number) : Observable<IStatistic>
  // {
  //   return this.http.get<IStatistic>(this.url + "Statistic" + "/get/" + userId.toString);
  // }
  

/*   GetTeamLeaderBoard(){
      return this.http.get<ITeamLeaderboard>(this.huburl+"/team/Battleship");
  }
  SubmitTeamScore(score:ITeamScore){
    this.http.post<ITeamScore>(this.huburl+"/team/Battleship", score);
  } */

  GetIndividualLeaderboard():Observable<ILeaderboard>{
      return this.http.get<ILeaderboard>(this.huburl+"");
  }

   SubmitScore(score:IUserScore){
    this.http.post<IUserScore>(this.huburl+"", score);
  } 
}
