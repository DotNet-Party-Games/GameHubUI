import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  goToLobby() {
    this.router.navigate(['game/dotnetroyale/lobby']);
  }

  goToLeaderboard() {
    this.router.navigate(['game/dotnetroyale/leaderboard']);
  }

  goToUserProfile() {
    this.router.navigate(['game/dotnetroyale/user-profile']);
  }

  goToRoot(){
    this.router.navigate(['game/dotnetroyale']);
  }

}
