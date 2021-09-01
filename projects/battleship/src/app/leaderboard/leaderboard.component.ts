import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { IUserScore } from '../services/IUserScores';
import { ILeaderboard } from '../services/ILeaderBoard';
import { StatisticapiService } from '../services/statisticapi.service';
import { Statistics } from '../services/TeamScore';

export interface MockScore {
  scoreId: number,
  userId: number,
  scoreValue: number,
  gameTime: string
}

@Component({
  selector: 'app-leaderboard',
  templateUrl: './leaderboard.component.html',
  styleUrls: ['./leaderboard.component.css']
})
export class LeaderboardComponent implements OnInit {

  scores: Statistics[];
  dataSource: MatTableDataSource<Statistics>;
  NoData:boolean=true;
  Leaderboard:ILeaderboard;
  displayedColumns: string[] = ['UserId', 'Wins', 'Losses'];

  @ViewChild(MatSort, { static: false }) sort: MatSort;
  @ViewChild(MatSort, { static: false }) set matSort(ms: MatSort) {
    this.sort = ms;
  }

  @ViewChild(MatSort) mockSort: MatSort;

  constructor(private StatsApi:StatisticapiService) { 
    this.scores = new Array<Statistics>();
    this.dataSource = new MatTableDataSource();
  }

  ngOnInit(): void 
  {
    const scoreObserver={
      next:(x: any)=> {this.scores=x; this.NoData=false, console.log(this.NoData)},
      error:(err: any)=> console.log(err),  
    }
    this.StatsApi.GetEveryone();
    console.log("goteveryone");
    this.GetIndividualLeaderboard();
  }

  GetIndividualLeaderboard()
  {
        this.scores = this.StatsApi.test; 
        console.log(this.StatsApi.test);
        console.log(this.scores);
        this.dataSource = new MatTableDataSource(Array.from(this.scores));
      }
    

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}