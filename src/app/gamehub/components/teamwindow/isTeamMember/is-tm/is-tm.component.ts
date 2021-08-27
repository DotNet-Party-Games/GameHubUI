import { Component, Input, NgZone, OnInit } from '@angular/core';
import { ITeam } from 'src/app/gamehub/interfaces/ITeam';
import { ITeamJoinRequest } from 'src/app/gamehub/interfaces/ITeamJoinRequest';
import { IUser } from 'src/app/gamehub/interfaces/IUser';
import { ChatAlert } from 'src/app/gamehub/models/chatalert.model';
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
  notification :string | any='';

  // Constructor
  constructor(private teamservice:TeamService,
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
    });
  }
    location.reload();
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
      if(response){
        this.GetListOfRequest();
        this.SearchTeam();
      }
    });
    this.sendMessage();
    location.reload();
  }

  SearchTeam():void
   {
     this.teamservice.GetSearchedTeamsByName(this.teamName).subscribe((team : ITeam)=>{
       this.myteam = team;
     });
   }

   subscribeToEvents(): void { 
    this.chatService.messageReceived.subscribe((message: ChatMessage) => {  
      this.ngZone.run(() => {   
          this.notification = message;
      });  
    });   
    this.chatService.userEvent.subscribe((chatEvent: ChatStatus) => {  
      this.ngZone.run(() => {   
          console.log(chatEvent);
      });  
    });
    this.chatService.userAlert.subscribe((alert: ChatAlert) => {
      this.ngZone.run(() => {
        console.log(alert);
      });
    });
  }
  public sendMessage(): void {   
      var msg: ChatMessage = {
        senderId: this.currentUser.id,
        senderName: this.currentUser.username,
        body: "You have been accepted",
        timestamp: new Date().getTime(),
      }
      this.chatService.sendMessage(msg);
  }

}
