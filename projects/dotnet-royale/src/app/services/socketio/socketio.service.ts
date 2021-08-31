import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { io, Socket } from 'socket.io-client';
import { BehaviorSubject } from 'rxjs';
import { BoardComponent } from '../../tictactoe/board/board.component';
import { GameState } from '../TTTTGameState';
@Injectable({
  providedIn: 'root'
})
export class SocketioService {

  //private url = 'http://localhost:3000';
  //private url = 'http://20.81.113.152/dotnetroyalesocket/';
  //private url = 'https://pgsocketserver.herokuapp.com/';
  private url = 'https://revabox.eastus.cloudapp.azure.com/dotnetroyalesocket/';

  private socket: Socket;
  private newGameState = new BehaviorSubject<any>({ x: 1, y: 1 });
  currentGameState = this.newGameState.asObservable();
  private newBlackjack = new BehaviorSubject<any>({});
  currentBlackjack = this.newBlackjack.asObservable();
  // private newTTTTGameState = new BehaviorSubject<any>({});
  // currentTTTTGameState = this.newTTTTGameState.asObservable();
  private playerList = new BehaviorSubject<any>({});
  currentPlayerList = this.playerList.asObservable();

  constructor() {
    this.socket = io(this.url, { transports: ['websocket', 'pulling', 'flashsocket'] });
  }
  // ================= General Room Stuff ==============================
  joinRoom(data): void {
    this.socket.emit('join', data);
    sessionStorage.setItem('roomId', data.room);
  }

  reloadRoomList(username): void {
    this.socket.emit('reloadRoomList', username);
  }
  leaveRoom(data): void {
    this.socket.emit('leave', data);
    sessionStorage.removeItem('roomId');
  }

  getRoomList(): Observable<any> {
    return new Observable<any>(observer => {
      this.socket.on('updatedRoomList', (roomList) => {
        observer.next(roomList);
      });
      return () => {
        this.socket.disconnect();
      }
    });
  }
  goToGame(): Observable<any> {
    return new Observable<any>(obs => {
      this.socket.on('goto game', (data) => {
        obs.next(data);
      });
    });
  }

  sendGameId(data): void {
    this.socket.emit('play game', data);
  }
  //========================= General Player Stuff ========================
  getPlayers(data): void {
    this.socket.emit('getPlayers', data);
  }
  findPlayers(): Observable<any> {
    return new Observable(obs => {
      this.socket.on('foundPlayers', (data) => {
        console.log("got players from socket");
        console.log(data);
        obs.next(data);
      });
    });
  }

  //================ General Audio Stuff ============================
  sendAudioTrigger(data): void {
    this.socket.emit('play audio', data)
  }
  getAudioTrigger(): Observable<any> {
    return new Observable<string>(observer => {
      this.socket.on('receive audio', (data) => {
        observer.next(data);
      });
      return () => {
        this.socket.disconnect();
      }
    });
  }
  //================ chatroom stuff ======================================
  sendMessage(data): void {
    this.socket.emit('message', data);
  }

  //repeat this for sendgame state, receive game state and display that within layout HTML (game.snakepos)
  getMessage(): Observable<any> {
    return new Observable<{ user: string, message: string }>(observer => {
      this.socket.on('new message', (data) => {
        observer.next(data);
      });
      return () => {
        this.socket.disconnect();
      }
    });
  }
  //====================== Snake stuff ============================
  sendSnakeGameState(data): void {
    this.socket.emit('gamestate', data);
  }
  getSnakeGameState():Observable<any> {
    return new Observable<any>(observer=>{
      this.socket.on('new gamestate',(data)=>
      observer.next(data));
    });
    }
    sendLightSnakeGameState(data): void {
      this.socket.emit('lightgamestate', data);
    }
    getLightSnakeGameState():Observable<any> {
      return new Observable<any>(observer=>{
        this.socket.on('new lightgamestate',(data)=>
        observer.next(data));
      });
    }


  //==================== Black Jack Stuff ==========================
  sendBlackJackData(data): void {
    this.socket.emit('blackjack', data)
  }

  getBlackJackData(): void {
    this.socket.on('new blackjack', (data) => {
      this.newBlackjack.next(data);
    })
  }


  //====================== Tic Tac Toe Time Stuff ==================
  sendTicTacToeData(data): void {
    this.socket.emit('gameboard', data);
  }

  getTicTacToeData(): Observable<GameState> {
    return new Observable(obs => {
      this.socket.on('new gameboard', (data) =>{
        obs.next(data);
      });
    });
  }
}
