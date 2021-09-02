import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Observable } from 'rxjs';
import { ILeaderboard } from './ILeaderBoard';
import { IUserScore } from './IUserScores';
import { Statistics } from './TeamScore';
import { TeamLeaderboardService, UserService } from 'projects/hubservices/src/public-api';
import { User } from 'projects/hubservices/src/models/user.model';

@Injectable({
  providedIn: 'root'
})
export class StatisticapiService {

  //private url = "https://localhost:5001/api/"
  private url = "https://revabox.eastus.cloudapp.azure.com/battleshipapi/api/"
  private huburl="https://revabox.eastus.cloudapp.azure.com/hubapi"
  test:Statistics[];
  userObj:User;

  constructor(private http: HttpClient, private user:UserService, private leaderboard:TeamLeaderboardService) { }

  // getUserStats(userId: number) : Observable<IStatistic>
  // {
  //   return this.http.get<IStatistic>(this.url + "Statistic" + "/get/" + userId.toString);
  // }
  
  GetIndividualLeaderboard():Observable<ILeaderboard>{
    return this.http.get<ILeaderboard>(this.url+"");
}
  UpdateStatistic(won:number){
    
    this.user.user.subscribe(res => {this.userObj = res})
    this.leaderboard.submitScore(this.userObj.team.name, won)
    if (won ==1){
      this.http.post(this.url+"Statistic", {player:this.userObj.username, p_:true});
    }
    if (won==0){
      this.http.post(this.url+"Statistic", {player:this.userObj.username, p_:false})
    }
  }

  GetEveryone(){
    return this.http.get<Statistics[]>(this.url+"Statistic").subscribe(result=> {this.test=result;});
;
  }

  GetPerson(id:string){
    return this.http.get(this.url+"Statistic/get/"+id);
  }
}
