import { Component, OnInit } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { Observable } from 'rxjs';

import { ChatService } from '../services/chat.service';

//const SOCKET_ENDPOINT = 'ws://localhost:3000';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {
  // declare variables
  socket: Socket;
  message: string;
  data:string;
  messages:Observable<string[]>;

  constructor(private chatService: ChatService) { }

  ngOnInit() {
    this.messages = this.chatService.messages;
  }

  SendMessage() {
    this.chatService.sendMessage(this.message);
    this.message = '';
  }
}
