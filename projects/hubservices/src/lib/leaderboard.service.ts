import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Team } from '../models/team.model';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class TeamLeaderboardService {
  public userTeam: Team

  constructor(private http: HttpClient, private userService: UserService) {
    this.userService.user.subscribe(user => {
      if(user) {
        this.userTeam = user.team;
      }
    });
  }

  public submitScore(gameName: string, score: number) {
    if (this.userTeam) {
      this.http.post(`${environment.api.url}/leaderboard/team/${gameName}`, {teamName: this.userTeam.name, score: score}).subscribe(
        () => {
          console.log(`Team score for ${this.userTeam.name} submitted`)
        },
        () => {
          console.log(`Error submiting score for team ${this.userTeam.name}`)
        }
      );
    }
  }
}
