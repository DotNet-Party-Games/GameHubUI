import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-leaderboard',
  templateUrl: './leaderboard.component.html',
  styleUrls: ['./leaderboard.component.scss']
})
export class LeaderboardComponent implements OnInit {

  leaders: {playerName:string, score:number}[]=[];
  constructor() { 
    this.leaders.push({playerName:"klaus",score:1500});
    this.leaders.push({playerName:"Iram",score:1000});
    this.leaders.push({playerName:"Sean",score:500});
  }

  ngOnInit(): void {
  }

}
