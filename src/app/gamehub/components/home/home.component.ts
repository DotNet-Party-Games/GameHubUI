import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';
import { TeamLeaderboardService } from 'projects/hubservices/src/public-api';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  constructor(public auth: AuthService, private leaderboardService: TeamLeaderboardService) { }

  user: any;

  ngOnInit(): void {}

  public getUserInfo(): void {
    this.leaderboardService.submitScore("songsink", 1);
  }

 
}
