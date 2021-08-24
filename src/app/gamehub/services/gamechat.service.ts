import { EventEmitter, Injectable } from '@angular/core';
import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';  
import { environment } from 'src/environments/environment';
import { ChatMessage } from '../models/chatmessage.model';
import { ChatStatus } from '../models/chatstatus.model';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class GameChatService {
  public messageReceived = new EventEmitter<ChatMessage>();  
  public connectionEstablished = new EventEmitter<Boolean>();
  public userEvent = new EventEmitter<ChatStatus>();
  public loading = new EventEmitter<Boolean>();

  private _hubConnection: HubConnection = new HubConnectionBuilder()
    .withUrl(`${environment.api.url}/chat`)
    .withAutomaticReconnect()
    .build();

  constructor() { 
    this.registerOnServerEvents();
    this.startConnection(); 
  }

  public sendMessage(message: ChatMessage) {  
    this._hubConnection.invoke('GameRoomChat', message);  
  }
  
  public joinChat(roomId: string) {
    if (this._hubConnection) {
      this.loading.emit(true);
      this._hubConnection.invoke('JoinGameRoomChat', roomId)
        .then(() => {
          console.log(`Connected to room ID:  ${roomId}.`)
        })
        .catch(err =>{
          console.log(err.toString());
        })
        .finally(() => {
          this.loading.emit(false);
        });
    }
  }

  public leaveChat(roomId: string) {
    if (this._hubConnection) {
      this._hubConnection.invoke('LeaveGameRoomChat', roomId)
        .then(() => {
          console.log(`Disconnected from room ID: ${roomId}.`)
        })
        .catch(err =>{
          console.log(err.toString());
        })
        .finally(() => {
          this.loading.emit(false);
        });
    }
  }

  private startConnection(): void {
    this.loading.emit(true);  
    this._hubConnection  
      .start()  
      .then(() => {  
        console.log('Hub connection started');  
        this.connectionEstablished.emit(true);
        this.loading.emit(false);  
      })  
      .catch( _ => {  
        console.log('Error while establishing connection, retrying...');  
        setTimeout(() => this.startConnection(), 5000);  
      });  
  }

  private registerOnServerEvents(): void {  
    this._hubConnection.on('Message', (data: any) => {  
      this.messageReceived.emit(data);  
    });
    this._hubConnection.on('Event', (data: any) => {
      this.userEvent.emit(data);
    });
  } 
}
