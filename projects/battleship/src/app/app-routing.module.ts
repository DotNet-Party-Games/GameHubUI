import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GameComponent } from './game/game.component';
import { AuthGuard } from '@auth0/auth0-angular';
import { GameBoardComponent } from './game-board/game-board.component';
import { GameboardSetupComponent } from './gameboard-setup/gameboard-setup.component';
import { LeaderboardComponent } from './leaderboard/leaderboard.component';
import { RoomComponent } from './room/room.component';

const routes: Routes = [
  {
    path: '',
    component: RoomComponent
  },
  {
    path: 'gamescreen',
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
