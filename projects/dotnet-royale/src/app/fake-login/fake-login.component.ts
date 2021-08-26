import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-fake-login',
  templateUrl: './fake-login.component.html',
  styleUrls: ['./fake-login.component.css']
})
export class FakeLoginComponent implements OnInit {

  username: string;
  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  //This code is for test only - from here **********************************************************************

  fakeLogin() {
    sessionStorage.setItem('userName', this.username);
  }

  goToMain(){
    this.router.navigate(['game/dotnetroyale/main']);
  }

  //This code is for test only - to here ************************************************************************

}
