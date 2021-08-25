import { Component, Input, OnInit } from '@angular/core';
import { ITeam } from 'src/app/gamehub/interfaces/ITeam';
import { ITeamJoinRequest } from 'src/app/gamehub/interfaces/ITeamJoinRequest';
import { IUser } from 'src/app/gamehub/interfaces/IUser';
import { TeamService } from 'src/app/gamehub/services/teamservice/team.service';

@Component({
  selector: 'app-is-tm',
  templateUrl: './is-tm.component.html',
  styleUrls: ['./is-tm.component.scss']
})
export class IsTMComponent implements OnInit {

  // Variable declarations
  @Input()
  public currentUser: IUser |any = {};
  myteam : ITeam |any = {};
  teamName:string | any = sessionStorage.getItem('teamName');
  isDeleted:boolean | any = false;
  isAccepted:boolean | any = false;
  requestList : ITeamJoinRequest[] |any = [];


  // Constructor
  constructor(private teamservice:TeamService) { }
  


  ngOnInit(): void {
      this.GetListOfRequest();
      this.SearchTeam();
    
  }

  // Delete Team
  OnDeleteTeam():void{
    this.teamservice.DeleteTeamByName(this.currentUser.team.name).subscribe((isDeleted :boolean)=>{
      this.isDeleted = isDeleted;
    });
    console.log(this.isDeleted);
  }

  // Get the list Of  all Join team request
  GetListOfRequest():void{
    this.teamservice.GetAllRequestsForJoinTeam(this.teamName).subscribe((requestList:ITeamJoinRequest[])=>{
      
      requestList.forEach(element => {
        if(element.user.teamId==null){
          this.requestList.push(element);
        }
      });
    });
  }

  // Accept or deny a particular request
  AcceptOrDeny(requestId:string,accept?:boolean){
    this.teamservice.ApproveOrDenyRequest(requestId).subscribe((response:boolean)=>{
      this.isAccepted=response
    });
    location.reload();
  }

  SearchTeam():void
   {
     this.teamservice.GetSearchedTeamsByName(this.teamName).subscribe((team : ITeam)=>{
       this.myteam = team;
     });
   }

}
