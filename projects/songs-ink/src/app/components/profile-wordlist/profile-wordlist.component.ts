import { Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { CustomWord } from '../../models/CustomWord';

@Component({
  selector: 'app-profile-wordlist',
  templateUrl: './profile-wordlist.component.html',
  styleUrls: ['./profile-wordlist.component.css']
})
export class ProfileWordlistComponent implements OnInit {
  @Output() onRemoveWord: EventEmitter<string> = new EventEmitter();
  @Input() word: CustomWord;
  faTimes = faTimes;

  constructor() { }

  ngOnInit(): void {

  }

  removeWord(word: CustomWord)
  {
    this.onRemoveWord.emit(word.customWordName);
  }
}
