import { Component, OnInit } from '@angular/core';
import { User } from 'projects/hubservices/src/models/user.model';
import { UserService } from 'projects/hubservices/src/public-api';
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
  public user: User | null = null;

  constructor(private leaderBoardService: LeaderboardService, public userService: UserService) { 
    // this.leaders.push({playerName:"klaus",score:1500});
    // this.leaders.push({playerName:"Iram",score:1000});
    // this.leaders.push({playerName:"Sean",score:500});

    this.GetUser();
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

  GetUser()
  {
    this.userService.user.subscribe(user => {
      // if(!this.isLoading) this.isLoading = true;
      this.user = user;
    });
  }

}
