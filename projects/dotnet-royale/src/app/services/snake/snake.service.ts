import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { io, Socket } from 'socket.io-client';

@Injectable({
  providedIn: 'root'
})
export class SnakeService {

  //private url = 'http://localhost:3000';
  //private url = 'wss://revabox.eastus.cloudapp.azure.com/dotnetroyalesocket/';
  private url = 'https://revabox.eastus.cloudapp.azure.com';

  private socket: Socket;

  constructor()
  {
    this.socket = io(this.url, {transports: ['websocket', 'pulling', 'flashsocket']});
  }
  joinRoom(data):void{
    this.socket.emit('join', data);
  }
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


}
