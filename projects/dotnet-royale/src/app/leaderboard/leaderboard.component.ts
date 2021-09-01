import { Component, Input, OnInit } from '@angular/core';
import { PartygameService } from '../services/partygame.service';
import { IScore } from '../services/score';
import { IStat } from '../services/stat';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-leaderboard',
  templateUrl: './leaderboard.component.html',
  styleUrls: ['./leaderboard.component.css']
})
export class LeaderboardComponent implements OnInit {

  snakeLeaders: IScore[];
  blackjackLeaders: IStat[];
  tictactoeLeaders: IStat[];
  lightbikeLeaders: IStat[];

  constructor(private router: Router, private partyGameApi: PartygameService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.getAllLeaderBoardByGameId();
  }

  getAllLeaderBoardByGameId()
  {
    this.partyGameApi.getTop10ScoresByGameId(1).subscribe((response: IScore[]) => {
      this.snakeLeaders = response;
    });
    this.partyGameApi.getTop10BlackJackStats().subscribe((response: IStat[]) => {
      this.blackjackLeaders = response;
    });
    this.partyGameApi.getTop10TicTacToeStats().subscribe((response: IStat[]) => {
      this.tictactoeLeaders = response;
    });
    this.partyGameApi.getTop10LightBikeStats().subscribe((response: IStat[]) => {
      this.lightbikeLeaders = response;
    });
  }

  goToMain(){
    this.router.navigate(['main'], { relativeTo: this.route.parent });
  }

}
