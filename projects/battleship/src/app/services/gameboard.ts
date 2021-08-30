export interface IGameboard{
    height: number;
    width: number;
    
}

export interface IUser {
    userName: string;
}

export class INavy {
    ocean: number[][][];
    oceanLegend: string[][][];
    craft: string[][][];
}

export interface IShot {
    x: number;
    y: number;
    z: number;
    state: number;
    stateLegend: string;
}

export enum Tile{
    water,
    patrolboat
};
