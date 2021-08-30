import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-leaderboard-list-item',
  templateUrl: './leaderboard-list-item.component.html',
  styleUrls: ['./leaderboard-list-item.component.css']
})
export class LeaderboardListItemComponent implements OnInit {

  @Input() leaderboardItem: any;
  active: any;
  constructor() { }

  ngOnInit(): void {
  }

}
