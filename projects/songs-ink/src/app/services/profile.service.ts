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
  private url = "https://localhost:5001/api/Main/";
  
  constructor(private http: HttpClient) { }

  getUserScore(p_userNickName: string): Observable<LeaderBoard>
  {
    return this.http.get<LeaderBoard>(`${this.url}/getScoreOfPlayer/${p_userNickName}`);
  }

  getUserInfo(userEmail: string) : Observable<Profile>
  {
    return this.http.get<Profile>(`${this.url}getAPlayer/${userEmail}`);
    //return this.http.get<Profile>(`${this.url}1`);
  }
  addPlayerProfile(newPlayerProfile: Profile) : Observable<Profile>
  {
    return this.http.post<Profile>(this.url+"createNewPlayer",newPlayerProfile, httpOptions);//update url when have endpoint
  }
  updatePlayerProfile(playerProfile: Profile): Observable<Profile>
  {
    return this.http.put<Profile>(this.url+"updatePlayer",playerProfile, httpOptions);
    //return this.http.put<Profile>(this.url+"1",playerProfile);
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
}
