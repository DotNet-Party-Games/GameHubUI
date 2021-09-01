import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';

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


// creates configuration for module to operate off?
const config: SocketIoConfig = { url: 'http://localhost:3000', options: {}};
// const config: SocketIoConfig = { url: 'https://revabox.eastus.cloudapp.azure.com/', options: {path:"/battleshipsocket/socket.io/"}};

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
    LeaderboardComponent
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
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthHttpInterceptor,
      multi: true,
    }
  ],
})
export class BattleshipModule { }
