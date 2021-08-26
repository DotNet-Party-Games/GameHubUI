import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { io, Socket } from 'socket.io-client';
import { BlackjackComponent } from '../../blackjack/blackjack.component';
@Injectable({
  providedIn: 'root'
})
export class BlackjackService {

  private socket: Socket;
  private url='http://localhost:3000';
  //private url = 'http://20.81.113.152/dotnetroyalesocket/';
  //private url = 'https://pgsocketserver.herokuapp.com/';
  private newBlackjack = new BehaviorSubject<any>({});
  currentBlackjack = this.newBlackjack.asObservable();
  constructor() { 
    this.socket = io(this.url, {transports:['websocket','pulling','flashsocket']});
  }

  joinRoom(data):void{
    this.socket.emit('join',data);
  }

  sendBlackJackData(data):void{
    this.socket.emit('blackjack',data)
  }

  getBlackJackData():void{
    this.socket.on('new blackjack', (data) => {
        this.newBlackjack.next(data);
    })
  }

  leaveRoom(data):void{
    this.socket.emit('leave',data);
  }

}
