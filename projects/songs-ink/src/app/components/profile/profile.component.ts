import { Component, OnInit, Input } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';
import { Profile } from '../../models/Profile';
import { CustomCategory } from '../../models/CustomCategory';
import { CustomWord } from 'src/app/models/CustomWord';
import { ProfileService } from '../../services/profile.service';
import { RouterModule } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { SocketIoService } from 'src/app/services/socketio.service';
import { LeaderBoard } from 'src/app/models/LeaderBoard';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  currentPlayer: Profile = {
    currentScore: 0,
    email: "",
    playerScore: 0,
    playerName: "",
    gamesPlayed: 0,
    id: 0,
    customWords: []
  };
  tempName: string | undefined;
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
  newName: string = "";
  wordAddCost: number = -100;
  categoryAddCost: number = -250;

  userCategories: CustomCategory[];
  categoryName: string;

  player: LeaderBoard;

  constructor(private profApi: ProfileService, public auth: AuthService, private socketService: SocketIoService) { }

  ngOnInit(): void {
    // on startup get the profile from the data base
    this.userCategories = [];
    this.player = {
      currentScore: 0,
      overallScore: 0,
      nickName: ""
    };
    this.auth.user$.subscribe(
      (response) => {
        this.player.nickName = <string>response?.nickname;
        this.getUserInfo(this.player.nickName);
        // this.currentPlayer.email = response?.email;
        // this.tempName = response?.nickname; // should always be defined 
        // this.getUserInfo(this.currentPlayer.email!);
      }
    );
  }


  getUserInfo(p_nickName: string) {
    this.profApi.getUserScore(p_nickName).subscribe(
      (response) => {
        this.player.currentScore = response.currentScore;
        this.player.overallScore = response.overallScore;
        this.player.id = response.id;
        // this.currentPlayer.id = response.id;
        // this.currentPlayer.playerName = response.playerName;
        // this.currentPlayer.gamesPlayed = response.gamesPlayed;
        // this.currentPlayer.currentScore = response.currentScore;
        // this.currentPlayer.playerScore = response.playerScore;
        // this.currentPlayer.customWords = response.customWords;
        // this.socketService.currentLoggedIn = response;
        if(response.id)
        {
          this.profApi.getCustomCategories(<number>this.player.id).subscribe(response => {
            for (let item of response)
            {
              this.userCategories.push(
                {
                  id: item.id,
                  playerId: item.playerId,
                  customCategoryName: item.customCategoryName                }
              )
            }
          });
        }
        if (response.playerName) {
          this.socketService.SetUsername(response.playerName)
        }
      }, (error) => {
        //If the backend is unable to find the profile from the email then
        //it throws an error, when it does it creates the player profile
        this.currentPlayer.playerName = this.tempName;
        
        this.profApi.addPlayerProfile(this.currentPlayer).subscribe(
          (response) => {
            this.currentPlayer.id = response.id;
            if (response.playerName) {
              this.socketService.SetUsername(this.tempName!)
            }
          }
        );
      }
    );
  }
  // I think having the parameter is irrelevant since the current profile is the only
  // one being updated but Ill leave it like this.
  updatePlayerProfile(profile: Profile) {
    this.profApi.updatePlayerProfile(profile).subscribe();
  }

  addCategory() {  
    if(!this.newCategory) {
      alert("Please enter a category.");
      return;
    }
    if (this.currentPlayer.currentScore < Math.abs(this.categoryAddCost)) {
      alert("You do not have enough points to add a category");
      return;
    }
    this.category.playerId = this.currentPlayer.id;
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

  addCustomWord() {
    if (!this.newWord) {
      alert("Please enter a word");
      return;
    }
    
    if (this.currentPlayer.currentScore < Math.abs(this.wordAddCost)) {
      alert("You do not have enough points to add a word");
      return;
    }

    this.word.PlayerId = this.currentPlayer.id;
    this.word.CustomWordName = this.newWord;
    this.profApi.addPlayerWord(this.word);

  }

  addWord() {
    if (!this.newWord) {
      alert("Please enter a word");
      return;
    }
    
    if (this.currentPlayer.currentScore < Math.abs(this.wordAddCost)) {
      alert("You do not have enough points to add a word");
      return;
    }
  
    this.profApi.getUserInfo(this.currentPlayer.email!).subscribe(
      (response) => {
        this.currentPlayer.id = response.id;
        this.currentPlayer.playerName = response.playerName;
        this.currentPlayer.gamesPlayed = response.gamesPlayed;
        this.currentPlayer.currentScore = response.currentScore;
        this.currentPlayer.playerScore = response.playerScore;
        this.currentPlayer.customWords = response.customWords;

        this.currentPlayer.customWords.push(this.newWord);
        this.currentPlayer.currentScore += this.wordAddCost;
        this.newWord = "";
        this.updatePlayerProfile(this.currentPlayer);
      });

  }
  removeWord(wordToRemove: string) {


    this.profApi.getUserInfo(this.currentPlayer.email!).subscribe(
      (response) => {
        this.currentPlayer.id = response.id;
        this.currentPlayer.playerName = response.playerName;
        this.currentPlayer.gamesPlayed = response.gamesPlayed;
        this.currentPlayer.currentScore = response.currentScore;
        this.currentPlayer.playerScore = response.playerScore;
        this.currentPlayer.customWords = response.customWords;
        let index = this.currentPlayer.customWords.indexOf(wordToRemove);
        if (index > -1) // if index is >= to len of arr then it is -1 
        {
          this.currentPlayer.customWords.splice(index, 1); //removes the word to be removed
        }
        this.updatePlayerProfile(this.currentPlayer); //update player profile with new list
      });
  }
  changeUserName() {

    this.profApi.getUserInfo(this.currentPlayer.email!).subscribe(
      (response) => {
        this.currentPlayer.id = response.id;
        this.currentPlayer.playerName = response.playerName;
        this.currentPlayer.gamesPlayed = response.gamesPlayed;
        this.currentPlayer.currentScore = response.currentScore;
        this.currentPlayer.playerScore = response.playerScore;
        this.currentPlayer.customWords = response.customWords;
        if (!this.newName || this.newName == this.currentPlayer.playerName) {
          alert("Please enter a new usename");
          return;
        }
        this.currentPlayer.playerName = this.newName;
        this.socketService.SetUsername(this.currentPlayer.playerName);
        this.updatePlayerProfile(this.currentPlayer);
        this.newName = "";
      });
  }

}
