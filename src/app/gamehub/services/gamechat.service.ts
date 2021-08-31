import { EventEmitter, Injectable } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';
import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';
import { environment } from 'src/environments/environment';
import { ChatAlert } from '../models/chatalert.model';
import { ChatMessage } from '../models/chatmessage.model';
import { ChatStatus } from '../models/chatstatus.model';

@Injectable({
  providedIn: 'root'
})
export class GameChatService {
  public messageReceived = new EventEmitter<ChatMessage>();
  public connectionEstablished = new EventEmitter<Boolean>();
  public userEvent = new EventEmitter<ChatStatus>();
  public userAlert = new EventEmitter<ChatAlert>();

  private hubConnection: HubConnection | null = null;
  private roomId: string = "";

  constructor(private authService: AuthService) {
    this.registerOnServerEvents();
  }

  public sendMessage(message: ChatMessage) {
    if (this.hubConnection != null && this.roomId != "") {
      this.hubConnection.invoke('GameRoomChat', this.roomId, message);
    }
  }

  public joinChat(roomId: string) {
    if (this.hubConnection) {
      this.hubConnection.invoke('JoinGameRoomChat', roomId)
        .then(() => {
          console.log(`Connected to room ID: ${roomId}.`)
          this.roomId = roomId;
        })
        .catch(err => {
          console.log(err.toString());
          console.log('retrying...');
          setTimeout(() => this.joinChat(roomId), 5000);
        })
    }
  }

  public leaveChat(roomId: string) {
    if (this.hubConnection) {
      this.hubConnection.invoke('LeaveGameRoomChat', roomId)
        .then(() => {
          console.log(`Disconnected from room ID: ${roomId}`);
          this.roomId = "";
        })
        .catch(err => {
          console.log(err.toString());
        })
    }
  }

  public startConnection(): void {
    this.authService.getAccessTokenSilently({ audience: 'revboxgamesapi' }).subscribe(
      token => {
        this.hubConnection = new HubConnectionBuilder()
          .withUrl(`${environment.api.url}/chat`, { accessTokenFactory: () => token })
          .withAutomaticReconnect()
          .build();

        if (this.hubConnection) {
          this.hubConnection
            .start()
            .then(() => {
              console.log('Hub connection started');
              this.connectionEstablished.emit(true);
              this.registerOnServerEvents();
            })
            .catch(_ => {
              console.log('Error while establishing connection, retrying...');
              setTimeout(() => this.startConnection(), 5000);
            });
        }
      },
      error => {
        console.log(error);
      }
    );
  }

  private registerOnServerEvents(): void {
    if (this.hubConnection) {
      this.hubConnection.on('Message', (data: ChatMessage) => {
        this.messageReceived.emit(data);
      });
      this.hubConnection.on('Event', (data: ChatStatus) => {
        this.userEvent.emit(data);
        console.log(data);
      });
      this.hubConnection.on('Alert', (data: ChatAlert) => {
        this.userAlert.emit(data);
        console.log(data);
      });
    }
  }
}
