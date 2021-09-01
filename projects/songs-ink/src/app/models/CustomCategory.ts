import { CustomWord } from "./CustomWord";
export interface CustomCategory {
    id?: number,
    playerId: number,
    customCategoryName: string;
    words: CustomWord[];
}