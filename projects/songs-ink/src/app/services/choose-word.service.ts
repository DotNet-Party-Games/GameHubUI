import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ChooseWordService {

  private url = "https://revabox.eastus.cloudapp.azure.com/songsinkapi/api/Main/get4RandomWordsOfACategoryWithCategoryName";
  constructor(private http: HttpClient) { }

  getWords(category: string) {
    return this.http.get<any>(`${this.url}/${category}`);
  }
}
