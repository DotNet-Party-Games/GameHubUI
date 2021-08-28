import { Component, OnInit } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss']
})
export class NavComponent implements OnInit {

  constructor(public auth: AuthService) { }

  ngOnInit(): void {
  }

  public login(): void {
    this.auth.loginWithPopup();
  }
  logout(): void {
    // Call this to log the user out of the application
    this.auth.logout({ returnTo: window.location.origin });
  }
}
