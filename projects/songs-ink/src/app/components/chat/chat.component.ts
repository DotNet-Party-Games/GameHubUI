import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { SocketIoService } from '../../services/socketio.service';
import { Subscription } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit, OnDestroy {
  @Input() newChatParameter: string;
  room: string;
  backup:string[] = [];
  chatlines:string[] = [];
  newChat:string;
  goal:string;
  currentUsername:string;
  playerTest:string[];
  private _roomsub: Subscription;
  firstCorrect:boolean;
  ableToScore:boolean=true;
  activeDrawer:boolean;
  receiveMessage : boolean = true;


  title = 'socketio-angular';

  constructor(private socketService: SocketIoService, private router: Router, private route: ActivatedRoute) {}

  ngOnInit() {
    let audio = new Audio('./assets/songsink/Send_Message.wav');
    this._roomsub = this.socketService.currentRoom.subscribe(currentRoom => this.room = currentRoom);
    this._roomsub = this.socketService.goalWord.subscribe(theWord => this.goal=theWord);
    this._roomsub = this.socketService.newMessage.subscribe((message:string)=> {
      this.chatlines.unshift(message);
      if(this.receiveMessage){
        audio.volume=0.1;
        audio.play();
      }
      this.receiveMessage = true;
    })
    this._roomsub= this.socketService.maxPoints.subscribe(test => this.firstCorrect=test);
    this._roomsub=this.socketService.ableToScore.subscribe(test=>this.ableToScore=test);
    this._roomsub=this.socketService.activeDrawer.subscribe(test=>this.activeDrawer=test);

  }

  AddChat(message:string) {
    if(message&&this.goal&&this.ableToScore&&!this.activeDrawer){
      if(message.toLocaleLowerCase()==this.goal.toLocaleLowerCase()){
        this.receiveMessage = false;
        this.socketService.editChat(" guessed correctly!");
        if(this.firstCorrect){
          this.socketService.AddPoints(100);
        } 
        else{
          this.socketService.AddPoints(50);
        }
      }
      else if(message){
        this.receiveMessage = false;
        this.socketService.editChat(message);
      }
    }
    else if(message){
      console.log("inside else");
      this.receiveMessage = false;
      this.socketService.editChat(message);
    }
  }

  ngOnDestroy(){
    this.socketService.leaveRoom();
    this._roomsub.unsubscribe();
  }

  leaveRoom() {
    this.router.navigate(['lobby'], {relativeTo: this.route.parent})

  }
}
