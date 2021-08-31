import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SocketIoService } from './../../services/socketio.service'
import { RoomListComponent } from '../room-list/room-list.component';
import { Router, ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-lobby',
  templateUrl: './lobby.component.html',
  styleUrls: ['./lobby.component.css']
})
export class LobbyComponent implements OnInit {

  constructor(private router: Router, private route: ActivatedRoute) { }

  ngOnInit(): void {

  }

  viewProfile()
  {
    this.router.navigate(['profile'], {relativeTo: this.route.parent})
  }

}
