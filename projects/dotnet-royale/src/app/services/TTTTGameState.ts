export interface GameState
{
    isOver?: boolean;
    squares?: any[];
    grid?: any[];
    winner?: string | null;
    currentPlayer?: number;
    playerList?: any[];
    playerPieces?: any[];
    alreadyClicked?: boolean;
    gameStarted?: boolean;
}