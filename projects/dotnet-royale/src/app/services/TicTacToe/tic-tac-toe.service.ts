import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { io, Socket } from 'socket.io-client';
import { BoardComponent } from '../../tictactoe/board/board.component';
@Injectable({
  providedIn: 'root'
})
export class TicTacToeService {
  private socket: Socket;
  private url = 'http://localhost:3000';
  //private url = 'http://20.81.113.152/dotnetroyalesocket/';
  //private url = 'https://pgsocketserver.herokuapp.com/';

  constructor() {
    this.socket = io(this.url, { transports: ['websocket', 'pulling', 'flashsocket'] });
  }

}

