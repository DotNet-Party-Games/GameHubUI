import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { GamewindowComponent } from './gamehub/components/gamewindow/gamewindow.component';
import { LeaderboardComponent } from './gamehub/components/leaderboard/leaderboard.component';
import { TeamwindowComponent } from './gamehub/components/teamwindow/teamwindow.component';
import { HomeComponent } from './gamehub/components/home/home.component';
import { NavComponent } from './gamehub/components/nav/nav.component';

import { RouterModule } from '@angular/router';
import { AuthGuard, AuthModule, AuthHttpInterceptor} from '@auth0/auth0-angular';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { environment } from 'src/environments/environment';
import { GamechatComponent } from './gamehub/components/gamechat/gamechat.component';
import { IsnotTMComponent } from './gamehub/components/teamwindow/isNotTeamMember/isnot-tm/isnot-tm.component';
import { IsTMComponent } from './gamehub/components/teamwindow/isTeamMember/is-tm/is-tm.component';
import { GameComponent } from './gamehub/components/gamewindow/game/game.component';
import { LoadingWheelComponent } from './gamehub/components/loadingwheel/loading-wheel.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SocketIoConfig, SocketIoModule} from 'ngx-socket-io';
import { ToastsComponent } from './gamehub/components/toasts/toasts.component';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

// const config: SocketIoConfig = { url: 'http://localhost:3000', options: {}};

@NgModule({
  declarations: [
    AppComponent,
    GamewindowComponent,
    LeaderboardComponent,
    TeamwindowComponent,
    HomeComponent,
    NavComponent,
    GamechatComponent,
    IsnotTMComponent,
    IsTMComponent,
    GameComponent,
    LoadingWheelComponent,
    ToastsComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    // SocketIoModule.forRoot(config),
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
      {path: '', redirectTo: "home", pathMatch: 'full'},
      {path: "home", component: HomeComponent},
      {path: "gamelist", component: GamewindowComponent,canActivate: [AuthGuard], },
      {path: "leaderboard", component: LeaderboardComponent, canActivate: [AuthGuard], },
      {path: "teamwindow", component: TeamwindowComponent, canActivate: [AuthGuard], },
      {path: "chat", component: GamechatComponent, canActivate: [AuthGuard], },
      {path: "game", component: GameComponent, canActivate: [AuthGuard], },
      {path: "game/dotnetroyale", component: GameComponent, loadChildren: () => import('projects/dotnet-royale/src/app/dotnetroyale.module').then(m => m.DotnetRoyaleModule)},
      {path: "game/songsink", component: GameComponent, loadChildren: () => import('projects/songs-ink/src/app/songsink.module').then(m => m.SongsInkModule)},
      {path: "game/battleship", component:GameComponent, loadChildren:()=>import('projects/battleship/src/app/battleship.module').then(m=> m.BattleshipModule)}
      //{path: "**", redirectTo: "home"}
      
    ], { useHash: true }),
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    NgbModule,
    NoopAnimationsModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthHttpInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
