import { Component, OnInit } from '@angular/core';
import { SocketOne } from '../battleship.module';
import { GameStateService } from '../services/gamestate.service';

@Component({
  selector: 'app-userlist',
  templateUrl: './userlist.component.html',
  styleUrls: ['./userlist.component.scss']
})
export class UserlistComponent implements OnInit {
  displayedColumns: string[] = ['User', 'Turn'];
  userlist:string[] = [];

  constructor(private game:GameStateService) { }

  ngOnInit(): void {
    this.userlist = this.game.usersInRoom;
    this.game.userList.subscribe(result=>this.userlist=result);
  }

}
