import { Component, ContentChild, Input, OnInit } from "@angular/core";
import { BikeComponent } from "../snake.component";

@Component({
  selector: "app-bike-game-field",
  templateUrl: "./game-field.component.html",
  styleUrls: ["./game-field.component.css"]
})
export class BikeGameFieldComponent implements OnInit {
  @Input()
  width: number;

  @Input()
  height: number;

  @Input()
  food: { x: number; y: number };

  widthArray: Array<number>;
  heightArray: Array<number>;

  @ContentChild(BikeComponent)
  snake: BikeComponent;

  constructor() {
    //empty
  }

  ngOnInit() {
    this.widthArray = new Array(this.width).fill(0).map((x, i) => i);
    this.heightArray = new Array(this.height).fill(0).map((x, i) => i);
  }

  isSnake(x: number, y: number): boolean {
    return this.snake.pos.some(coords => coords.x === x && coords.y === y);
  }

  isSnake2(x: number, y: number): boolean {
    return this.snake.pos2.some(coords => coords.x === x && coords.y === y);
  }
}
