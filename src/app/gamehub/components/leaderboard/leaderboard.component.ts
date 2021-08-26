import { Component, OnInit } from '@angular/core';
import { ITeamScore } from '../../interfaces/ITeamScores';
import { LeaderboardService } from '../../services/leaderboardservice/leaderboard.service';

@Component({
  selector: 'app-leaderboard',
  templateUrl: './leaderboard.component.html',
  styleUrls: ['./leaderboard.component.scss']
})
export class LeaderboardComponent implements OnInit {

  TeamEntry?: ITeamScore[];
  SelectedGame: string = "partygames";

  constructor(private leaderBoardService: LeaderboardService) { 
    // this.leaders.push({playerName:"klaus",score:1500});
    // this.leaders.push({playerName:"Iram",score:1000});
    // this.leaders.push({playerName:"Sean",score:500});

  }

  ngOnInit(): void {
    this.GetTeamLeaderboard(this.SelectedGame);
  }

  GetTeamLeaderboard(gameName: string)
  {
    this.leaderBoardService.GetTeamLeaderboard(gameName).subscribe(
      (result) => {
        this.TeamEntry = result.scores;
        this.SelectedGame = result.id;
        }
    );
  }

}
