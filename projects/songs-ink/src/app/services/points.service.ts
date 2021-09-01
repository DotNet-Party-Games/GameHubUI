import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Profile } from '../models/Profile';
import { LeaderBoard } from '../models/LeaderBoard';

const httpOptions = 
{
 headers: new HttpHeaders({
   'Content-Type': 'application/json',
 }),
};

@Injectable({
  providedIn: 'root'
})
export class PointsService {
  //private url = "https://localhost:5001/api/Main/";
  private url = 'https://revabox.eastus.cloudapp.azure.com/songsinkapi/api/Main/';
  constructor(private http: HttpClient) { }

  getScoreofPlayer(id: number) : Observable<number> //gets current score not total score
  {
    return this.http.get<number>(`${this.url}getScoreOfPlayer/${id}`);
  }
  updateScoreOfPlayer(player: LeaderBoard): Observable<Profile>
  {
    return this.http.put<Profile>(`${this.url}updateScoreOfPlayer/`, player, httpOptions);
  }
}
