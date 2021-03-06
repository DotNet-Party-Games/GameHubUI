import { Component, OnInit, Input} from '@angular/core';
import { Player } from '../../models/Player';
@Component({
  selector: 'app-player-list-item',
  templateUrl: './player-list-item.component.html',
  styleUrls: ['./player-list-item.component.scss']
})
export class PlayerListItemComponent implements OnInit {

  @Input() player: Player;

  constructor() { 
    //empty
  }

  ngOnInit(): void { 
    //empty
  }

}
