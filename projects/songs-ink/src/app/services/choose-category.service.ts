import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class ChooseCategoryService {

  //private url = "https://localhost:5001/api/Main";
  private url = "https://revabox.eastus.cloudapp.azure.com/songsinkapi/api/Main";
  constructor(private http: HttpClient) { }

  getDefaultCategories() {
    return this.http.get<any>(`${this.url}/getAllCategories`);
  }

  getUserAndDefaultCategories(userID: number) {
    return this.http.get<string[]>(this.url);
  }
}
