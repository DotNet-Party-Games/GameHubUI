import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Profile } from '../models/Profile';
import { CustomCategory } from '../models/CustomCategory';
import { CustomWord } from '../models/CustomWord';
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
export class ProfileService {
  private url = "https://revabox.eastus.cloudapp.azure.com/songsinkapi/api/Main/";
  
  constructor(private http: HttpClient) { }

  addPlayer(p_userNickName: string): Observable<LeaderBoard>
  {
    return this.http.post<LeaderBoard>(`${this.url}AddPlayer/${p_userNickName}`, httpOptions);
  }

  getUserScore(p_userNickName: string): Observable<LeaderBoard>
  {
    return this.http.get<LeaderBoard>(`${this.url}getScoreOfPlayer/${p_userNickName}`);
  }

  getPlayers(): Observable<LeaderBoard[]>
  {
    return this.http.get<LeaderBoard[]>(`${this.url}getPlayers`);
  }

  getUserInfo(userEmail: string) : Observable<Profile>
  {
    return this.http.get<Profile>(`${this.url}getAPlayer/${userEmail}`);
  }
  addPlayerProfile(newPlayerProfile: Profile) : Observable<Profile>
  {
    return this.http.post<Profile>(this.url+"createNewPlayer",newPlayerProfile, httpOptions);//update url when have endpoint
  }
  updatePlayerProfile(playerProfile: Profile): Observable<Profile>
  {
    return this.http.put<Profile>(this.url+"updatePlayer",playerProfile, httpOptions);
  }

  addCategory(category: CustomCategory): Observable<CustomCategory>
  {
    return this.http.post<CustomCategory>(this.url+"addCustomCategory", category, httpOptions);
  }

  removeCategory(category: CustomCategory): Observable<CustomCategory>
  {
    return this.http.post<CustomCategory>(this.url+"removeCustomCategory", category, httpOptions);
  }

  addPlayerWord(word: CustomWord): Observable<CustomWord>
  {
    return this.http.post<CustomWord>(this.url+"addPlayerWord", word, httpOptions);
  }
  
  removePlayerWord(word: CustomWord): Observable<CustomWord>
  {
    return this.http.post<CustomWord>(this.url+"removePlayerWord", word, httpOptions);
  }

  getCustomCategories(playerID: number): Observable<CustomCategory[]> {
    return this.http.get<CustomCategory[]>(`${this.url}getCustomCategories/${playerID}`);
  }

  getPlayerWords(playerID: number): Observable<CustomWord[]> {
    return this.http.get<CustomWord[]>(`${this.url}getPlayerWords/${playerID}`);
  }

  getCustomWords(categoryID: number): Observable<CustomWord[]> {
    return this.http.get<CustomWord[]>(`${this.url}GetCustomWords/${categoryID}`);
  }
}
