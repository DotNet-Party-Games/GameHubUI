import { Component, OnInit } from '@angular/core';
import { ITeam } from '../../interfaces/ITeam';
import { IUser } from '../../interfaces/IUser';
import { TeamService } from '../../services/teamservice/team.service';

@Component({
  selector: 'app-teamwindow',
  templateUrl: './teamwindow.component.html',
  styleUrls: ['./teamwindow.component.scss']
})
export class TeamwindowComponent implements OnInit {

  public currentUser: IUser |any;
  public userTeam:ITeam |any;
  public haveTeam: boolean =false;
  constructor( private teamservice:TeamService) {
    this.currentUser= {
      id:"",
      username:"",
      email:"",
      picture:"",
      teamId:"",
      team:"",
    };
   }


  ngOnInit(): void {
    this.GetCurrentUser();
    
  }

  GetCurrentUser():void{
    this.teamservice.GetUserInfo().subscribe((currentUser : IUser)=>{
      this.currentUser = currentUser ; 
      if(currentUser.team!=null){
        sessionStorage.setItem('teamName',currentUser.team.name);
        this.haveTeam = true;
      }
      
    });
    
  }

}
