import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { Player } from '../models/Player';
import { Profile } from '../models/Profile';
import { PointsService } from './points.service';
import { ProfileService } from './profile.service';
import { TeamLeaderboardService, UserService } from 'projects/hubservices/src/public-api';
import { User } from '@auth0/auth0-spa-js';

@Injectable({
  providedIn: 'root'
})
export class SocketIoService {
  roomListstatic:string[]=[];
  userName:string;
  gameUserName:string;
  currentRoom = this.socket.fromEvent<string>('room');
  roomList = this.socket.fromEvent<string[]>('room list');
  chatLogOfRoom = this.socket.fromEvent<string[]>('EnterChatBox');
  newMessage = this.socket.fromEvent<string>('message');
  timeRemaining = this.socket.fromEvent<string>('time left');
  usersInRoom = this.socket.fromEvent<Player[]>('players');
  goalWord = this.socket.fromEvent<string>('goal word');
  goalCat = this.socket.fromEvent<string>('goal cat');
  maxPoints = this.socket.fromEvent<boolean>('first right');
  activeDrawer = this.socket.fromEvent<boolean>('active drawer');
  roundPoints = this.socket.fromEvent<number>('add points');
  ableToScore = this.socket.fromEvent<boolean>('able to score');
  currentLoggedIn:Profile;
  tempCurrentLoggedIn:Profile;
  user: User;
  

  constructor(private profApi: ProfileService, private socket: Socket, private pointApi: PointsService, private leaderboardService: TeamLeaderboardService, private userService: UserService) {
    this.userService.user.subscribe(user => {
      this.user = user;
    })
    this.RunOnConnect(); 
   }

    RunOnConnect(){
      this.userName = this.user.nickname;
      console.log(this.userName);
    }

    SetUsername(newName:string){
      this.userName=newName;
    }
 
  
  getRoom(id: string) {
    
    this.socket.emit('getRoom', {roomId:id, username:this.userName});
    this.socket.on('update name', (tempusernamer:string) =>{
      this.gameUserName=tempusernamer;
    })
  }

  addRoom(chosenCategory: string) {
    this.socket.emit('addRoom', { room: this.roomId(), category: chosenCategory });
    
  }
  setUpRoomList() {
    this.roomList.subscribe(list=> this.roomListstatic=list);
  }


  editChat(chatline: string) {
    this.socket.emit('message', {message:chatline, tempusernamer:this.gameUserName});
  }

  leaveRoom(){
    this.socket.emit("leave room", this.userName);
  }

  UpdateTimer(remaining: number){
    this.socket.emit('timer update', remaining);
  }

  TimeUp(){
    this.socket.emit('times up');
    this.socket.emit('Clear');
  }

  AddPoints(points:number){
    
    this.socket.emit('add points', {tempuser:this.gameUserName,points:points});
    this.socket.on('update total points',(points:number)=>this.UpdateTotalPoints(points));
  }


  UpdateTotalPoints(add:number){
    this.profApi.getUserScore(<string>this.user.username).subscribe( (response) => {

      if(response.currentScore == null){
        response.currentScore = 0;
      }
      if(response.overallScore == null){
        response.overallScore = 0;
      }
      response.currentScore += add;
      response.overallScore += add;
      this.pointApi.updateScoreOfPlayer(response).subscribe();
    });
    this.leaderboardService.submitScore("songsink", add);
  }


  StartRound(){
    let currentTime = 35;
    let timerId = setInterval(() =>{
      if(currentTime==0){
        this.TimeUp();
        clearTimeout(timerId);
      }else{
      this.UpdateTimer(currentTime);
      currentTime--;
      }
    }, 1000)
  }


  private roomId() {
    let text = '';
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    for (let i = 0; i < 5; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
  }
}
