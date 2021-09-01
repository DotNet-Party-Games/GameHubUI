import { Component, Input, NgZone, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ITeam } from 'src/app/gamehub/interfaces/ITeam'; 
import { ITeamJoinRequest } from 'src/app/gamehub/interfaces/ITeamJoinRequest';
import { IUser } from 'src/app/gamehub/interfaces/IUser';
import { ChatAlert } from 'src/app/gamehub/models/chatalert.model';
import { AppToastService, GameChatService } from 'projects/hubservices/src/public-api';
import { TeamService } from 'src/app/gamehub/services/teamservice/team.service'; 
import { UserService } from 'projects/hubservices/src/public-api';
import { User } from 'src/app/gamehub/models/user.model';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-isnot-tm',
  templateUrl: './isnot-tm.component.html',
  styleUrls: ['./isnot-tm.component.scss']
})
export class IsnotTMComponent implements OnInit, OnChanges {

  createTeamGroup = new FormGroup({
    name : new FormControl(),
    description : new FormControl(),
  });
  joinRequest:ITeamJoinRequest | any={};
  teams: ITeam[] | any= [];
  searchKey: string |any = '';
  cfrm : string |any = '';
  notifyMe:ChatAlert | any={};
  public isLoading: Boolean = false;
  public selectedTeamName: string | null;

  @Input()
  public currentUser: IUser |any = {};

  public user: User | null = null;
  public connectionEstablished: Boolean = false;
  private modalReference: any = null;

  
  constructor( private teamservice:TeamService,
    public userService: UserService,
    private chatService: GameChatService,
    private ngZone: NgZone,
    private modalService: NgbModal,
    private toastService: AppToastService) { 
      this.subscribeToEvents();
    }
 
  ngOnInit(): void {
    this.isLoading = true;
     this.GetAllTeam();
   }
 
  ngOnChanges(): void{ }
   // get the list of all teams
  GetAllTeam(): void {
     this.teamservice.GetAllTeams().subscribe(
      (teamList : ITeam[])=>{
        this.teams = teamList;
        this.isLoading = false;
      }, 
      (error) => {
        console.log(error);
        console.log("Retrying to get teams...")
        setTimeout(() => this.GetAllTeam(), 5000); 
      }
    )
  }
 
   //Get list of Team base on search
   OnSearchTeam():void
   {
     this.teamservice.GetSearchedTeamsByName(this.searchKey).subscribe((teamfound : ITeam)=>{
       this.teams = [];
       if(teamfound.id!=null){
        this.teams.push(teamfound);
        document.getElementById("sp")?.setAttribute("style","color:green");
       }
     });     
     this.searchKey="";
   }

  sendJoinTeamRequest(): void {
    if (this.selectedTeamName != null) {
      this.teamservice.JoinTeam(this.selectedTeamName).subscribe(joinRequest => {
        if(joinRequest) {
          this.toastService.show("YOUR REQUEST HAS BEEN SENT","Please wait for the team leader to review your request.");
        } else {
          this.toastService.show("FAILED TO SEND REQUEST","Please try again later.");
        }
      });
    }
    this.modalReference.close();
  }

  openTeamRequestModal(content: any, teamName: string) {
    this.selectedTeamName = teamName;
    this.modalReference = this.modalService.open(content, { centered: true });
  }

  closeTeamRequestModal() {
    this.modalReference.close();
  }

  // the submit button event click call on OnCreateTeam method
  OnCreateTeam(createTeamGroup:FormGroup):void{
    if(createTeamGroup.valid){
      this.teamservice.CreateTeam(createTeamGroup.value).subscribe((createdTeam:any) =>{
        if(createdTeam){   
          sessionStorage.setItem('user_teamId',createdTeam.users[0].teamId.toString());
          sessionStorage.setItem('user_teamName',createdTeam.users[0].team.toString());
          this.toastService.show("TEAM CREATED",`Your team ${createdTeam.name} has been created`);
        } else {
          this.toastService.show("FAILED TO CREATE TEAM",`An error occurred while creating your team.`);
        }
      })
    }  
    this.GetAllTeam();
    this.userService.getUser();
  }

  subscribeToEvents(): void {
    this.userService.user.subscribe(user => {
      this.user = user;
    });
    this.chatService.userAlert.subscribe((alert: ChatAlert) => {
      this.ngZone.run(() => {
        console.log(alert);
        this.notifyMe = alert;
        if(this.notifyMe.alertType=="REQUEST APPROVED"){
          this.userService.getUser();
        }
      });
    });
  }
}