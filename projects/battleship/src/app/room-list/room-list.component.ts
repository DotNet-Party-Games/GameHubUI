import { Component, OnInit, OnDestroy, NgModule } from '@angular/core';
import { Observable, Subscription } from 'rxjs';


import { RoomService } from '../services/room.service';


@Component({
  selector: 'app-room-list',
  templateUrl: './room-list.component.html',
  styleUrls: ['./room-list.component.scss']
})
export class RoomListComponent implements OnInit, OnDestroy {
  // variable declarations
  // stream of available rooms
  rooms: Observable<string[]>;
  // id of current room
  currentRoom: string;
  // subscription of current room, will be unsubbed after ngondestroy
  private _roomSub: Subscription;


  myModel=false;
  // initialize room service file in constructor
  constructor(private roomService: RoomService) { }

  ngOnInit() {
    this.rooms = this.roomService.rooms;
    this._roomSub = this.roomService.currentRoom.subscribe(room => this.currentRoom = room.id);
  }

  ngOnDestroy() {
    this._roomSub.unsubscribe();
  }

  // references joinroom in service file
  loadRoom(id:string) {
    this.roomService.joinRoom(id);
  }

  newRoom() {
    if (this.myModel){
      this.roomService.roomSize = 4;
      this.roomService.addRoom();
      console.log("Making new multiplayer room");
    }
    else{
      this.roomService.roomSize=2;
      this.roomService.addRoom();
      console.log("Making new room");
    }
  }
}
