import { Component, OnInit } from '@angular/core';
import { PartygameService } from '../services/partygame.service';
import { IGame } from '../services/game';
import { IUserScore } from '../services/userscore';
import { IGameStats } from '../services/gamestats';
import { Router } from '@angular/router';
import { IUser } from '../services/user';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {

  userName: string;
  user: IUser;
  userId: number;
  games: IGame[];
  userscores: IUserScore[];
  scores: {gameName: string, score: number}[];

  snakeGameStats: IGameStats;
  blackJackGameStats: IGameStats;
  tictactoeGameStats: IGameStats;

  constructor(private router: Router, private partyGameApi: PartygameService) { }

  ngOnInit(): void {
    this.userName = sessionStorage.getItem("userName");
    this.partyGameApi.getUserFromUserName(this.userName)
      .subscribe((response: IUser) => {this.user = response});
    this.userId = this.user.id;

    this.partyGameApi.getSnakeGameStatsByUserId(this.userId)
      .subscribe((response: IGameStats) => {this.snakeGameStats = response});
    this.partyGameApi.getBlackJackGameStatsByUserId(this.userId)
      .subscribe((response: IGameStats) => {this.blackJackGameStats = response});
    this.partyGameApi.getTicTacToeGameStatsByUserId(this.userId)
      .subscribe((response: IGameStats) => {this.tictactoeGameStats = response});
  }

  getGameList()
  {
    this.partyGameApi.getGames().subscribe((response: IGame[]) => { this.games = response });
  }

  GetUserScoreHistory()
  {
    this.partyGameApi.getScoreHistoryByUserId(this.userId).subscribe((response: IUserScore[]) => {
      this.userscores = response;
      this.userscores.sort((a, b) => b.score - a.score);
    });
  }

  goToMain(){
    this.router.navigate(['/main']);
  }

}
