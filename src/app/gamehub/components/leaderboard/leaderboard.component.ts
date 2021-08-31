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

  TeamEntry: ITeamScore[];
  SelectedGame: string = "partygames";
  public user: User | null = null;
  public isLoading: Boolean = false;

  constructor(private leaderBoardService: LeaderboardService, public userService: UserService) { 
    // this.leaders.push({playerName:"klaus",score:1500});
    // this.leaders.push({playerName:"Iram",score:1000});
    // this.leaders.push({playerName:"Sean",score:500});

    this.GetUser();
  }

  ngOnInit(): void {
    this.GetTeamLeaderboard(this.SelectedGame);
    this.isLoading = true;
  }

  GetTeamLeaderboard(gameName: string)
  {
    this.isLoading = true;
    this.leaderBoardService.GetTeamLeaderboard(gameName).subscribe(
      (result) => {
        this.TeamEntry = result.scores;
        this.SelectedGame = result.id;
        this.TeamEntry.sort((a, b) => (a.score > b.score ? -1 : 1));
        this.isLoading = false;
        },
      (error) => {
        console.log(error);
        console.log("Retrying to get leaderboard...")
        setTimeout(() => this.GetTeamLeaderboard(gameName), 5000); 
      }
    );
  }

  GetUser()
  {
    this.userService.user.subscribe(user => {
      this.user = user;
    });
  }

}
