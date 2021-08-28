import { Component, OnInit } from '@angular/core';
import { IGame } from '../services/game';
import { PartygameService } from '../services/partygame.service';
import { DataService } from '../services/data.service';

@Component({
  selector: 'app-gamelist',
  templateUrl: './gamelist.component.html',
  styleUrls: ['./gamelist.component.css']
})
export class GamelistComponent implements OnInit {

  games: IGame[];
  currentGameId: number;

  constructor(private partyGameApi: PartygameService, private data: DataService ) {}

  ngOnInit(): void {
    this.getGameList();
    console.log(this.games);
  }

  getGameList()
  {
    this.partyGameApi.getGames().subscribe((response: IGame[]) => { this.games = response });
  }

  setGameId(p_gameId: number)
  {
    this.data.changeGameId(p_gameId);
  }
}
