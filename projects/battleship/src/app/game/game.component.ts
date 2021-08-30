import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { GameStateService } from '../services/gamestate.service';

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

  constructor(private socket:GameStateService) { }

  ngOnInit(): void {
    this._roomSub = this.socket.gameStarted.subscribe(started=>this.gameState=started);
    this._roomSub = this.socket.winner.subscribe(win=>{this.winner = win; this.playaudio("win")});
    this._roomSub = this.socket.loser.subscribe(lose=>{this.loser = lose; this.playaudio("lose")});
  }

  playaudio(status:string){
    let audio = new Audio();
    switch(status){
      case "win":
        audio.src = "../../../../src/assets/battleship/victory.mp3";
        audio.load();
        audio.play();
        break;
      case "lose":
        audio.src = "../../../../src/assets/Taps 5 second version.wav";
        audio.load();
        audio.play();
        break;
    }
  }

}
