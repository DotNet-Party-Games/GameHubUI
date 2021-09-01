import { AfterViewInit, Component, OnInit } from '@angular/core';

import { IScore } from '../services/score';
import { PartygameService } from '../services/partygame.service';
import { ILoggedUser } from '../services/user';
import { ActivatedRoute,Router } from '@angular/router';
import { SocketioService } from '../services/socketio/socketio.service';
import { Subscription } from 'rxjs';
import { gamestate } from './bjgamestate';
import { TeamLeaderboardService } from '../../../../hubservices/src/public-api';

// interface for individual player
export interface Blackjack {
  name: string; // player name
  player : any[]; // The player's current hand
  ppoints : number; // The player's current points
  pstand : boolean; // Player has stood
  winner: boolean; // denotes if player won or not
}

@Component({
  selector: 'app-blackjack',
  templateUrl: './blackjack.component.html',
  styleUrls: ['./blackjack.component.css']
})
export class BlackjackComponent implements OnInit, AfterViewInit {
  // dealer variables moved here
  deck: any[]; // overall deck for everyone
  dealer : any[]; // The dealer's current hand
  dpoints : number; // The dealer's current points
  safety : number = 17; // Computer will stand on or past this point
  dstand : boolean; // Dealer has stood
  dwinner: boolean; // Dealer wins game

  // id for room
  public roomId: string;
  // subscription to get players
  playerSub: Subscription;
  // variable to limit gettingplayers call to once
  getPlayers: boolean = false;

  //cards
  dsymbols: any[] = ["♥", "♦", "♣", "♠"] // symbols for suits
  dnum: any = { 1 : "A", 11 : "J", 12 : "Q", 13 : "K" }; // Card numbers

  // keeps track if a game has started or not
  // manages visibility of buttons on html page
  gameStarted: boolean = false;

  // get player 1 information
  thisPlayer: number;

  // player array will be used when instantiating bjplayers

  players: string[];
  // player objects will be placed here
  bjplayers: Blackjack[] = [];
  // will keep track of turns based on bjplayers array
  turn: number = 0;
  sentScore: boolean= false;
  // declare gamestate for a player
  gameState: gamestate = {
    deck: [], // overall game deck

    players: [], // array to hold player objects

    gameStarted: false, // denotes if game started or not

    dealer : [], // The dealer's current hand
    dpoints : 0, // The dealer's current points
    safety : 17, // Computer will stand on or past this point
    dstand : false, // Dealer has stood
    dwinner: false, // Dealer wins game

    turn: this.turn // counting player's turn based on 0 index
  }

  finalScore : IScore = {
    gamesId: null,
    userName: null,
    score: null,
  }

  public currentUser:ILoggedUser;
   // constructor to initialize socket use amongst other services
  constructor(private partyGameApi: PartygameService, private router: Router, private socketService: SocketioService, private route: ActivatedRoute,private leaderboardService: TeamLeaderboardService) {
    this.currentUser =
    {
      id: 0,
      password: "",
      userName: ""
    }
    this.currentUser.id = parseInt(sessionStorage.getItem('userId'));
    this.currentUser.userName = sessionStorage.getItem('userName');
    this.currentUser.password = sessionStorage.getItem('userPassword');
  }

  ngAfterViewInit() {
    //this.sendBlackJackData(bj);
    // will handle room stuff
    this.shouldStand(this.turn);
    // initializes game
  }

  ngOnInit(): void {
    this.roomId = sessionStorage.getItem('roomId');
    this.playerSub = this.socketService.findPlayers().subscribe(data => {
      if(!this.getPlayers) {
        // log data received from server
        console.log(data);
        // get all player data
        this.players = data;
        // ready player objects playing blackjack
        this.readyPlayers();
        // makes sure only first player commences game
        this.thisPlayer = this.players.indexOf(this.currentUser.userName);
        console.log("This player number: ");
        console.log(this.thisPlayer);

        if(this.thisPlayer == 0) {
          // start game
          this.start();
        }
      }
      this.getPlayers = true;
    });

    // get info from getplayers method in socket service
    this.socketService.getPlayers({ room: this.roomId });
    // subscribe to socketservice function
    this.socketService.getBlackJackData().subscribe(data => {
      console.log("received data");
      console.log(data);
      // set local object array to gamestate array
      this.gameState = data;
      this.bjplayers = this.gameState.players;
      this.dealer = this.gameState.dealer;
      this.dpoints= this.gameState.dpoints;
      this.safety = this.gameState.safety;
      this.dstand = this.gameState.dstand;
      this.dwinner = this.gameState.dwinner;
      this.turn = this.gameState.turn;
      this.gameStarted=this.gameState.gameStarted;
      this.deck = this.gameState.deck;
      let currentTurn = this.turn;

      if(this.turn != currentTurn)
      {
        this.sendBlackJackData(this.gameState);
      }

      if(!this.gameState.gameStarted && !this.sentScore)
      {
        this.sentScore = true;
        console.log("this should only be called once");
        if(this.bjplayers[this.thisPlayer].winner)
      {
          this.finalScore.gamesId = 2;
          this.finalScore.score = 1;
          this.finalScore.userName = sessionStorage.getItem('userName');
          this.partyGameApi.addscore(this.finalScore).subscribe(data =>
            {this.partyGameApi.updateBlackJackStats(this.finalScore).subscribe();
            });
          this.leaderboardService.submitScore("partygames",1);
      }else
      {
        this.finalScore.gamesId = 2;
        this.finalScore.score = 0;
        this.finalScore.userName = sessionStorage.getItem('userName');
        this.partyGameApi.addscore(this.finalScore).subscribe(data =>
          {this.partyGameApi.updateBlackJackStats(this.finalScore).subscribe();
          });
      }
      }
      this.socketService.getAudioTrigger().subscribe(data2 => {
        this.playSFX(data2);
      })
    });
  }

  sendBlackJackData(gameState: gamestate)
  {
    // make sure proper data being sent
    console.log(gameState);
    // send information through socket service to server
    this.socketService.sendBlackJackData({game: gameState, room: this.roomId});
  }

  goToRoom(){
    // change to reroute to blackjack room
    this.router.navigate(['room'], { relativeTo: this.route.parent });
  }
  shouldStand(pNum: number)
  {
    if(this.bjplayers[pNum].pstand)
    {
      this.turn++;
      this.gameState.turn=this.turn;
    }
  }
  // array to declare objects based on users in room
  readyPlayers() {
    for(let player of this.players)
    {
      let bj = {
        name: player,
        player : [], // The player's current hand
        ppoints : 0, // The player's current points
        pstand : false, // Player has stood
        winner : false // if player won or not
      }
      // push player object to bjplayers array
      this.bjplayers.push(bj);
    }
    // player object goes to gamestate
    this.gameState.players=this.bjplayers;
  }

  // will be called when player presses start button
  start() {
    // add gamestates as well
    // game has now started for certain html tags
    this.gameStarted = true;
    this.gameState.gameStarted = true;
    // player 1 goes first (mind the 0 index)
    this.turn = 0;
    this.gameState.turn = this.turn;
    // deck array emptied to be repopulated
    this.deck = [];
    // dealer hand set to empty
    this.dealer = [];
    // dealer points set to zero
    this.dpoints = 0;
    // hasnt gone, so dealer hasnt stood yet
    this.dstand = false;
    // hasnt won
    this.dwinner = false;
    this.gameState.dwinner=false;

    // (C2) RESHUFFLE DECK
    // S: SHAPE (0 = HEART, 1 = DIAMOND, 2 = CLUB, 3 = SPADE)
    // N: NUMBER (1 = ACE, 2 TO 10 = AS-IT-IS, 11 = JACK, 12 = QUEEN, 13 = KING)
    for (let i=0; i<4; i++) {
      for (let j=1; j<14; j++) {
        this.deck.push({s : i, n : j});
      }
    }

    for (let i = this.deck.length - 1; i > 0; i--) {
      let j = Math.floor(Math.random() * i);
      let temp = this.deck[i];
      this.deck[i] = this.deck[j];
      this.deck[j] = temp;
    }

    // add shuffled deck to gamestate
    this.gameState.deck = this.deck;

    // for players
    for(let i = 0; i < this.bjplayers.length; i++) {
      // player hand is set empty
      this.bjplayers[i].player = [];
      // player cant stand yet
      this.bjplayers[i].pstand = false;
      // player set to not winning initially
      this.bjplayers[i].winner = false;
      // draw first card
      this.draw(i);

      // draw second card
      this.draw(i);
      // calculate points
      this.points(i);
      if(this.bjplayers[i].ppoints == 21) {
        this.bjplayers[i].pstand = true;
        this.gameState.players = this.bjplayers;
      }

    }

    // for dealer
    // draw two cards
    this.draw(42);
    this.draw(42);
    // calculate dealer points
    this.points(42);
    this.shouldStand(0);
    this.sendBlackJackData(this.gameState);
  }

  // (D) DRAW A CARD FROM THE DECK
  draw(i : number) {
    // pop card from deck
    let card = this.deck.pop();
    this.gameState.deck=this.deck;
    // set dealer index to arbitrary 42 number
    // dealer gets card pushed to hand array
    if(i == 42) {
      this.dealer.push(card);
      // add card to dealer gamestate

      this.gameState.dealer = this.dealer;
    }

    // (D3) PLAYER'S CARD
    else {
      this.bjplayers[i].player.push(card);
      // add card to player gamestate
      this.gameState.players[i].player=this.bjplayers[i].player;

      console.log("Deal player card");
      console.log(this.gameState.players[i].player);
      console.log(this.bjplayers[i].player);
    }
  }

  // when player or dealer hits
  hit(i : number) {
    // for dealer
    if(i == 42) {
      this.draw(i);
      this.points(42);
    }
    else {
      //(G1) DRAW A NEW CARD
      this.draw(i);
      this.points(i);


      // if player points go over 21, auto stand
      if(this.bjplayers[i].ppoints > 21) {
        this.stand(i);
        this.playSFX("oof");
      }
      // same auto stand for 21
      else if(this.bjplayers[i].ppoints == 21) {
        this.playSFX("21");
        this.stand(i);

      }
      this.socketService.sendAudioTrigger({ audioFile: "hit", room: this.roomId });
      // no else after previous two blocks, give stand option for user with button
    }
    console.log("Sending gamestate in draw");
    console.log(this.gameState);
    this.sendBlackJackData(this.gameState);
  }

  // when player or dealer stands
  stand(i: number) {
    // make stand variable true
    this.bjplayers[i].pstand = true;
    this.gameState.players[i].pstand = true;

    // if last player goes and game is still going, call dealer ai to finish game
    if(this.turn == this.bjplayers.length - 1) {
      while(this.gameStarted) {
        console.log("in while loop");
        this.ai();
      }
    }
    // otherwise pass turn to next player
    else {
      this.turn++;
      // update turn in the gamestate
      this.gameState.turn += 1;
    }
    this.sendBlackJackData(this.gameState);
  }

  // calculate dealer or player points
  points(j: number) {
    

    var calc = this.calcPoints(j);
    var aces = calc[0];
    var points = calc[1];
    // (E2) CALCULATIONS FOR ACES
    // NOTE: FOR MULTIPLE ACES, WE CALCULATE ALL POSSIBLE POINTS AND TAKE HIGHEST.
    if (aces!=0) {
      var minmax = [];
      for (let elevens=0; elevens<=aces; elevens++) {
        let calc = points + (elevens * 11) + (aces-elevens * 1);
        minmax.push(calc);
      }
      points = minmax[0];
      for (let i of minmax) {
        if (i > points && i <= 21) { points = i; }
      }
    }

    this.updatePoints(j,points);

  }
  calcPoints(j:number)
  {
    // (E1) RUN THROUGH CARDS
    // TAKE CARDS 1-10 AT FACE VALUE + J, Q, K AT 10 POINTS.
    // DON'T CALCULATE ACES YET, THEY CAN EITHER BE 1 OR 11.
    var aces = 0, points = 0;

    // calculate points based on aces in deck
    for (let i of (j == 42 ? this.dealer : this.bjplayers[j].player)) {
      if (i.n == 1) { aces++; }
      else if (i.n>=11 && i.n<=13) { points += 10; }
      else { points += i.n; }
    }
    return [aces, points];
  }
  updatePoints(j: number, points: number )
  {
// (E3) UPDATE POINTS
    // update dealer points
    if (j == 42) {
      this.dpoints = points;
      // add points to dealer gamestate
      this.gameState.dpoints = this.dpoints;
    }
    // add points to player points
    else {
      this.bjplayers[j].ppoints = points;
      // add points to player gamestate
      this.gameState.players[j].ppoints = this.bjplayers[j].ppoints;
    }

  }

  // manages dealer choices at end of game
  ai() {
    // if dealer points are greater than or equal to 17
    if(this.dpoints >= this.safety) {
      // check function called to see who won
      this.check();
      // game set to false, so play button shows up on webpage
      this.gameStarted = false;
      this.gameState.gameStarted = false;
    }
    else {
      // otherwise, hit if below 17 for dealer
      this.hit(42);
    }
  }

  // checks for winners at end of game
  check() {
    // if dealer busts
    if(this.dpoints > 21) {
      this.checkWhenDealerBusts();
    }
    // if dealer gets 21
    else if (this.dpoints == 21) {
      this.checkWhenDealerHas21
    }
    // if dealer has less than 21
    else {
      this.checkWhenDealerBusts
    }
    // send final game data after game ends
    this.sendBlackJackData(this.gameState);
  }
checkWhenDealerBusts(){
  for(let i = 0; i < this.bjplayers.length; i++) {
    // players who dont bust win
    if(this.bjplayers[i].ppoints <= 21) {
      this.bjplayers[i].winner = true;
      // add winner boolean to gamestate
      this.gameState.players[i].winner = true;
    }
  }
}
checkWhenDealerHas21()
{
  // make dealer winning true
  this.dwinner = true;
  for(let i = 0; i < this.bjplayers.length; i++) {
    // players who get 21 still win
    if(this.bjplayers[i].ppoints == 21) {
      this.bjplayers[i].winner = true;
      // add winner boolean to gamestate
      this.gameState.players[i].winner = true;
    }
  }
}
checkWhenDealerLess21()
{
      // create variable to count how many players have higher points than dealer
      let betterThanDealer: number = 0;
      for(let i = 0; i < this.bjplayers.length; i++) {
        // if player has more than dealer and less than or equal to 21, they win
        if(this.bjplayers[i].ppoints > this.dpoints && this.bjplayers[i].ppoints <= 21) {
          this.bjplayers[i].winner = true;
          // add winner boolean to gamestate
          this.gameState.players[i].winner = true;
          // increment great than dealer variable
          betterThanDealer++;
        }
      }
      // if no player has higher points, or busts, dealer wins
      if(betterThanDealer == 0) {
        this.dwinner = true;
        // add winner boolean to gamestate
        this.gameState.dwinner = true;
      }
}



  playMusic()
  {
    let audio = <HTMLAudioElement>document.getElementById('bgmusic');
    audio.volume= 0.1;
    audio.src = "";
    audio.load();
    audio.play();
  }
  playSFX(audioCue: string)
  {
    let audio = <HTMLAudioElement>document.getElementById('sfx');
    audio.volume= 0.1;
    audio.src = "assets/dotnet-royale/" + audioCue + ".mp3";
    //src\assets\sounds
    //\src\app\blackjack
    audio.load();
    audio.play();
  }



}
