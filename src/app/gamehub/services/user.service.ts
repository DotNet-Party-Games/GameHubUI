import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';
import { Subject, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  public user: User | null = null;
  public errorMsg: string = "";

  constructor(private http: HttpClient, public auth: AuthService) { 
    this.auth.isAuthenticated$.subscribe(isAuth => {
      if (isAuth) {
        this.getUser();
      } else {
        this.user = null;
      }
    });
  }

  private getUser(): void {
    this.http.get<User>(`${environment.api.url}/user`)
      .subscribe(
        result => {
          console.log(result);
          this.user = result;
        },
        error => {
          console.log(error);
          setTimeout(() => this.getUser(), 5000); 
        }
      );
  }
}
