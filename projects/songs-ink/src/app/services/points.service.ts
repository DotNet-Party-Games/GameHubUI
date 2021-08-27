import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Profile } from '../models/Profile';

const httpOptions = 
{
 headers: new HttpHeaders({
   'Content-Type': 'application/json',
   'Access-Control-Allow-Origin': 'http:/localhost:4200' 
 }),
};

@Injectable({
  providedIn: 'root'
})
export class PointsService {
  private url = "https://localhost:5001/api/Main/";
  constructor(private http: HttpClient) { }

  getScoreofPlayer(id: number) : Observable<number> //gets current score not total score
  {
    return this.http.get<number>(`${this.url}getScoreOfPlayer/${id}`);
  }
  updateScoreOfPlayer(id: number, score:number): Observable<Profile>
  {
    return this.http.put<Profile>(`${this.url}updateScoreOfPlayer/${id}`, score, httpOptions);
  }
}
