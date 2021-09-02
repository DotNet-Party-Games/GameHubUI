import { Injectable, Input } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { Observable, Observer } from 'rxjs';
import { IBoard, IUser } from './gameboard';
import { SocketOne } from '../battleship.module';

@Injectable({
    providedIn: 'root'
  })
  export class GameStateService {

    //Updated on each shot
    currentTurn = this.socket.fromEvent<boolean>('turn change');

    //Updated on each enemy shot
    TeamBoard = this.socket.fromEvent<IBoard>('enemy shoots');

    //Updated on each team shot
    EnemyBoard = this.socket.fromEvent<IBoard>('team shoots');

    EnemyStartingBoard:IBoard = new IBoard;

    teammateBoard = this.socket.fromEvent<IBoard>('teammate start');
    enemyAirStartBoard = this.socket.fromEvent<IBoard>('enemy air start');
    enemySeaStartBoard = this.socket.fromEvent<IBoard>('enemy sea start');


    //Updated on each shot
    statusMessage = this.socket.fromEvent<string>('status message');

    startingBoard:IBoard = new IBoard;
    teamBoard:IBoard = new IBoard;

    //Updated once everyone is ready
    gameStarted = this.socket.fromEvent<boolean>('game active status');

    //Updated on each person readying up
    playerOneReady = this.socket.fromEvent<boolean>('player one ready');
    playerTwoReady = this.socket.fromEvent<boolean>('player two ready');
    playerThreeReady = this.socket.fromEvent<boolean>('player three ready');
    playerFourReady = this.socket.fromEvent<boolean>('player four ready');

    //Gets updated on the winning shot (Inside 'win shot')
    winner = this.socket.fromEvent<boolean>('winner');

    //Gets updated on the winning shot (Inside 'win shot')
    loser = this.socket.fromEvent<boolean>('loser');

    //Gets updated upon joining a room (inside AddUserToList())
    userList = this.socket.fromEvent<string[]>('user list');

    //Gets updated upon joining a room (inside AddUserToList())
    isWater = this.socket.fromEvent<boolean>('is water');

    //Gets updated upon joining a room (inside AddUserToList())
    playerteam = this.socket.fromEvent<boolean>('player team');

    //Gets updated upon joining a room (inside AddUserToList())
    maxSize = this.socket.fromEvent<number>('max size');

    playerNumber = this.socket.fromEvent<number>('player number');

    roomFull = this.socket.fromEvent<boolean>('room full');

    currentPlayer = this.socket.fromEvent<number>('current player turn');

    win:boolean;

    size:number;

    environ:boolean;

    usersInRoom:string[];

    currentPlayerstatic:number;

  
    // initialize socket object
    constructor(private socket: SocketOne) {
      this.winner.subscribe(result => this.win = result);
      this.maxSize.subscribe(result => this.size=result);
      this.isWater.subscribe(result=>this.environ=result);
      this.userList.subscribe(result=>this.usersInRoom = result);
      this.teammateBoard.subscribe(result=>this.teamBoard=result);
      this.currentPlayer.subscribe(result=>this.currentPlayerstatic=result)
      this.enemyAirStartBoard.subscribe(result=>{
          for (let i = 0; i < 10; i++) {
            for (let j = 0; j < 10; j++) {
              this.EnemyStartingBoard.legend[i][j][1]=result.legend[i][j][1]
              this.EnemyStartingBoard.refNumber[i][j][1]=result.refNumber[i][j][1];
              this.EnemyStartingBoard.craft[i][j][1]=result.craft[i][j][1];
            }
          }
      });
      this.enemySeaStartBoard.subscribe(result=>{
        for (let i = 0; i < 10; i++) {
          for (let j = 0; j < 10; j++) {
            this.EnemyStartingBoard.legend[i][j][0]=result.legend[i][j][0];
            this.EnemyStartingBoard.refNumber[i][j][0]=result.refNumber[i][j][0];
            this.EnemyStartingBoard.craft[i][j][0]=result.craft[i][j][0];
          }
        }
      });
    }
    SendPlayerBoard(board:IBoard){
        this.socket.emit('send board', board);
    }
    SendShot(updatedBoard:IBoard, status:string){
        this.socket.emit('send shot', updatedBoard);
        this.socket.emit('status message', status);
    }
    ReadyUp(){
      this.socket.emit('player ready');
    }
    StartGame(){
      this.InterpretBoard(this.EnemyStartingBoard.refNumber,this.EnemyStartingBoard.legend,this.EnemyStartingBoard.craft);
      this.InterpretBoard(this.startingBoard.refNumber,this.startingBoard.legend,this.startingBoard.craft);
      this.TeamBoard.subscribe(result=>this.startingBoard = result);
      this.EnemyBoard.subscribe(result=>this.EnemyStartingBoard = result);
      this.socket.emit('starting boards',({board1:this.startingBoard, board2:this.EnemyStartingBoard}));
      this.socket.emit('start game');
      

    }
    LeaveRoom(){
      if(this.win){
        this.socket.emit('back to lobby after game')
      } else{
        this.socket.emit("leave room");
      }
    }
    WinningShot(){
      this.socket.emit('win shot');
      
    }
    InterpretBoard(item: number[][][], itemLegend: string[][][], craft: string[][][]) {
      for (let i = 0; i < 10; i++) {
        for (let j = 0; j < 10; j++) {
          for(let k = 0; k < 2; k++){
            switch (itemLegend[i][j][k]) {
              case "water":
                item[i][j][k] = 0;
                craft[i][j][k] = "None";
                break;
              case "air":
                craft[i][j][k] = "None";
                item[i][j][k] = 0;
                break;
              default:
                item[i][j][k] = 0;
                craft[i][j][k] = "None";
                break;
            }
            switch (itemLegend[i][j][k].substring(0,6)) {
              case "plane1":
                item[i][j][k] = 4;
                craft[i][j][k] = "Helicopter";
                break;
              case "plane2":
                item[i][j][k] = 5;
                craft[i][j][k] = "Stealth";
                break;
              case "plane3":
                item[i][j][k] = 6;
                craft[i][j][k] = "Fighter1";
                break;
              case "plane4":
                item[i][j][k] = 7;
                craft[i][j][k] = "Fighter2";
                break;
              case "patrol":
                item[i][j][k] = 8;
                craft[i][j][k] = "Patrol";
                break;
              case "submar":
                item[i][j][k] = 9;
                craft[i][j][k] = "Submarine";
                break;
              case "destro":
                item[i][j][k] = 10;
                craft[i][j][k] = "Destroyer";
                break;
              case "battle":
                item[i][j][k] = 11;
                craft[i][j][k] = "Battleship";
                break;
              case "aircra":
                item[i][j][k] = 12;
                craft[i][j][k] = "Carrier";
                break;
              default:
                break;
            }
          }
        }
      }
    }
    
  }
  