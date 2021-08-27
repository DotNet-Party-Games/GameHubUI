import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../../../../hubservices/src/lib/user.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {

  constructor(private router: Router, private route: ActivatedRoute, private userService: UserService) { }

  ngOnInit(): void {
    let username = sessionStorage.getItem('userName');
    if(!username)
      this.userService.user.subscribe(u => {
        sessionStorage.setItem('userName', u.username);
      });
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
    this.router.navigate(['gamelist']);
  }

}
