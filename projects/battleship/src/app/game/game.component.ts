import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { BattleshipDeployService } from '../services/battleship-deploy.service';
import { GameStateService } from '../services/gamestate.service';
import { RoomService } from '../services/room.service';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})
export class GameComponent implements OnInit {

  gameState:boolean = false;
  winner:boolean = false;
  loser:boolean = false;
  _roomSub:Subscription;
  roomNum: string;

  constructor(private socket:GameStateService,private deploy:BattleshipDeployService, private roomservice:RoomService,private router:Router,) { }

  ngOnInit(): void {
    this._roomSub = this.socket.gameStarted.subscribe(started=>this.gameState=started);
    this._roomSub = this.socket.winner.subscribe(win=>{this.winner = win; this.playaudio("win")});
    this._roomSub = this.socket.loser.subscribe(lose=>{this.loser = lose; this.playaudio("lose")});
    this.roomservice.currentRoom.subscribe(response => this.roomNum = response);
  }

  playaudio(status:string){
    let audio = new Audio();
    switch(status){
      case "win":
        audio.src = "/assets/battleship/victory.mp3";
        audio.load();
        audio.play();
        break;
      case "lose":
        audio.src = "/assets/battleship/Taps 5 second version.wav";
        audio.load();
        audio.play();
        break;
    }
  }

  LeaveRoom(){
    this.deploy.leaveRoom(this.roomNum);
    console.log("leaving room");
    this.router.navigate(["/game/battleship/roomlist"]);
  }

}
