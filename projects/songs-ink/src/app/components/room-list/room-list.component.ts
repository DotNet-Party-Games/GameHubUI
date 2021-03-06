import { Component, OnInit, OnDestroy,AfterViewChecked, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { ChooseCategoryService }  from './../../services/choose-category.service'
import { SocketIoService } from './../../services/socketio.service'
import { ChatComponent } from '../chat/chat.component';

@Component({
  selector: 'app-room-list',
  templateUrl: './room-list.component.html',
  styleUrls: ['./room-list.component.scss']
})
export class RoomListComponent implements OnInit, OnDestroy, AfterViewChecked {
  
  rooms:string[];
  currentRoom: string;
  private _roomsub: Subscription;
  private _roomsub2: Subscription;
  // isVisible: boolean=false;

  //category stuff
  categories: string[];
  chosenCategory: string;

  constructor(private router: Router, private route: ActivatedRoute, private SocketService: SocketIoService, public dialog: MatDialog, private categoryService: ChooseCategoryService) { 
  }

  ngOnInit(): void {
    this.categories = [];
    let rooms2:string[];
    this._roomsub = this.SocketService.currentRoom.subscribe(room => this.currentRoom = room);
    this.SocketService.setUpRoomList();
    this._roomsub2 = this.SocketService.roomList.subscribe(rooms => this.rooms = rooms);
    if (!this.rooms) {
      this.rooms=this.SocketService.roomListstatic;
    }
  }

  ngAfterViewChecked(){
    //empty
  }

  loadRoom(id: string) {
    this.SocketService.getRoom(id);
    this.router.navigate(['game'], {relativeTo: this.route.parent})
  }
  addRoom() {
    this.categoryService.getDefaultCategories().subscribe(categories => {
      for(let i = 0; i < categories.length; i++) {
        this.categories[i] = categories[i].categoryName;
      }
    });
    this.openDialog();
  }

  getRooms(){
    this.rooms=this.SocketService.roomListstatic;
  }

  ngOnDestroy() {
    this._roomsub.unsubscribe();
    this._roomsub2.unsubscribe();
    console.log("Deleted");
  }

  syncRooms() {
    this.rooms=this.SocketService.roomListstatic;
    this._roomsub2.unsubscribe();
    this._roomsub2 = this.SocketService.roomList.subscribe(rooms => this.rooms = rooms);
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(ChooseCategoryDialogComponent, {
      data: this.categories
    });
    dialogRef.afterClosed().subscribe(result => {
      this.chosenCategory = result;
      this.SocketService.addRoom(this.chosenCategory);
      // emit
    })
  }

  // showRooms() {
  //   this.isVisible=!this.isVisible;
  // }
}

@Component({
  selector: 'app-choose-category-dialog',
  templateUrl: './app-choose-category-dialog.component.html'
})
export class ChooseCategoryDialogComponent {

  constructor(
    public dialogRef: MatDialogRef<RoomListComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { this.dialogRef.disableClose = true; }
}
