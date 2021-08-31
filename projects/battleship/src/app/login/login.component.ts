import { Component, Inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '@auth0/auth0-angular';
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent implements OnInit {

  constructor(public auth:AuthService, @Inject(DOCUMENT) private document:Document) { }

  async ngOnInit() { }

  login()
  {
    this.auth.loginWithRedirect();
  }

  logout()
  {
    this.auth.logout({returnTo: this.document.location.origin})
  }
}
