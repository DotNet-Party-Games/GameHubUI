import { EventEmitter, Injectable } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';
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

  private _hubConnection: HubConnection | null = null;

  constructor(private authService: AuthService) {
    this.registerOnServerEvents();
  }

  public sendMessage(message: ChatMessage) {
    if (this._hubConnection != null) {
      this._hubConnection.invoke('GameRoomChat', message);
    }
  }

  public joinChat(roomId: string) {
    if (this._hubConnection) {
      this._hubConnection.invoke('JoinGameRoomChat', roomId)
        .then(() => {
          console.log(`Connected to room ID: ${roomId}.`)
        })
        .catch(err => {
          console.log(err.toString());
          console.log('retrying...');
          setTimeout(() => this.joinChat(roomId), 5000);
        })
    }
  }

  public leaveChat(roomId: string) {
    if (this._hubConnection) {
      this._hubConnection.invoke('LeaveGameRoomChat', roomId)
        .then(() => {
          console.log(`Disconnected from room ID: ${roomId}`)
        })
        .catch(err => {
          console.log(err.toString());
        })
    }
  }

  public startConnection(): void {
    this.authService.getAccessTokenSilently({ audience: 'revboxgamesapi' }).subscribe(
      token => {
        this._hubConnection = new HubConnectionBuilder()
          .withUrl(`${environment.api.url}/chat`, { accessTokenFactory: () => token })
          .withAutomaticReconnect()
          .build();

        if (this._hubConnection) {
          this._hubConnection
            .start()
            .then(() => {
              console.log('Hub connection started');
              this.connectionEstablished.emit(true);
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
    if (this._hubConnection) {
      this._hubConnection.on('Message', (data: ChatMessage) => {
        this.messageReceived.emit(data);
      });
      this._hubConnection.on('Event', (data: ChatStatus) => {
        this.userEvent.emit(data);
      });
    }
  }
}
