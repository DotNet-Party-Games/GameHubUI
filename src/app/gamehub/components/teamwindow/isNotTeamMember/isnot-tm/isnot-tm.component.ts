import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ITeam } from 'src/app/gamehub/interfaces/ITeam'; 
import { ITeamJoinRequest } from 'src/app/gamehub/interfaces/ITeamJoinRequest';
import { TeamService } from 'src/app/gamehub/services/teamservice/team.service'; 

@Component({
  selector: 'app-isnot-tm',
  templateUrl: './isnot-tm.component.html',
  styleUrls: ['./isnot-tm.component.scss']
})
export class IsnotTMComponent implements OnInit {

  joinRequest:ITeamJoinRequest | any;
  teams: ITeam[] | any;
  searchKey: string |any = '';
   constructor( private teamservice:TeamService) { }
 
   ngOnInit(): void {
     this.GetAllTeam();
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
     this.teamservice.GetSearchedTeamsByName(this.searchKey).subscribe((teamList : ITeam[])=>{
       this.teams = teamList;
     });
     console.log(this.searchKey);
     this.searchKey="";
   }

   // send a request to join a team
   OnJoinTeamRequest(teamName:string):void{
     if(teamName!=null){
      this.teamservice.JoinTeam(teamName).subscribe((joinRequest: ITeamJoinRequest)=>{
        this.joinRequest = joinRequest;
        console.log(this.joinRequest.id);
      });
     }
     
    
   }

}
