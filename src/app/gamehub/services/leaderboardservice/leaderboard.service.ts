import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { ITeamLeaderboard } from '../../interfaces/ITeamLeaderboard';

@Injectable({
  providedIn: 'root'
})
export class LeaderboardService {
  
  //reference API URL
  //private url = "https://localhost:44327/leaderboard/";

  private url = environment.api.url;

  constructor(private http: HttpClient) { }

  GetTeamLeaderboard(gameName: string): Observable<ITeamLeaderboard>
  {
    return this.http.get<ITeamLeaderboard>(this.url + "/leaderboard/team/" + gameName);
  }

}
