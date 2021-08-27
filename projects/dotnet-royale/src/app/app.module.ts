import { DoBootstrap, NgModule, Injector, ModuleWithProviders } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { LayoutComponent } from './layout/layout.component';
import { LivechatComponent } from './livechat/livechat.component';
import { GamelistComponent } from './gamelist/gamelist.component';
import { LeaderboardComponent } from './leaderboard/leaderboard.component';
import { PartygameService } from './services/partygame.service';
import { SquareComponent } from './tictactoe/square/square.component';
import { BoardComponent } from './tictactoe/board/board.component';
import { SnakeComponent } from './snake/snake.component';
import { GameFieldComponent } from './snake/game-field/game-field.component';

import { BlackjackComponent } from './blackjack/blackjack.component';
import { MainComponent } from './main/main.component';
import { LobbyComponent } from './lobby/lobby.component';
import { RoomComponent } from './room/room.component';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { FakeLoginComponent } from './fake-login/fake-login.component';
import { TrueblackjackComponent } from './trueblackjack/trueblackjack.component';
import { VerticalCarouselComponent } from './vertical-carousel/vertical-carousel.component';
import { lightbikeComponent } from './light-bike/light-bike.component';


@NgModule({
  declarations: [
    AppComponent,
    LayoutComponent,
    LivechatComponent,
    GamelistComponent,
    LeaderboardComponent,
    SquareComponent,
    BoardComponent,
    SnakeComponent,
    GameFieldComponent,
    BlackjackComponent,
    MainComponent,
    LobbyComponent,
    RoomComponent,
    UserProfileComponent,
    FakeLoginComponent,
    TrueblackjackComponent,
    VerticalCarouselComponent,
    lightbikeComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    RouterModule.forRoot([
      {path: 'game/dotnetroyale', component: FakeLoginComponent},
      {path: 'game/dotnetroyale/main', component: MainComponent},
      {path: 'game/dotnetroyale/lobby', component: LobbyComponent},
      {path: 'game/dotnetroyale/room', component: RoomComponent},
      {path: 'game/dotnetroyale/leaderboard', component: LeaderboardComponent},
      {path: 'game/dotnetroyale/user-profile', component: UserProfileComponent},
      {path: 'game/dotnetroyale/snake', component: LayoutComponent},
      {path: 'game/dotnetroyale/blackjack', component: BlackjackComponent},
      {path: 'game/dotnetroyale/tictactoe', component: BoardComponent},
      {path: 'game/dotnetroyale/lightbike', component: lightbikeComponent}
    ]),
    NgbModule
  ],
  providers: [PartygameService],
  bootstrap: [AppComponent]
})

export class AppModule{}
// export class AppModule implements DoBootstrap {

//   constructor(injector: Injector) {
//     const snakeComponent = createCustomElement(SnakeComponent, { injector });
//     customElements.define('ng-snake', snakeComponent);
//   }

//   ngDoBootstrap(){}
// }

@NgModule({})
export class DotnetRoyaleModule{
  static forRoot(): ModuleWithProviders<DotnetRoyaleModule> {
    return {
      ngModule: AppModule,
      providers: []
    }
  }
}
