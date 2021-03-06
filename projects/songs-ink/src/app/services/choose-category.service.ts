import { Injectable } from '@angular/core';
import { HttpClient} from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class ChooseCategoryService {
 private url = "https://revabox.eastus.cloudapp.azure.com/songsinkapi/api/Main";
  constructor(private http: HttpClient) { }

  getDefaultCategories() {
    return this.http.get<any>(`${this.url}/getAllCategories`);
  }

  getUserCategories(userID: number) {
    return this.http.get<string[]>(`${this.url}/${userID}`);
  }
}
