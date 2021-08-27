import { Component, OnInit } from '@angular/core';
import { PartygameService } from '../services/partygame.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {

  userId: number;
  snakeAvgScore: number;
  snakeHighScore: number;
  blackJackWinLossRatio: number;
  ticTacToeWinLossRatio: number;

  constructor(private router: Router, private partyGameApi: PartygameService) { }

  ngOnInit(): void {
    this.partyGameApi.getUserFromUserName(sessionStorage.getItem("userName"))
      .subscribe((response: any) => {this.userId = response.id});

    this.partyGameApi.getSnakeGameStatsByUserId(6)
      .subscribe((response: any) => {
        this.snakeAvgScore = response.avgScore;
        this.snakeHighScore = response.highScore;
      });
    this.partyGameApi.getBlackJackGameStatsByUserId(6)
      .subscribe((response: any) => {
        this.blackJackWinLossRatio = response.winLossRatio}
        );
    this.partyGameApi.getTicTacToeGameStatsByUserId(6)
      .subscribe((response: any) => {this.ticTacToeWinLossRatio = response.winLossRatio});
  }

  goToMain(){
    this.router.navigate(['/main']);
  }

}
