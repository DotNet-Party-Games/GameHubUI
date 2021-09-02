import { LeaderBoard } from './../../models/LeaderBoard';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-leaderboard-list-item',
  templateUrl: './leaderboard-list-item.component.html',
  styleUrls: ['./leaderboard-list-item.component.css']
})
export class LeaderboardListItemComponent implements OnInit {

  @Input() leaderboardItem: LeaderBoard;
  constructor() { 
    //empty
  }

  ngOnInit(): void {
    //empty
  }

}
