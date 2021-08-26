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
    this.router.navigate(['/lobby']);
  }

  goToLeaderboard() {
    this.router.navigate(['/leaderboard']);
  }

  goToUserProfile() {
    this.router.navigate(['/user-profile']);
  }

  goToRoot(){
    this.router.navigate(['/']);
  }

}
