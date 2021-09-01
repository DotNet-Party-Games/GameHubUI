import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HubLeaderboard } from '../models/HubLeaderboard';
import { HubUserScore } from '../models/HubUserScore';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  })
};

@Injectable({
  providedIn: 'root'
})

export class HubLeaderboardService {
  private url = " https://revabox.eastus.cloudapp.azure.com/hubapi/Leaderboard/"
  constructor(private http: HttpClient) { }

  submitScore(gameType: string, score: HubUserScore) : Observable<HubLeaderboard>
  {
    return this.http.post<HubLeaderboard>(`${this.url}individual/songsink`, score, httpOptions);
  }
}
