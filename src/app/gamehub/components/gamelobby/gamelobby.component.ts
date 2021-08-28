import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-gamelobby',
  templateUrl: './gamelobby.component.html',
  styleUrls: ['./gamelobby.component.scss']
})
export class GamelobbyComponent implements OnInit {

  messageText:string ="";
  messageArray:{user:string,message:string}[]=[];
  playerList:{playerName:string}[]=[];
  constructor() { 
    this.playerList.push({playerName:"klaus"});
    this.playerList.push({playerName:"Iram"});
    this.playerList.push({playerName:"Sean"});
    this.playerList.push({playerName:"Hieu"});
  }

  ngOnInit(): void {
  }

  sendMessage():void{
    console.log(this.messageText);
    this.messageArray.push({user:"klaus",message:this.messageText})
    this.messageText='';
  }
}
