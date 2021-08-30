import { Injectable, Input } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { Observable, Observer } from 'rxjs';
import { INavy } from './gameboard';

@Injectable({
    providedIn: 'root'
  })
  export class GameStateService {
    currentTurn = this.socket.fromEvent<boolean>('turn change');
    playerBoardUpdate = this.socket.fromEvent<INavy>('enemy shoots');
    playerName = this.socket.fromEvent<string>('player name');
    enemyName = this.socket.fromEvent<string>('enemy name');
    enemyFleet = this.socket.fromEvent<INavy>('enemy fleet');
    statusMessage = this.socket.fromEvent<string>('status message');
    startingNavy:INavy = new INavy;
    gameStarted = this.socket.fromEvent<boolean>('game active status');
    opponentReady = this.socket.fromEvent<boolean>('opponent ready');
    winner = this.socket.fromEvent<boolean>('winner');
    loser = this.socket.fromEvent<boolean>('loser');
  
    // initialize socket object
    constructor(private socket: Socket) { }
    
    SendPlayerBoard(navy:INavy){
        this.socket.emit('send player board to opponent', navy);
        this.socket.once('enemy fleet', ()=>this.socket.emit('send player board to opponent', this.startingNavy));
    }

    SendShot(updatedBoard:INavy, status:string){
        this.socket.emit('send shot',updatedBoard);
        this.socket.emit('status message', status);
    }

    UpdateNames(player:string){
      this.socket.emit('update name', player);
    }

    ReadyUp(){
      this.socket.emit('player ready');
    }

    StartGame(){
      this.socket.emit('start game');
    }
    LeaveRoom(){
      this.socket.emit("Leave Room");
    }

    WinningShot(){
      this.socket.emit('win shot');
      
    }



    InterpretOcean(item: number[][][], baseOcean: string[][][], craft: string[][][]) {
      for (let i = 0; i < 10; i++) {
        for (let j = 0; j < 10; j++) {
          switch (baseOcean[i][j][0]) {
            case "water":
              item[i][j][0] = 0;
              craft[i][j][0] = "None";
              break;
            case "hit":
              item[i][j][0] = 1;
              craft[i][j][0] = "None";
              break;
            case "miss":
              item[i][j][0] = 2;
              craft[i][j][0] = "None";
              break;
            case "destroyed":
              item[i][j][0] = 3;
              craft[i][j][0] = "None";
              break;
            case "destroyed":
              item[i][j][0] = 4;
              craft[i][j][0] = "None";
              break;
            case "water":
              item[i][j][0] = 5;
              craft[i][j][0] = "None";
              break;
            case "patrolboatr1":
              item[i][j][0] = 6;
              craft[i][j][0] = "Patrol";
              break;
            case "patrolboatr2":
              item[i][j][0] = 7;
              craft[i][j][0] = "Patrol";
              break;
            case "patrolboat1":
              item[i][j][0] = 8;
              craft[i][j][0] = "Patrol";
              break;
            case "patrolboat2":
              item[i][j][0] = 9;
              craft[i][j][0] = "Patrol";
              break;
            case "submariner1":
              item[i][j][0] = 10;
              craft[i][j][0] = "Submarine";
              break;
            case "submariner2":
              item[i][j][0] = 11;
              craft[i][j][0] = "Submarine";
              break;
            case "submariner3":
              item[i][j][0] = 12;
              craft[i][j][0] = "Submarine";
              break;
            case "submarine1":
              item[i][j][0] = 13;
              craft[i][j][0] = "Submarine";
              break;
            case "submarine2":
              item[i][j][0] = 14;
              craft[i][j][0] = "Submarine";
              break;
            case "submarine3":
              item[i][j][0] = 15;
              craft[i][j][0] = "Submarine";
              break;
            case "destroyerr1":
              item[i][j][0] = 16;
              craft[i][j][0] = "Destroyer";
              break;
            case "destroyerr2":
              item[i][j][0] = 17;
              craft[i][j][0] = "Destroyer";
              break;
            case "destroyerr3":
              item[i][j][0] = 18;
              craft[i][j][0] = "Destroyer";
              break;
            case "destroyer1":
              item[i][j][0] = 19;
              craft[i][j][0] = "Destroyer";
              break;
            case "destroyer2":
              item[i][j][0] = 20;
              craft[i][j][0] = "Destroyer";
              break;
            case "destroyer3":
              item[i][j][0] = 21;
              craft[i][j][0] = "Destroyer";
              break;
            case "battleshipr1":
              item[i][j][0] = 22;
              craft[i][j][0] = "Battleship";
              break;
            case "battleshipr2":
              item[i][j][0] = 23;
              craft[i][j][0] = "Battleship";
              break;
            case "battleshipr3":
              item[i][j][0] = 24;
              craft[i][j][0] = "Battleship";
              break;
            case "battleshipr4":
              item[i][j][0] = 25;
              craft[i][j][0] = "Battleship";
              break;
            case "battleship1":
              item[i][j][0] = 26;
              craft[i][j][0] = "Battleship";
              break;
            case "battleship2":
              item[i][j][0] = 27;
              craft[i][j][0] = "Battleship";
              break;
            case "battleship3":
              item[i][j][0] = 28;
              craft[i][j][0] = "Battleship";
              break;
            case "battleship4":
              item[i][j][0] = 29;
              craft[i][j][0] = "Battleship";
              break;
            case "aircraftcarrierr1":
              craft[i][j][0] = "Carrier";
              item[i][j][0] = 30;
              break;
            case "aircraftcarrierr2":
              craft[i][j][0] = "Carrier";
              item[i][j][0] = 31;
              break;
            case "aircraftcarrierr3":
              craft[i][j][0] = "Carrier";
              item[i][j][0] = 32;
              break;
            case "aircraftcarrierr4":
              craft[i][j][0] = "Carrier";
              item[i][j][0] = 33;
              break;
            case "aircraftcarrierr5":
              craft[i][j][0] = "Carrier";
              item[i][j][0] = 34;
              break;
            case "aircraftcarrier1":
              craft[i][j][0] = "Carrier";
              item[i][j][0] = 35;
              break;
            case "aircraftcarrier2":
              craft[i][j][0] = "Carrier";
              item[i][j][0] = 36;
              break;
            case "aircraftcarrier3":
              craft[i][j][0] = "Carrier";
              item[i][j][0] = 37;
              break;
            case "aircraftcarrier4":
              craft[i][j][0] = "Carrier";
              item[i][j][0] = 38;
              break;
            case "aircraftcarrier5":
              craft[i][j][0] = "Carrier";
              item[i][j][0] = 39;
              break;
            default:
              item[i][j][0] = 0;
              craft[i][j][0] = "None";
              break;
          }
        }
      }
    }


  }
  