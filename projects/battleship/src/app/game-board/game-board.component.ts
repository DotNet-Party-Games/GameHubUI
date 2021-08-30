import { Component, Input, OnInit} from '@angular/core';
import { INavy, IShot } from '../services/gameboard';
import { GameStateService } from '../services/gamestate.service';
import { Subscription } from 'rxjs';
import { InteractivityChecker } from '@angular/cdk/a11y';
import { Router } from '@angular/router';
import { IUserScore } from '../services/IUserScores';
import { stringify } from '@angular/compiler/src/util';
import { ScoreapiService } from '../services/scoreapi.service';

export interface IUser
{
  userId: string,
  userName: string
}

@Component({
  selector: 'app-game-board',
  templateUrl: './game-board.component.html',
  styleUrls: ['./game-board.component.css']
})
export class GameBoardComponent implements OnInit {

  @Input()
  playerName: IUser;
  @Input()
  playerOcean: INavy = new INavy;

  width: number[];
  height: number[];
  enemyName: IUser;
  enemyOcean: INavy = new INavy;
  PlayerBoardUpdate: INavy = new INavy;
  statusMessage: string;
  turn: boolean;
  _room: Subscription;
  patrol:number;
  sub:number;
  dest:number;
  battle:number;
  carrier:number;
  winner:boolean;
  loser:boolean;

  constructor(private socket:GameStateService, private router:Router, private score:ScoreapiService) {
    this.width = new Array(10);
    this.height = new Array(10);
    this.turn = false;
  }

  ngOnInit(): void {
    this.Seed();
    this._room = this.socket.currentTurn.subscribe(turn=>this.turn = turn);
    this.PlayerBoardUpdate=this.socket.startingNavy;
    // this.socket.SendPlayerBoard(this.PlayerBoardUpdate);
    this._room = this.socket.playerBoardUpdate.subscribe(shot=>this.PlayerBoardUpdate = shot);
    this._room = this.socket.enemyName.subscribe(enemy=>this.enemyName.userName = enemy);
    this._room = this.socket.enemyFleet.subscribe(board=>this.enemyOcean = board);
    this._room = this.socket.statusMessage.subscribe(mess=>this.statusMessage=mess);
    this.patrol = 2;
    this.sub = 3;
    this.dest = 3;
    this.battle = 4;
    this.carrier = 5;
    console.log(this.PlayerBoardUpdate.ocean);
    console.log(this.enemyOcean.ocean);
    // this.socket.UpdateNames(this.playerName.userName);
  }

  Attack(x: number, y: number, z: number) {
    if (this.turn){
      let message:string;
      console.log(x+y+z);
      console.log(this.enemyOcean.ocean[x][y][z]);
      if(this.enemyOcean.ocean[x][y][z]>5){
        // message = this.playerName.userName + " Hit " + this.enemyName.userName;
        this.enemyOcean.ocean[x][y][z] = 1;
        this.enemyOcean.oceanLegend[x][y][z] = "hit";
        console.log("Hit");
        this.UpdateBoardStatus(this.enemyOcean.craft[x][y][z]);
        if(this.patrol==0&&this.sub==0&&this.dest==0&&this.battle==0&&this.carrier==0){
          this.sendResult();
          this.socket.WinningShot();
        }else{
          this.socket.SendShot(this.enemyOcean, message);
          this.playaudio(this.enemyOcean.oceanLegend[x][y][z]);
        } 
      }
      else if(this.enemyOcean.ocean[x][y][z] == 0){
          // message = this.playerName.userName + " Missed " + this.enemyName.userName;
          this.enemyOcean.ocean[x][y][z] = 2;
          this.enemyOcean.oceanLegend[x][y][z] = "miss";
          this.socket.SendShot(this.enemyOcean, message);
          this.playaudio(this.enemyOcean.oceanLegend[x][y][z]);
      }

  }
}
playaudio(action:string){
  let audio = new Audio();
  switch(action){
    case "miss":
      audio.src = "../../../../src/assets/splash.wav";
      audio.load();
      audio.play();
      break;
    case "hit":
      audio.src = "../../../../src/assets/explosion.mp3";
      audio.load();
      audio.play();
      break;
    case "sink":
      audio.src = "../../../../src/assets/bubbling.mp3"
      audio.load();
      audio.play();
      break;
  }
}

  Seed(){
    this.PlayerBoardUpdate.ocean = new Array(10);
    this.PlayerBoardUpdate.oceanLegend = new Array(10);
    this.PlayerBoardUpdate.craft = new Array(10);

    this.enemyOcean.ocean = new Array(10);
    this.enemyOcean.oceanLegend = new Array(10);
    this.enemyOcean.craft = new Array(10);

    for (let i = 0; i < 10; i ++) {
      this.PlayerBoardUpdate.ocean[i] = new Array(10);
      this.PlayerBoardUpdate.oceanLegend[i] = new Array(10);
      this.PlayerBoardUpdate.craft[i] = new Array(10);

      this.enemyOcean.ocean[i] = new Array(10);
      this.enemyOcean.oceanLegend[i] = new Array(10);
      this.enemyOcean.craft[i] = new Array(10);

      for(let j = 0; j < 10; j ++) {

        this.PlayerBoardUpdate.ocean[i][j] = new Array(2);
        this.PlayerBoardUpdate.oceanLegend[i][j] = new Array(2);
        this.PlayerBoardUpdate.craft[i][j] = new Array(2);

        this.enemyOcean.ocean[i][j] = new Array(2);
        this.enemyOcean.oceanLegend[i][j] = new Array(2);
        this.enemyOcean.craft[i][j] = new Array(2);

        this.PlayerBoardUpdate.ocean[i][j][0] = 0;
        this.PlayerBoardUpdate.oceanLegend[i][j][0] = "water";
        this.PlayerBoardUpdate.craft[i][j][0] = "None";

        this.enemyOcean.ocean[i][j][0] = 0;
        this.enemyOcean.oceanLegend[i][j][0] = "water";
        this.enemyOcean.craft[i][j][0];
      }
    }
  }

  UpdateBoardStatus(craft:string){
    switch (craft) {
      case "Patrol":
        this.patrol-=1;
        if(this.patrol==0){
          this.Extenguish(craft);
          
        }
      break;
      case "Submarine":
        this.sub-=1;
        if(this.sub==0){
          this.Extenguish(craft);
        }
      break;
      case "Destroyer":
        this.dest-=1;
        if(this.dest==0){
          this.Extenguish(craft);
        }
      break;
      case "Battleship":
        this.battle-=1;
        if(this.battle==0){
          this.Extenguish(craft);
        }
      break;
      case "Carrier":
        this.carrier-=1;
        if(this.carrier==0){
          this.Extenguish(craft);
        }
      break;
      default:
      break;
    }
  }

  Extenguish(craft:string){
    for (let i = 0; i < 10; i ++) {
      for(let j = 0; j < 10; j ++) {
        if(this.enemyOcean.craft[i][j][0] == craft){
          this.enemyOcean.ocean[i][j][0] = 3;
          this.enemyOcean.oceanLegend[i][j][0] = "destroyed";
        }
      }
    }
    this.playaudio("sink");
  }
  LeaveRoom(){
    this.router.navigate(["/roomlist"]);
  }

  sendResult(){
    let Winner:IUserScore ={

      UserId:this.playerName.userName,
      Score:1
    }
    let Loser:IUserScore={
      UserId:this.enemyName.userName,
      Score:0
    }
    this.score.SubmitScore(Winner);
    this.score.SubmitScore(Loser);
  }

  
}
