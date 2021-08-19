import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { GamelobbyComponent } from './gamehub/components/gamelobby/gamelobby.component';
import { GamewindowComponent } from './gamehub/components/gamewindow/gamewindow.component';
import { LeaderboardComponent } from './gamehub/components/leaderboard/leaderboard.component';
import { TeamwindowComponent } from './gamehub/components/teamwindow/teamwindow.component';
import { HomeComponent } from './gamehub/components/home/home.component';

import { RouterModule } from '@angular/router';
import { NavComponent } from './gamehub/components/nav/nav.component';
import { CreateTeamComponent } from './gamehub/components/teamwindow/createTeam/create-team/create-team.component';

@NgModule({
  declarations: [
    AppComponent,
    GamelobbyComponent,
    GamewindowComponent,
    LeaderboardComponent,
    TeamwindowComponent,
    HomeComponent,
    NavComponent,
    CreateTeamComponent    
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    RouterModule.forRoot([
      {path: "home", component: HomeComponent },
      {path: "gamewindow", component: GamewindowComponent },
      {path: "gamelobby", component: GamelobbyComponent },
      {path: "leaderboard", component: LeaderboardComponent },
      {path: "teamwindow", component: TeamwindowComponent },
      {path: "createteam", component: CreateTeamComponent },
    ]),
    FormsModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
