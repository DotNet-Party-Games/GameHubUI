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
    this.router.navigate(['lobby'], { relativeTo: this.route.parent });
  }

  goToLeaderboard() {
    this.router.navigate(['leaderboard'], { relativeTo: this.route.parent });
  }

  goToUserProfile() {
    this.router.navigate(['user-profile'], { relativeTo: this.route.parent });
  }

  goToRoot(){
    this.router.navigate(['game/dotnetroyale']);
    // this.router.navigate([''], { relativeTo: this.route.parent });
    // console.log(this.route.parent);
  }

}
