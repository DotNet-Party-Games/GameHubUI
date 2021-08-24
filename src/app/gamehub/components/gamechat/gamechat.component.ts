import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-gamechat',
  templateUrl: './gamechat.component.html',
  styleUrls: ['./gamechat.component.scss']
})
export class GamechatComponent implements OnInit {

  constructor(public userService: UserService) { }

  ngOnInit(): void {
    console.log(this.userService.user);
  }

}
