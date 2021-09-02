export interface Bjgamestate {
    deck: any[]; // overall game deck

    players: any[]; // array for player objects

    // name: string; // player name
    // player : any[]; // The player's current hand
    // ppoints : number; // The player's current points
    // pstand : boolean; // Player has stood
    // winner: boolean; // denotes if player won or not

    gameStarted: boolean; // denotes if game started or not
    
    dealer : any[]; // The dealer's current hand
    dpoints : number; // The dealer's current points
    safety : number; // Computer will stand on or past this point
    dstand : boolean; // Dealer has stood
    dwinner: boolean; // Dealer wins game

    turn: number; // which player in the bjplayers array's turn it is
}