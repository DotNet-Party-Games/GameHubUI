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

  @Input()
  public currentUser: IUser |any ={
    id:"",
    username:"",
    email:"",
    picture:"",
    teamId:"",
    team:"",
  };
  team : ITeam |any;
  teamName:string | any;
  isDeleted:boolean | any;
  constructor(private teamservice:TeamService) { }
  requestList : ITeamJoinRequest |any;


  ngOnInit(): void {
    this.isDeleted = false;
    this.teamName = sessionStorage.getItem('teamName');
    // if(this.currentUser.id === this.currentUser.team.teamOwner){
      this.GetListOfRequest();
      this.SearchTeam();
    // }
    
  }

  OnDeleteTeam():void{
    this.teamservice.DeleteTeamByName(this.currentUser.team.name).subscribe((isDeleted :boolean)=>{
      this.isDeleted = isDeleted;
    });
    console.log(this.isDeleted);
  }

  GetListOfRequest():void{
    this.teamservice.GetAllRequestsForJoinTeam(this.teamName).subscribe((requestList:ITeamJoinRequest[] | any)=>{
      this.requestList = requestList;
      console.log(JSON.stringify(this.requestList[1]));
    });
  }

  AcceptOrDeny(requestId:string,accept:boolean){
    this.teamservice.ApproveOrDenyRequest(requestId, accept).subscribe((response:boolean)=>{

    });
  }

  SearchTeam():void
   {
     this.teamservice.GetSearchedTeamsByName(this.teamName).subscribe((teamList : ITeam[])=>{
       this.team = teamList;
       console.log(JSON.stringify(this.team));
     });
   }

}
