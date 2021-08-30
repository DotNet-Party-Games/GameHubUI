import { Component, Input, OnInit } from '@angular/core';
import { PartygameService } from '../services/partygame.service';
import { Leader } from '../services/leader';
import { IScore } from '../services/score';
import { IUser } from '../services/user';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-leaderboard',
  templateUrl: './leaderboard.component.html',
  styleUrls: ['./leaderboard.component.css']
})
export class LeaderboardComponent implements OnInit {

  snakeLeaders: Leader[];
  blackjackLeaders: Leader[];
  tictactoeLeaders: Leader[];
  scores: IScore[];

  constructor(private router: Router, private partyGameApi: PartygameService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.snakeLeaders = this.getLeaderBoardByGameId(1);
    this.blackjackLeaders = this.getLeaderBoardByGameId(2);
    this.tictactoeLeaders = this.getLeaderBoardByGameId(3);
  }

  getLeaderBoardByGameId(p_gameId: number) : Leader[]
  {
    let leaders: Leader[] = [];
    this.partyGameApi.getTop10ScoresByGameId(p_gameId).subscribe((response: IScore[]) => {
      this.scores = response;
      this.scores.forEach(s => {
        this.partyGameApi.getUserFromUserId(s.userId).subscribe((u: IUser) => {
          leaders.push({username: u.userName, score:s.score});
          leaders.sort((a, b) => b.score - a.score)
          });
      })
    });
    return leaders;
  }

  goToMain(){
    this.router.navigate(['main'], { relativeTo: this.route.parent });
  }

}
