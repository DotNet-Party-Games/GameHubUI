import { Component, Input, OnDestroy, OnInit} from '@angular/core';
import { IBoard, IShot } from '../services/gameboard';
import { GameStateService } from '../services/gamestate.service';
import { Subscription } from 'rxjs';
import { InteractivityChecker } from '@angular/cdk/a11y';
import { Router, ActivatedRoute} from '@angular/router';
import { IUserScore } from '../services/IUserScores';
import { stringify } from '@angular/compiler/src/util';
import { StatisticapiService } from '../services/statisticapi.service';

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
export class GameBoardComponent implements OnInit, OnDestroy {

  width: number[];
  height: number[];
  TeamBoard:IBoard = new IBoard;
  EnemyBoard: IBoard = new IBoard;
  userList:string[] = [];
  statusMessage: string;
  turn: boolean;
  _room: Subscription;

  patrol:number;
  sub:number;
  dest:number;
  battle:number;
  carrier:number;
  heli:number;
  stealth:number;
  fight1:number;
  fight2:number;

  winner:boolean;
  loser:boolean;
  isWater:boolean = this.socket.environ;
  view:boolean;
  playernumber:number;
  size:number = this.socket.size;

  constructor(private socket:GameStateService, private router:Router, private score:StatisticapiService, private route:ActivatedRoute) {
    this.width = new Array(10);
    this.height = new Array(10);
    this.turn = false;
  }
  ngOnInit(): void {
    this.Seed();
    this._room = this.socket.currentTurn.subscribe(turn=>this.turn = turn);
    // this.TeamBoard = this.socket.startingBoard;
    // this.socket.SendPlayerBoard(this.PlayerBoardUpdate);
    this.TeamBoard = this.socket.startingBoard;
    this.EnemyBoard = this.socket.EnemyStartingBoard;
    this._room = this.socket.TeamBoard.subscribe(shot=>this.TeamBoard = shot);
    this._room = this.socket.EnemyBoard.subscribe(board=>this.EnemyBoard = board);
    this._room = this.socket.statusMessage.subscribe(mess=>this.statusMessage = mess);
    this._room = this.socket.isWater.subscribe(place => this.isWater = place);
    for (let i = 0; i < 10; i++) {
      for (let j = 0; j < 10; j++) {
        if(this.isWater){
          if(this.size==4){
        this.socket.startingBoard.legend[i][j][1]=this.socket.teamBoard.legend[i][j][1];
        this.socket.startingBoard.refNumber[i][j][1]=this.socket.teamBoard.refNumber[i][j][1];
        this.socket.startingBoard.craft[i][j][1]=this.socket.teamBoard.craft[i][j][1];
        }
        } else {
          this.socket.startingBoard.legend[i][j][0]=this.socket.teamBoard.legend[i][j][0];
          this.socket.startingBoard.refNumber[i][j][0]=this.socket.teamBoard.refNumber[i][j][0];
          this.socket.startingBoard.craft[i][j][0]=this.socket.teamBoard.craft[i][j][0];
        }
      }
    }
    console.log(this.EnemyBoard);
    this.view = this.isWater;
    this.patrol = 2;
    this.sub = 3;
    this.dest = 3;
    this.battle = 4;
    this.carrier = 5;
    this.heli = 2;
    this.stealth = 4;
    this.fight1 = 6;
    this.fight2 = 6;
    // this.socket.UpdateNames(this.playerName.userName);
  }
  Attack(x: number, y: number, z: number) {
    if (this.turn){
      let message:string;
      if(this.EnemyBoard.refNumber[x][y][z]>3){
        // message = this.playerName.userName + " Hit " + this.enemyName.userName;
        this.EnemyBoard.refNumber[x][y][z] = 1;
        if(z==0){
        this.EnemyBoard.legend[x][y][z] = "hit";
        }else{
          this.EnemyBoard.legend[x][y][z] = "airhit";
        }
        this.UpdateBoardStatus(this.EnemyBoard.craft[x][y][z]);
        if(this.patrol==0&&this.sub==0&&this.dest==0&&this.battle==0&&this.carrier==0){
          this.socket.WinningShot();
        }else if(this.heli==0&&this.stealth==0&&this.fight1==0&&this.fight2==0){
          this.socket.WinningShot();
        } else{
          this.socket.SendShot(this.EnemyBoard, message);
          this.playaudio(this.EnemyBoard.legend[x][y][z]);
        }
      }
      else if(this.EnemyBoard.refNumber[x][y][z] == 0){
          // message = this.playerName.userName + " Missed " + this.enemyName.userName;
          this.EnemyBoard.refNumber[x][y][z] = 2;
          if(z==0){
            this.EnemyBoard.legend[x][y][z] = "miss";
            }else{
              this.EnemyBoard.legend[x][y][z] = "airmiss";
            }
          this.socket.SendShot(this.EnemyBoard, message);
          this.playaudio(this.EnemyBoard.legend[x][y][z]);
      }

  }
}
playaudio(action:string){
  let audio = new Audio();
  switch(action){
    case "miss":
      audio.src = "./../../../../../src/assets/battleship/splash.wav";
      audio.load();
      audio.play();
      break;
    case "hit":
      audio.src = "./../../../../../src/assets/battleship/explosion.mp3";
      audio.load();
      audio.play();
      break;
    case "sink":
      audio.src = "./../../../../../src/assets/battleship/bubbling.mp3"
      audio.load();
      audio.play();
      break;
  }
}

  Seed(){
    this.TeamBoard.refNumber = new Array(10);
    this.TeamBoard.legend = new Array(10);
    this.TeamBoard.craft = new Array(10);

    this.EnemyBoard.refNumber = new Array(10);
    this.EnemyBoard.legend = new Array(10);
    this.EnemyBoard.craft = new Array(10);

    for (let i = 0; i < 10; i ++) {
      this.TeamBoard.refNumber[i] = new Array(10);
      this.TeamBoard.legend[i] = new Array(10);
      this.TeamBoard.craft[i] = new Array(10);

      this.EnemyBoard.refNumber[i] = new Array(10);
      this.EnemyBoard.legend[i] = new Array(10);
      this.EnemyBoard.craft[i] = new Array(10);

      for(let j = 0; j < 10; j ++) {

        this.TeamBoard.refNumber[i][j] = new Array(2);
        this.TeamBoard.legend[i][j] = new Array(2);
        this.TeamBoard.craft[i][j] = new Array(2);

        this.EnemyBoard.refNumber[i][j] = new Array(2);
        this.EnemyBoard.legend[i][j] = new Array(2);
        this.EnemyBoard.craft[i][j] = new Array(2);

        this.TeamBoard.refNumber[i][j][0] = 0;
        this.TeamBoard.legend[i][j][0] = "water";
        this.TeamBoard.craft[i][j][0] = "None";

        this.TeamBoard.refNumber[i][j][1] = 0;
        this.TeamBoard.legend[i][j][1] = "air";
        this.TeamBoard.craft[i][j][1] = "None";

        this.EnemyBoard.refNumber[i][j][0] = 0;
        this.EnemyBoard.legend[i][j][0] = "water";
        this.EnemyBoard.craft[i][j][0] = "None";

        this.EnemyBoard.refNumber[i][j][1] = 0;
        this.EnemyBoard.legend[i][j][1] = "air";
        this.EnemyBoard.craft[i][j][1] = "None";
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
      case "Helicopter":
        this.heli-=1;
        if(this.heli==0){
          this.Extenguish(craft);
        }
      break;
      case "Stealth":
        this.stealth-=1;
        if(this.stealth==0){
          this.Extenguish(craft);
        }
      break;
      case "Fighter1":
        this.fight1-=1;
        if(this.fight1==0){
          this.Extenguish(craft);
        }
      break;
      case "Fighter2":
        this.fight2-=1;
        if(this.fight2==0){
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
        if(this.EnemyBoard.craft[i][j][0] == craft){
          this.EnemyBoard.refNumber[i][j][0] = 3;
          this.EnemyBoard.legend[i][j][0] = "destroyed";
          this.playaudio("sink");
        }
        if(this.EnemyBoard.craft[i][j][1] == craft){
          this.EnemyBoard.refNumber[i][j][1] = 3;
          this.EnemyBoard.legend[i][j][1] = "airplaneDestroyed";
          
        }
      }
    }
    
  }
  LeaveRoom(){
    this.router.navigate(["/roomlist"], {relativeTo:this.route.parent});
  }

  
  cycleBoardView() {
    this.view=!this.view;
  }
  ngOnDestroy(){
    this.socket.LeaveRoom();
  }
}
