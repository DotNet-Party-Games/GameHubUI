import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { io, Socket } from 'socket.io-client';
import { BoardComponent } from '../../tictactoe/board/board.component';
@Injectable({
  providedIn: 'root'
})
export class TicTacToeService {

  //private url = 'http://localhost:3000';
  //private url = 'wss://revabox.eastus.cloudapp.azure.com/dotnetroyalesocket/';
  private url = 'http://revabox.eastus.cloudapp.azure.com';
  
  private socket: Socket;

  constructor() {
    this.socket = io(this.url, { transports: ['websocket', 'pulling', 'flashsocket'] });
  }

}


/* Copy all this garbage into the socket index.js when Seunghoon is done
// Hopefully this will work without any trouble
socket.on('play audio', (data) => {
  io.to(data.room).emit('receive audio', {gameboard: data.audioFile});
}





*/
