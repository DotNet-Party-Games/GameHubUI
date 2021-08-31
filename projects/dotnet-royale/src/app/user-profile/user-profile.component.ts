import { Component, OnInit } from '@angular/core';
import { PartygameService } from '../services/partygame.service';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { timeStamp } from 'console';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {

  userName: string;
  snakeAvgScore: number;
  snakeHighScore: number;
  blackJackWinLossRatio: number;
  ticTacToeWinLossRatio: number;
  lightBikeWinLossRatio: number;

  constructor(private router: Router, private partyGameApi: PartygameService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.userName = sessionStorage.getItem("userName");
    this.partyGameApi.getSnakeGameStatsByUserName(this.userName)
      .subscribe((response: any) => {
        this.snakeAvgScore = response.avgScore;
        this.snakeHighScore = response.highScore;
      });
    this.partyGameApi.getBlackJackGameStatsByUserName(this.userName)
      .subscribe((response: any) => {
        this.blackJackWinLossRatio = response.winLossRatio}
        );
    this.partyGameApi.getTicTacToeGameStatsByUserName(this.userName)
      .subscribe((response: any) => {
        this.ticTacToeWinLossRatio = response.winLossRatio
      });
      this.partyGameApi.getLightBikeGameStatsByUserName(this.userName)
      .subscribe((response: any) => {
        this.lightBikeWinLossRatio = response.winLossRatio
      });
  }

  goToMain(){
    this.router.navigate(['main'], { relativeTo: this.route.parent });
  }

}
