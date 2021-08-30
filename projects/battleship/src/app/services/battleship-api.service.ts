// import { HttpClient, HttpParams } from '@angular/common/http';
// import { Injectable } from '@angular/core';
// import { waitForAsync } from '@angular/core/testing';
// import { Observable } from 'rxjs';
// import { ChatService } from './chat.service';
// import { IGameAPI } from './gameboard';

// @Injectable({
//   providedIn: 'root'
// })
// export class BattleshipAPIService {
//   private url: string = "https://battleship-tsw.azurewebsites.net/api/";
//   private url = "https://localhost:5001/api/"

//   constructor(private http: HttpClient, private socketService:ChatService) { }

//   GetGameBoard(roomId: number): Observable<IGameAPI> {
//     let param = new HttpParams().set("roomNumber", roomId);
//     return this.http.get<IGameAPI>(this.url + "GameBoard/get/", { params: param })
//   }

//   Attack(roomId: number, userId: string, x: number, y: number, z: number): Observable<IGameAPI> {
//     let attackBody = new HttpParams({
//       fromObject: {
//         'roomNumber': roomId,
//         'userId': userId,
//         'x': x,
//         'y': y,
//         'z': z
//       }
//     });
//     let param = new HttpParams().set("roomNumber", roomId).set('userId', userId).set('x', x).set('y', y).set('z', z);
//     return this.http.put<IGameAPI>(this.url + "GameBoard/Attack/", attackBody, { params: param });
//   }

//   SetUp(roomNumber:number, user1Id:string, user2Id:string): Observable<IGameAPI>{
//     let setupBody = new HttpParams({
//       fromObject: {
//         'roomNumber': roomNumber,
//         'user1Id': user1Id,
//         'user2Id': user2Id
//       }
//     });
//     let param = new HttpParams().set('roomNumber', roomNumber).set('user1Id', user1Id).set('user2Id', user2Id);
//     return this.http.put<IGameAPI>(this.url + "GameBoard/SetUp", setupBody, {params: param});
//   }

//   Reset(roomNumber: number): Observable<IGameAPI> {
//     let param = new HttpParams().set("roomNumber", roomNumber);
//     return this.http.get<IGameAPI>(this.url + "GameBoard/reset/", { params: param })
//   }

//   PlaceShip(roomNumber:number, userId:string, shipId:number, x:number, y:number, z:number, horizontal:boolean){
//     let placeshipbody = new HttpParams({
//       fromObject: {
//         'roomNumber': roomNumber,
//         'userId': userId,
//         'shipId': shipId,
//         'x': x,
//         'y': y,
//         'z': z,
//         'horizontal': horizontal
//       }
//     });
//     let param = new HttpParams().set('roomNumber', roomNumber).set('userId', userId).set('shipId', shipId).set('x', x).set('y', y).set('z', z).set('horizontal', horizontal);
//     return this.http.put<IGameAPI>(this.url + "GameBoard/PlaceShip", placeshipbody, {params: param});
//   }

//   DeployShips(roomNumber:number, userId:string): Observable<IGameAPI>{
//     let deployshipsbody = new HttpParams({
//       fromObject: {
//         'roomNumber': roomNumber,
//         'userId': userId
//       }
//     });
//     let param = new HttpParams().set('roomNumber', roomNumber).set('userId', userId);
//     return this.http.put<IGameAPI>(this.url + "GameBoard/DeployShips", deployshipsbody, {params: param});
//   }
// }
