import { Component, Input, NgZone, OnInit } from '@angular/core';
import { ITeam } from 'src/app/gamehub/interfaces/ITeam';
import { ITeamJoinRequest } from 'src/app/gamehub/interfaces/ITeamJoinRequest';
import { IUser } from 'src/app/gamehub/interfaces/IUser';
import { ChatAlert } from 'src/app/gamehub/models/chatalert.model';

import { UserService } from 'src/app/gamehub/services/user.service'; 
import { User } from 'src/app/gamehub/models/user.model';
// import { GameChatService } from 'src/app/gamehub/services/gamechat.service';

import { ChatMessage } from 'src/app/gamehub/models/chatmessage.model';
import { ChatStatus } from 'src/app/gamehub/models/chatstatus.model';
import { GameChatService } from 'projects/hubservices/src/public-api';

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
  hasLeft:boolean | any = false;
  requestList : ITeamJoinRequest[] |any = [];
  cfrm : string |any = '';
  notifyMe:ChatAlert | any={};

  
  public user: User | null = null;
  public connectionEstablished: Boolean = false;

  // Constructor
  constructor(private teamservice:TeamService,
    public userService: UserService,
    private chatService: GameChatService,
    private ngZone: NgZone) { 
      this.subscribeToEvents();
    }

  ngOnInit(): void {
      this.GetListOfRequest();
      this.SearchTeam();
  }

  // Delete Team
  OnDeleteTeam():void{
    this.cfrm= confirm("Are You Sure To Delete Team?");
    if(this.cfrm){
    this.teamservice.DeleteTeamByName(this.currentUser.team.name).subscribe((isDeleted :boolean)=>{
      this.isDeleted = isDeleted;
      sessionStorage.removeItem('teamName');
    });
  }
    location.reload();
  }

  // leave Team
  OnLeaveTeam():void{
    this.cfrm= confirm("Are You Sure To Delete Team?");
    if(this.cfrm){
    this.teamservice.leaveTeam().subscribe((left :boolean)=>{
      this.hasLeft = left;
      sessionStorage.removeItem('teamName');
    });
  }
    location.reload();
  }

  // Get the list Of  all Join team request
  GetListOfRequest():void{
    this.teamservice.GetAllRequestsForJoinTeam(this.teamName).subscribe((requestList:ITeamJoinRequest[])=>{
      this.requestList =requestList;
    });
  }

  // Accept or deny a particular request
  AcceptOrDeny(requestId:string,accept?:boolean){
    this.teamservice.ApproveOrDenyRequest(requestId).subscribe((response:boolean)=>{
      this.isAccepted=response
      if(response){
        this.GetListOfRequest();
        this.SearchTeam();
      }
    });
    // location.reload();
  }

  SearchTeam():void
   {
     this.teamservice.GetSearchedTeamsByName(this.teamName).subscribe((team : ITeam)=>{
       this.myteam = team;
     });
   }

  subscribeToEvents(): void {
    this.userService.user.subscribe(user => {
      this.user = user;
      if(this.user != null) {
        this.chatService.startConnection();
      }
    });
    this.chatService.userAlert.subscribe((alert: ChatAlert) => {
      this.ngZone.run(() => {
        console.log(alert);
        this.notifyMe = alert;
        if(this.notifyMe.alertType=="NEW TEAM JOIN REQUEST"){
          this.GetListOfRequest();
        }
      });
    });
  }
}
