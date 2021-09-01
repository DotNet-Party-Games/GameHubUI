import { Component, EventEmitter, NgZone, OnInit } from '@angular/core';
import { UserService } from 'projects/hubservices/src/public-api';
import { GameChatService } from 'projects/hubservices/src/public-api';
import { ChatMessage } from '../../models/chatmessage.model';
import { ChatStatus } from '../../models/chatstatus.model';
import { User } from '../../models/user.model';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-gamechat',
  templateUrl: './gamechat.component.html',
  styleUrls: ['./gamechat.component.scss']
})
export class GamechatComponent implements OnInit {

  public loading = new EventEmitter<boolean>();

  public chatMessages: ChatMessage[] = [];
  public user: User | null = null;
  public connectionEstablished: boolean = false;
  public isLoading: boolean = false;
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
    this.isLoading = true;
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
      if(!this.isLoading) this.isLoading = true;
      this.user = user;
    });

    this.chatService.connectedToRoom.subscribe(isConnected => {
      if (isConnected) {
        this.isLoading = false;
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
