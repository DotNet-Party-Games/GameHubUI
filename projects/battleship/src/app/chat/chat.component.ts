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
  messages:string[] = [];

  constructor(private chatService: ChatService) { }

  ngOnInit() {
    this.chatService.message.subscribe((message:string) =>{
      this.messages.unshift(message);
    });
  }

  SendMessage() {
    if(this.message!=""){
    this.chatService.sendMessage(this.message);
    }
    this.message = '';
  }
}
