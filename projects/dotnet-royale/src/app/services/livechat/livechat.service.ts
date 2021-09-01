import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { io, Socket } from 'socket.io-client';

@Injectable({
  providedIn: 'root'
})
export class LivechatService {

  //private url = 'http://localhost:3000';
  //private url = 'wss://revabox.eastus.cloudapp.azure.com/dotnetroyalesocket/';
  private url = 'https://revabox.eastus.cloudapp.azure.com';

  private socket: Socket;

  constructor() {
    this.socket = io(this.url, {transports:['websocket','pulling','flashsocket']});

  }

  joinRoom(data):void{
    this.socket.emit('join',data);
    sessionStorage.setItem('roomId', data.room);
  }

  reloadRoomList(username):void{
    this.socket.emit('reloadRoomList', username);
  }

  sendMessage(data):void{
    this.socket.emit('message',data);
  }

  //repeat this for sendgame state, receive game state and display that within layout HTML (game.snakepos)
  getMessage():Observable<any>{
    return new Observable<{user: string, message:string}>(observer => {
      this.socket.on('new message',(data) =>{
        observer.next(data);
      });
      return()=>{
        this.socket.disconnect();
      }
    });
  }

  leaveRoom(data):void{
    this.socket.emit('leave',data);
    sessionStorage.removeItem('roomId');
  }

  getRoomList():Observable<any>{
    return new Observable<any>(observer=>{
      this.socket.on('updatedRoomList',(roomList)=>{
        observer.next(roomList);
      });
      return()=>{
        this.socket.disconnect();
      }
    });
  }
  getPlayers(data): void {
    this.socket.emit('getPlayers', data);
  }
  findPlayers(): Observable<any> {
    return new Observable(obs => {
      this.socket.on('foundPlayers', (data) => {
        console.log("in ttt service")
        console.log("got players from socket");
        console.log(data);
        obs.next(data);

      });
    });
  }
}
