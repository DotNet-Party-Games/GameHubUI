import { Component, EventEmitter, NgZone, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { GameChatService } from '../../services/gamechat.service';
import { ChatMessage } from '../../models/chatmessage.model';
import { ChatStatus } from '../../models/chatstatus.model';
import { User } from '../../models/user.model';
import { FormControl } from '@angular/forms';
import { timingSafeEqual } from 'crypto';

@Component({
  selector: 'app-gamechat',
  templateUrl: './gamechat.component.html',
  styleUrls: ['./gamechat.component.scss']
})
export class GamechatComponent implements OnInit {

  public loading = new EventEmitter<Boolean>();

  public chatMessages: ChatMessage[] = [];
  public user: User | null = null;
  public connectionEstablished: Boolean = false;
  public isLoading: Boolean = false;
  public channelId: string = "test"
  public messageBody = new FormControl('');

  constructor(
    public userService: UserService,
    private chatService: GameChatService,
    private ngZone: NgZone
    ) { 
      this.subscribeToEvents();
    }

  ngOnInit(): void {
    if (this.user != null) {
      console.log(`User start: ${this.user}`);
      this.chatService.startConnection();
    }
  }

  public sendMessage(): void {
    if (this.messageBody.value != '' && this.user != null) {
      var msg: ChatMessage = {
        senderId: this.user.id,
        senderName: this.user.username,
        body: this.messageBody.value,
        timeSent: new Date().getUTCDate(),
      }
      this.chatService.sendMessage(msg);
    }
    this.messageBody.reset();
  }

  private subscribeToEvents(): void {
    this.userService.user.subscribe(user => {
      this.user = user;
      if(this.user != null) {
        this.chatService.startConnection();
      }
    });

    this.chatService.connectionEstablished.subscribe(isConnected => {
      this.connectionEstablished = isConnected;
      if (isConnected) {
        this.chatService.joinChat(this.channelId);
      }
    });

    this.chatService.messageReceived.subscribe((message: ChatMessage) => {  
      this.ngZone.run(() => {   
          this.chatMessages.push(message);
      });  
    });

    this.chatService.userEvent.subscribe((chatEvent: ChatStatus) => {  
      this.ngZone.run(() => {   
          console.log(chatEvent);
      });  
    });
  }

}
