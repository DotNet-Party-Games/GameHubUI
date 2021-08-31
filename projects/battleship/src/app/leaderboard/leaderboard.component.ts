import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { IUserScore } from '../services/IUserScores';
import { ILeaderboard } from '../services/ILeaderBoard';
import { StatisticapiService } from '../services/statisticapi.service';

export interface MockScore {
  scoreId: number,
  userId: number,
  scoreValue: number,
  gameTime: string
}

const MOCK_DATA : MockScore[] = 
[
  {
    "scoreId": 1,
    "userId": 1,
    "scoreValue": 0,
    "gameTime": "2021-08-06T18:58:21.753"
  },
  {
    "scoreId": 2,
    "userId": 2,
    "scoreValue": 4,
    "gameTime": "2021-08-13T05:58:54.375"
  },
  {
    "scoreId": 7,
    "userId": 2,
    "scoreValue": 6,
    "gameTime": "2021-08-06T18:58:21"
  },
  {
    "scoreId": 8,
    "userId": 1,
    "scoreValue": 8,
    "gameTime": "2021-08-06T18:58:21"
  },
  {
    "scoreId": 9,
    "userId": 1,
    "scoreValue": 11,
    "gameTime": "2021-08-05T18:58:21"
  },
  {
    "scoreId": 10,
    "userId": 2,
    "scoreValue": 11,
    "gameTime": "2021-08-05T14:54:21"
  },
  {
    "scoreId": 11,
    "userId": 1,
    "scoreValue": 31,
    "gameTime": "2021-08-04T12:53:16"
  },
  {
    "scoreId": 12,
    "userId": 2,
    "scoreValue": 31,
    "gameTime": "2021-08-04T12:53:16"
  },
  {
    "scoreId": 13,
    "userId": 2,
    "scoreValue": 15,
    "gameTime": "2021-08-03T10:33:26"
  },
  {
    "scoreId": 14,
    "userId": 1,
    "scoreValue": 9,
    "gameTime": "2021-08-03T10:33:26"
  }
];

@Component({
  selector: 'app-leaderboard',
  templateUrl: './leaderboard.component.html',
  styleUrls: ['./leaderboard.component.css']
})
export class LeaderboardComponent implements OnInit, AfterViewInit {

  scores: IUserScore[];
  displayedColumns: string[] = ['userId', 'scoreValue', 'gameTime'];
  dataSource: MatTableDataSource<IUserScore>;
  mockDataSource: MatTableDataSource<MockScore>;
  NoData:boolean=true;
  Leaderboard:ILeaderboard;

  @ViewChild(MatSort, { static: false }) sort: MatSort;
  @ViewChild(MatSort, { static: false }) set matSort(ms: MatSort) {
    this.sort = ms;
  }

  @ViewChild(MatSort) mockSort: MatSort;

  constructor(private StatsApi:StatisticapiService) { 
    this.scores = new Array<IUserScore>();
    this.dataSource = new MatTableDataSource();
    MOCK_DATA.sort((a, b) => (a.scoreValue > b.scoreValue) ? -1 : 1);
    this.mockDataSource = new MatTableDataSource(MOCK_DATA);
    
  }

  ngOnInit(): void 
  {
    const scoreObserver={
      next:(x: any)=> {this.Leaderboard=x; this.Leaderboard.Scores.sort((a, b) => (a.Score > b.Score) ? -1 : 1); this.NoData=false},
      error:(err: any)=> console.log(err),  
    }
    this.StatsApi.GetIndividualLeaderboard().subscribe(scoreObserver);
  }

  ngAfterViewInit() {
    this.sort.sortChange.subscribe(() => {
    });
    this.dataSource.sort = this.sort;
    this.mockDataSource.sort = this.mockSort;
  }

  GetIndividualLeaderboard()
  {
    this.StatsApi.GetIndividualLeaderboard().subscribe(
      (response) => {
        this.scores = response.Scores;
        this.scores.sort((a, b) => (a.Score > b.Score) ? -1 : 1);  // sort array from greatest to least
        this.dataSource = new MatTableDataSource(Array.from(this.scores));
        console.log(this.scores);
      }
    )
    
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    this.mockDataSource.filter = filterValue.trim().toLowerCase();
  }
}