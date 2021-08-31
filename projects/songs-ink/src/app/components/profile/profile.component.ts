import { Component, OnInit} from '@angular/core';
import { CustomCategory } from '../../models/CustomCategory';
import { CustomWord } from '../../models/CustomWord';
import { ProfileService } from '../../services/profile.service';
import { LeaderBoard } from '../../models/LeaderBoard';
import { UserService } from 'projects/hubservices/src/public-api';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  
  newWord: string;

  category: CustomCategory = {
    playerId: 0,
    customCategoryName: ""
  }
  word: CustomWord = {
    PlayerId: 0,
    CustomCategoryId: 0,
    CustomWordName: ""
  }
  newCategory: string;
  wordAddCost: number = -100;
  categoryAddCost: number = -500;

  userCategories: CustomCategory[];
  userWords: CustomWord[];
  categoryName: string;

  player: LeaderBoard;

  constructor(private userService: UserService, private profApi: ProfileService) { }

  ngOnInit(): void {
    
    this.player = {
      currentScore: 0,
      overallScore: 0,
      nickName: ""
    };
    
    this.userService.user.subscribe(response => {
      this.player.nickName = <string>response?.username;
    });
    this.profApi.getUserScore(this.player.nickName).subscribe( (response => {
      if(response) {
        this.player.currentScore = response.currentScore;
        this.player.overallScore = response.overallScore;
        this.player.id = response.id;
      }
      else {
        this.profApi.addPlayer(this.player.nickName).subscribe( (response => {
          this.player.id = response.id;
        }))
      }
    }))

    this.userCategories = [];
  }
    
  addCategory() {  
    if(!this.newCategory) {
      alert("Please enter a category.");
      return;
    }
    if (this.player.currentScore < Math.abs(this.categoryAddCost)) {
      alert("You do not have enough points to add a category");
      return;
    }
    this.category.playerId = this.player.id;
    this.category.customCategoryName = this.newCategory;
    this.profApi.addCategory(this.category).subscribe( result => {
      this.userCategories.push(
        {
          id: result.id,
          playerId: result.playerId,
          customCategoryName: result.customCategoryName
        }
      )
    });
  }

  removeCategory(category: string) {
    let removeCategory= this.userCategories.find(cat => cat.customCategoryName == category);
    if (removeCategory)
    {
        this.profApi.removeCategory(removeCategory).subscribe(result => {
          this.userCategories = this.userCategories.filter(obj => obj !== result);
      }); 
    }
    else
    {
      alert("That category does not exist");
      return;
    }   
  }

  addWord() {
    if (!this.newWord) {
      alert("Please enter a word");
      return;
    }
    if (this.player.currentScore < Math.abs(this.wordAddCost)) {
      alert("You do not have enough points to add a word");
      return;
    }
    this.word.PlayerId = this.player.id;
    this.word.CustomWordName = this.newWord;
    this.profApi.addPlayerWord(this.word);
  }

  removeWord(wordToRemove: string) {
  }
}
