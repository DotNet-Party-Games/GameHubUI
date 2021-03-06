import { LeaderboardComponent } from './components/leaderboard/leaderboard.component';
import { LeaderboardListItemComponent } from './components/leaderboard-list-item/leaderboard-list-item.component';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';
import { GameComponent } from './components/game/game.component';
import { PlayerListComponent } from './components/player-list/player-list.component';
import { CanvasComponent } from './components/canvas/canvas.component';
import { PlayerListItemComponent } from './components/player-list-item/player-list-item.component';

import { MatDialogModule } from '@angular/material/dialog';
import {MatListModule} from '@angular/material/list';
import {MatInputModule} from '@angular/material/input';
import {MatMenuModule} from '@angular/material/menu';
import {MatIconModule} from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { SocketIoService } from './services/socketio.service';
import {MatTableModule} from '@angular/material/table';
import {MatGridListModule} from '@angular/material/grid-list';
import { ChatComponent } from './components/chat/chat.component';
import { RoomListComponent, ChooseCategoryDialogComponent } from './components/room-list/room-list.component';
import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';
import { LobbyComponent } from './components/lobby/lobby.component';
import { LoginComponent } from './components/login/login.component';
import { ProfileComponent } from './components/profile/profile.component';
import { WordComponent } from './components/word/word.component';
import { ProfileWordlistComponent } from './components/profile-wordlist/profile-wordlist.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ChooseWordComponent, ChooseWordDialogComponent} from './components/choose-word/choose-word.component';
import { TimerComponent } from './components/timer/timer.component';


const config: SocketIoConfig = { url: 'https://revabox.eastus.cloudapp.azure.com', options: {path: '/songsinksocket/socket.io', transports: ['websocket', 'pulling', 'flashsocket'] } };

import { AuthGuard} from '@auth0/auth0-angular';
import { JukeboxComponent } from './components/jukebox/jukebox.component';
import { ProfileCategorylistComponent } from './components/profile-categorylist/profile-categorylist.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    GameComponent,
    PlayerListComponent,
    CanvasComponent,
    PlayerListItemComponent,
    ChatComponent,
    RoomListComponent,
    LobbyComponent,
    LoginComponent,
    ProfileComponent,
    ProfileWordlistComponent,
    TimerComponent,
    JukeboxComponent,
    ProfileComponent,
    WordComponent,
    ChooseWordComponent,
    ChooseWordDialogComponent,
    TimerComponent,
    ChooseCategoryDialogComponent,
    ProfileCategorylistComponent,
    LeaderboardComponent,
    LeaderboardListItemComponent
  ],
  imports: [
    RouterModule.forChild([
      {path: "", component: LobbyComponent},
      {path:"lobby", component: LobbyComponent},
      {path:"room-list", component: RoomListComponent},
      {path: "game", component: GameComponent},
      {path:"login", component: LoginComponent},
      {path:"game", component: GameComponent},
      {path:"leaderboard", component: LeaderboardComponent},
      {path: "profile", component: ProfileComponent, canActivate: [AuthGuard]}
    ]),
    CommonModule,
    MatListModule,
    MatInputModule,
    MatMenuModule,
    MatButtonModule,
    SocketIoModule.forRoot(config),
    MatTableModule,
    MatIconModule,
    ReactiveFormsModule,
    FontAwesomeModule,
    FormsModule,
    MatDialogModule,
    MatGridListModule
  ],
  providers: [SocketIoService, ProfileComponent]
})
export class SongsInkModule {}
