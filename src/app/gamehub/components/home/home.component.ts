import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  constructor(public auth: AuthService, private http: HttpClient) { }

  user: any;

  ngOnInit(): void {
    this.auth.user$.subscribe(result => this.user = result);
  }

  public getUserInfo(): void {
    console.log(this.user);
    this.http.get(`${environment.api.url}/user`).subscribe(result => console.log(result));
  }

 
}
