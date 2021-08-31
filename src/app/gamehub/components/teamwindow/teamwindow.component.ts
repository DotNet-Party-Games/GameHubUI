import { Component, OnInit } from '@angular/core';
import { GameChatService, UserService } from 'projects/hubservices/src/public-api';
import { ITeam } from '../../interfaces/ITeam';
import { IUser } from '../../interfaces/IUser';
import { TeamService } from '../../services/teamservice/team.service';

@Component({
  selector: 'app-teamwindow',
  templateUrl: './teamwindow.component.html',
  styleUrls: ['./teamwindow.component.scss']
})
export class TeamwindowComponent implements OnInit {

  public currentUser: IUser | null = null;
  public userTeam:ITeam |any;
  public haveTeam: boolean =false;

  constructor(public userService: UserService) {}


  ngOnInit(): void {
    this.getCurrentUser();
    this.subscribeToEvents()
    
  }

  getCurrentUser(): void {
    this.userService.user.subscribe(currentUser => {
      this.currentUser = currentUser;
      console.log(currentUser)
      if (currentUser != null && currentUser.team != null) {
        this.haveTeam = true;
        sessionStorage.setItem('teamName', currentUser.team.name);
      } else {
        this.haveTeam = false;
      }
    });
  }

  subscribeToEvents(): void {
    this.userService.user.subscribe(user => {
      this.currentUser = user;;
    });
  }
}
