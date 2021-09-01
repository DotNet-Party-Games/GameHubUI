import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { io, Socket } from 'socket.io-client';
import { BlackjackComponent } from '../../blackjack/blackjack.component';
@Injectable({
  providedIn: 'root'
})
export class BlackjackService {

  //private url = 'http://localhost:3000';
  //private url = 'wss://revabox.eastus.cloudapp.azure.com/dotnetroyalesocket/';
  private url = 'https://revabox.eastus.cloudapp.azure.com';

  private socket: Socket;
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
