import { Component, OnInit } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';
import { IStatistic } from './statistic';
import { StatisticapiService } from '../services/statisticapi.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  profileJson: string = "";
  userStats: IStatistic;

  constructor(public auth: AuthService, private statisticApi:StatisticapiService) {
    this.userStats = {
      wins: 0,
      losses: 0,
      ties: 0
    };
  }

  ngOnInit(): void {
    this.auth.user$.subscribe(
      (profile) => (this.profileJson = JSON.stringify(profile, null, 2))
    );
    this.getUserStats();
  }

  getUserStats()
  {
    this.statisticApi.getUserStats().subscribe(
      (response) => {
        this.userStats = response;
      }
    )
  }
}