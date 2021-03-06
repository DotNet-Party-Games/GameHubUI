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
  userList: string[] =[];
  goToGameSub: Subscription;
  constructor(private router: Router, private socketService: SocketioService, private route: ActivatedRoute) { }
  ngOnDestroy(): void {
    this.goToGameSub.unsubscribe();
  }
  clickedPlay: boolean = false;
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
    this.router.navigate(['lobby'], { relativeTo: this.route.parent });
  }

  leaveRoom(username:string, roomId:string):void
  {
    this.socketService.leaveRoom({user:username, room:roomId});
    sessionStorage.removeItem("roomId");
  }

  setGameId(p_gameId: number)
  {
    this.playSFX("click");
    this.gameId = p_gameId;
  }

  randomGameId()
  {
    this.playSFX("click");
    this.gameId = Math.floor(Math.random() * 3) + 1;
  }
  sendGameId()
  {
    this.clickedPlay = true;
    if(this.userList.indexOf(this.username)==0)
    {
      console.log("sending gameid");
      this.socketService.sendGameId({room: this.roomId, gameid: this.gameId});
    }

  }
  goToGame(p_gameid: number)
  {
    if(this.userList.indexOf(this.username)!=0 || this.clickedPlay)
    {
      switch(p_gameid) {
      case 1: {
        this.goToGameSub.unsubscribe();
        this.router.navigate(['snake'], { relativeTo: this.route.parent });
        break;
      }
      case 2: {
        this.goToGameSub.unsubscribe();
        this.router.navigate(['blackjack'], { relativeTo: this.route.parent });
        break;
      }
      case 3: {
        //this.goToGameSub.unsubscribe();
        this.router.navigate(['tictactoe'], { relativeTo: this.route.parent });
        break;
      }
      case 4: {
        this.goToGameSub.unsubscribe();
        this.router.navigate(['lightbike'], { relativeTo: this.route.parent });
        break;
      }
      case 5: {
       // this.goToGameSub.unsubscribe();
        this.router.navigate(['room'], { relativeTo: this.route.parent });
        break;
      }
      default: {
        break;
      }
    }
    }
    
  }
  playSFX(audioCue: string)
  {
    let audio = <HTMLAudioElement>document.getElementById('sfx');
    audio.volume= 0.1;
    audio.src = audioCue;
    audio.load();
    audio.play();
  }

}
