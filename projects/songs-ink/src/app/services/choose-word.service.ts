import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Word } from '../models/Word';
@Injectable({
  providedIn: 'root'
})
export class ChooseWordService {

  //private url = "https://localhost:5001/api/Main/get4RandomWordsOfACategoryWithCategoryName";
  private url = 'https://revabox.eastus.cloudapp.azure.com/songsinkapi/api/Main/get4RandomWordsOfACategoryWithCategoryName';
  constructor(private http: HttpClient) { }

  getWords(category: string) {
    return this.http.get<any>(`${this.url}/${category}`);
  }
}
