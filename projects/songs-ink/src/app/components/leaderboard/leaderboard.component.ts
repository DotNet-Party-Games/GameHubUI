import { LeaderBoard } from './../../models/LeaderBoard';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-leaderboard',
  templateUrl: './leaderboard.component.html',
  styleUrls: ['./leaderboard.component.css']
})
export class LeaderboardComponent implements OnInit {

  leaderboardItems: LeaderBoard[];
  activeItem: LeaderBoard;
  constructor() { }

  ngOnInit() {

  }

}
