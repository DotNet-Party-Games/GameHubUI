import { Component, Input } from "@angular/core";

@Component({
  selector: "app-bike",
  templateUrl: "./snake.component.html",
  styleUrls: ["./snake.component.css"]
})
export class BikeComponent {
  @Input()
  pos: { x: number; y: number }[] = [];

  @Input()
  pos2: { x: number; y: number }[] = [];
}
