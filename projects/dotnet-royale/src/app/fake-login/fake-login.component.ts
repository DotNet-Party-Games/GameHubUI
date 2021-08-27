import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-fake-login',
  templateUrl: './fake-login.component.html',
  styleUrls: ['./fake-login.component.css']
})
export class FakeLoginComponent implements OnInit {

  username: string;
  constructor(private router: Router, private route: ActivatedRoute) { }

  ngOnInit(): void {
  }

  //This code is for test only - from here **********************************************************************

  fakeLogin() {
    sessionStorage.setItem('userName', this.username);
  }

  goToMain(){
    this.router.navigate(['main'], { relativeTo: this.route });
  }

  //This code is for test only - to here ************************************************************************

}
