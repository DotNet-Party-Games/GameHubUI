import { AfterViewInit, Component, OnInit } from '@angular/core';
import { ReservedOrUserEventNames } from 'socket.io-client/build/typed-events';
import { BlackjackService } from '../services/blackjack/blackjack.service';
import { IScore } from '../services/score';
import { PartygameService } from '../services/partygame.service';
import { ILoggedUser } from '../services/user';
import { ActivatedRoute, Router } from '@angular/router';
import { sortAndDeduplicateDiagnostics } from 'typescript';

export interface Blackjack {

  hdstand : any; // dealer stand
  hdpoints : any; // dealer points
  hdhand : any; // dealer hand
  hpstand : any; // player stand
  hppoints : any; // player points
  hphand : any; // player hand
  hpcon : any; // player controls

  deck : any[]; // The current deck of cards
  dealer : any[]; // The dealer's current hand
  player : any[]; // The player's current hand
  dpoints : number; // The dealer's current points
  ppoints : number; // The player's current points
  safety : number; // Computer will stand on or past this point
  dstand : boolean; // Dealer has stood
  pstand : boolean; // Player has stood
  turn : number; // Who's turn now? 0 for player, 1 for dealer (computer)
  winner: any;
  players: any[];
}


@Component({
  selector: 'app-blackjack',
  templateUrl: './blackjack.component.html',
  styleUrls: ['./blackjack.component.css']
})
export class BlackjackComponent implements OnInit, AfterViewInit {
  players: any = ["Suraj", "Satyam"];

  currentTurn: number = 0;
  turn: number = 0;

  finalScore : IScore = {
    gamesId: null,
    userName: null,
    score: null,
  }

  public currentUser:ILoggedUser;
  constructor(private partyGameApi: PartygameService, private blackjackservice: BlackjackService, private router: Router, private route: ActivatedRoute) {
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
  ngAfterViewInit(): void {
    bj.hdstand = document.getElementById("deal-stand");
    bj.hdpoints = document.getElementById("deal-points");
    bj.hdhand = document.getElementById("deal-cards");
    bj.hpstand = document.getElementById("play-stand0");
    bj.hppoints = document.getElementById("play-points0");
    bj.hphand = document.getElementById("play-cards0");

    bj.hpstand2 = document.getElementById("play-stand1");
    bj.hppoints2 = document.getElementById("play-points1");
    bj.hphand2 = document.getElementById("play-cards1");

    bj.hpstand3 = document.getElementById("play-stand2");
    bj.hppoints3 = document.getElementById("play-points2");
    bj.hphand3 = document.getElementById("play-cards2");

    bj.hpstand4 = document.getElementById("play-stand3");
    bj.hppoints4 = document.getElementById("play-points3");
    bj.hphand4 = document.getElementById("play-cards3");

    bj.players = this.players;
    bj.hpcon = document.getElementById("play-control");
    bj.winner = document.getElementById("winner");
    // onclick events
    document.getElementById("playc-start").addEventListener("click", bj.start);
    //this.sendBlackJackData(bj);
    document.getElementById("playc-hit").addEventListener("click", bj.hit);
    //this.sendBlackJackData(bj);
    document.getElementById("playc-stand").addEventListener("click", bj.stand);
    this.sendBlackJackData(bj);

    this.selectGameRoomHandler();
  }

  public roomId: string;
  ngOnInit(): void {
    bj.hdstand = document.getElementById("deal-stand");
    bj.hdpoints = document.getElementById("deal-points");
    bj.hdhand = document.getElementById("deal-cards");
    bj.hpstand = document.getElementById("play-stand0");
    bj.hppoints = document.getElementById("play-points0");
    bj.hphand = document.getElementById("play-cards0");

    bj.hpstand2 = document.getElementById("play-stand1");
    bj.hppoints2 = document.getElementById("play-points1");
    bj.hphand2 = document.getElementById("play-cards1");

    bj.hpstand3 = document.getElementById("play-stand2");
    bj.hppoints3 = document.getElementById("play-points2");
    bj.hphand3 = document.getElementById("play-cards2");

    bj.hpstand4 = document.getElementById("play-stand3");
    bj.hppoints4 = document.getElementById("play-points3");
    bj.hphand4 = document.getElementById("play-cards3");

    bj.hpcon = document.getElementById("play-control");
    bj.winner = document.getElementById("winner");
    // onclick events
    document.getElementById("playc-start").addEventListener("click", bj.start);
    //this.sendBlackJackData(bj);
    document.getElementById("playc-hit").addEventListener("click", bj.hit);
    //this.sendBlackJackData(bj);
    document.getElementById("playc-stand").addEventListener("click", bj.stand);
    this.sendBlackJackData(bj);

    this.selectGameRoomHandler();
  }

  start() {
    this.sendBlackJackData(bj);
  }

  hit() {
    this.sendBlackJackData(bj);
    this.currentTurn++;
    this.turn = this.currentTurn % this.players.length;
    // if(this.currentPlayer == 1 && 1 < this.playerLength) {
    //   this.currentPlayer = 2;
    // }
    // else if(this.currentPlayer == this.playerLength) {
    //   this.currentPlayer -= 1;
    // }

    // if(this.currentPlayer == 2 && 2 < this.playerLength) {
    //   this.currentPlayer = 3;
    // }
  }

  stand() {
    this.sendBlackJackData(bj);
    this.currentTurn++;
    this.turn = this.currentTurn % this.players.length;
  }


  selectGameRoomHandler(): void
  {
      this.roomId = '4';
      // this.currentUser.userName = 'Stephen';
      //this.join(this.currentUser.userName,this.roomId);
      for(let i = 0; i < this.players.length; i++) {
        this.join(this.players[i], this.roomId);
      }

  }

  join (username:string, roomId:string):void{
    this.blackjackservice.joinRoom({user:username, room:roomId});
  }

  sendBlackJackData(blackjack: Blackjack)
  {
    console.log(blackjack);
    this.blackjackservice.sendBlackJackData({blackjack: bj});
  }

  goToRoom(){
    // change to reroute to blackjack room
    this.router.onSameUrlNavigation = 'reload';
    this.router.navigate(['blackjack'], { relativeTo: this.route } );
  }

}


var bj = {

  hdstand : null, // dealer stand
  hdpoints : null, // dealer points
  hdhand : null, // dealer hand
  hpstand : null, // player stand
  hppoints : null, // player points
  hphand : null, // player hand
  hpstand2 : null, // player2 stand
  hppoints2 : null, // player2 points
  hphand2 : null, // player2 hand
  hpstand3 : null, // player3 stand
  hppoints3 : null, // player3 points
  hphand3 : null, // player3 hand
  hpstand4 : null, // player4 stand
  hppoints4 : null, // player4 points
  hphand4 : null, // player4 hand
  hpcon : null, // player controls
  players: [], // amount of players(do length) + string names
  deck : [], // The current deck of cards
  dealer : [], // The dealer's current hand
  player : [], // The player's current hand
  player2 : [],
  player3 : [],
  player4 : [],
  dpoints : 0, // The dealer's current points
  ppoints : 0, // The player's current points
  ppoints2 : 0,
  ppoints3 : 0,
  ppoints4 : 0,
  safety : 17, // Computer will stand on or past this point
  dstand : false, // Dealer has stood
  pstand : false, // Player has stood
  pstand2: false,
  pstand3 : false,
  pstand4 : false,
  turn : 0, // Who's turn now? 0 for dealer(computer), 1 for player , 2 for player2, 3 for player3, 4 for player4
  winner: null,
  winner2: null,
  winner3: null,
  winner4: null,


  // new game
  start : function () {
    // refresh the page
    //this.Blackjack.ngOnInit();
    // (C1) RESET POINTS, HANDS, DECK, TURN, AND HTML
    bj.deck = [];  bj.dealer = [];  bj.player = []; bj.player2= [];// bj.player3 = []; bj.player4 = [];
    bj.dpoints = 0;  bj.ppoints = 0; bj.ppoints2 = 0;// bj.ppoints3 = 0; bj.ppoints4 = 0;
    bj.dstand = false;  bj.pstand = false; bj.pstand2 = false;// bj.pstand3 = false; bj.pstand4 = false;
    bj.hdpoints.innerHTML = "?"; bj.hppoints.innerHTML = 0; bj.hppoints2.innerHTML = 0;  //bj.hppoints3.innerHTML = 0;  bj.hppoints4.innerHTML = 0;
    bj.hdhand.innerHTML = ""; bj.hphand.innerHTML = ""; bj.hphand2.innerHTML = "";// bj.hphand3.innerHTML = ""; bj.hphand4.innerHTML = "";
    // bj.hdpoints.value = 0;
    // console.log(`Dealer points is ${bj.hdpoints.value}`);
    // bj.hppoints.value = 0;
    // console.log(`Player points is ${bj.hppoints.value}`);
    // bj.hdhand.value = ""; bj.hphand.value = "";
    bj.hdstand.classList.remove("stood");
     bj.hpstand.classList.remove("stood");
     bj.hpstand2.classList.remove("stood");
    // bj.hpstand3.classList.remove("stood");
    // bj.hpstand4.classList.remove("stood");
     bj.hpcon.classList.add("started");
    bj.winner.innerHTML=null;


    // (C2) RESHUFFLE DECK
    // S: SHAPE (0 = HEART, 1 = DIAMOND, 2 = CLUB, 3 = SPADE)
    // N: NUMBER (1 = ACE, 2 TO 10 = AS-IT-IS, 11 = JACK, 12 = QUEEN, 13 = KING)
    for (let i=0; i<4; i++) { for (let j=1; j<14; j++) {
      bj.deck.push({s : i, n : j});
    }}
    for (let i=bj.deck.length - 1; i>0; i--) {
      let j = Math.floor(Math.random() * i);
      let temp = bj.deck[i];
      bj.deck[i] = bj.deck[j];
      bj.deck[j] = temp;
    }

    // (C3) DRAW FIRST 4 CARDS
   // console.log(bj.players.length);

    for(let i=0; i<=bj.players.length; i++)
    {
      bj.turn = i; bj.draw(); bj.draw();
    }

    // bj.turn = 0; bj.draw(); bj.turn = 1; bj.draw();
    // bj.turn = 0; bj.draw(); bj.turn = 1; bj.draw();

    // (C4) LUCKY 21 ON FIRST DRAW?
    for(let i=0; i<=bj.players.length; i++)
    {
      bj.turn = i; bj.points();
    }

    bj.winner = bj.check();
    if (bj.winner == null && bj.winner2 == null && bj.winner3 == null && bj.winner4 == null) {
      bj.turn = 0;
    }
    console.log('BJ turn in start function before is ' + bj.turn);
    if(bj.turn == bj.players.length) {
      // bj.turn = 0;
      // if(bj.ppoints == 21) {
      //   bj.turn++;
      // }
      bj.next();
    }
    console.log('BJ turn in start function after is ' + bj.turn);
    // call sending data to blackjack service
    //this.blackjack.sendBlackJackData(bj);
  },

  // (D) DRAW A CARD FROM THE DECK
  dsymbols : ["&hearts;", "&diams;", "&clubs;", "&spades;"], // HTML symbols for cards
  dnum : { 1 : "A", 11 : "J", 12 : "Q", 13 : "K" }, // Card numbers
  draw : function () {
    // (D1) TAKE LAST CARD FROM DECK + CREATE HTML
    var card = bj.deck.pop(),
        cardh = document.createElement("div"),
        cardv = (bj.dnum[card.n] ? bj.dnum[card.n] : card.n) + bj.dsymbols[card.s];
    cardh.className = "bj-card";
    cardh.innerHTML = cardv ;
    console.log("Player"+cardh.innerHTML);
    // (D2) DEALER'S CARD
    // NOTE : HIDE FIRST DEALER CARD
    if (bj.turn== bj.players.length) {
      if (bj.dealer.length==0) {
        cardh.id = "deal-first";
        cardh.innerHTML = `<div class="back">?</div><div class="front">${cardv}</div>`;
        console.log("Dealer" + cardh.innerHTML);
      }
      bj.dealer.push(card);
      bj.hdhand.appendChild(cardh);
    }

    // (D3) PLAYER'S CARD
    else if(bj.turn==0){
      bj.player.push(card);
      console.log("Player 1 hand: " + bj.player);
      console.log("Current turn is " + bj.turn);
      bj.hphand.appendChild(cardh);
    }
    else if(bj.turn==1 && bj.turn != bj.players.length){
      bj.player2.push(card);
      console.log("Player 2 hand: " + bj.player2);
      console.log("Current turn is " + bj.turn);
      bj.hphand2.appendChild(cardh);
    }
    else if(bj.turn==2 && bj.turn != bj.players.length){
      bj.player3.push(card);
      bj.hphand3.appendChild(cardh);
    }
    else if(bj.turn==3 && bj.turn != bj.players.length){
      bj.player4.push(card);
      bj.hphand4.appendChild(cardh);
    }
  },

  // (E) CALCULATE AND UPDATE POINTS
  points : function () {
    // (E1) RUN THROUGH CARDS
    // TAKE CARDS 1-10 AT FACE VALUE + J, Q, K AT 10 POINTS.
    // DON'T CALCULATE ACES YET, THEY CAN EITHER BE 1 OR 11.
    var aces = 0, points = 0;
    // for (let i of (bj.turn ? bj.dealer : bj.player )) {
    //   if (i.n == 1) { aces++; }
    //   else if (i.n>=11 && i.n<=13) { points += 10; }
    //   else { points += i.n; }
    // }
    if(bj.turn == bj.players.length)
    {
       for(let i of bj.dealer)
       {
         if (i.n == 1) { aces++; }
         else if (i.n>=11 && i.n<=13) { points += 10; }
         else { points += i.n; }
       }
    }
    else if(bj.turn == 0)
    {
      for(let i of bj.player)
      {
        if (i.n == 1) { aces++; }
        else if (i.n>=11 && i.n<=13) { points += 10; }
        else { points += i.n; }
      }
    }
    else if(bj.turn == 1 && bj.turn != bj.players.length)
    {
      for(let i of bj.player2)
      {
        if (i.n == 1) { aces++; }
        else if (i.n>=11 && i.n<=13) { points += 10; }
        else { points += i.n; }
      }
    }
    else if(bj.turn == 2 && bj.turn != bj.players.length)
    {
      for(let i of bj.player3)
      {
        if (i.n == 1) { aces++; }
        else if (i.n>=11 && i.n<=13) { points += 10; }
        else { points += i.n; }
      }
    }
    else if(bj.turn == 3 && bj.turn != bj.players.length)
    {
      for(let i of bj.player4)
      {
        if (i.n == 1) { aces++; }
        else if (i.n>=11 && i.n<=13) { points += 10; }
        else { points += i.n; }
      }
    }
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

    // (E3) UPDATE POINTS
    if (bj.turn==bj.players.length) { bj.dpoints = points; }
    else if(bj.turn==0){
      bj.ppoints = points;
      bj.hppoints.innerHTML = points;
    }
    else if(bj.turn==1 && bj.turn != bj.players.length){
      bj.ppoints2 = points;
      bj.hppoints2.innerHTML = points;
    }
    else if(bj.turn==2 && bj.turn != bj.players.length){
      bj.ppoints3 = points;
      bj.hppoints3.innerHTML = points;
    }
    else if(bj.turn==3 && bj.turn != bj.players.length){
      bj.ppoints4 = points;
      bj.hppoints4.innerHTML = points;
    }
  },

  // (F) CHECK FOR WINNERS (AND LOSERS)
  check : function () {
    // (F1) FLAGS
    // WINNER - 0 FOR PLAYER, 1 FOR DEALER, 2 FOR A TIE
    var message = "";

    // (F2) BLACKJACK - WIN ON FIRST ROUND
    if (bj.player.length==2 && bj.dealer.length==2 && bj.player2.length == 2 && bj.player3.length == 2 && bj.player4.length == 2) {

        // TIE
        if (bj.ppoints==21 && bj.dpoints==21) {
          bj.winner = 2; message = "Player ties with Blackjacks";
          if(bj.turn == 0) {
            bj.next();
          }
        }
        if (bj.ppoints2==21 && bj.dpoints==21) {
          bj.winner2 = 2; message += "Player2 ties with Blackjacks";
          if(bj.turn == 1) {
            bj.next();
          }
        }
        if (bj.ppoints3==21 && bj.dpoints==21) {
          bj.winner3 = 2; message += "Player3 ties with Blackjacks";
        }
        if (bj.ppoints4==21 && bj.dpoints==21) {
          bj.winner4 = 2; message += "Player4 ties with Blackjacks";
        }


        // PLAYER WINS
        if (bj.winner==null && bj.ppoints==21) {
          bj.winner = 0; message = "Player wins with a Blackjack!";
        }
        if ((bj.winner==null || bj.winner==0) && bj.ppoints2==21) {
          bj.winner2 = 0; message += "Player2 wins with a Blackjack!";
        }
        if ((bj.winner==null || bj.winner==0) && bj.ppoints3==21) {
          bj.winner3 = 0; message += "Player3 wins with a Blackjack!";
        }
        if ((bj.winner==null || bj.winner==0) && bj.ppoints4==21) {
          bj.winner4 = 0; message += "Player4 wins with a Blackjack!";
        }


        // DEALER WINS
        if (bj.winner==null && bj.winner2== null  && bj.dpoints==21) {
          bj.winner = 1; message = "Dealer wins with a Blackjack!";
        }
        if(bj.players.length == 1) {
          if (bj.winner == null && bj.dpoints==21) {
            bj.winner = 1;
            message = "Dealer wins with a Blackjack!";
          }
        }
        if(bj.players.length == 2) {
          if (bj.winner==null && bj.winner2== null  && bj.dpoints==21) {
            bj.winner = 1; bj.winner2 = 1;
            message = "Dealer wins with a Blackjack!";
          }
        }
        if(bj.players.length == 3) {
          if (bj.winner==null && bj.winner2== null  && bj.winner3== null && bj.dpoints==21) {
            bj.winner = 1; bj.winner2 = 1; bj.winner3 = 1;
            message = "Dealer wins with a Blackjack!";
          }
        }
        if(bj.players.length == 4) {
          if (bj.winner==null && bj.winner2== null  && bj.winner3== null && bj.winner4== null && bj.dpoints==21) {
            bj.winner = 1; bj.winner2 = 1; bj.winner3 = 1; bj.winner4 = 1;
            message = "Dealer wins with a Blackjack!";
          }
        }
    }

    // (F3) WHO GONE BUST?
    if (bj.winner == null) {
      if(bj.players.length==1)
      {
        //Player GONE BUST
        if (bj.ppoints>21) {
          bj.winner = 1;
          message = "Player has gone bust. Dealer wins.";
        }

        // DEALER GONE BUST
        if (bj.dpoints>21) {
          bj.winner = 0;
          message = "Dealer has gone bust - Players wins!";
        }
      }

      if(bj.players.length==2)
      {
        //Player GONE BUST
        if (bj.ppoints>21) {
          bj.winner = 1;
          message = "Player has gone bust";
          bj.turn++;
        }

        if (bj.ppoints2>21) {
          bj.winner2 = 1;
          message = "Player2 has gone bust";
          bj.turn++;
        }
        if(bj.ppoints>21 && bj.ppoints2>21)
        {
          bj.winner = 1;
          bj.winner2 = 1;
          message = "All Players have gone bust. Dealer wins."
        }
        // DEALER GONE BUST
        if (bj.dpoints>21) {
          bj.winner = 0;
          bj.winner2 = 0;
          message = "Dealer has gone bust - Players wins!";
        }
      }

      if(bj.players.length==3)
      {
        //Player GONE BUST
        if (bj.ppoints>21) {
          bj.winner = 1;
          message = "Player has gone bust";
          bj.turn++;
        }

        if (bj.ppoints2>21) {
          bj.winner2 = 1;
          message += "Player2 has gone bust";
          bj.turn++;
        }

        if (bj.ppoints3>21) {
          bj.winner3 = 1;
          message += "Player3 has gone bust";
          bj.turn++;
        }
        if(bj.ppoints>21 && bj.ppoints2>21 && bj.ppoints3>21)
        {
          bj.winner= 1;
          bj.winner2 = 1;
          bj.winner3 = 1;
          message = "All Players have gone bust. Dealer wins."
        }
        // DEALER GONE BUST
        if (bj.dpoints>21) {
          bj.winner= 0;
          bj.winner2 = 0;
          bj.winner3 = 0;
          message = "Dealer has gone bust - Players wins!";
        }
      }

      if(bj.players.length==4)
      {
        //Player GONE BUST
        if (bj.ppoints>21) {
          bj.winner = 1;
          message = "Player has gone bust";
          bj.turn++;
        }

        if (bj.ppoints2>21) {
          bj.winner2 = 1;
          message += "Player2 has gone bust";
          bj.turn++;
        }

        if (bj.ppoints3>21) {
          bj.winner3 = 1;
          message += "Player3 has gone bust";
          bj.turn++;
        }

        if (bj.ppoints4>21) {
          bj.winner4 = 1;
          message += "Player4 has gone bust";
          bj.turn++;
        }

        if(bj.ppoints>21 && bj.ppoints2>21 && bj.ppoints3>21 && bj.ppoints4>21)
        {
          bj.winner= 1;
          bj.winner2 = 1;
          bj.winner3 = 1;
          bj.winner4 = 1;
          message = "All Players have gone bust. Dealer wins."
        }
        // DEALER GONE BUST
        if (bj.dpoints>21) {
          bj.winner = 0;
          bj.winner2 = 0;
          bj.winner3 = 0;
          bj.winner4 = 0;
          message = "Dealer has gone bust - Players wins!";
        }
      }
    }

    // (F4) POINTS CHECK - WHEN BOTH PLAYERS STAND
    if (bj.winner == null && bj.dstand && bj.pstand && bj.players.length == 1) {
      // DEALER HAS MORE POINTS
      if (bj.dpoints > bj.ppoints) {
        bj.winner = 1; message = "Dealer wins with " + bj.dpoints + " points!";
      }
      // PLAYER HAS MORE POINTS
      else if (bj.dpoints < bj.ppoints) {
        bj.winner = 0; message = "Player wins with " + bj.ppoints + " points!";
      }
      // TIE
      else {
        bj.winner = 2; message = "It's a tie.";
      }
    }

    if (bj.winner == null && bj.dstand && bj.pstand && bj.pstand2 && bj.players.length == 2) {
      // DEALER HAS MORE POINTS
      if (bj.dpoints > bj.ppoints) {
        bj.winner = 1;
        message = "Dealer beats Player with " + bj.dpoints + " points!";
      }
      if(bj.dpoints > bj.ppoints2) {
        bj.winner2 = 1;
        message += "Dealer beats Player 2 with " + bj.dpoints + " points!";
      }
      if (bj.dpoints > bj.ppoints && bj.dpoints > bj.ppoints2) {
        bj.winner = 1; bj.winner2 = 1;
        message = "Dealer beats everyone with " + bj.dpoints + " points!";
      }
      // PLAYER HAS MORE POINTS
      if (bj.dpoints < bj.ppoints) {
        bj.winner = 0;
        message += "Player wins with " + bj.ppoints + " points!";
      }
      if(bj.dpoints < bj.ppoints2) {
        bj.winner2 = 0;
        message += "Player2 wins with " + bj.ppoints2 + " points!";
      }
      // TIE
      if(bj.dpoints == bj.ppoints) {
        bj.winner = 2; message += "Player ties.";
      }
      if(bj.dpoints == bj.ppoints2) {
        bj.winner2 = 2; message += "Player2 ties.";
      }
    }

    if (bj.winner == null && bj.dstand && bj.pstand && bj.pstand2 && bj.pstand3 && bj.players.length == 3) {
      // DEALER HAS MORE POINTS
      if (bj.dpoints > bj.ppoints) {
        bj.winner = 1;
        message = "Dealer beats Player with " + bj.dpoints + " points!";
      }
      if(bj.dpoints > bj.ppoints2) {
        bj.winner2 = 1;
        message += "Dealer beats Player 2 with " + bj.dpoints + " points!";
      }
      if(bj.dpoints > bj.ppoints3) {
        bj.winner3 = 1;
        message += "Dealer beats Player 3 with " + bj.dpoints + " points!";
      }
      if (bj.dpoints > bj.ppoints && bj.dpoints > bj.ppoints2 && bj.dpoints > bj.ppoints3) {
        bj.winner = 1; bj.winner2 = 1; bj.winner3 = 1;
        message = "Dealer beats everyone with " + bj.dpoints + " points!";
      }
      // PLAYER HAS MORE POINTS
      if (bj.dpoints < bj.ppoints) {
        bj.winner = 0;
        message += "Player wins with " + bj.ppoints + " points!";
      }
      if(bj.dpoints < bj.ppoints2) {
        bj.winner2 = 0;
        message += "Player2 wins with " + bj.ppoints2 + " points!";
      }
      if(bj.dpoints < bj.ppoints3) {
        bj.winner3 = 0;
        message += "Player3 wins with " + bj.ppoints3 + " points!";
      }
      // TIE
      if(bj.dpoints == bj.ppoints) {
        bj.winner = 2; message += "Player ties.";
      }
      if(bj.dpoints == bj.ppoints2) {
        bj.winner2 = 2; message += "Player2 ties.";
      }
      if(bj.dpoints == bj.ppoints3) {
        bj.winner3 = 2; message += "Player3 ties.";
      }
    }

    if (bj.winner == null && bj.dstand && bj.pstand && bj.pstand2 && bj.pstand3 && bj.pstand4 && bj.players.length == 4) {
      // DEALER HAS MORE POINTS
      if (bj.dpoints > bj.ppoints) {
        bj.winner = 1;
        message = "Dealer beats Player with " + bj.dpoints + " points!";
      }
      if(bj.dpoints > bj.ppoints2) {
        bj.winner2 = 1;
        message += "Dealer beats Player 2 with " + bj.dpoints + " points!";
      }
      if(bj.dpoints > bj.ppoints3) {
        bj.winner3 = 1;
        message += "Dealer beats Player 3 with " + bj.dpoints + " points!";
      }
      if(bj.dpoints > bj.ppoints4) {
        bj.winner4 = 1;
        message += "Dealer beats Player 4 with " + bj.dpoints + " points!";
      }
      if (bj.dpoints > bj.ppoints && bj.dpoints > bj.ppoints2 && bj.dpoints > bj.ppoints3 && bj.dpoints > bj.ppoints4) {
        bj.winner = 1; bj.winner2 = 1; bj.winner3 = 1; bj.winner4 = 1;
        message = "Dealer beats everyone with " + bj.dpoints + " points!";
      }
      // PLAYER HAS MORE POINTS
      if (bj.dpoints < bj.ppoints) {
        bj.winner = 0;
        message += "Player wins with " + bj.ppoints + " points!";
      }
      if(bj.dpoints < bj.ppoints2) {
        bj.winner2 = 0;
        message += "Player2 wins with " + bj.ppoints2 + " points!";
      }
      if(bj.dpoints < bj.ppoints3) {
        bj.winner3 = 0;
        message += "Player3 wins with " + bj.ppoints3 + " points!";
      }
      if(bj.dpoints < bj.ppoints4) {
        bj.winner4 = 0;
        message += "Player3 wins with " + bj.ppoints4 + " points!";
      }
      // TIE
      if(bj.dpoints == bj.ppoints) {
        bj.winner = 2; message += "Player ties.";
      }
      if(bj.dpoints == bj.ppoints2) {
        bj.winner2 = 2; message += "Player2 ties.";
      }
      if(bj.dpoints == bj.ppoints3) {
        bj.winner3 = 2; message += "Player3 ties.";
      }
      if(bj.dpoints == bj.ppoints4) {
        bj.winner4 = 2; message += "Player3 ties.";
      }
    }

    // (F5) DO WE HAVE A WINNER?
    if (bj.winner != null) {
      // SHOW DEALER HAND AND SCORE
      bj.hdpoints.innerHTML = bj.dpoints;
      document.getElementById("deal-first").classList.add("show");

      // RESET INTERFACE
      bj.hpcon.classList.remove("started");

      // WINNER IS...
      // this.finalScore.userId = parseInt(sessionStorage.getItem('userId'));
      // this.finalScore.gamesId = 2;
      // this.finalScore.score = 1;
      bj.winner.innerHTML = message;
    }
    return bj.winner;
  },

  // (G) HIT A NEW CARD
  hit : function () {
    // (G1) DRAW A NEW CARD
    bj.draw(); bj.points();

     // (G2) AUTO-STAND ON 21 POINTS
    if (bj.turn==0 && bj.dpoints==21 && !bj.dstand) {
      bj.dstand = true; bj.hdstand.classList.add("stood");
    }
    if (bj.turn==1 && bj.ppoints==21 && !bj.pstand) {
      bj.pstand = true; bj.hpstand.classList.add("stood");
    }
    if (bj.turn==2 && bj.ppoints2==21 && !bj.pstand2) {
      bj.pstand2 = true; bj.hpstand2.classList.add("stood");
    }
    if (bj.turn==3 && bj.ppoints3==21 && !bj.pstand3) {
      bj.pstand3 = true; bj.hpstand3.classList.add("stood");
    }
    if (bj.turn==3 && bj.ppoints4==21 && !bj.pstand4) {
      bj.pstand4 = true; bj.hpstand4.classList.add("stood");
    }

    // (G3) CONTINUE GAME IF NO WINNER
    var winner = bj.check();
    if (bj.winner==null && bj.winner2==null && bj.winner3==null && bj.winner4==null) {
      bj.next();
    }
  },

  // (H) STAND
  stand : function () {
    // (H1) SET STAND STATUS
    if (bj.turn == bj.players.length) {
      bj.dstand = true; bj.hdstand.classList.add("stood");
    }
    else if (bj.turn == 0) {
      bj.pstand = true;
      bj.hpstand.classList.add("stood");
    }
    else if (bj.turn == 1) {
      bj.pstand2 = true;
      bj.hpstand2.classList.add("stood");
    }
    else if (bj.turn == 2) {
      bj.pstand3 = true;
      bj.hpstand3.classList.add("stood");
    }
    else if (bj.turn == 3) {
      bj.pstand4 = true;
      bj.hpstand4.classList.add("stood");
    }

    // (H2) END GAME OR KEEP GOING?
    var winner = (bj.pstand && bj.dstand) ? bj.check() : null ;
    if (winner==null) {
      bj.next();
    }
    if(bj.players.length == 1) {
      var winner = (bj.pstand && bj.dstand) ? bj.check() : null ;
      if (winner==null) {
        bj.next();
      }
    }
    if(bj.players.length == 2) {
      var winner = (bj.pstand && bj.dstand && bj.pstand2) ? bj.check() : null ;
      if (winner==null) {
        bj.next();
      }
    }
    if(bj.players.length == 3) {
      var winner = (bj.pstand && bj.dstand && bj.pstand2 && bj.pstand3) ? bj.check() : null ;
      if (winner==null) {
        bj.next();
      }
    }
    if(bj.players.length == 4) {
      var winner = (bj.pstand && bj.dstand && bj.pstand2 && bj.pstand3 && bj.pstand4) ? bj.check() : null ;
      if (winner==null) {
        bj.next();
      }
    }
  },

  // (I) WHO'S NEXT?
  next : function () {



    // (I1) UP NEXT...


    let lastTurn = bj.players.length;
    if(bj.turn == lastTurn)
    {
      bj.turn = 0;
    }
    else{
      bj.turn++;
      if(bj.turn == lastTurn) {
        if(bj.dstand) {
          bj.turn = 0;
        }
        else {
          bj.ai();
        }
      }
    }

    // // (I2) DEALER IS NEXT
    // if (bj.turn==0) {
    //   if (bj.dstand) { bj.turn = 1; } // SKIP DEALER TURN IF STOOD
    //   else { bj.ai(); }
    // }

    // // (I2) PLAYER IS NEXT
    // else
    // {
    //   if(bj.turn == lastTurn)
    //   {
    //     if(bj.turn == 1)
    //     {
    //       bj.turn = 0; bj.ai();
    //     }

    //   }
    //     else{
    //     if (bj.pstand) {
    //       bj.turn = 0; bj.ai();
    //     } // SKIP PLAYER TURN IF STOOD
    //   }
    // }
  },

  // (J) "SMART" COMPUTER MOVE
  ai : function () { if (bj.turn) {
    // (J1) STAND ON SAFETY LIMIT
    if (bj.dpoints >= bj.safety) { bj.stand(); }

    // (J2) ELSE DRAW ANOTHER CARD
    else { bj.hit(); }
  }}
};
