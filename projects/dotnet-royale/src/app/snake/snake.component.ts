import { Component, Input } from "@angular/core";

@Component({
  selector: "app-snake",
  templateUrl: "./snake.component.html",
  styleUrls: ["./snake.component.css"]
})
export class SnakeComponent {
  @Input()
  pos: { x: number; y: number }[] = [];

  @Input()
  pos2: { x: number; y: number }[] = [];
}
