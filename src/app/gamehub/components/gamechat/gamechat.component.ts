import { Component, EventEmitter, NgZone, OnInit } from '@angular/core';
import { UserService } from 'projects/hubservices/src/public-api';
import { GameChatService } from 'projects/hubservices/src/public-api';
import { ChatMessage } from '../../models/chatmessage.model';
import { ChatStatus } from '../../models/chatstatus.model';
import { User } from '../../models/user.model';
import { FormControl } from '@angular/forms';
import { timingSafeEqual } from 'crypto';
import { ChatAlert } from '../../models/chatalert.model';

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

  public userDictionary = {};

  public container: HTMLElement | null = null;

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
      //this.chatService.startConnection();   
    }
  }

  ngAfterViewInit() {      
    this.container = document.getElementById("messagecontainer");  
    if (this.container != null) {            
      this.container.scrollTop = this.container.scrollHeight;
    }     
  }
  
  ngOnDestroy() {
    this.chatService.leaveChat();
  }

  public getUserKeys() {
    return Object.keys(this.userDictionary);
  }

  public sendMessage(): void {
    if (this.messageBody.value !== '' && this.messageBody.value != null && this.user != null) {
      var msg: ChatMessage = {
        senderId: this.user.id,
        senderName: this.user.username,
        body: this.messageBody.value,
        timestamp: new Date().getTime(),
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
          this.chatMessages.unshift(message);
      });  
    });

    this.chatService.userEvent.subscribe((chatEvent: ChatStatus) => {  
      this.ngZone.run(() => {   
          if (chatEvent.status === "PRESENT" || chatEvent.status === "JOINED") {
            this.userDictionary[chatEvent.user.id] = chatEvent.user;
          } else if (chatEvent.status == "LEFT") {
            delete this.userDictionary[chatEvent.user.id];
          }
      });  
    });
  }

}
