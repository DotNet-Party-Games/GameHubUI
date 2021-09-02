import { Component, Input, NgZone, OnInit } from '@angular/core';
import { ITeam } from 'src/app/gamehub/interfaces/ITeam';
import { ITeamJoinRequest } from 'src/app/gamehub/interfaces/ITeamJoinRequest';
import { IUser } from 'src/app/gamehub/interfaces/IUser';
import { ChatAlert } from 'src/app/gamehub/models/chatalert.model';
import { AppToastService, UserService, GameChatService} from 'projects/hubservices/src/public-api';  
import { User } from 'src/app/gamehub/models/user.model';
import { TeamService } from 'src/app/gamehub/services/teamservice/team.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

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
  public connectionEstablished: boolean = false;
  private modalReference: any = null;
  public isLoading: boolean = false;

  // Constructor
  constructor(private teamservice:TeamService,
    public userService: UserService,
    private chatService: GameChatService,
    private ngZone: NgZone,
    private modalService: NgbModal,
    private toastService: AppToastService) { 
      this.subscribeToEvents();
  }

  ngOnInit(): void {
      this.isLoading = true;
      this.GetListOfRequest();
      this.SearchTeam();
  }

  // Delete Team
  deleteTeam() {
    this.teamservice.DeleteTeamByName(this.currentUser.team.name).subscribe((isDeleted :boolean)=>{
      this.isDeleted = isDeleted;
      sessionStorage.removeItem('teamName');
      this.userService.getUser();
    });
    this.closeModal()
  }

  leaveTeam() {
    this.teamservice.leaveTeam().subscribe((left :boolean)=>{
      this.hasLeft = left;
      sessionStorage.removeItem('teamName');
      this.userService.getUser();
    });
    this.closeModal()
  }

  openModal(content: any) {
    this.modalReference = this.modalService.open(content, { centered: true,  });
  }

  closeModal() {
    this.modalReference.close();
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
      this.isAccepted=response;
      if(response){
        this.GetListOfRequest();
        this.SearchTeam();
      }
    });
    this.userService.getUser();
  }

  SearchTeam():void
   {
     this.teamservice.GetSearchedTeamsByName(this.teamName).subscribe((team : ITeam)=>{
       this.myteam = team;
       this.isLoading = false;
     });
   }

   ngOnDestroy() {
    //empty
  }

  subscribeToEvents(): void {
    this.userService.user.subscribe(user => {
      this.user = user;
      if (user && user.team) {
        this.chatService.connectionEstablished.subscribe(isConnected => {
          if (isConnected) {
            this.chatService.joinChat(user.teamId);
          }
        })
      }
    });
    this.chatService.userAlert.subscribe((alert: ChatAlert) => {
      this.ngZone.run(() => {
        this.notifyMe = alert;
        if(this.notifyMe.alertType=="NEW TEAM JOIN REQUEST"){
          this.GetListOfRequest();
        } else if (this.notifyMe.alertType=="TEAM DISBANDED") {
          this.userService.getUser();
        } else {
          this.SearchTeam();
        }
      });
    });
  }
}
