import { EventEmitter, Injectable } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';
import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';
import { BehaviorSubject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ChatAlert } from '../models/chatalert.model';
import { ChatMessage } from '../models/chatmessage.model';
import { ChatStatus } from '../models/chatstatus.model';
import { AppToastService } from './apptoast.service';

@Injectable({
  providedIn: 'root'
})
export class GameChatService {
  public messageReceived = new EventEmitter<ChatMessage>();
  public connectionEstablished = new BehaviorSubject<Boolean>(false);
  public connectedToRoom = new BehaviorSubject<Boolean>(false);
  public userEvent = new EventEmitter<ChatStatus>();
  public userAlert = new EventEmitter<ChatAlert>();

  public connectionEst: Boolean = false;

  private hubConnection: HubConnection | null = null;
  private roomId: string = "";

  constructor(private authService: AuthService, private toastService: AppToastService) {
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
          this.connectedToRoom.next(true);
        })
        .catch(err => {
          console.log(err);
          console.log('retrying...');
          setTimeout(() => this.joinChat(roomId), 5000);
        })
    }
  }

  public leaveChat() {
    if (this.hubConnection && this.roomId) {
      this.hubConnection.invoke('LeaveGameRoomChat', this.roomId)
        .then(() => {
          console.log(`Disconnected from room ID: ${this.roomId}`);
          this.roomId = "";
        })
        .catch(err => {
          console.log(err);
        })
    }
  }

  public startConnection(): void {
    if (!this.connectionEst) {
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
                this.connectionEstablished.next(true);
                this.registerOnServerEvents();
              })
              .catch(_ => {
                console.log('Error while establishing connection, retrying...');
                setTimeout(() => this.startConnection(), 5000);
              });
              this.hubConnection.onreconnecting(()=>{
                this.connectionEstablished.next(false);
              });
              this.hubConnection.onreconnected(()=> {
                this.connectionEstablished.next(true);
                this.connectionEst = true;
              })
          }
        },
        error => {
          console.log(error);
        }
      );
    } 
  }

  private registerOnServerEvents(): void {
    if (this.hubConnection) {
      this.hubConnection.on('Message', (data: ChatMessage) => {
        this.messageReceived.emit(data);
      });
      this.hubConnection.on('Event', (data: ChatStatus) => {
        this.userEvent.emit(data);
      });
      this.hubConnection.on('Alert', (data: ChatAlert) => {
        this.userAlert.emit(data);
        this.toastService.show(data.alertType, data.message);
      });
    }
    this.connectionEstablished.subscribe(connection => {
      this.connectionEst = connection;
    });
  }
}
