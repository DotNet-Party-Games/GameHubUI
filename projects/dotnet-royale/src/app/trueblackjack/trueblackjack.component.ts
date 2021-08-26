import { Component, Input, OnInit } from '@angular/core';
import { Player } from "./player";
import { Hand } from "./hand";
import { Deck } from "./deck";
import { FormControl } from '@angular/forms';
@Component({
  selector: 'app-trueblackjack',
  templateUrl: './trueblackjack.component.html',
  styleUrls: ['./trueblackjack.component.css']
})
export class TrueblackjackComponent implements OnInit {
  deck: Deck;
  players: Array<Player> = [];
  dealerHand: Hand;
  bet = new FormControl('');
  // @Input() bet: number;
  Message : string;
  Turn : string;
  Money : string; 
  Cards : string;

  constructor() { }

  ngOnInit(): void {
  }

  blackJack() {
    console.log("This BlackJack Game has been created by David Garcia Morillo");
    let nOfDecks: number = 4 ;

    this.deck = new Deck(nOfDecks);
    this.dealerHand = new Hand(this.deck);
  
    this.startGame();
    while (true) {
      // TODO console.log("Game Started")
      console.log(`The first card of the dealer is ${this.dealerHand.cards[0]}`);
  
      // this.players.forEach(playerTurn);
  
      // this.dealerTurn();
      // this.endGame();
      // if (!this.nextGame()) break;
    }
    // rl.close();
 }
  startGame() {
  //const numberOfPeople: number = askNumberOfPeople();
  this.askAndSetPlayerAttributes(1);
  }

  // askNumberOfPeople(): number {
  //   let numberOfPeople: number = 4;
  
  //   return numberOfPeople;
  // }
  askAndSetPlayerAttributes(numberOfPeople: number) {
    for (let i = 1; i < numberOfPeople + 1; i++) {
      const name: string = "Stephen";
      this.players.push(new Player(name, 100, this.deck)); //100 is initial money
    }
  }

  // public set bet(v : number) 
  // {
  //   this.bet = v;
  // }

  
  // public get bet() : number {
  //   return this.bet;
  // }
    updateBet() {
      this.bet.setValue('');
    }

   askPlayerBet(player: Player) {
    while (true) {
      this.Message = 'What bet do you wanna make';
      const addBet = this.bet.value;
      if (addBet > player.actualMoney)
        this.Message = 'Your bet cannot be greater than your actual money.';
      else if (addBet <= 0) this.Message= 'Your bet must be greater than 0.';
      else {
        player.bet = addBet;
        break;
      }
    }
  }

  playerWinOrLose(hand: Hand): boolean {
    let result: boolean = false;
    const playerPoints = hand.points;
    if (playerPoints === 21) {
      if (hand.hasBlackJack()) this.Message= 'BLACKJACK!';
      else this.Message= 'YOU GOT 21 POINTS!';
  
      result = true;
    } else if (playerPoints === 0) {
      this.Message = "BUST.\tI'm afraid you lose this game :(.";
      result = true;
    }
    return result;
  }

  //Continue or not Check
  checkIfYes = (userDecision: string): boolean =>
  ["y", "yes", "1", "true"].includes(userDecision.trim().toLowerCase());

   askPlayerAction(): boolean {
    const decision: string = "y"; // Will always be yes so they will continue until player has no monies
    return this.checkIfYes(decision);
  }

  hit(){
   
  }

  playerTurn(player: Player) {
    this.Turn = `${player}'s turn `;
    this.Money= `Your current total is ${player.actualMoney}`;
  
    this.askPlayerBet(player);

    this.Cards = `${player.hands[0].cards[0]} and ${player.hands[0].cards[1]} (${player.hands[0].points} points)`;
  

    // for (const [i, hand] of player.hands.entries()) {
    //   // If the player has doubled, he can only hit one more time
    //   while (!this.playerWinOrLose(hand) && (hand.cards.length < 3)) {

    //     let breaking = false;
    //     switch (userDecision) {
    //       case "h":
    //       case "hit":
    //         player.hit(i);
    //         console.log(`Now, your cards are: ${hand}`);
    //         break;
  
    //       case "s":
    //       case "stand":
    //         console.log(`Player ${player} stood`);
    //         breaking = true;
    //         break;
  
    //       default:
    //         console.log(
    //           "Invalid command!\nAvailable Commands: (h)it, (s)tand"
    //         );
    //         break;
    //     }
    //     if (breaking) break;
    //   }
    // }
  }




}

