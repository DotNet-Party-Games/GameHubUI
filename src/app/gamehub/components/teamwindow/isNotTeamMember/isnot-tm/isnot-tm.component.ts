import { Component, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ITeam } from 'src/app/gamehub/interfaces/ITeam'; 
import { ITeamJoinRequest } from 'src/app/gamehub/interfaces/ITeamJoinRequest';
import { TeamService } from 'src/app/gamehub/services/teamservice/team.service'; 

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
  messageSearch : string | any = '';
  
   constructor( private teamservice:TeamService) { }
 
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
     this.messageSearch = '';
   }
 
   //Get list of Team base on search
   OnSearchTeam():void
   {
     this.teamservice.GetSearchedTeamsByName(this.searchKey).subscribe((teamfound : ITeam)=>{
       this.teams = [];
       if(teamfound.id!=null){
        this.teams.push(teamfound);
        this.messageSearch = 'Team found';
        document.getElementById("sp")?.setAttribute("style","color:green");
       }
     });
     
     
     this.searchKey="";
   }

   // send a request to join a team
   OnJoinTeamRequest(teamName:string):void{
     if(teamName!=null){
      this.teamservice.JoinTeam(teamName).subscribe((joinRequest: ITeamJoinRequest)=>{
        this.joinRequest = joinRequest;
        console.log(this.joinRequest.id);
      });
      alert("Your request is been sent");
    }
  }
    // the submit button event click call on OnCreateTeam method
  OnCreateTeam(createTeamGroup:FormGroup):void{
    this.teamservice.CreateTeam(createTeamGroup.value).subscribe((createdTeam:any) =>{
      if(createdTeam){   
        sessionStorage.setItem('user_teamId',createdTeam.users[0].teamId.toString())
        sessionStorage.setItem('user_teamName',createdTeam.users[0].team.toString())
      }
      alert("Team created");
      
    })
    this.GetAllTeam();
    location.reload();
  }

}
