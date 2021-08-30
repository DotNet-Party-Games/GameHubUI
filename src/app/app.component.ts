import { Component } from '@angular/core';
import { GameChatService, UserService } from 'projects/hubservices/src/public-api';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'Revabox Games';

  constructor(public userService: UserService, private chatService: GameChatService) {
    this.subscribeToEvents();
  }

  subscribeToEvents(): void {
    this.userService.user.subscribe(user => {
      if(user != null) {
        this.chatService.startConnection()
      }
    });
  }
}

