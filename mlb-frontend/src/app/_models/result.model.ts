export enum Division {
    ALE = 'ALE',
    ALC = 'ALC',
    ALW = 'ALW',
    NLE = 'NLE',
    NLC = 'NLC',
    NLW = 'NLW'
}

export interface Result {
    code: string;
    division: Division;
    currentWins: number;
    currentLosess: number;
    projWins: number;
    projLosses: number;
    playoffOdds: number;
    divisionOdds: number;
    WCOdds: number;
    pennantOdds: number;
    championshipOdds: number;
}

interface TeamGame {
    name: string;
    pitchingRating: number;
    hittingRating: number;
    startingPitcherRating: number;
    probability: number;
}

export interface DateProjections {
    games: Array<Array<TeamGame>>;
}
