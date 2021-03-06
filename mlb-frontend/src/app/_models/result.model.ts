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

export interface TeamGame {
    name: string;
    pitchingRating: number;
    hittingRating: number;
    startingPitcherRating: number;
    probability: number;
    lineup?: Array<string>;
    runs?: number;
}

export interface DateProjections {
    date: Date;
    games: Array<Array<TeamGame>>;
}

interface TeamOdds {
    code: string;
    division: string;
    odds: number;
}

export interface HistoricalOdds {
    date: Date;
    teamResults: Array<TeamOdds>;
}
