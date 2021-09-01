import { Component, OnInit } from '@angular/core';
import {
  BehaviorSubject,
  fromEvent,
  interval,
  Observable,
  Subject
} from "rxjs";
import { distinctUntilChanged, map, takeUntil, tap } from "rxjs/operators";
import { IGame } from '../services/game';
export interface GameState {
  width: number;
  height: number;
  snakePos: { x: number; y: number }[];
  food: { x: number; y: number };
  lost: boolean;
  snakePos2: { x: number; y: number }[];
}
import { PartygameService } from '../services/partygame.service';
import { IScore } from '../services/score';
import { ILoggedUser } from '../services/user';
import { ActivatedRoute, Router } from '@angular/router';
import { SocketioService } from '../services/socketio/socketio.service';
import { TeamLeaderboardService} from '../../../../hubservices/src/public-api';
//copy over layout into another folder called light bike
//place light bike folder into the pathing within app.module.ts
//room.html needs to have the routing information to display the game
//should have a 2 versions of snake game if done properly, then you can change one to fit what we want for light bike


enum Direction {
  UP,
  DOWN,
  LEFT,
  RIGHT
}

enum FieldType {
  EMPTY,
  SNAKE,
  FOOD
}

@Component({
  selector: 'app-layout',
  templateUrl: './light-bike.component.html',
  styleUrls: ['./light-bike.component.css']
})
export class lightbikeComponent implements OnInit {
  public roomId: string;
  finalScore: IScore = {
    gamesId: null,
    userName: null,
    score: null
  }
  obj: GameState;
  public currentUser: ILoggedUser;
  games: IGame[];
  currentGameId: number;
  mainScreen: string;
  snakeDirection: Direction;

  game$: BehaviorSubject<GameState>;

  keyDown$: Observable<string>;
  tick$: Observable<number>;
  direction$ = new BehaviorSubject<Direction>(Direction.RIGHT);
  lost$ = new Subject<void>();
  snakePositionDisplay: { x: number; y: number }[];
  SnakeGameStateAtX: { x: number; y: number }[];
  tempSnake: { x: number; y: number }[];
  SnakeGameState: { x: number; y: number }[];
  SnakeGameState2: { x: number; y: number }[];
  userList: string[];
  keypress: boolean;
  count12: number;
  snakeMap = new Map();
  lives: number;
  score: number;
  currentHighScore: number;
  lastAlive: boolean;
  GameOver:number;
  GameEnd: boolean;
  Win: boolean;
  Boost: boolean;

  constructor(private router: Router, private partyGameApi: PartygameService, private socketService: SocketioService, private route: ActivatedRoute, private leaderboardService: TeamLeaderboardService) {
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
    this.getGameList();
    this.lives = 3;

    this.keyDown$ = fromEvent<KeyboardEvent>(document, "keydown").pipe(
      tap(event => event.stopPropagation()),
      map(event => event.key),
      distinctUntilChanged()
    );
    this.socketService.getLightSnakeGameState().subscribe(data => {
      console.log("data from socket");
      console.log(data);
      this.snakeMap.set(data.User, data.b.map(a => a));
      this.snakePositionDisplay = [];
      if (data.GameOver == true)
      {
        console.log("TRUE");
        this.GameOver++;
      }
      for (let val of this.snakeMap.values()) {
        this.snakePositionDisplay = [].concat(this.snakePositionDisplay, val);
      }
      if (this.currentHighScore < data.Score && data.Score > this.score)
      {
        this.currentHighScore = data.Score;
      }
      else if (this.currentHighScore < this.score)
      {
        this.currentHighScore = this.score;
      }
    });
    this.tick$ = interval(80);
    this.direction$.subscribe((currentDirection) =>
      this.snakeDirection = currentDirection);
    const direction = this.keyDown$.pipe(
      map(key => {
        //print statements to determine what is allowing the double input !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
        switch (key) {
          case "ArrowUp":
          case "w":
            //if the snake is already going down
            if (this.snakeDirection == 1) {
              //go down
              this.keypress = true;
              return Direction.DOWN;
            }
            //if the snake isnt going down, it is allowed to go directly up
            else {
              this.keypress = true;
              return Direction.UP;

            }
          case "ArrowDown":
          case "s":
            if (this.snakeDirection == 0) {
              this.keypress = true;
              return Direction.UP;
            }
            else {
              this.keypress = true;
              return Direction.DOWN;
            }
          case "ArrowLeft":
          case "a":
            if (this.snakeDirection == 3) {
              this.keypress = true;
              return Direction.RIGHT;
            }
            else {
              this.keypress = true;
              return Direction.LEFT;
            }
          case "ArrowRight":
          case "d":
            if (this.snakeDirection == 2) {
              this.keypress = true;
              return Direction.LEFT;
            }
            else {
              this.keypress = true;
              return Direction.RIGHT;
            }
          default:
            return this.direction$.value;
        }
      })
    );

    direction.subscribe(this.direction$);

    this.newGame();
    this.selectGameRoomHandler();
  }
  // handles the next game instance given the direction, does not seem to handle control of the snake
  selectGameRoomHandler(): void {
    this.roomId = sessionStorage.roomId;
    this.currentUser.userName = sessionStorage.userName;
    this.join(this.currentUser.userName, this.roomId);
  }
  join(username: string, roomId: string): void {
    this.socketService.joinRoom({ user: username, room: roomId });
  }
  sendLightSnakeGameState(): void {
    this.socketService.sendLightSnakeGameState({ SnakePos: this.game$.value.snakePos, Lost: this.game$.value.lost, room: this.roomId, User: this.currentUser.userName, Score: this.score});
  }
  getNextField(
    game: GameState,
    direction: Direction
  ): { x: number; y: number } {

    const currentField = game.snakePos[game.snakePos.length - 1];
    const nextField = { x: currentField.x, y: currentField.y };
    switch (direction) {
      case Direction.UP:
        //makes it so you can loop to the other side of the map
        if (nextField.y !== 0) {

          nextField.y--;
        } else {

          nextField.y = game.height - 1;
        }
        break;
      case Direction.DOWN:
        if (nextField.y !== game.height - 1) {
          nextField.y++;
        } else {
          nextField.y = 0;
        }
        break;
      case Direction.LEFT:
        if (nextField.x !== 0) {
          nextField.x--;
        } else {
          nextField.x = game.width - 1;
        }
        break;
      case Direction.RIGHT:
        if (nextField.x !== game.width - 1) {
          nextField.x++;
        } else {
          nextField.x = 0;
        }
        break;
    }

    return nextField;
  }

  getFieldType(field: { x: number; y: number }, game: GameState): FieldType {
    if (field.x === game.food.x && field.y === game.food.y) {
      return FieldType.FOOD;
    }
    if (game.snakePos.some(pos => pos.x === field.x && pos.y === field.y)) {
      return FieldType.SNAKE;
    }
    if (game.snakePos2 != undefined) {
      if (game.snakePos2.some(pos => pos.x === field.x && pos.y === field.y)) {
        return FieldType.SNAKE;
      }
    }
    return FieldType.EMPTY;
  }

  getRandomField(width: number, height: number): { x: number; y: number } {
    return {
      x: Math.floor(width * Math.random()),
      y: Math.floor(height * Math.random())
    };
  }
  getRoomUserList() {
    this.socketService.getRoomList().subscribe(roomList => {
      let room = roomList.find(({ id }) => id == this.roomId);
      this.userList = room.users;
      this.userList.forEach(element => {
        this.snakeMap.set(element, []);
      });
    });
  }
  currentfood: { x: number; y: number };
  tempDisplay: { x: number; y: number }[];
  newGame(): void {
    this.Boost = false;
    this.Win = false;
    this.GameEnd = false;
    this.GameOver = 0;
    this.score = 1;
    this.currentHighScore = this.score;
    this.lives = 3;
    const width = 70;
    const height = 35;
    const food = {x:null, y:null};
    const snakePos = [this.getRandomField(width, height)];
    this.tempDisplay = snakePos;
    let snakePos2;
    this.count12 = 0;
    this.getRoomUserList();

    this.game$ = new BehaviorSubject<GameState>({
      food,
      snakePos,
      height,
      width,
      lost: false,
      snakePos2
    });

    this.tick$
      .pipe(
        map(tick => {
          this.count12 = 0;
          let game = this.game$.value;
          if (game.snakePos.length <= 13)
          {
            this.tempDisplay.push(game.snakePos[0]);
            this.count12++;
            game.snakePos = this.tempDisplay;
          }
          //this.snakeMap.set(this.currentUser.userName, game.snakePos);
          this.sendLightSnakeGameState();
          this.snakePositionDisplay = [];
          for (let val of this.snakeMap.values()) {
            this.snakePositionDisplay = [].concat(this.snakePositionDisplay, val);
          }
          game.snakePos2 = this.snakePositionDisplay;
          if (this.currentHighScore < this.score)
          {
            this.currentHighScore = this.score;
          }
          if (this.GameOver == this.userList.length-1)
          {
            this.GameEnd = true;
            this.Win = true;
          }


          const direction = this.direction$.value;
          const nextField = this.getNextField(game, direction);
          const nextFieldType = this.getFieldType(nextField, game);
          switch (nextFieldType) {
            case FieldType.EMPTY:
              if (this.Win == true)
              {
                game.snakePos = [...game.snakePos.slice(), nextField];
              }
              else{
                game.snakePos = [...game.snakePos.slice(1), nextField];
              }

              break;
            case FieldType.SNAKE:
              this.lives--;
              this.playSFX("oof");
              if (this.lives < 1)
              {
                this.GameOver++;
                if (this.GameOver == this.userList.length-1)
                {
                  this.GameEnd = true;
                }
                game.lost = true;
                this.GameEnd = true;
                this.sendLightSnakeGameState();
                this.lives = 0;
              }
              else
              {
               game.snakePos = [this.getRandomField(game.width,game.height)];
               this.tempDisplay = game.snakePos;
              }
              break;

          }
          return game;
        }),
        takeUntil(this.lost$)
      )
      .subscribe(game => {
        this.game$.next(game);
        if (game.lost && !this.Win) {
          this.finalScore.gamesId = 4;
          this.finalScore.score = 0;
          this.finalScore.userName = sessionStorage.getItem('userName');
          this.partyGameApi.addscore(this.finalScore).subscribe(data => {
            this.partyGameApi.updateLightBikeStats(this.finalScore).subscribe(); 
          });
          
          this.lost$.next();
        }
        else if(game.lost && this.Win)
        {
          this.finalScore.gamesId = 4;
          this.finalScore.score = 1;
          this.finalScore.userName = sessionStorage.getItem('userName');
          this.partyGameApi.addscore(this.finalScore).subscribe(data => {
            this.partyGameApi.updateLightBikeStats(this.finalScore).subscribe(); 
          });
          this.leaderboardService.submitScore("partygames",1);
          this.lost$.next();
        }
      });
  }
  getGameList() {
    this.partyGameApi.getGames().subscribe((response: IGame[]) => { this.games = response });
  }

  showGame() {
    let p_game = this.games.find(g => g.id == this.currentGameId).name;
    this.mainScreen = p_game;
  }

  resetScreen() {
    this.mainScreen = "default";
    location.reload();
  }

  goToRoom() {
    this.router.navigate(['room'], { relativeTo: this.route.parent });
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
    audio.load();
    audio.play();
  }
}

