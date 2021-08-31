import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { Observable, Observer } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  message = this.socket.fromEvent<string>('get message');
  broadcast:string;
  messages: Observable<string[]>;

  // initialize socket object
  constructor(private socket: Socket) { }

  sendMessage(message: string) {
    this.socket.emit('message', message);
  }

  
}
