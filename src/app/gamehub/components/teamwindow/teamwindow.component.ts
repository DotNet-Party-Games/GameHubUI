import { Component, OnInit } from '@angular/core';
import { UserService } from 'projects/hubservices/src/public-api';
import { ITeam } from '../../interfaces/ITeam';
import { IUser } from '../../interfaces/IUser';

@Component({
  selector: 'app-teamwindow',
  templateUrl: './teamwindow.component.html',
  styleUrls: ['./teamwindow.component.scss']
})
export class TeamwindowComponent implements OnInit {

  public currentUser: IUser | null = null;
  public userTeam:ITeam |any;
  public haveTeam: boolean = false;
  public isLoading: boolean = true;

  constructor(public userService: UserService) {}


  ngOnInit(): void {
    this.isLoading = true;
    this.subscribeToEvents()
    
  }

  subscribeToEvents(): void {
    this.userService.user.subscribe(user => {
      this.currentUser = user;
      if (user != null && user.team != null) {
        this.haveTeam = true;
        sessionStorage.setItem('teamName', user.team.name);
      } else {
        this.haveTeam = false;
      }
      this.isLoading = false;
    });
  }
}
