import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SocketIoService } from './../../services/socketio.service'
import { RoomListComponent } from '../room-list/room-list.component';
import { Router, ActivatedRoute } from '@angular/router';
import { UserService } from 'projects/hubservices/src/public-api';
@Component({
  selector: 'app-lobby',
  templateUrl: './lobby.component.html',
  styleUrls: ['./lobby.component.css']
})
export class LobbyComponent implements OnInit {
  user: string;

  constructor(private router: Router, private route: ActivatedRoute, private socketService: SocketIoService, private userService: UserService) { }

  ngOnInit(): void {
    this.userService.user.subscribe(response => {
      this.user = <string>response?.username;
    });
    this.socketService.SetUsername(this.user);
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
