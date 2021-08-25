import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { GamelobbyComponent } from './gamehub/components/gamelobby/gamelobby.component';
import { GamewindowComponent } from './gamehub/components/gamewindow/gamewindow.component';
import { LeaderboardComponent } from './gamehub/components/leaderboard/leaderboard.component';
import { TeamwindowComponent } from './gamehub/components/teamwindow/teamwindow.component';
import { HomeComponent } from './gamehub/components/home/home.component';
import { NavComponent } from './gamehub/components/nav/nav.component';

import { RouterModule } from '@angular/router';
import { AuthGuard, AuthModule } from '@auth0/auth0-angular';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthHttpInterceptor } from '@auth0/auth0-angular';

import { environment } from 'src/environments/environment';
import { GamechatComponent } from './gamehub/components/gamechat/gamechat.component';
import { IsnotTMComponent } from './gamehub/components/teamwindow/isNotTeamMember/isnot-tm/isnot-tm.component';
import { IsTMComponent } from './gamehub/components/teamwindow/isTeamMember/is-tm/is-tm.component';

@NgModule({
  declarations: [
    AppComponent,
    GamelobbyComponent,
    GamewindowComponent,
    LeaderboardComponent,
    TeamwindowComponent,
    HomeComponent,
    NavComponent,
    GamechatComponent,    
    IsnotTMComponent,
    IsTMComponent    
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AuthModule.forRoot({
      domain: environment.auth.domain,
      clientId: environment.auth.clientId,
      audience: 'revboxgamesapi',
      httpInterceptor: {
        allowedList: [
          {
            uri: `${environment.api.url}/*`,
            tokenOptions: {
              audience: 'revboxgamesapi'
            }
          }
        ]
      }
    }),
    RouterModule.forRoot([
      {path: "home", component: HomeComponent },
      {path: "gamewindow", component: GamewindowComponent,canActivate: [AuthGuard], },
      {path: "gamelobby", component: GamelobbyComponent, canActivate: [AuthGuard], },
      {path: "leaderboard", component: LeaderboardComponent, canActivate: [AuthGuard], },
      {path: "teamwindow", component: TeamwindowComponent, canActivate: [AuthGuard], },
      {path: "chat", component: GamechatComponent, canActivate: [AuthGuard], }

    ]),
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    ReactiveFormsModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthHttpInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
