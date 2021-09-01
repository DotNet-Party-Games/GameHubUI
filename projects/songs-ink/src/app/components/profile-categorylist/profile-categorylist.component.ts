import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CustomCategory } from '../../models/CustomCategory';
import { CustomWord } from '../../models/CustomWord';
import { ProfileService } from '../../services/profile.service';
@Component({
  selector: 'app-profile-categorylist',
  templateUrl: './profile-categorylist.component.html',
  styleUrls: ['./profile-categorylist.component.css']
})
export class ProfileCategorylistComponent implements OnInit {

  @Output() onRemoveCategory: EventEmitter<string> = new EventEmitter();
  @Input() category: CustomCategory;
  words: CustomWord[];
  newWord: string;
  test: string;
  Word: CustomWord;
  wordAddCost: number = -100;
  constructor(private profileService: ProfileService) { }

  ngOnInit(): void {
    this.Word = 
    {
      CustomCategoryId: 0,
      customWordName: "",
      PlayerId: this.category.playerId
    }
    this.words = [];
    this.profileService.getCustomWords(this.category.id).subscribe( (response) => {
      this.words = response;
    })   
  }

  removeCategory(category: string)
  {
    this.onRemoveCategory.emit(category);
  }

  addWord(categoryId: number)
  {
    this.Word.CustomCategoryId = categoryId;
    this.Word.customWordName = this.newWord;
    this.Word.PlayerId = this.category.playerId;
    //might need to add player id
    this.profileService.addPlayerWord(this.Word).subscribe( (response) => {
      this.words.push(
        {
          id: response.id,
          PlayerId: this.Word.PlayerId,
          customWordName: this.Word.customWordName,
          CustomCategoryId: this.Word.CustomCategoryId
        }
      )
    }); 
  }

  removeWord(wordName: string)
  {
    let removeWord = this.words.find(word => word.customWordName == wordName);

    if(removeWord)
    {
      this.profileService.removePlayerWord(removeWord).subscribe( (result) => {
        const index = this.words.indexOf(removeWord, 0);
        this.words.splice(index, 1);
      })
    }
    else 
    {
      alert("That word does not exist");
      return;
    }
  }
}
