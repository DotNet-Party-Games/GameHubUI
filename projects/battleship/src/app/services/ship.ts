export class Ship{
    x: number;
    y: number;
    placed: boolean;
    horizontal: boolean;

    constructor(){
        this.x = 0;
        this.y = 0;
        this.placed = false;
        this.horizontal = false;
    }
}