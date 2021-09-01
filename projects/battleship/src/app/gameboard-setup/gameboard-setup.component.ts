import { stringify } from '@angular/compiler/src/util';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute ,Router } from '@angular/router';
import { AuthService } from '@auth0/auth0-angular';
import { BattleshipDeployService } from '../services/battleship-deploy.service';
import { GameStateService } from '../services/gamestate.service';
import { RoomService } from '../services/room.service';
import { Ship } from '../services/ship';
import { Orientation, Airplane } from '../services/airplane';
import { relative } from 'path';

@Component({
  selector: 'app-gameboard-setup',
  templateUrl: './gameboard-setup.component.html',
  styleUrls: ['./gameboard-setup.component.css']
})
export class GameboardSetupComponent implements OnInit {

  width: number[];
  height: number[];
  selected: number[] = new Array(2);  // holds the x,y coords for placing a ship (only tracking 1 endpoint)
  test: string[][][] = new Array(10);  // array for placeholder space to test if ship/airplane can be placed
  selectedShip: string;  // name of the ship selected to be placed
  isVertical: boolean = false;  // isRotated
  ships: Ship[] = new Array(5);
  playerOneReady:boolean = false;
  playerTwoReady:boolean = false;
  playerThreeReady:boolean = false;
  playerFourReady:boolean = false;
  isWater:boolean = true;
  size:number;
  playerNumber:number;
  roomNum: string;
  userId: string;  // this can now be username
  opponentId: string;  // this can also now be username
  shipsDeployed: boolean;
  roomId:string;
  opponentReady:boolean=false;
  ready1:boolean=false;
  ready2:boolean=false;
  viewBoard: boolean = true;  // tells the browser which gameboard to actively view; default should be "sea"
  airplanes: Airplane[] = new Array(4);
  airplanesDeployed: boolean;
  airplaneOrientation: Orientation;
  selectedAirplane: string;
  importedOrientation = Orientation;
  userControl:string;
  users:string[] = [];
  roomFull:boolean = false;
  gameStarted:boolean = false;
  constructor(public auth: AuthService, private deploy:BattleshipDeployService, private router:Router, private roomservice:RoomService, private gamestate:GameStateService, private route:ActivatedRoute) {
    this.userControl = "";
    this.height = new Array(10);
    this.width = new Array(10);
    for(let i = 0; i < 10; i++){
      this.test[i] = new Array(10);
      for(let j=0; j<10; j++){
        this.test[i][j]=new Array(2);
        this.test[i][j][0] = "water";
        this.test[i][j][1] = "air";
      }
    }
    this.selected[0] = 0;
    this.selected[1] = 0;
    this.selectedShip = "";
    this.selectedAirplane = "";

    for(let i =0; i < 5; i++){
      this.ships[i] = new Ship;
    }

    // this might be in an if?
    for (let i = 0; i < 4; i++) {
      this.airplanes[i] = new Airplane;
    }

    this.deploy.roomnum.subscribe(response=> this.roomNum=response);
    this.opponentId = "0";
    this.userId = "2";
    this.shipsDeployed = false;
    this.airplanesDeployed = false;
    this.airplaneOrientation = Orientation.Vertical;
  }
  ngOnInit(): void {

    this.roomservice.currentRoom.subscribe(response => this.roomNum = response);
    this.gamestate.isWater.subscribe(environ => this.isWater = environ);
    this.gamestate.roomFull.subscribe(full=>this.roomFull=full);
    

    this.gamestate.startingBoard.refNumber = new Array(10);
    this.gamestate.startingBoard.legend = new Array(10);
    this.gamestate.startingBoard.craft = new Array(10);

    this.gamestate.EnemyStartingBoard.refNumber = new Array(10);
    this.gamestate.EnemyStartingBoard.legend = new Array(10);
    this.gamestate.EnemyStartingBoard.craft = new Array(10);

    for (let i = 0; i < 10; i ++) {
      this.gamestate.startingBoard.refNumber[i] = new Array(10);
      this.gamestate.startingBoard.legend[i] = new Array(10);
      this.gamestate.startingBoard.craft[i] = new Array(10);
      this.gamestate.EnemyStartingBoard.refNumber[i] = new Array(10);
      this.gamestate.EnemyStartingBoard.legend[i] = new Array(10);
      this.gamestate.EnemyStartingBoard.craft[i] = new Array(10);
      for(let j = 0; j < 10; j ++) {
        this.gamestate.startingBoard.refNumber[i][j] = new Array(2);
        this.gamestate.startingBoard.legend[i][j] = new Array(2);
        this.gamestate.startingBoard.craft[i][j] = new Array(2);
        this.gamestate.EnemyStartingBoard.refNumber[i][j] = new Array(2);
        this.gamestate.EnemyStartingBoard.legend[i][j] = new Array(2);
        this.gamestate.EnemyStartingBoard.craft[i][j] = new Array(2);
        
        this.gamestate.startingBoard.refNumber[i][j][0] = 0;
        this.gamestate.startingBoard.legend[i][j][0] = "water";
        this.gamestate.startingBoard.craft[i][j][0] = "None";
        this.gamestate.EnemyStartingBoard.refNumber[i][j][0] = 0;
        this.gamestate.EnemyStartingBoard.legend[i][j][0] = "water";
        this.gamestate.EnemyStartingBoard.craft[i][j][0] = "None";

        this.gamestate.startingBoard.refNumber[i][j][1] = 0;
        this.gamestate.startingBoard.legend[i][j][1] = "air";
        this.gamestate.startingBoard.craft[i][j][1] = "None";
        this.gamestate.EnemyStartingBoard.refNumber[i][j][1] = 0;
        this.gamestate.EnemyStartingBoard.legend[i][j][1] = "air";
        this.gamestate.EnemyStartingBoard.craft[i][j][1] = "None";
     }
    }
    this.gamestate.playerOneReady.subscribe(turn=>this.playerOneReady=turn);
    this.gamestate.playerTwoReady.subscribe(turn=>this.playerTwoReady=turn); 
    this.gamestate.playerThreeReady.subscribe(turn=>this.playerThreeReady=turn);
    this.gamestate.playerFourReady.subscribe(turn=>this.playerFourReady=turn);
    this.gamestate.maxSize.subscribe(size=>this.size=size);
    // this.gamestate.isWater.subscribe(water=>this.isWater=water);
    this.gamestate.playerNumber.subscribe(numbers=> this.playerNumber=numbers);
    this.gamestate.isWater.subscribe(envir => this.viewBoard = envir); 
    this.gamestate.gameStarted.subscribe(started=>this.gameStarted=started);
  }

  cycleBoardView() {
    this.viewBoard=!this.viewBoard;
  }

  resetControl() {
    this.userControl = "";
  }

  controlAir() {
    this.userControl = "air";
  }

  controlSea() {
    this.userControl = "sea";
  }

  selectWaterSpace(i:number, j:number){
    this.selected[0] = i;
    this.selected[1] = j;
    this.placeShip();
  }

  selectAirSpace(i:number, j:number) {
    this.selected[0] = i;
    this.selected[1] = j;
    this.placeAirplane();
  }

  selectShip(s:string){
    this.selectedShip = s;
  }

  selectAirplane(s:string) {
    this.selectedAirplane = s;
  }

  placeShip(){
    if(this.isVertical==true){
      switch (this.selectedShip) {
        case "patrolboat":
          if(this.selected[0]+1 < 10 && this.checkForSpace(2)){
            if(this.ships[4].placed == true){
              this.clearShip(this.ships[4],2);
            }
            this.test[this.selected[0]][this.selected[1]][0] = "patrolboatr1";
            this.test[this.selected[0]+1][this.selected[1]][0] = "patrolboatr2";
            this.ships[4].y = this.selected[0];
            this.ships[4].x = this.selected[1];
            this.ships[4].placed = true;
            this.ships[4].horizontal = false;
          }
          else
          {
            this.CannotPlaceError("sea");
          }
          break;
        case "submarine":
          if(this.selected[0]+2 < 10 && this.checkForSpace(3)){
            if(this.ships[3].placed == true){
              this.clearShip(this.ships[3],3);
            }
            this.test[this.selected[0]][this.selected[1]][0] = "submariner1";
            this.test[this.selected[0]+1][this.selected[1]][0] = "submariner2";
            this.test[this.selected[0]+2][this.selected[1]][0] = "submariner3";
            this.ships[3].y = this.selected[0];
            this.ships[3].x = this.selected[1];
            this.ships[3].placed = true;
            this.ships[3].horizontal = false;
          }
          else
          {
            this.CannotPlaceError("sea");
          }
          break;
        case "destroyer":
          if(this.selected[0]+2 < 10 && this.checkForSpace(3)){
            if(this.ships[2].placed == true){
              this.clearShip(this.ships[2],3);
            }
            this.test[this.selected[0]][this.selected[1]][0] = "destroyerr1";
            this.test[this.selected[0]+1][this.selected[1]][0] = "destroyerr2";
            this.test[this.selected[0]+2][this.selected[1]][0] = "destroyerr3";
            this.ships[2].y = this.selected[0];
            this.ships[2].x = this.selected[1];
            this.ships[2].placed = true;
            this.ships[2].horizontal = false;
          }
          else
          {
            this.CannotPlaceError("sea");
          }
          break;
        case "battleship":
          if(this.selected[0]+3 < 10 && this.checkForSpace(4)){
            if(this.ships[1].placed == true){
              this.clearShip(this.ships[1],4);
            }
            this.test[this.selected[0]][this.selected[1]][0] = "battleshipr1";
            this.test[this.selected[0]+1][this.selected[1]][0] = "battleshipr2";
            this.test[this.selected[0]+2][this.selected[1]][0] = "battleshipr3";
            this.test[this.selected[0]+3][this.selected[1]][0] = "battleshipr4";
            this.ships[1].y = this.selected[0];
            this.ships[1].x = this.selected[1];
            this.ships[1].placed = true;
            this.ships[1].horizontal = false;
          }
          else
          {
            this.CannotPlaceError("sea");
          }
          break;
        case "aircraftcarrier":
          if(this.selected[0]+4 < 10 && this.checkForSpace(5)){
            if(this.ships[0].placed == true){
              this.clearShip(this.ships[0],5);
            }
            this.test[this.selected[0]][this.selected[1]][0] = "aircraftcarrierr1";
            this.test[this.selected[0]+1][this.selected[1]][0] = "aircraftcarrierr2";
            this.test[this.selected[0]+2][this.selected[1]][0] = "aircraftcarrierr3";
            this.test[this.selected[0]+3][this.selected[1]][0] = "aircraftcarrierr4";
            this.test[this.selected[0]+4][this.selected[1]][0] = "aircraftcarrierr5";
            this.ships[0].y = this.selected[0];
            this.ships[0].x = this.selected[1];
            this.ships[0].placed = true;
            this.ships[0].horizontal = false;
          }
          else
          {
            this.CannotPlaceError("sea");
          }
          break;
        default:
          alert("No ship has been selected! Click on a ship and then click on the board to place that ship.");
          break;
      }   
    }
    else{
      switch (this.selectedShip) {
        case "patrolboat":
          if(this.selected[1]+1 < 10 && this.checkForSpace(2)){
            if(this.ships[4].placed == true){
              this.clearShip(this.ships[4],2);
            }
            this.test[this.selected[0]][this.selected[1]][0] = "patrolboat1";
            this.test[this.selected[0]][this.selected[1]+1][0] = "patrolboat2";
            this.ships[4].y = this.selected[0];
            this.ships[4].x = this.selected[1];
            this.ships[4].placed = true;
            this.ships[4].horizontal = true;
          }
          else
          {
            this.CannotPlaceError("sea");
          }
          break;
        case "submarine":
          if(this.selected[1]+2 < 10 && this.checkForSpace(3)){
            if(this.ships[3].placed == true){
              this.clearShip(this.ships[3],3);
            }
            this.test[this.selected[0]][this.selected[1]][0] = "submarine1";
            this.test[this.selected[0]][this.selected[1]+1][0] = "submarine2";
            this.test[this.selected[0]][this.selected[1]+2][0] = "submarine3";
            this.ships[3].y = this.selected[0];
            this.ships[3].x = this.selected[1];
            this.ships[3].placed = true;
            this.ships[3].horizontal = true;
          }
          else
          {
            this.CannotPlaceError("sea");
          }
          break;
        case "destroyer":
          if(this.selected[1]+2 < 10 && this.checkForSpace(3)){
            if(this.ships[2].placed == true){
              this.clearShip(this.ships[2],3);
            }
            this.test[this.selected[0]][this.selected[1]][0] = "destroyer1";
            this.test[this.selected[0]][this.selected[1]+1][0] = "destroyer2";
            this.test[this.selected[0]][this.selected[1]+2][0] = "destroyer3";
            this.ships[2].y = this.selected[0];
            this.ships[2].x = this.selected[1];
            this.ships[2].placed = true;
            this.ships[2].horizontal = true;
          }
          else
          {
            this.CannotPlaceError("sea");
          }
          break;
        case "battleship":
          if(this.selected[1]+3 < 10 && this.checkForSpace(4)){
            if(this.ships[1].placed == true){
              this.clearShip(this.ships[1],4);
            }
            this.test[this.selected[0]][this.selected[1]][0] = "battleship1";
            this.test[this.selected[0]][this.selected[1]+1][0] = "battleship2";
            this.test[this.selected[0]][this.selected[1]+2][0] = "battleship3";
            this.test[this.selected[0]][this.selected[1]+3][0] = "battleship4";
            this.ships[1].y = this.selected[0];
            this.ships[1].x = this.selected[1];
            this.ships[1].placed = true;
            this.ships[1].horizontal = true;
          }
          else
          {
            this.CannotPlaceError("sea");
          }
          break;
        case "aircraftcarrier":
          if(this.selected[1]+4 < 10 && this.checkForSpace(5)){
            if(this.ships[0].placed == true){
              this.clearShip(this.ships[0],5);
            }
            this.test[this.selected[0]][this.selected[1]][0] = "aircraftcarrier1";
            this.test[this.selected[0]][this.selected[1]+1][0] = "aircraftcarrier2";
            this.test[this.selected[0]][this.selected[1]+2][0] = "aircraftcarrier3";
            this.test[this.selected[0]][this.selected[1]+3][0] = "aircraftcarrier4";
            this.test[this.selected[0]][this.selected[1]+4][0] = "aircraftcarrier5";
            this.ships[0].y = this.selected[0];
            this.ships[0].x = this.selected[1];
            this.ships[0].placed = true;
            this.ships[0].horizontal = true;
          }
          else
          {
            this.CannotPlaceError("sea");
          }
          break;
        default:
          alert("No ship has been selected! Click on a ship and then click on the board to place that ship.");
          break;
      }   
    }
  }

  placeAirplane() {
    switch (this.airplaneOrientation) {
      case Orientation.Vertical:
        switch (this.selectedAirplane) {
          case "helicopter":
            if(this.selected[1]+1 < 10 && this.checkForAirplaneSpace("helicopter")){
              if(this.airplanes[0].placed == true){
                this.clearAirplane(this.airplanes[0], 2);
              }
              this.test[this.selected[0]][this.selected[1]][1] = "plane1_1";
              this.test[this.selected[0]][this.selected[1]+1][1] = "plane1_2";
              this.airplanes[0].y = this.selected[0];
              this.airplanes[0].x = this.selected[1];
              this.airplanes[0].placed = true;
              this.airplanes[0].orientation = this.airplaneOrientation;
            }
            else
            {
              this.CannotPlaceError("air");
            }
            break;
          case "stealth plane":
            if (this.selected[1]+1 < 10 && 
                this.selected[0]+1 < 10 &&
                this.selected[0]-1 >= 0 &&
                this.checkForAirplaneSpace("stealth plane"))
            {
              if (this.airplanes[1].placed == true){
                this.clearAirplane(this.airplanes[1], 4);
              }
              this.test[this.selected[0]][this.selected[1]][1] = "plane2_1";
              this.test[this.selected[0]-1][this.selected[1]+1][1] = "plane2_2";
              this.test[this.selected[0]][this.selected[1]+1][1] = "plane2_3";
              this.test[this.selected[0]+1][this.selected[1]+1][1] = "plane2_4";
              this.airplanes[1].y = this.selected[0];
              this.airplanes[1].x = this.selected[1];
              this.airplanes[1].placed = true;
              this.airplanes[1].orientation = this.airplaneOrientation;
            }
            else
            {
              this.CannotPlaceError("air");
            }
            break;
          case "fighter #1":
            if (this.selected[1]+3 < 10 && 
              this.selected[0]+1 < 10 &&
              this.selected[0]-1 >= 0 &&
              this.checkForAirplaneSpace("fighter #1"))
            {
              if (this.airplanes[2].placed == true){
                this.clearAirplane(this.airplanes[2], 6);
              }
              this.test[this.selected[0]][this.selected[1]][1] = "plane3_1";
              this.test[this.selected[0]][this.selected[1]+1][1] = "plane3_2";
              this.test[this.selected[0]-1][this.selected[1]+2][1] = "plane3_3";
              this.test[this.selected[0]][this.selected[1]+2][1] = "plane3_4";
              this.test[this.selected[0]+1][this.selected[1]+2][1] = "plane3_5";
              this.test[this.selected[0]][this.selected[1]+3][1] = "plane3_6";
              this.airplanes[2].y = this.selected[0];
              this.airplanes[2].x = this.selected[1];
              this.airplanes[2].placed = true;
              this.airplanes[2].orientation = this.airplaneOrientation;
            }
            else
            {
              this.CannotPlaceError("air");
            }
            break;
          case "fighter #2":
            if (this.selected[1]+3 < 10 && 
              this.selected[0]+1 < 10 &&
              this.selected[0]-1 >= 0 &&
              this.checkForAirplaneSpace("fighter #2"))
            {
              if (this.airplanes[3].placed == true){
                this.clearAirplane(this.airplanes[3], 6);
              }
              this.test[this.selected[0]][this.selected[1]][1] = "plane4_1";
              this.test[this.selected[0]][this.selected[1]+1][1] = "plane4_2";
              this.test[this.selected[0]-1][this.selected[1]+2][1] = "plane4_3";
              this.test[this.selected[0]][this.selected[1]+2][1] = "plane4_4";
              this.test[this.selected[0]+1][this.selected[1]+2][1] = "plane4_5";
              this.test[this.selected[0]][this.selected[1]+3][1] = "plane4_6";
              this.airplanes[3].y = this.selected[0];
              this.airplanes[3].x = this.selected[1];
              this.airplanes[3].placed = true;
              this.airplanes[3].orientation = this.airplaneOrientation;
            }
            else
            {
              this.CannotPlaceError("air");
            }
            break;
          default:
            alert("No airplane has been selected! Click on an airplane and then click on the board to place that airplane.");
            break;
        }
        break;
      case Orientation.Rotated90:
        switch (this.selectedAirplane) {
          case "helicopter":
            if(this.selected[0]+1 < 10 && this.checkForAirplaneSpace("helicopter")){
              if(this.airplanes[0].placed == true){
                this.clearAirplane(this.airplanes[0], 2);
              }
              this.test[this.selected[0]][this.selected[1]][1] = "plane1_1_R1";
              this.test[this.selected[0]+1][this.selected[1]][1] = "plane1_2_R1";
              this.airplanes[0].y = this.selected[0];
              this.airplanes[0].x = this.selected[1];
              this.airplanes[0].placed = true;
              this.airplanes[0].orientation = this.airplaneOrientation;
            }
            else
            {
              this.CannotPlaceError("air");
            }
            break;
          case "stealth plane":
            if (this.selected[0]+1 < 10 && 
                this.selected[1]+1 < 10 &&
                this.selected[1]-1 >= 0 &&
                this.checkForAirplaneSpace("stealth plane"))
            {
              if (this.airplanes[1].placed == true){
                this.clearAirplane(this.airplanes[1], 4);
              }
              this.test[this.selected[0]][this.selected[1]][1] = "plane2_1_R1";
              this.test[this.selected[0]+1][this.selected[1]+1][1] = "plane2_2_R1";
              this.test[this.selected[0]+1][this.selected[1]][1] = "plane2_3_R1";
              this.test[this.selected[0]+1][this.selected[1]-1][1] = "plane2_4_R1";
              this.airplanes[1].y = this.selected[0];
              this.airplanes[1].x = this.selected[1];
              this.airplanes[1].placed = true;
              this.airplanes[1].orientation = this.airplaneOrientation;
            }
            else
            {
              this.CannotPlaceError("air");
            }
            break;
          case "fighter #1":
            if (this.selected[0]+3 < 10 && 
              this.selected[1]+1 < 10 &&
              this.selected[1]-1 >= 0 &&
              this.checkForAirplaneSpace("fighter #1"))
            {
              if (this.airplanes[2].placed == true){
                this.clearAirplane(this.airplanes[2], 6);
              }
              this.test[this.selected[0]][this.selected[1]][1] = "plane3_1_R1";
              this.test[this.selected[0]+1][this.selected[1]][1] = "plane3_2_R1";
              this.test[this.selected[0]+2][this.selected[1]+1][1] = "plane3_3_R1";
              this.test[this.selected[0]+2][this.selected[1]][1] = "plane3_4_R1";
              this.test[this.selected[0]+2][this.selected[1]-1][1] = "plane3_5_R1";
              this.test[this.selected[0]+3][this.selected[1]][1] = "plane3_6_R1";
              this.airplanes[2].y = this.selected[0];
              this.airplanes[2].x = this.selected[1];
              this.airplanes[2].placed = true;
              this.airplanes[2].orientation = this.airplaneOrientation;
            }
            else
            {
              this.CannotPlaceError("air");
            }
            break;
          case "fighter #2":
            if (this.selected[0]+3 < 10 && 
              this.selected[1]+1 < 10 &&
              this.selected[1]-1 >= 0 &&
              this.checkForAirplaneSpace("fighter #2"))
            {
              if (this.airplanes[3].placed == true){
                this.clearAirplane(this.airplanes[3], 6);
              }
              this.test[this.selected[0]][this.selected[1]][1] = "plane4_1_R1";
              this.test[this.selected[0]+1][this.selected[1]][1] = "plane4_2_R1";
              this.test[this.selected[0]+2][this.selected[1]+1][1] = "plane4_3_R1";
              this.test[this.selected[0]+2][this.selected[1]][1] = "plane4_4_R1";
              this.test[this.selected[0]+2][this.selected[1]-1][1] = "plane4_5_R1";
              this.test[this.selected[0]+3][this.selected[1]][1] = "plane4_6_R1";
              this.airplanes[3].y = this.selected[0];
              this.airplanes[3].x = this.selected[1];
              this.airplanes[3].placed = true;
              this.airplanes[3].orientation = this.airplaneOrientation;
            }
            else
            {
              this.CannotPlaceError("air");
            }
            break;
          default:
            alert("No airplane has been selected! Click on an airplane and then click on the board to place that airplane.");
            break;
        }
        break;
      case Orientation.Rotated180:
        switch (this.selectedAirplane) {
          case "helicopter":
            if(this.selected[1]-1 >= 0 && this.checkForAirplaneSpace("helicopter")){
              if(this.airplanes[0].placed == true){
                this.clearAirplane(this.airplanes[0], 2);
              }
              this.test[this.selected[0]][this.selected[1]][1] = "plane1_1_R2";
              this.test[this.selected[0]][this.selected[1]-1][1] = "plane1_2_R2";
              this.airplanes[0].y = this.selected[0];
              this.airplanes[0].x = this.selected[1];
              this.airplanes[0].placed = true;
              this.airplanes[0].orientation = this.airplaneOrientation;
            }
            else
            {
              this.CannotPlaceError("air");
            }
            break;
          case "stealth plane":
            if (this.selected[1]-1 >= 0 && 
                this.selected[0]+1 < 10 &&
                this.selected[0]-1 >= 0 &&
                this.checkForAirplaneSpace("stealth plane"))
            {
              if (this.airplanes[1].placed == true){
                this.clearAirplane(this.airplanes[1], 4);
              }
              this.test[this.selected[0]][this.selected[1]][1] = "plane2_1_R2";
              this.test[this.selected[0]+1][this.selected[1]-1][1] = "plane2_2_R2";
              this.test[this.selected[0]][this.selected[1]-1][1] = "plane2_3_R2";
              this.test[this.selected[0]-1][this.selected[1]-1][1] = "plane2_4_R2";
              this.airplanes[1].y = this.selected[0];
              this.airplanes[1].x = this.selected[1];
              this.airplanes[1].placed = true;
              this.airplanes[1].orientation = this.airplaneOrientation;
            }
            else
            {
              this.CannotPlaceError("air");
            }
            break;
          case "fighter #1":
            if (this.selected[1]-3 >= 0 && 
              this.selected[0]+1 < 10 &&
              this.selected[0]-1 >= 0 &&
              this.checkForAirplaneSpace("fighter #1"))
            {
              if (this.airplanes[2].placed == true){
                this.clearAirplane(this.airplanes[2], 6);
              }
              this.test[this.selected[0]][this.selected[1]][1] = "plane3_1_R2";
              this.test[this.selected[0]][this.selected[1]-1][1] = "plane3_2_R2";
              this.test[this.selected[0]+1][this.selected[1]-2][1] = "plane3_3_R2";
              this.test[this.selected[0]][this.selected[1]-2][1] = "plane3_4_R2";
              this.test[this.selected[0]-1][this.selected[1]-2][1] = "plane3_5_R2";
              this.test[this.selected[0]][this.selected[1]-3][1] = "plane3_6_R2";
              this.airplanes[2].y = this.selected[0];
              this.airplanes[2].x = this.selected[1];
              this.airplanes[2].placed = true;
              this.airplanes[2].orientation = this.airplaneOrientation;
            }
            else
            {
              this.CannotPlaceError("air");
            }
            break;
          case "fighter #2":
            if (this.selected[1]-3 >= 0 && 
              this.selected[0]+1 < 10 &&
              this.selected[0]-1 >= 0 &&
              this.checkForAirplaneSpace("fighter #2"))
            {
              if (this.airplanes[3].placed == true){
                this.clearAirplane(this.airplanes[3], 6);
              }
              this.test[this.selected[0]][this.selected[1]][1] = "plane4_1_R2";
              this.test[this.selected[0]][this.selected[1]-1][1] = "plane4_2_R2";
              this.test[this.selected[0]+1][this.selected[1]-2][1] = "plane4_3_R2";
              this.test[this.selected[0]][this.selected[1]-2][1] = "plane4_4_R2";
              this.test[this.selected[0]-1][this.selected[1]-2][1] = "plane4_5_R2";
              this.test[this.selected[0]][this.selected[1]-3][1] = "plane4_6_R2";
              this.airplanes[3].y = this.selected[0];
              this.airplanes[3].x = this.selected[1];
              this.airplanes[3].placed = true;
              this.airplanes[3].orientation = this.airplaneOrientation;
            }
            else
            {
              this.CannotPlaceError("air");
            }
            break;
          default:
            alert("No airplane has been selected! Click on an airplane and then click on the board to place that airplane.");
            break;
        }
        break;
      case Orientation.Rotated270:
        switch (this.selectedAirplane) {
          case "helicopter":
            if(this.selected[0]-1 >= 0 && this.checkForAirplaneSpace("helicopter")){
              if(this.airplanes[0].placed == true){
                this.clearAirplane(this.airplanes[0], 2);
              }
              this.test[this.selected[0]][this.selected[1]][1] = "plane1_1_R3";
              this.test[this.selected[0]-1][this.selected[1]][1] = "plane1_2_R3";
              this.airplanes[0].y = this.selected[0];
              this.airplanes[0].x = this.selected[1];
              this.airplanes[0].placed = true;
              this.airplanes[0].orientation = this.airplaneOrientation;
            }
            else
            {
              this.CannotPlaceError("air");
            }
            break;
          case "stealth plane":
            if (this.selected[0]-1 >= 0 && 
                this.selected[1]+1 < 10 &&
                this.selected[1]-1 >= 0 &&
                this.checkForAirplaneSpace("stealth plane"))
            {
              if (this.airplanes[1].placed == true){
                this.clearAirplane(this.airplanes[1], 4);
              }
              this.test[this.selected[0]][this.selected[1]][1] = "plane2_1_R3";
              this.test[this.selected[0]-1][this.selected[1]-1][1] = "plane2_2_R3";
              this.test[this.selected[0]-1][this.selected[1]][1] = "plane2_3_R3";
              this.test[this.selected[0]-1][this.selected[1]+1][1] = "plane2_4_R3";
              this.airplanes[1].y = this.selected[0];
              this.airplanes[1].x = this.selected[1];
              this.airplanes[1].placed = true;
              this.airplanes[1].orientation = this.airplaneOrientation;
            }
            else
            {
              this.CannotPlaceError("air");
            }
            break;
          case "fighter #1":
            if (this.selected[0]-3 >= 0 && 
              this.selected[1]+1 < 10 &&
              this.selected[1]-1 >= 0 &&
              this.checkForAirplaneSpace("fighter #1"))
            {
              if (this.airplanes[2].placed == true){
                this.clearAirplane(this.airplanes[2], 6);
              }
              this.test[this.selected[0]][this.selected[1]][1] = "plane3_1_R3";
              this.test[this.selected[0]-1][this.selected[1]][1] = "plane3_2_R3";
              this.test[this.selected[0]-2][this.selected[1]-1][1] = "plane3_3_R3";
              this.test[this.selected[0]-2][this.selected[1]][1] = "plane3_4_R3";
              this.test[this.selected[0]-2][this.selected[1]+1][1] = "plane3_5_R3";
              this.test[this.selected[0]-3][this.selected[1]][1] = "plane3_6_R3";
              this.airplanes[2].y = this.selected[0];
              this.airplanes[2].x = this.selected[1];
              this.airplanes[2].placed = true;
              this.airplanes[2].orientation = this.airplaneOrientation;
            }
            else
            {
              this.CannotPlaceError("air");
            }
            break;
          case "fighter #2":
            if (this.selected[0]-3 >= 0 && 
              this.selected[1]+1 < 10 &&
              this.selected[1]-1 >= 0 &&
              this.checkForAirplaneSpace("fighter #2"))
            {
              if (this.airplanes[3].placed == true){
                this.clearAirplane(this.airplanes[3], 6);
              }
              this.test[this.selected[0]][this.selected[1]][1] = "plane4_1_R3";
              this.test[this.selected[0]-1][this.selected[1]][1] = "plane4_2_R3";
              this.test[this.selected[0]-2][this.selected[1]-1][1] = "plane4_3_R3";
              this.test[this.selected[0]-2][this.selected[1]][1] = "plane4_4_R3";
              this.test[this.selected[0]-2][this.selected[1]+1][1] = "plane4_5_R3";
              this.test[this.selected[0]-3][this.selected[1]][1] = "plane4_6_R3";
              this.airplanes[3].y = this.selected[0];
              this.airplanes[3].x = this.selected[1];
              this.airplanes[3].placed = true;
              this.airplanes[3].orientation = this.airplaneOrientation;
            }
            else
            {
              this.CannotPlaceError("air");
            }
            break;
          default:
            alert("No airplane has been selected! Click on an airplane and then click on the board to place that airplane.");
            break;
        }
        break;
      default:
        alert("No orientation has been selected! Please select an rotation option.");
        break;
    }
  }

  resetShip(ship:string){
    switch(ship){
      case "patrolboat":
        this.clearShip(this.ships[4], 2);
        this.ships[4].placed=false;
        break;
      case "submarine":
        this.clearShip(this.ships[3], 3);
        this.ships[3].placed=false;
        break;
      case "destroyer":
        this.clearShip(this.ships[2], 3);
        this.ships[2].placed=false;
        break;
      case "battleship":
        this.clearShip(this.ships[1], 4);
        this.ships[1].placed=false;
        break;
      case "aircraftcarrier":
        this.clearShip(this.ships[0], 5);
        this.ships[0].placed=false;
        break;
      default:
        break;
    }
    this.shipsDeployed = false;
  }

  resetAirplane(airplane:string) {
    switch (airplane) {
      case "helicopter":
        this.clearAirplane(this.airplanes[0], 2);
        this.airplanes[0].placed = false;
        break;
      case "stealth plane":
        this.clearAirplane(this.airplanes[1], 4);
        this.airplanes[1].placed = false;
        break;
      case "fighter #1":
        this.clearAirplane(this.airplanes[2], 6);
        this.airplanes[2].placed = false;
        break;
      case "fighter #2":
        this.clearAirplane(this.airplanes[3], 6);
        this.airplanes[3].placed = false;
        break;
      default:
        break;
    }
    this.airplanesDeployed = false;
  }

  isShipPlaced(ship:number){
    if(this.ships[ship].placed){
      return true;
    }
    else{
      return false;
    }
  }

  isAirplanePlaced(airplane:number) {
    if (this.airplanes[airplane].placed) {
      return true;
    }
    
    return false;
  }

  checkForSpace(size:number){
    for(let i = 0; i < size; i++){
      if(this.isVertical == true){
        if(this.test[this.selected[0]+i][this.selected[1]][0] != "water" && !this.test[this.selected[0]+i][this.selected[1]].includes(this.selectedShip)){
          return false;
        }
      }
      else{
        if(this.test[this.selected[0]][this.selected[1]+i][0] != "water" && !this.test[this.selected[0]][this.selected[1]+i].includes(this.selectedShip)){
          return false;
        }
      }
    }
    return true;
  }

  checkForAirplaneSpace(plane:string) {
    switch (this.airplaneOrientation) {
      case Orientation.Vertical:
        switch (plane) {
          case "helicopter":
            for (let i = 0; i < 2; i++) {
              if(this.test[this.selected[0]][this.selected[1]+i][1] != "air" && !this.test[this.selected[0]][this.selected[1]+i].includes(this.selectedAirplane)){
                return false;
              }
            }
            break;
          case "stealth plane":
            for (let i = 0; i < 2; i++) {
              if(this.test[this.selected[0]][this.selected[1]+i][1] != "air" && !this.test[this.selected[0]][this.selected[1]+i].includes(this.selectedAirplane)){
                return false;
              }
            }
            if ((this.test[this.selected[0] - 1][this.selected[1] + 1][1] != "air" && !this.test[this.selected[0] - 1][this.selected[1] + 1].includes(this.selectedAirplane))
                 || (this.test[this.selected[0] + 1][this.selected[1] + 1][1] != "air" && !this.test[this.selected[0] + 1][this.selected[1] + 1].includes(this.selectedAirplane))){
              return false;
            }
            break;
          case "fighter #1":
          case "fighter #2":
            for (let i = 0; i < 4; i++) {
              if(this.test[this.selected[0]][this.selected[1]+i][1] != "air" && !this.test[this.selected[0]][this.selected[1]+i].includes(this.selectedAirplane)){
                return false;
              }
            }
            if ((this.test[this.selected[0] - 1][this.selected[1] + 2][1] != "air" && !this.test[this.selected[0] - 1][this.selected[1] + 2].includes(this.selectedAirplane))
                 || (this.test[this.selected[0] + 1][this.selected[1] + 2][1] != "air" && !this.test[this.selected[0] + 1][this.selected[1] + 2].includes(this.selectedAirplane))){
              return false;
            }
            break;
          default:
            break;
        }
        break;
      case Orientation.Rotated90:
        switch (plane) {
          case "helicopter":
            for (let i = 0; i < 2; i++) {
              if(this.test[this.selected[0] + i][this.selected[1]][1] != "air" && !this.test[this.selected[0] + i][this.selected[1]].includes(this.selectedAirplane)){
                return false;
              }
            }
            break;
          case "stealth plane":
            for (let i = 0; i < 3; i++) {
              if(this.test[this.selected[0]+1][this.selected[1] - 1 + i][1] != "air" && !this.test[this.selected[0]+1][this.selected[1] - 1 + i].includes(this.selectedAirplane)){
                return false;
              }
            }
            if (this.test[this.selected[0]][this.selected[1]][1] != "air" && !this.test[this.selected[0]][this.selected[1]].includes(this.selectedAirplane)){
              return false;
            }
            break;
          case "fighter #1":
          case "fighter #2":
            for (let i = 0; i < 4; i++) {
              if(this.test[this.selected[0] + i][this.selected[1]][1] != "air" && !this.test[this.selected[0] + i][this.selected[1]].includes(this.selectedAirplane)){
                return false;
              }
            }
            if ((this.test[this.selected[0] + 2][this.selected[1] - 1][1] != "air" && !this.test[this.selected[0] + 2][this.selected[1] - 1].includes(this.selectedAirplane))
                 || (this.test[this.selected[0] + 2][this.selected[1] + 1][1] != "air" && !this.test[this.selected[0] + 2][this.selected[1] + 1].includes(this.selectedAirplane))){
              return false;
            }
            break;
          default:
            break;
        }
        break;
      case Orientation.Rotated180:
        switch (plane) {
          case "helicopter":
            for (let i = 0; i < 2; i++) {
              if(this.test[this.selected[0]][this.selected[1] - i][1] != "air" && !this.test[this.selected[0]][this.selected[1] - i].includes(this.selectedAirplane)){
                return false;
              }
            }
            break;
          case "stealth plane":
            for (let i = 0; i < 2; i++) {
              if(this.test[this.selected[0]][this.selected[1] - i][1] != "air" && !this.test[this.selected[0]][this.selected[1] - i].includes(this.selectedAirplane)){
                return false;
              }
            }
            if ((this.test[this.selected[0] - 1][this.selected[1] - 1][1] != "air" && !this.test[this.selected[0] - 1][this.selected[1] - 1].includes(this.selectedAirplane))
                 || (this.test[this.selected[0] + 1][this.selected[1] - 1][1] != "air" && !this.test[this.selected[0] + 1][this.selected[1] - 1].includes(this.selectedAirplane))){
              return false;
            }
            break;
          case "fighter #1":
          case "fighter #2":
            for (let i = 0; i < 4; i++) {
              if(this.test[this.selected[0]][this.selected[1] - i][1] != "air" && !this.test[this.selected[0]][this.selected[1] - i].includes(this.selectedAirplane)){
                return false;
              }
            }
            if ((this.test[this.selected[0] - 1][this.selected[1] - 2][1] != "air" && !this.test[this.selected[0] - 1][this.selected[1] - 2].includes(this.selectedAirplane))
                 || (this.test[this.selected[0] + 1][this.selected[1] - 2][1] != "air" && !this.test[this.selected[0] + 1][this.selected[1] - 2].includes(this.selectedAirplane))){
              return false;
            }
            break;
          default:
            break;
        }
        break;
      case Orientation.Rotated270:
        switch (plane) {
          case "helicopter":
            for (let i = 0; i < 2; i++) {
              if(this.test[this.selected[0] - i][this.selected[1]][1] != "air" && !this.test[this.selected[0] - i][this.selected[1]].includes(this.selectedAirplane)){
                return false;
              }
            }
            break;
          case "stealth plane":
            for (let i = 0; i < 3; i++) {
              if(this.test[this.selected[0]-1][this.selected[1] - 1 + i][1] != "air" && !this.test[this.selected[0] - 1][this.selected[1] - 1 + i].includes(this.selectedAirplane)){
                return false;
              }
            }
            if (this.test[this.selected[0]][this.selected[1]][1] != "air" && !this.test[this.selected[0]][this.selected[1]].includes(this.selectedAirplane)){
              return false;
            }
            break;
          case "fighter #1":
          case "fighter #2":
            for (let i = 0; i < 4; i++) {
              if(this.test[this.selected[0] - i][this.selected[1]][1] != "air" && !this.test[this.selected[0] - i][this.selected[1]].includes(this.selectedAirplane)){
                return false;
              }
            }
            if ((this.test[this.selected[0] - 2][this.selected[1] - 1][1] != "air" && !this.test[this.selected[0] - 2][this.selected[1] - 1].includes(this.selectedAirplane))
                 || (this.test[this.selected[0] - 2][this.selected[1] + 1][1] != "air" && !this.test[this.selected[0] - 2][this.selected[1] + 1].includes(this.selectedAirplane))){
              return false;
            }
            break;
          default:
            break;
        }
        break;
      default:
        break;
    }
    return true;
  }

  toggleVertical(){
    this.isVertical = !this.isVertical;
  }

  rotateVertical() {
    this.airplaneOrientation = Orientation.Vertical;
  }

  rotate90() {
    this.airplaneOrientation = Orientation.Rotated90;
  }

  rotate180() {
    this.airplaneOrientation = Orientation.Rotated180;
  }

  rotate270() {
    this.airplaneOrientation = Orientation.Rotated270;
  }

  clearShip(s:Ship,size:number){
    for(let i=0; i<size; i++){
      if(s.horizontal == false){
        this.test[s.y+i][s.x][0] = "water";
      }
      else{
        this.test[s.y][s.x+i][0] = "water";
      }
    }
  }

  clearAirplane(plane:Airplane, size:number) {
    switch (size) {
      case 2:
        switch (plane.orientation) {
          case Orientation.Vertical:
            for(let i = 0; i < size; i++){
                this.test[plane.y][plane.x + i][1] = "air";
            }
            break;
          case Orientation.Rotated90:
            for(let i = 0; i < size; i++){
              this.test[plane.y + i][plane.x][1] = "air";
            }
            break;
          case Orientation.Rotated180:
            for(let i = 0; i < size; i++){
              this.test[plane.y][plane.x - i][1] = "air";
            }
            break;
          case Orientation.Rotated270:
            for(let i = 0; i < size; i++){
              this.test[plane.y - i][plane.x][1] = "air";
            }
            break;
          default:
            break;
        }
        break;
      case 4:
        switch (plane.orientation) {
          case Orientation.Vertical:
            for (let i = 0; i < 2; i++) {
                this.test[plane.y][plane.x + i][1] = "air";
            }
            this.test[plane.y - 1][plane.x + 1][1] = "air";
            this.test[plane.y + 1][plane.x + 1][1] = "air";
            break;
          case Orientation.Rotated90:
            for (let i = 0; i < 3; i++) {
              this.test[plane.y + 1][plane.x - 1 + i][1] = "air";
            }
            this.test[plane.y][plane.x][1] = "air";
            break;
          case Orientation.Rotated180:
            for (let i = 0; i < 2; i++) {
              this.test[plane.y][plane.x - i][1] = "air";
            }
            this.test[plane.y - 1][plane.x - 1][1] = "air";
            this.test[plane.y + 1][plane.x - 1][1] = "air";
            break;
          case Orientation.Rotated270:
            for (let i = 0; i < 3; i++) {
              this.test[plane.y - 1][plane.x - 1 + i][1] = "air";
            }
            this.test[plane.y][plane.x][1] = "air";
            break;
          default:
            break;
        }
        break;
      case 6:
        switch (plane.orientation) {
          case Orientation.Vertical:
            for(let i = 0; i < 4; i++){
                this.test[plane.y][plane.x + i][1] = "air";
            }
            this.test[plane.y - 1][plane.x + 2][1] = "air";
            this.test[plane.y + 1][plane.x + 2][1] = "air";
            break;
          case Orientation.Rotated90:
            for(let i = 0; i < 4; i++){
              this.test[plane.y + i][plane.x][1] = "air";
            }
            this.test[plane.y + 2][plane.x + 1][1] = "air";
            this.test[plane.y + 2][plane.x - 1][1] = "air";
            break;
          case Orientation.Rotated180:
            for(let i = 0; i < 4; i++){
              this.test[plane.y][plane.x - i][1] = "air";
            }
            this.test[plane.y - 1][plane.x - 2][1] = "air";
            this.test[plane.y + 1][plane.x - 2][1] = "air";
            break;
          case Orientation.Rotated270:
            for(let i = 0; i < 4; i++){
              this.test[plane.y - i][plane.x][1] = "air";
            }
            this.test[plane.y - 2][plane.x + 1][1] = "air";
            this.test[plane.y - 2][plane.x - 1][1] = "air";
            break;
          default:
            break;
          }
        break;
      default:
        break;
    }
  }

  Deploy(){
    if(this.isWater){
    for(let i = 0; i < 5; i++){
      if(this.ships[i].placed == false){
        alert("Not all ships have been placed!");
        return;
      }
    }
    this.shipsDeployed = true;
    this.sendtoserver();
  }
  if(!this.isWater){
    for(let i = 0; i < 4; i++){
      if(this.airplanes[i].placed == false){
        alert("Not all airplanes have been placed!");
        return;
      }
    }
    this.airplanesDeployed = true;
    this.sendtoserver();
  }

  }

  sendtoserver(){
    this.gamestate.startingBoard.legend=this.test;
    this.gamestate.InterpretBoard(this.gamestate.startingBoard.refNumber,this.gamestate.startingBoard.legend, this.gamestate.startingBoard.craft);
    this.gamestate.SendPlayerBoard(this.gamestate.startingBoard);
    
    if(this.size==4){
      console.log(this.playerNumber);
      switch (this.playerNumber) {
        case 1:
          if(this.playerTwoReady&&this.playerThreeReady&&this.playerFourReady){
            this.gamestate.StartGame()
          } else{
            this.gamestate.ReadyUp();
          }
          break;
        case 2:
          if(this.playerOneReady&&this.playerThreeReady&&this.playerFourReady){
            this.gamestate.StartGame()
          } else{
            this.gamestate.ReadyUp();
          }
          break;
        case 3:
          if(this.playerOneReady&&this.playerTwoReady&&this.playerFourReady){
            this.gamestate.StartGame()
          } else{
            this.gamestate.ReadyUp();
          }
          break;
        case 4:
          if(this.playerOneReady&&this.playerTwoReady&&this.playerThreeReady){
            this.gamestate.StartGame()
          } else{
            this.gamestate.ReadyUp();
          }
          break;
        default:
          break;
      }
    } else if(this.size == 2){
        switch (this.playerNumber) {
          case 1:
            if(this.playerTwoReady){
              this.gamestate.StartGame()
            } else{
              this.gamestate.ReadyUp();
            }
            break;
          case 2:
            if(this.playerOneReady){
              this.gamestate.StartGame()
            } else{
              this.gamestate.ReadyUp();
            }
            break;
          default:
            break;
        }
      }
  }

  LeaveRoom(){
    this.deploy.leaveRoom(this.roomNum);
    console.log("leaving room");
    this.router.navigate(["/game/battleship/roomlist"]);
  }

  CannotPlaceError(s:string){
    if (s === "sea") {
      alert("Can't place {"+ this.selectedShip + "} at location {" + this.selected[0] + "," + this.selected[1]+ "}!");
    } else if (s === "air") {
      alert("Can't place {"+ this.selectedAirplane + "} at location {" + this.selected[0] + "," + this.selected[1]+ "}!");
    }
    
  }

  ngOnDestroy(){
      if(!this.gameStarted){
        this.gamestate.LeaveRoom();
      }
  }
}
