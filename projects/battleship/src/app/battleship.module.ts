import { Injectable, NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { SocketIoModule, SocketIoConfig, Socket } from 'ngx-socket-io';

import { MatToolbarModule } from '@angular/material/toolbar';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule} from '@angular/material/button'; 
import { MatTableModule } from '@angular/material/table';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSelectModule } from '@angular/material/select';
import { MatSortModule } from '@angular/material/sort';
import {MatButtonToggleModule} from '@angular/material/button-toggle';


import { HomeComponent } from './home/home.component';
import { GameComponent } from './game/game.component';
import { LoginComponent } from './login/login.component';

import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthHttpInterceptor } from '@auth0/auth0-angular';
import { GameBoardComponent } from './game-board/game-board.component';
import { GameboardSetupComponent } from './gameboard-setup/gameboard-setup.component';
import { RoomListComponent } from './room-list/room-list.component';
import { RoomComponent } from './room/room.component';
import { ChatComponent } from './chat/chat.component';
import { LeaderboardComponent } from './leaderboard/leaderboard.component';
import { CommonModule } from '@angular/common';
import { GameStateService } from './services/gamestate.service';
import { ChatService } from './services/chat.service';
import { RoomService } from './services/room.service';
import { BattleshipDeployService } from './services/battleship-deploy.service';
import { UserService } from 'projects/hubservices/src/public-api';
import { StatisticapiService } from './services/statisticapi.service';
import { TeamLeaderboardService } from 'projects/hubservices/src/public-api';
import { UserlistComponent } from './userlist/userlist.component';

// @Injectable()
// export class SocketOne extends Socket {
//   constructor() {
//     super({ url: 'https://revabox.eastus.cloudapp.azure.com/', options: {path: '/battleshipsocket/socket.io/', transports: ['websocket', 'pulling', 'flashsocket']}});
//       // super({ url: 'http://localhost:3000', options: {transports: [
//       // 'websocket', 
//       // 'pulling', 'flashsocket']}});
//   }
// }


// creates configuration for module to operate off?
// const config: SocketIoConfig = { url: 'http://localhost:3000', options: {transports: ['websocket', 'pulling', 'flashsocket']}};
const config: SocketIoConfig = { url: 'https://revabox.eastus.cloudapp.azure.com/', options: {path: '/battleshipsocket/socket.io/', transports: ['websocket', 'pulling', 'flashsocket'] } };

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    GameComponent,
    LoginComponent,
    GameBoardComponent,
    GameboardSetupComponent,
    RoomListComponent,
    RoomComponent,
    ChatComponent,
    LeaderboardComponent,
    UserlistComponent
  ],
  imports: [
      CommonModule,
      AppRoutingModule,
      FlexLayoutModule,
      SocketIoModule.forRoot(config),
      FormsModule,
      ReactiveFormsModule,
      MatToolbarModule,
      MatInputModule,
      MatCardModule,
      MatMenuModule,
      MatIconModule,
      MatButtonModule,
      MatSlideToggleModule,
      MatTableModule,
      MatDividerModule,
      MatButtonToggleModule,
      MatSlideToggleModule,
      MatSelectModule,
      MatProgressSpinnerModule,
      MatSortModule
  ],
  providers: [ GameStateService, ChatService, RoomService, BattleshipDeployService, UserService, StatisticapiService],
})
export class BattleshipModule { }
