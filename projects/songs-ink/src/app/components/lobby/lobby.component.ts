import { Component, OnInit } from '@angular/core';
import { SocketIoService } from './../../services/socketio.service'
import { Router, ActivatedRoute } from '@angular/router';
import { UserService } from 'projects/hubservices/src/public-api';
import { ProfileService } from '../../services/profile.service';
@Component({
  selector: 'app-lobby',
  templateUrl: './lobby.component.html',
  styleUrls: ['./lobby.component.css']
})
export class LobbyComponent implements OnInit {
  user: string;

  constructor(private router: Router, private route: ActivatedRoute, private socketService: SocketIoService, private userService: UserService, private profileService: ProfileService) { }

  ngOnInit(): void {
    this.userService.user.subscribe(response => {
      this.user = <string>response?.username;
    });
    this.socketService.SetUsername(this.user);
    this.profileService.getUserScore(this.user).subscribe( (response) => {
      if(!response) {
        this.profileService.addPlayer(this.user).subscribe( (response1) => {
          this.user = response1.nickName;
        })
      }
    }) 
  }

  viewProfile()
  {
    this.router.navigate(['profile'], {relativeTo: this.route.parent})
  }

  viewLeaderBoard()
  {
    this.router.navigate(['leaderboard'], {relativeTo: this.route.parent})
  }

}
