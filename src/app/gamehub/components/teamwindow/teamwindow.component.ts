import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-teamwindow',
  templateUrl: './teamwindow.component.html',
  styleUrls: ['./teamwindow.component.scss']
})
export class TeamwindowComponent implements OnInit {

  teams: {teamName:string, teamMembers:string[]}[]=[];
  constructor() { 
    this.teams.push({teamName:"klaus",teamMembers:["a","b","c"]});
    this.teams.push({teamName:"Iram",teamMembers:["aa","bb","cc"]});
    this.teams.push({teamName:"Sean",teamMembers:["aaa","bbb","ccc"]});
  }

  ngOnInit(): void {
  }

}
