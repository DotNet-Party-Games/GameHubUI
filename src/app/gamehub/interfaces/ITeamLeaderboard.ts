import { ITeamScore } from "./ITeamScores";

export interface ITeamLeaderboard
{
    id: string,
    scores: ITeamScore[]
}