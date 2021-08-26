
import { Component, HostListener, OnDestroy } from '@angular/core';
import { LivechatService } from './services/livechat/livechat.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnDestroy {

  username: string;
  roomId: string;

  constructor(private livechatService: LivechatService){}

  @HostListener('window:beforeunload', ['$event'])
  unloadHandler(event: Event) {
    this.username = sessionStorage.getItem("userName");
    this.roomId = sessionStorage.getItem("roomId");
    this.livechatService.leaveRoom({room: this.roomId, user: this.username});
  }

  ngOnInit(){

  }

  ngOnDestroy(): void {

    // this.username = sessionStorage.getItem("userName");
    // this.roomId = sessionStorage.getItem("roomId");
    // this.livechatService.leaveRoom({room: this.roomId, user: this.username});

  }

}
