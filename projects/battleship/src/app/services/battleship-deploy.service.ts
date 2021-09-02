import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { SocketOne } from '../battleship.module';
import { Ship } from './ship';

@Injectable({
  providedIn: 'root'
})
export class BattleshipDeployService {
  roomnum = this.socket.fromEvent<string>("send room number")

  constructor(private socket:SocketOne) { }

  sendboard(positions: Ship[], roomNum:number, userId:number){
    this.socket.emit("send coordinates", positions, roomNum, userId);
  }
  leaveRoom(roomNum:string){
    console.log("left room");
    this.socket.emit("leave room");
  }
  getroomnumber(userid:number){
    this.socket.emit("get room number", userid);
  }
}
