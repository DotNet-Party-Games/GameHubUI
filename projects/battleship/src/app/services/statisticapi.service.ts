import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Observable } from 'rxjs';

import { ILeaderboard } from './ILeaderBoard';

@Injectable({
  providedIn: 'root'
})
export class StatisticapiService {

  private url = "https://localhost:5001/api/"
  //private url = "https://battleship-tsw.azurewebsites.net/api/"

  constructor(private http: HttpClient) { }

  // getUserStats(userId: number) : Observable<IStatistic>
  // {
  //   return this.http.get<IStatistic>(this.url + "Statistic" + "/get/" + userId.toString);
  // }
  GetIndividualLeaderboard():Observable<ILeaderboard>{
    return this.http.get<ILeaderboard>(this.url+"");
  }
  UpdateStatistics(){
    return this.http.post(this.url+"StatisticsController/update", {})
  }

}
