import { ThisReceiver } from '@angular/compiler';
import { Injectable } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Socket } from 'ngx-socket-io';
import { UserService } from 'projects/hubservices/src/public-api';
import { Room } from '../models/room.model';
import { User } from 'projects/hubservices/src/models/user.model';
import { StatisticapiService } from './statisticapi.service';


@Injectable({
  providedIn: 'root'
})
export class RoomService {
  // variable declarations
  // events emitted by server, consumed on client as observable
  currentRoom = this.socket.fromEvent<string>('room');
  rooms = this.socket.fromEvent<string[]>('rooms');
  roomSize = 2;
  testName:string = this.roomId();
  user:User;

  // constructor initializes socket use
  constructor(private socket: Socket, private router:Router) { 
    console.log(this.testName);
    this.socket.emit('first connection', this.testName);
  }

  // based off events in server
  joinRoom(id: string) {
    this.socket.emit('join room', id);
    this.router.navigate(['/game/battleship/gamescreen']);
  }

  addRoom() {
    console.log(this.roomSize);
    this.socket.emit('add a room', { id: this.roomId(), maxPlayers: this.roomSize });
    this.router.navigate(['/game/battleship/gamescreen']);
  }

  // function to make a random room id that can be parsed into a number for api calls
  private roomId() {
    let roomId = '';
    const possible = '123456789';
    for(let i = 0; i < 3; i++) {
      roomId += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return roomId;
  }

  UpdateScores(){
    this.socket.on('winner', ()=>{

    })
    this.socket.on('loser', ()=>{
        
    })
  }

  joinTeam(friendID:string){
    //get your username so that you can add yourself to the team
    const yourid = "";
    //send both your name and friend's so that you can make a team with both. 
    //score question, if you win does that count as a win for both or in a new scoreboard just for teams
    //
    this.socket.emit("join team", friendID, yourid);
  }
}
