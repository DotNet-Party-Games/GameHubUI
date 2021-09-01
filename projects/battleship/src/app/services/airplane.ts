export enum Orientation {
    // Rotations should be in degrees and start counterclockwise
    Vertical,
    Rotated90,
    Rotated180,
    Rotated270
}

export class Airplane {
    x: number;
    y: number;
    placed: boolean;
    orientation: Orientation;

    constructor() {
        this.x = 0;
        this.y = 0;
        this.placed = false;
        this.orientation = Orientation.Vertical;
    }
}