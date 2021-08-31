import { LeaderBoard } from './../../models/LeaderBoard';
import { Component, OnInit } from '@angular/core';
import { ProfileService } from '../../services/profile.service';
@Component({
  selector: 'app-leaderboard',
  templateUrl: './leaderboard.component.html',
  styleUrls: ['./leaderboard.component.css']
})
export class LeaderboardComponent implements OnInit {

  leaderboardItems: LeaderBoard[] = [];
  activeItem: LeaderBoard;
  constructor(private profileService: ProfileService) { }

  ngOnInit() {
    this.profileService.getPlayers().subscribe( (response) => {
      for (let player of response)
      {
        this.leaderboardItems.push (
          {
            id: player.id,
            nickName: player.nickName,
            currentScore: player.currentScore,
            overallScore: player.overallScore
          }
        )
      }
    })
  }
}
