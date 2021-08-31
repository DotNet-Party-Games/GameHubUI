import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Observable } from 'rxjs';
import { ILeaderboard } from './ILeaderBoard';
import { IUserScore } from './IUserScores';
import { Statistics } from './TeamScore';

@Injectable({
  providedIn: 'root'
})
export class StatisticapiService {

  //private url = "https://localhost:5001/api/"
  private url = "https://revabox.eastus.cloudapp.azure.com/battleshipapi/api/"
  private huburl="https://revabox.eastus.cloudapp.azure.com/hubapi"
  test:Statistics[];

  constructor(private http: HttpClient) { }

  // getUserStats(userId: number) : Observable<IStatistic>
  // {
  //   return this.http.get<IStatistic>(this.url + "Statistic" + "/get/" + userId.toString);
  // }
  GetIndividualLeaderboard():Observable<ILeaderboard>{
    return this.http.get<ILeaderboard>(this.url+"");
}
  UpdateStatistic(player:string, won:number){
    let score:IUserScore = {
      UserId:player,
     Score:won,
    }
    this.http.post(this.huburl+"/individual/battleship", score)
    if (won ==1){
      this.http.post(this.url+"Statistic", {player, p_:false});
    }
    if (won==0){
      this.http.post(this.huburl+"Statistic", {player, p_:true})
    }
  }

  GetEveryone(){
    return this.http.get<Statistics[]>(this.url+"Statistic").subscribe(result=> {this.test=result; console.log("Service", result, this.test);});
;
  }

  GetPerson(id:string){
    return this.http.get(this.url+"Statistic/get/"+id);
  }
}
