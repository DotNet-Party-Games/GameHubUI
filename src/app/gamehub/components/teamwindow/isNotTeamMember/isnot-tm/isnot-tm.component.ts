import { Component, Input, NgZone, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ITeam } from 'src/app/gamehub/interfaces/ITeam'; 
import { ITeamJoinRequest } from 'src/app/gamehub/interfaces/ITeamJoinRequest';
import { IUser } from 'src/app/gamehub/interfaces/IUser';
import { ChatAlert } from 'src/app/gamehub/models/chatalert.model';
import { GameChatService } from 'projects/hubservices/src/public-api';
import { TeamService } from 'src/app/gamehub/services/teamservice/team.service'; 
import { UserService } from 'projects/hubservices/src/public-api';
import { User } from 'src/app/gamehub/models/user.model';

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

  @Input()
  public currentUser: IUser |any = {};

  public user: User | null = null;
  public connectionEstablished: Boolean = false;

  
   constructor( private teamservice:TeamService,
    public userService: UserService,
    private chatService: GameChatService,
    private ngZone: NgZone) { 
      this.subscribeToEvents();
    }
 
   ngOnInit(): void {
     this.GetAllTeam();
   }
 
   ngOnChanges(changes:SimpleChanges):void{

   }
   // get the list of all teams
   GetAllTeam():void
   {
     this.teamservice.GetAllTeams().subscribe((teamList : ITeam[])=>{
       this.teams = teamList;
     })
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

   // send a request to join a team
   OnJoinTeamRequest(teamName:string):void{
    this.cfrm= confirm("submit the request?");
    if(this.cfrm){
      if(teamName!=null){
        this.teamservice.JoinTeam(teamName).subscribe((joinRequest: ITeamJoinRequest|any)=>{
          this.joinRequest = joinRequest;          
          if(this.joinRequest.id){
            alert("Your request is been sent");
          }
        });        
      }
    }     
  }

  // the submit button event click call on OnCreateTeam method
  OnCreateTeam(createTeamGroup:FormGroup):void{
    if(createTeamGroup.valid){
      this.teamservice.CreateTeam(createTeamGroup.value).subscribe((createdTeam:any) =>{
        if(createdTeam){   
          sessionStorage.setItem('user_teamId',createdTeam.users[0].teamId.toString())
          sessionStorage.setItem('user_teamName',createdTeam.users[0].team.toString())
        }
        alert("Team created");
      })
    }  
    this.GetAllTeam();
    location.reload();
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
        if(this.notifyMe.alertType=="REQUEST APPROVED"){
          location.reload();
        }
      });
    });
  }
}