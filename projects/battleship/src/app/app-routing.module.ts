import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HomeComponent } from './home/home.component';
import { GameComponent } from './game/game.component';

import { LoginComponent } from './login/login.component';
import { AuthGuard } from '@auth0/auth0-angular';
import { GameBoardComponent } from './game-board/game-board.component';
import { GameboardSetupComponent } from './gameboard-setup/gameboard-setup.component';
import { RoomListComponent } from './room-list/room-list.component';
import { LeaderboardComponent } from './leaderboard/leaderboard.component';
import { Room } from './models/room.model';
import { RoomComponent } from './room/room.component';

const routes: Routes = [
  {
    path: '',
    component: RoomComponent
  },
  {
    path: 'game',
    component: GameComponent,
    canActivate: [ AuthGuard ]
  },
  {
    path: 'gameboard',
    component: GameBoardComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'gameboardsetup',
    component: GameboardSetupComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'leaderboard',
    component: LeaderboardComponent
  }, 
  {
    path:"roomlist",
    component:RoomComponent,
    canActivate:[AuthGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
