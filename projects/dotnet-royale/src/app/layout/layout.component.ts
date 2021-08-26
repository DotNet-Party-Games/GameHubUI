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
import { DataService } from '../services/data.service';
import { IScore } from '../services/score';
import { SnakeService } from '../services/snake/snake.service';
import { ILoggedUser } from '../services/user';
import { Router } from '@angular/router';
import { LivechatService } from '../services/livechat/livechat.service';
import { SocketioService } from '../services/socketio/socketio.service';

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
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css']
})
export class LayoutComponent implements OnInit {
  public roomId: string;
  finalScore: IScore = {
    gamesId: null,
    userId: null,
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

  constructor(private router: Router, private partyGameApi: PartygameService, private data: DataService, private socketService: SocketioService) {
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
    this.data.currentGameId.subscribe(p_gameId => {
      this.currentGameId = p_gameId;
      if (p_gameId == -1) this.resetScreen();
    });
    this.keyDown$ = fromEvent<KeyboardEvent>(document, "keydown").pipe(
      tap(event => event.stopPropagation()),
      map(event => event.key),
      distinctUntilChanged()
    );
    this.socketService.getSnakeGameState().subscribe(data => {
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
    this.tick$ = interval(110);
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
  sendSnakeGameState(): void {
    this.socketService.sendSnakeGameState({ GameState: this.game$.value, room: this.roomId, User: this.currentUser.userName, Score: this.score});
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
  newGame(): void {
    this.GameEnd = false;
    this.GameOver = 0;
    this.score = 1;
    this.currentHighScore = this.score;
    this.lives = 3;
    const width = 40;
    const height = 33;
    const food = this.getRandomField(width, height);
    const snakePos = [this.getRandomField(width, height)];
    let snakePos2;
    this.getRoomUserList();

    this.game$ = new BehaviorSubject<GameState>({
      food,
      snakePos,
      height,
      width,
      lost: false,
      snakePos2
    });
    //Maybe transition to an observable and the subscriber is set on the latest value since it subscribed until next(), then do next() for n number of players
    this.tick$
      .pipe(
        map(tick => {
          console.log(this.GameOver);
          let game = this.game$.value;
          this.count12 = 0;
          this.snakeMap.set(this.currentUser.userName, game.snakePos);
          console.log("sending gamestate to socket");
          this.sendSnakeGameState();
          this.snakePositionDisplay = [];
          for (let val of this.snakeMap.values()) {

            this.snakePositionDisplay = [].concat(this.snakePositionDisplay, val);
          }
          game.snakePos2 = this.snakePositionDisplay;
          if (this.currentHighScore < this.score)
          {
            this.currentHighScore = this.score;
          }
          console.log(this.GameOver);
          if (game.lost == true && this.GameOver == this.userList.length-1)
          {
            this.GameEnd = true;
          }
      
          // this.snakePositionDisplay = [].concat(this.snakePositionDisplay, this.SnakeGameState);
          // this.snakePositionDisplay = [].concat(this.snakePositionDisplay, this.SnakeGameState);


          //const subscription = this.socketService.currentGameState.subscribe(data => (this.SnakeGameState = data.map(a=>a)));
          //for (let n = 0; n < this.userList.length-1; n++)
          //{
          // this.sendSnakeGameState();
          // //loop through for n number of players with an observable that is already subscribed and do .next for the amount of players there are... boom multiplayer
          // const subscription = this.socketService.getSnakeGameState().subscribe(data => (this.SnakeGameState = data.map(a=>a)));
          // this.sendSnakeGameState();

          // this.SnakeGameState2 = [].concat(this.SnakeGameState2, this.SnakeGameState);

          // this.socketService.getSnakeGameState().subscribe(data=>
          //   (this.SnakeGameState = data.map(a=>a)));
          // this.SnakeGameState2 = [].concat(this.SnakeGameState2, this.SnakeGameState);



          // console.log(JSON.stringify(this.SnakeGameState2));



          //subscription2.unsubscribe();
          //maybe flip

          //if (this.SnakeGameState != undefined)
          //{
          //  if (n>0)
          //   {
          //     let count = 0;
          //     while (JSON.stringify(this.SnakeGameState) === JSON.stringify(this.tempSnake))
          //      {
          //        count++;
          //        console.log("true");
          //        this.tempSnake = this.socketService.newGameState.getValue();
          //        if (count > 10)
          //        {
          //          break;
          //        }
          //      }
          //     this.SnakeGameState2.push(...this.SnakeGameState);
          //   }
          //   else
          //   {
          //     this.tempSnake = this.SnakeGameState;
          //     this.SnakeGameState2 = this.SnakeGameState; 
          //   }
          // }
          //subscription.unsubscribe();
          //}

          //this.snakePositionDisplay = [].concat(this.snakePositionDisplay, game.snakePos);
          //console.log(JSON.stringify(this.snakePositionDisplay));
          //game.snakePos2 = this.snakePositionDisplay;
          //this.snakePositionDisplay = [].concat(game.snakePos, this.snakePositionDisplay);


          // if (this.SnakeGameState != undefined)
          // {
          //   game.snakePos2 = this.SnakeGameState;
          //   this.snakePositionDisplay = [].concat(game.snakePos, this.SnakeGameState);
          // }
          // else
          // {
          //   this.snakePositionDisplay = game.snakePos;
          // }
          //subscription.unsubscribe();

          const direction = this.direction$.value;
          const nextField = this.getNextField(game, direction);
          const nextFieldType = this.getFieldType(nextField, game);
          switch (nextFieldType) {
            case FieldType.EMPTY:
              game.snakePos = [...game.snakePos.slice(1), nextField];
              break;
            case FieldType.FOOD:
              this.score++;
              game.snakePos = [...game.snakePos, nextField];
              game.food = this.getRandomField(game.width, game.height);
              let loop = true;
              while (loop) {
                for (let x = 0; x < game.snakePos.length; x++) {
                  if (game.snakePos[x].x === game.food.x && game.snakePos[x].y === game.food.y) {
                    game.food = this.getRandomField(game.width, game.height);
                  }

                  else {
                    loop = false;
                  }
                }
              }
              break;
            case FieldType.SNAKE:
              this.lives--;
              if (this.lives < 1)
              {
                this.GameOver++;
                if (this.GameOver >= this.userList.length)
                {
                  console.log("game over paps");
                  this.GameEnd = true;
                }
                //game.snakePos = [];
                //this.sendSnakeGameState();
                game.lost = true;
                this.GameEnd = true;
                this.sendSnakeGameState();
                this.lives = 0;
              }
              else
              {
                game.snakePos = [this.getRandomField(game.width,game.height)];
              }
              break;
          }
          return game;
        }),
        takeUntil(this.lost$)
      )
      .subscribe(game => {
        this.game$.next(game);
        if (game.lost) {
          this.finalScore.gamesId = 1;
          this.finalScore.score = (this.score * 100) - 100;
          this.finalScore.userId = parseInt(sessionStorage.getItem('userId'));
          this.partyGameApi.addscore(this.finalScore).subscribe();
          this.partyGameApi.updateSnakeStats(this.finalScore).subscribe();
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
    this.router.navigate(['game/dotnetroyale/room']);
  }

}
