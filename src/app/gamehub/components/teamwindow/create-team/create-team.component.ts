import { Component, OnInit,OnChanges } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { IUser } from 'src/app/gamehub/interfaces/IUser';
import { ITeam } from 'src/app/gamehub/interfaces/ITeam';
import { TeamService } from 'src/app/gamehub/services/teamservice/team.service';

@Component({
  selector: 'app-create-team',
  templateUrl: './create-team.component.html',
  styleUrls: ['./create-team.component.scss']
})
export class CreateTeamComponent implements OnInit,OnChanges {

  createTeamGroup = new FormGroup({
    name : new FormControl(),
    description : new FormControl(),
  });

  constructor( private teamservice:TeamService) { }

  ngOnInit(): void {
  }
  
  ngOnChanges(){

  }

  // the submit button event click call on OnCreateTeam method
  OnCreateTeam(createTeamGroup:FormGroup):void{
    this.teamservice.CreateTeam(createTeamGroup.value).subscribe((createdTeam:any) =>{
      if(createdTeam){   
        sessionStorage.setItem('user_teamId',createdTeam.users[0].teamId.toString())
        sessionStorage.setItem('user_teamName',createdTeam.users[0].team.toString())
      }
      alert(""+createdTeam+"Team created");
    })
    
  }

}
