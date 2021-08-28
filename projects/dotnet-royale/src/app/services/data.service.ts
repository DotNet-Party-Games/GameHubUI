import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private gameIdSource = new BehaviorSubject<number>(1);
  private mainScreenSource = new BehaviorSubject<string>("default");

  currentGameId = this.gameIdSource.asObservable();
  mainScreen = this.mainScreenSource.asObservable();

  constructor() { }

  changeGameId(p_gameId: number) {
    this.gameIdSource.next(p_gameId)
  }
  changeMainScreen(p_mainScreen: string) {
    this.mainScreenSource.next(p_mainScreen)
  }

}
