import { Injectable } from '@angular/core';
import { HttpClient} from "@angular/common/http";
import { Observable, BehaviorSubject } from 'rxjs';
import { IGame } from './game';
import { IScore } from './score';
import { IStat } from './stat';
import { IGameStats } from './gamestats';

@Injectable({
  providedIn: 'root'
})
export class PartygameService {
  //url referencing the WebAPI
  //private url = "http://20.81.113.152/dotnetroyaleapi/";
  //private url = "https://revabox.eastus.cloudapp.azure.com/dotnetroyaleAPI/";
  private url = 'https://revabox.eastus.cloudapp.azure.com/dotnetroyaleAPI/';

 isLoggedIn:boolean;
  currentScore: IScore = {
    gamesId:null,
    userName:null,
    score:null,
  };
  private messageSource = new BehaviorSubject("default message");
  currentMessage = this.messageSource.asObservable();

  //service constructor
  constructor(private http: HttpClient) { }

  //AddScore Methoid
  addscore(model: any): Observable<IScore>{
    console.log("adding score");
    return this.http.post<IScore>(this.url+'user/addScore', model);
  }

  getGames() : Observable<IGame[]>
  {
    return this.http.get<IGame[]>(this.url + "Game");
  }

  updateSnakeStats(model: any): Observable<IScore>{
    return this.http.post<IScore>(this.url+'user/updateSnakeStats',model);
  }
  updateBlackJackStats(model: any): Observable<IScore>{
    return this.http.post<IScore>(this.url+'user/updateBlackJackStats',model);
  }
  updateTicTacToeStats(model: any): Observable<IScore>{
    console.log("updating tic tok");
    return this.http.post<IScore>(this.url+'user/updateTicTacToeStats',model);
  }
  updateLightBikeStats(model: any): Observable<IScore>{
    return this.http.post<IScore>(this.url+'user/updateLightBikeStats',model);
  }

  getTop10ScoresByGameId(gameId: number) : Observable<IScore[]>
  {
    return this.http.get<IScore[]>(this.url + "Game/getTop10ScoresByGameId/" + gameId);
  }

  getTop10BlackJackStats() : Observable<IStat[]>
  {
    return this.http.get<IStat[]>(this.url + "Game/getTop10BlackJackStats/");
  }

  getTop10TicTacToeStats() : Observable<IStat[]>
  {
    return this.http.get<IStat[]>(this.url + "Game/getTop10TicTacToeStats/");
  }

  getTop10LightBikeStats() : Observable<IStat[]>
  {
    return this.http.get<IStat[]>(this.url + "Game/getTop10LightBikeStats/");
  }

  getSnakeGameStatsByUserName(userName: string) : Observable<IGameStats>
  {
    return this.http.get<IGameStats>(this.url + "User/getSnakeGameStatsByUserName/" + userName);
  }

  getBlackJackGameStatsByUserName(userName: string) : Observable<IGameStats>
  {
    return this.http.get<IGameStats>(this.url + "User/getBlackJackGameStatsByUserName/" + userName);
  }

  getTicTacToeGameStatsByUserName(userName: string) : Observable<IGameStats>
  {
    return this.http.get<IGameStats>(this.url + "User/getTicTacToeGameStatsByUserName/" + userName);
  }

  getLightBikeGameStatsByUserName(userName: string) : Observable<IGameStats>
  {
    return this.http.get<IGameStats>(this.url + "User/getLightBikeGameStatsByUserName/" + userName);
  }

}
