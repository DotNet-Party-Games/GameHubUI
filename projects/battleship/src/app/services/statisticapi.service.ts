import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Observable } from 'rxjs';
import { IStatistic } from '../profile/statistic';

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
  getUserStats() : Observable<IStatistic>
  {
    return this.http.get<IStatistic>(this.url + "Statistic" + "/get/1");
  }
}
