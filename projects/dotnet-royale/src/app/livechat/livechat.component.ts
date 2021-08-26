import { IGame } from '../services/game';
import { LivechatService } from '../services/livechat/livechat.service';
import { PartygameService } from '../services/partygame.service';
import { AfterViewInit, Component, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SocketioService } from '../services/socketio/socketio.service';

@Component({
  selector: 'app-livechat',
  templateUrl: './livechat.component.html',
  styleUrls: ['./livechat.component.css']
})
export class LivechatComponent implements OnInit,OnChanges {

  public roomId : string;
  public messageText:string;
  public messageArray: {user:string, message:string}[] = [];

  public currentUser:string;
  public selectedGame:IGame;

  public UserList:string[];

  constructor(private partyGameApi: PartygameService, private socketService: SocketioService )
  {
    this.currentUser = sessionStorage.getItem('userName');
  }
  ngOnChanges(changes: SimpleChanges): void {

  }

  ngOnInit(): void
  {
    this.currentUser = sessionStorage.getItem('userName');
    this.roomId = sessionStorage.getItem('roomId');
    this.selectGameRoomHandler();
    this.reloadRoomList();
    this.getRoomUserList();
  }

  selectGameRoomHandler():void
  {
    this.roomId = sessionStorage.getItem("roomId");
    this.socketService.getMessage().subscribe((data: {user:string, message:string}) => {
            this.messageArray.push(data);
        });

    this.join(this.currentUser,this.roomId);
  }

  join(username:string, roomId:string):void
  {
    this.socketService.joinRoom({user:username, room:roomId});
  }

  sendMessage():void
  {
    this.socketService.sendMessage({
      user: this.currentUser,
      room: this.roomId,
      message:this.messageText
    });
    this.messageText = '';
    let elem = document.getElementById('chbody');
      elem.scrollTop = elem.scrollHeight;
  }

  reloadRoomList(){
    this.socketService.reloadRoomList(this.currentUser);
  }

  getRoomUserList(){
    this.socketService.getRoomList().subscribe(roomList => {
      let room = roomList.find(({id}) => id == this.roomId);
      if(room) this.UserList = room.users;
    });
  }
  

}
