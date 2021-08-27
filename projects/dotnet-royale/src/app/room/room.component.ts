import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs/internal/Subscription';
import { SocketioService } from '../services/socketio/socketio.service';

@Component({
  selector: 'app-room',
  templateUrl: './room.component.html',
  styleUrls: ['./room.component.css']
})
export class RoomComponent implements OnInit, OnDestroy {

  username: string;
  gameId: number;
  roomId: string;
  userList: string[];
  goToGameSub: Subscription;
  constructor(private router: Router, private socketService: SocketioService, private route: ActivatedRoute) { }
  ngOnDestroy(): void {
    this.goToGameSub.unsubscribe();
  }

  ngOnInit(): void {
    this.username = sessionStorage.getItem('userName');
    this.roomId = sessionStorage.getItem('roomId');
    this.reloadRoomList();
    this.getRoomUserList();
    this.randomGameId();
    this.goToGameSub = this.socketService.goToGame().subscribe(data => {
      console.log("received game id");
      this.goToGame(data);
    })
  }

  reloadRoomList(){
    this.socketService.reloadRoomList(this.username);
  }

  getRoomUserList(){
    this.socketService.getRoomList().subscribe(roomList => {
      let room = roomList.find(({id}) => id == this.roomId);
      if(room) this.userList = room.users;
    });
  }

  goToLobby(){
    this.leaveRoom(this.username, this.roomId);
    this.router.navigate(['lobby'], { relativeTo: this.route });
  }

  leaveRoom(username:string, roomId:string):void
  {
    this.socketService.leaveRoom({user:username, room:roomId});
    sessionStorage.removeItem("roomId");
  }

  setGameId(p_gameId: number)
  {
    this.gameId = p_gameId;
  }

  randomGameId()
  {
    this.gameId = Math.floor(Math.random() * 3) + 1;
  }
  sendGameId()
  {
    console.log("sendgameid triggered");
    console.log(this.userList.indexOf(this.username));
    if(this.userList.indexOf(this.username)==0)
    {
      console.log("sending gameid");
      this.socketService.sendGameId({room: this.roomId, gameid: this.gameId});
    }
    
  }
  goToGame(p_gameid: number)
  {
    switch(p_gameid) {
      case 1: {
        this.router.navigate(['snake'], { relativeTo: this.route });
        break;
      }
      case 2: {
        this.router.navigate(['blackjack'], { relativeTo: this.route });
        break;
      }
      case 3: {
        this.router.navigate(['tictactoe'], { relativeTo: this.route });
        break;
      }
      case 4: {
        this.router.navigate(['lightbike'], { relativeTo: this.route });
        break;
      }
      default: {

      }
    }
  }

}
