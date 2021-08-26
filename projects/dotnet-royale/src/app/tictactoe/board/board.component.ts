import { Component, OnInit, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { IScore } from '../../services/score';
import { PartygameService } from '../../services/partygame.service';
import { TicTacToeService } from '../../services/TicTacToe/tic-tac-toe.service';
import { ILoggedUser } from '../../services/user';
import { Router } from '@angular/router';
import { GameState } from '../../services/TTTTGameState';
import { SocketioService } from '../../services/socketio/socketio.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.css']
})
export class BoardComponent implements OnInit, OnDestroy {

  public currentUser: ILoggedUser;
  finalScore: IScore = {
    gamesId: null,
    userId: null,
    score: null,
  }
  gameState: GameState = {
    gameStarted: false,
    playerPieces: ["X", "O", "\u0444", "\u30B7", "\u02E0", "\u0376", "\u037C", "\u0394", "\u0398", "\u039B", "\u039E", "\u03A0", "\u03A8", "\u03A9", "\u00B5", "\u03A3", "\u0393", "\u0370"],
  };
  public roomId: string = sessionStorage.getItem('roomId');
  numOfPlayers: number = 4; // This will be obtained from socketio
  squareHeight: number = 100 / (this.numOfPlayers + 1); // is used to generate columns of relative size
  fontSize: number = 5 * 2 / (this.numOfPlayers); // is used to generate rows of relative size
  thisPlayer: number; // the player number of this specific player
  thisPlayerName: string; // the player name of this specific player
  pullPlayer: boolean = false;
  audioUrl: string = "https://songsink.blob.core.windows.net/songs/"; //base url to access sounds
  audioSub: Subscription;
  playerSub: Subscription;
  ttttDataSub: Subscription;



  constructor(private router: Router, private partyGameApi: PartygameService, private cd: ChangeDetectorRef, private ttttService: TicTacToeService, private socketService: SocketioService) {
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

  ngOnInit(): void {
    this.thisPlayerName = sessionStorage.getItem('userName');
    this.audioSub = this.socketService.getAudioTrigger().subscribe(data => {
      console.log("received audio: " + data);
      this.playAudio(data);
    })
    this.playerSub = this.socketService.findPlayers().subscribe(data => {
      console.log("In find player subscription, data: ");
      console.log(data);
      if (!this.pullPlayer) {
        this.gameState.playerList = data;
        
        this.thisPlayer = this.gameState.playerList.indexOf(this.thisPlayerName);
        
        this.numOfPlayers = this.gameState.playerList.length;
        this.gameState.squares = new Array((this.numOfPlayers + 1) ** 2).fill(null);
        if (this.thisPlayer == 0) {
          this.newGame();
        }
      }
      this.pullPlayer = true;
    });
    this.ttttDataSub = this.socketService.getTicTacToeData().subscribe(data => {
      console.log("in current gamestate subscription: ");
      console.log(data);
      console.log(data.isOver);
      console.log(data.playerList);
      console.log(data.gameStarted);
      this.gameState=data;
    });
    this.socketService.getPlayers(({ room: this.roomId }));
  }

  ngOnDestroy(): void {
    this.playerSub.unsubscribe();
    this.ttttDataSub.unsubscribe();
    this.audioSub.unsubscribe();
  }
  sendTicTacToeGamestate(currentGameState: GameState) {
    //console.log("Sending GameBoard Data");
    this.socketService.sendTicTacToeData({ gameboard: currentGameState, room: this.roomId });
  }

  newGame() {
    this.gameState.gameStarted = true;
    
    this.gameState.squares = new Array((this.numOfPlayers + 1) ** 2).fill(null);
    this.gameState.currentPlayer = 0;
    this.createGrid();
    this.generatePlayerPieces();
    this.gameState.winner = null;
    this.gameState.isOver = false;
    this.gameState.alreadyClicked = false;
    this.sendTicTacToeGamestate(this.gameState);
    let audio = <HTMLAudioElement>document.getElementById('audio');
    audio.pause();
  }

  generatePlayerPieces() {
    let possiblePieces: any[];
    possiblePieces = ["X", "O", "\u0444", "\u30B7", "\u02E0", "\u0376", "\u037C", "\u0394", "\u0398", "\u039B", "\u039E", "\u03A0", "\u03A8", "\u03A9", "\u00B5", "\u03A3", "\u0393", "\u0370"];
    for (let i = possiblePieces.length - 1; i > 0; i--) {
      let j = Math.floor(Math.random() * (i + 1));
      [possiblePieces[i], possiblePieces[j]] = [possiblePieces[j], possiblePieces[i]];
    }
    this.gameState.playerPieces = new Array();
    for (let x = 0; x < this.numOfPlayers; x++) {
      if (x >= possiblePieces.length) {
        this.gameState.playerPieces.push(String(x));
      } else {
        this.gameState.playerPieces.push(possiblePieces[x]);
      }

    }
  }

  async makeMove(idx: number) {
    if (!this.gameState.squares[idx] && !this.gameState.isOver && !this.gameState.alreadyClicked && this.gameState.currentPlayer == this.thisPlayer) {
      this.gameState.alreadyClicked = true;
      this.gameState.squares[idx] = this.gameState.playerPieces[this.gameState.currentPlayer];
      this.updateGrid(idx, this.gameState.playerPieces[this.gameState.currentPlayer]);
      this.socketService.sendAudioTrigger({ audioFile: "placepiecesound", room: this.roomId });
      this.playAudio('placepiecesound');
      this.gameState.winner = this.calculateWinner();
      this.endTurn();
    }
  }
  endTurn() {
    this.gameState.currentPlayer += 1;
    if (this.gameState.currentPlayer > this.numOfPlayers - 1) {
      this.gameState.currentPlayer = 0;
    }
    this.gameState.alreadyClicked = false;
    if (this.gameState.winner && this.gameState.winner == this.thisPlayerName) {
      this.gameState.isOver = true;
      this.playAudio("youwon");
      this.socketService.sendAudioTrigger({ audioFile: "youlose", room: this.roomId })
    } 
    this.sendTicTacToeGamestate(this.gameState);

  }

  createGrid() {

    this.gameState.grid = new Array(); //creating a new array
    let x = 0;
    while (x <= this.numOfPlayers) //this outer loop itereates the "rows"
    {
      let y = 0;
      let tempArr = new Array(); //Creates a blank "row"
      while (y <= this.numOfPlayers) {
        tempArr.push(null);  //this pushes a null entry to the current "row"
        y++
      }
      this.gameState.grid.push(tempArr); //pushes the filled "row" to the grid
      x++
    }
  }
  updateGrid(idx: number, piece: any) {
    let row = Math.floor(idx / (this.numOfPlayers + 1)); // integer division (sorta) to get row
    let col = idx % (this.numOfPlayers + 1); // remainder to specify column
    this.gameState.grid[row][col] = piece;
  }
  // updateGameState(newGameState: GameState) {
  //   this.gameState = newGameState;
  // }

  playAudio(audioCue: string) {
    let audio = <HTMLAudioElement>document.getElementById('audio');
    audio.volume = 0.1;
    audio.src = this.audioUrl + audioCue + ".mp3";
    if (audioCue == "youwon") {
      audio.loop = true;
    }
    audio.load();
    audio.play();
  }
  calculateWinner() {
    //checks (x,1) for horizontal wins
    //checks (1,x) for vertical wins
    //start checking at (1,1) and check the 4 win orientations
    //then move to (1,2) until you hit (1,n-1) where n is the second to last column
    //then move down to (2,1) and repeat until (n-1,n-1)
    for (let x = 0; x <= this.numOfPlayers; x++) {
      for (let y = 0; y <= this.numOfPlayers; y++) {
        // if middle piece is null then we can skip the other checks
        if (this.gameState.grid[x][y]) {

          //check vertical when not next to the top or bottom edge
          if (x > 0 && x < this.numOfPlayers) {
            //check vertical
            if ((this.gameState.grid[x - 1][y] == this.gameState.grid[x][y]) && (this.gameState.grid[x][y] == this.gameState.grid[x + 1][y])) {
              return this.gameState.playerList[this.gameState.currentPlayer];
            }
          }

          // check horizontal when not next to left or right edge
          if (y > 0 && y < this.numOfPlayers) {
            //check horizontal
            if ((this.gameState.grid[x][y - 1] == this.gameState.grid[x][y]) && (this.gameState.grid[x][y] == this.gameState.grid[x][y + 1])) {
              return this.gameState.playerList[this.gameState.currentPlayer];
            }
          }
          //check if near corners
          if ((x > 0 && x < this.numOfPlayers) && (y > 0 && y < this.numOfPlayers)) {
            //check aigu diagonal
            if ((this.gameState.grid[x + 1][y - 1] == this.gameState.grid[x][y]) && (this.gameState.grid[x][y] == this.gameState.grid[x - 1][y + 1])) {
              return this.gameState.playerList[this.gameState.currentPlayer];
            }

            //check grave diagonal
            if ((this.gameState.grid[x - 1][y - 1] == this.gameState.grid[x][y]) && (this.gameState.grid[x][y] == this.gameState.grid[x + 1][y + 1])) {
              return this.gameState.playerList[this.gameState.currentPlayer];
            }
          }
        }
      }
    }
    let isCats: boolean = true;
    for (let x = 0; x < this.gameState.squares.length; x++) {
      if (this.gameState.squares[x] == null) {
        isCats = false;
        return null;
      }
    }
    this.gameState.isOver = true;
    return "Cats Game! Nobody";
  }
  goToRoom() {
    this.router.navigate(['/room']);
  }

}

