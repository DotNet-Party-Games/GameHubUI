import { Component, OnInit} from '@angular/core';
import { CustomCategory } from '../../models/CustomCategory';
import { CustomWord } from '../../models/CustomWord';
import { ProfileService } from '../../services/profile.service';
import { LeaderBoard } from '../../models/LeaderBoard';
import { UserService } from 'projects/hubservices/src/public-api';
import { SocketIoService } from '../../services/socketio.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  
  newWord: string;

  category: CustomCategory = {
    playerId: 0,
    customCategoryName: "",
    words: []
  }
  word: CustomWord = {
    PlayerId: 0,
    CustomCategoryId: 0,
    customWordName: ""
  }
  newCategory: string;
  wordAddCost: number = -100;
  categoryAddCost: number = -500;

  userCategories: CustomCategory[];
  userWords: CustomWord[];
  categoryName: string;

  player: LeaderBoard;

  constructor(private userService: UserService, private profApi: ProfileService, private socketService: SocketIoService) { }

  ngOnInit(): void {
    
    this.player = {
      currentScore: 0,
      overallScore: 0,
      nickName: ""
    };
    
    this.userService.user.subscribe( (response) => {
      this.player.nickName = <string>response.username;
    })
    this.profApi.getUserScore(this.player.nickName).subscribe( (response) => {
      if(response) {
        this.player.currentScore = response.currentScore;
        this.player.overallScore = response.overallScore;
        this.player.id = response.id;
        
        this.profApi.getCustomCategories(this.player.id).subscribe( (response) => {
          this.userCategories = response;
        })
      }
      else {
        this.profApi.addPlayer(this.player.nickName).subscribe( (response) => {
          this.player.id = response.id;
        })
      }
    })
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
          customCategoryName: result.customCategoryName,
          words: []
        }
      )
    });
  }

  removeCategory(category: string) {
    let removeCategory= this.userCategories.find(cat => cat.customCategoryName == category);
    if (removeCategory)
    {
        this.profApi.removeCategory(removeCategory).subscribe(result => {
          const index = this.userCategories.indexOf(removeCategory, 0);
          this.userCategories.splice(index, 1);
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
    this.word.customWordName = this.newWord;
    this.profApi.addPlayerWord(this.word);
  }

  removeWord(wordToRemove: string) {
  }
}
