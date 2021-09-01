import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';
import { Subject, of, BehaviorSubject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  //public user: User | null = null;
  //private userSub = new Subject<User|null>();
  //public user = this.userSub.asObservable();
  public user = new BehaviorSubject<User|null>(null);

  constructor(private http: HttpClient, public auth: AuthService) { 
    this.auth.isAuthenticated$.subscribe(isAuth => {
      if (isAuth) {
        this.getUser();
      } else {
        this.user.next(null);
      }
    });
  }

  public getUser(): void {
    this.http.get<User>(`${environment.api.url}/user`)
      .subscribe(
        result => {
          console.log(result);
          this.user.next(result);
        },
        error => {
          console.log(error);
          console.log("Retrying to get user...")
          setTimeout(() => this.getUser(), 5000); 
        }
      );
  }
}
