import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {

  constructor(private router: Router, private route: ActivatedRoute) { }

  ngOnInit(): void {
  }

  goToLobby() {
    this.router.navigate(['lobby'], { relativeTo: this.route });
  }

  goToLeaderboard() {
    this.router.navigate(['leaderboard'], { relativeTo: this.route });
  }

  goToUserProfile() {
    this.router.navigate(['user-profile'], { relativeTo: this.route });
  }

  goToRoot(){
    this.router.navigate(['dotnetroyale'], { relativeTo: this.route });
  }

}
