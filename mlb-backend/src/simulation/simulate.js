import { TeamResult } from '../models/TeamResult';
import { DateResult } from '../models/DateResult';
import { DateProjection } from '../models/DateProjection';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();
const axios = require('axios');

const TOTAL_GAMES = 162;
const CURRENT_YEAR = new Date().getFullYear();
const START_DATE_TIME = new Date(`03/15/${CURRENT_YEAR}`).getTime();
const END_DATE_TIME = new Date(`10/15/${CURRENT_YEAR}`).getTime();
const idToTeamIndex = new Map(); // easy lookups when doing games
const TEAM_IDS = [
  [110, 111, 139, 141, 147],
  [145, 114, 116, 118, 142],
  [117, 108, 133, 136, 140],
  [144, 146, 121, 143, 120],
  [112, 113, 158, 134, 138],
  [109, 115, 137, 135, 119]
];
let teams = [];
let remainingGames = [];
const TOTAL_ITERATIONS = 10000;
const MLB_API_URL = 'https://statsapi.mlb.com/api/v1';

export function populateProjDBToday() {
  mongoose.connect(process.env.MONGODB_IP,
    {
      useUnifiedTopology: true,
      useNewUrlParser: true
    },
    (err) => {
      if (err) {
        throw new Error('Could not connect to database. Exiting...');
      }
      console.log('Successfully connected to MongoDB instance.');
      /* loadDummyData(); */
      runAll();
    }
  );
}

export function getTodayProjections() {
  mongoose.connect(process.env.MONGODB_IP,
    {
      useUnifiedTopology: true,
      useNewUrlParser: true
    },
    (err) => {
      if (err) {
        throw new Error('Could not connect to database. Exiting...');
      }
      console.log('Successfully connected to MongoDB instance.');
      /* loadDummyData(); */
      simulateToday();
    }
  );
}

async function runAll() {
  await setTeams();
  await setCurrentRecords();
  await getRemainingGames();
  for (let i = 0; i < TOTAL_ITERATIONS; i++) {
    if (i % 1000 == 0) {
      console.log(`Running Season ${i}`);
    }
    await simulateRestOfSeason();
  }
  addToDB();
}

async function loadDummyData() {
  await DateResult.deleteMany({});
  const august8 = new DateResult({
    date: '2021-08-08',
    teamResults: [
      {
        code: 'NYY',
        division: 'ALE',
        odds: 27.2
      },
      {
        code: 'TB',
        division: 'ALE',
        odds: 96.4
      }
    ]
  });
  august8.save();
  const august9 = new DateResult({
    date: '2021-08-09',
    teamResults: [
      {
        code: 'NYY',
        division: 'ALE',
        odds: 22.1
      },
      {
        code: 'TB',
        division: 'ALE',
        odds: 97.1
      }
    ]
  });
  august9.save();
}

// Class code is placeholder
export class Pitcher {
  rating;
  k9;
  hr9;
  whip;
  gamesStarted;
  gamesPitched;
  set = false;
  iterations = 0;

  constructor(personJSON, year) {
    this.playerId = personJSON.id;
    this.personJSON = personJSON;
    this.year = year;
  }

  async setup() {
    await this.getStats();
    await this.setRating();
  }

  async getStats() {
    if (this.personJSON.stats) {
      let curYearIndex = this.personJSON.stats[0].splits.length - 1;
      let curYear = this.personJSON.stats[0].splits[curYearIndex].season;
      let endYear = parseFloat(curYear) - 2;
      let targetIndex = 0;
      while (parseFloat(curYear) >= endYear && !this.set) {
        for (let i = 0; i < curYearIndex + 1; i++) {
          if (this.personJSON.stats[0].splits[i].season == curYear) {
            targetIndex = i;
            break;
          }
        }
        const stats = this.personJSON.stats[0].splits[targetIndex].stat;
        this.k9 = parseFloat(stats.strikeoutsPer9Inn);
        this.hr9 = Math.max(.6, parseFloat(stats.homeRunsPer9));
        this.whip = Math.max(.65, parseFloat(stats.whip));
        this.gamesStarted = stats.gamesStarted;
        this.gamesPitched = stats.gamesPitched;
        if (this.gamesStarted >= 4 || this.gamesPitched >= 10) {
          this.set = true;
        } else {
          curYear = (parseFloat(curYear) - 1).toString();
        }
      }
      this.iterations = this.year - parseFloat(curYear);
    }
  }

  setRating() {
    if (!this.set) {
      this.rating = .75;
    } else {
      this.rating = Math.pow((.3 * Math.pow(this.k9 / 8, 1/3) + .5 * Math.pow(1.3 / this.whip, 1/3) + .2 * Math.pow(1.2 / this.hr9, 1/3)), 2);
      if (this.iterations == 1) {
        this.rating *= .95;
      } else if (this.iterations == 2) {
        this.rating *= .85;
      }
    }
  }
}

export class Position {
  rating;
  obp;
  slg;
  babip;
  stolenBases;
  atBats;
  set = false;
  iterations = 0;

  constructor(personJSON, year) {
    this.playerId = personJSON.id;
    this.personJSON = personJSON;
    this.year = year;
  }

  async setup() {
    await this.getStats();
    await this.setRating();
  }

  async getStats() {
    if (this.personJSON.stats) {
      // batting stats
      let curYearIndex = this.personJSON.stats[0].splits.length - 1;
      let curYear = this.personJSON.stats[0].splits[curYearIndex].season;
      let endYear = parseFloat(curYear) - 2;
      let targetIndex = 0;
      while (parseFloat(curYear) >= endYear && !this.set) {
        for (let i = 0; i < curYearIndex + 1; i++) {
          if (this.personJSON.stats[0].splits[i].season == curYear) {
            targetIndex = i;
            break;
          }
        }
        const stats = this.personJSON.stats[0].splits[targetIndex].stat;
        this.obp = parseFloat(stats.obp);
        this.slg = parseFloat(stats.slg);
        this.babip = parseFloat(stats.babip);
        this.stolenBases = stats.stolenBases;
        this.atBats = stats.atBats;
        if (this.atBats >= 50) {
          this.set = true;
        } else {
          curYear = (parseFloat(curYear) - 1).toString();
          this.iterations++;
        }
      }
      this.iterations = this.year - parseFloat(curYear);
    }
  }

  setRating() {
    if (!this.set) {
      this.rating = .75;
    } else { 
      const babipMultiplier = Math.pow(.300 / this.babip, 1/3);
      this.rating = (babipMultiplier) * (.7 * (this.obp / .325) + .3 * (this.slg / .410)) + (this.stolenBases * .001);
      if (this.iterations == 1) {
        this.rating *= .95;
      } else if (this.iterations == 2) {
        this.rating *= .85;
      }
    }
  }
}

export class Team {
  pitcherRating; // setRating()
  hitterRating;
  pitchers = [];
  hitters = [];
  pitcherRatings = [];
  hitterRatings = [];
  currentWins = 0; // set in getRecord
  currentLosses = 0; // set in getRecord
  winsInSeason = 0;
  lossesInSeason = 0;
  totalWins = 0; // of remaining
  totalLosses = 0; // of remaining
  postApps = 0;
  WCApps = 0;
  divisionWins = 0;
  pennantWins = 0;
  champWins = 0;
  idToNames = new Map();

  constructor(code, division, id, date = new Date(), set = false) {
    this.code = code;
    this.division = division;
    this.id = id;
    this.date = date;
    this.setNames = set;
  }

  async setup() {
    await this.getPlayers();
    await this.setPlayerRatings();
    await this.setRating();
  }

  async setRating() {
    let totalRating = 0;
    for (let i = 0; i < this.pitcherRatings.length; i++) {
      totalRating += this.pitcherRatings[i];
    }
    this.pitcherRating = totalRating / this.pitchers.length;
    totalRating = 0;
    for (let i = 0; i < this.hitterRatings.length; i++) {
      totalRating += this.hitterRatings[i];
    }
    this.hitterRating = totalRating / this.hitters.length;
  }

  async setPlayerRatings() {
    const curYear = this.date.getFullYear();
    const RELEVANT_SEASONS = `${curYear - 2},${curYear - 1},${curYear}`;
    const statHydrateH = `group=[hitting],type=[season],seasons=[${RELEVANT_SEASONS}]`;
    let hitterIds = "";
    for (let i = 0; i < this.hitters.length; i++) {
      hitterIds += String(this.hitters[i]);
      hitterIds += ',';
    }
    const getDataHitters = async () => {
      try {
        const response = await axios.get(`${MLB_API_URL}/people?personIds=${hitterIds}&hydrate=stats(${statHydrateH})`);
        for (let i = 0; i < response.data.people.length; i++) {
          const player = new Position(response.data.people[i], this.date.getFullYear());
          await player.setup();
          this.hitterRatings.push(player.rating);
        }
      } catch (error) {
        console.log(error);
      }
    }
    await getDataHitters();
    const statHydrateP = `group=[pitching],type=[season],seasons=[${RELEVANT_SEASONS}]`;
    let pitcherIds = "";
    for (let i = 0; i < this.pitchers.length; i++) {
      pitcherIds += String(this.pitchers[i]);
      pitcherIds += ',';
    }
    const getDataPitchers = async () => {
      try {
        const response = await axios.get(`${MLB_API_URL}/people?personIds=${pitcherIds}&hydrate=stats(${statHydrateP})`);
        for (let i = 0; i < response.data.people.length; i++) {
          const player = new Pitcher(response.data.people[i], this.date.getFullYear());
          await player.setup();
          this.pitcherRatings.push(player.rating)
        }
      } catch (error) {
        console.log(error);
      }
    }
    await getDataPitchers();
  }

  async getPlayers() {
    const getData = async () => {
      try {
        const formattedDate = ('0' + parseInt(this.date.getMonth() + 1)).slice(-2) + '/' +
        ('0' + this.date.getDate()).slice(-2) + '/' + this.date.getFullYear();
        const response = await axios.get(`${MLB_API_URL}/teams/${this.id}/roster?date=${formattedDate}`);
        const roster = response.data.roster;
        for (let i = 0; i < roster.length; i++) {
          const player = roster[i];
          if (player.position.code == "1") {
            this.pitchers.push(player.person.id);
          } else {
            this.hitters.push(player.person.id);
          }
          if (this.setNames) {
            this.idToNames.set(player.person.id, player.person.fullName);
          }
        }
      } catch (error) {
        console.log(error);
      }
    }
    await getData();
  }
}

async function setTeams() {
  // ids from mlbstatsapi
  let yankees = new Team('NYY', 'ALE', 147);
  await yankees.setup();
  idToTeamIndex.set(147, 0);
  teams.push(yankees);
  let redsox = new Team('BOS', 'ALE', 111);
  await redsox.setup();
  idToTeamIndex.set(111, 1);
  teams.push(redsox);
  let jays = new Team('TOR', 'ALE', 141);
  await jays.setup();
  idToTeamIndex.set(141, 2);
  teams.push(jays);
  let rays = new Team('TB', 'ALE', 139);
  await rays.setup();
  idToTeamIndex.set(139, 3);
  teams.push(rays);
  let orioles = new Team('BAL', 'ALE', 110);
  await orioles.setup();
  idToTeamIndex.set(110, 4);
  teams.push(orioles);
  let whitesox = new Team('CWS', 'ALC', 145);
  await whitesox.setup();
  idToTeamIndex.set(145, 5);
  teams.push(whitesox);
  let guardians = new Team('CLE', 'ALC', 114);
  await guardians.setup();
  idToTeamIndex.set(114, 6);
  teams.push(guardians);
  let tigers = new Team('DET', 'ALC', 116);
  await tigers.setup();
  idToTeamIndex.set(116, 7);
  teams.push(tigers);
  let royals = new Team('KC', 'ALC', 118);
  await royals.setup();
  idToTeamIndex.set(118, 8);
  teams.push(royals);
  let twins = new Team('MIN', 'ALC', 142);
  await twins.setup();
  idToTeamIndex.set(142, 9);
  teams.push(twins);
  let astros = new Team('HOU', 'ALW', 117);
  await astros.setup();
  idToTeamIndex.set(117, 10);
  teams.push(astros);
  let angels = new Team('LAA', 'ALW', 108);
  await angels.setup();
  idToTeamIndex.set(108, 11);
  teams.push(angels);
  let athletics = new Team('OAK', 'ALW', 133);
  await athletics.setup();
  idToTeamIndex.set(133, 12);
  teams.push(athletics);
  let mariners = new Team('SEA', 'ALW', 136);
  await mariners.setup();
  idToTeamIndex.set(136, 13);
  teams.push(mariners);
  let rangers = new Team('TEX', 'ALW', 140);
  await rangers.setup();
  idToTeamIndex.set(140, 14);
  teams.push(rangers);
  let braves = new Team('ATL', 'NLE', 144);
  await braves.setup();
  idToTeamIndex.set(144, 15);
  teams.push(braves);
  let marlins = new Team('MIA', 'NLE', 146);
  await marlins.setup();
  idToTeamIndex.set(146, 16);
  teams.push(marlins);
  let mets = new Team('NYM', 'NLE', 121);
  await mets.setup();
  idToTeamIndex.set(121, 17);
  teams.push(mets);
  let phillies = new Team('PHI', 'NLE', 143);
  await phillies.setup();
  idToTeamIndex.set(143, 18);
  teams.push(phillies);
  let nationals = new Team('WSH', 'NLE', 120);
  await nationals.setup();
  idToTeamIndex.set(120, 19);
  teams.push(nationals);
  let cubs = new Team('CHC', 'NLC', 112);
  await cubs.setup();
  idToTeamIndex.set(112, 20);
  teams.push(cubs);
  let reds = new Team('CIN', 'NLC', 113);
  await reds.setup();
  idToTeamIndex.set(113, 21);
  teams.push(reds);
  let brewers = new Team('MIL', 'NLC', 158);
  await brewers.setup();
  idToTeamIndex.set(158, 22);
  teams.push(brewers);
  let pirates = new Team('PIT', 'NLC', 134);
  await pirates.setup();
  idToTeamIndex.set(134, 23);
  teams.push(pirates);
  let cardinals = new Team('STL', 'NLC', 138);
  await cardinals.setup();
  idToTeamIndex.set(138, 24);
  teams.push(cardinals);
  let diamondbacks = new Team('ARI', 'NLW', 109);
  await diamondbacks.setup();
  idToTeamIndex.set(109, 25);
  teams.push(diamondbacks);
  let rockies = new Team('COL', 'NLW', 115);
  await rockies.setup();
  idToTeamIndex.set(115, 26);
  teams.push(rockies);
  let giants = new Team('SF', 'NLW', 137);
  await giants.setup();
  idToTeamIndex.set(137, 27);
  teams.push(giants);
  let padres = new Team('SD', 'NLW', 135);
  await padres.setup();
  idToTeamIndex.set(135, 28);
  teams.push(padres);
  let dodgers = new Team('LAD', 'NLW', 119);
  await dodgers.setup();
  idToTeamIndex.set(119, 29);
  teams.push(dodgers);
}

async function setCurrentRecords() {
  const getData = async () => {
    try {
      const response = await axios.get(`${MLB_API_URL}/standings?leagueId=103,104&season=${CURRENT_YEAR}&standingsTypes=regularSeason`);
      const records = response.data.records;
      if (records === undefined || records.length == 0) {
        for (let i = 0; i < teams.length; i++) {
          teams[i].currentWins = 0;
          teams[i].currentLosses = 0;
        }
      } else {
        for (let i = 0; i < records.length; i++) {
          const record = records[i];
          for (let j = 0; j < record.teamRecords.length; j++) {
            const teamRecord = record.teamRecords[j];
            let teamId = teamRecord.team.id;
            let index = idToTeamIndex.get(teamId);
            teams[index].currentWins = teamRecord.wins;
            teams[index].currentLosses = teamRecord.losses;
          }
        }
      }
    } catch (error) {
      console.log(error);
    }
  }
  await getData();
}

async function getRemainingGames() {
  let date = new Date();
  let time = date.getTime();
  while (time >= START_DATE_TIME && time <= END_DATE_TIME) {
    const getData = async () => {
      try {
        const formattedDate = ('0' + parseInt(date.getMonth() + 1)).slice(-2) + '/' +
        ('0' + date.getDate()).slice(-2) + '/' + date.getFullYear();
        const response = await axios.get(`${MLB_API_URL}/schedule/games/?sportId=1&date=${formattedDate}`);
        remainingGames.push(response);
      } catch (error) {
        console.log(error);
      }
    }
    await getData();
    date.setDate(date.getDate() + 1);
    time = date.getTime();
  }
}

function clearSeasonStats() {
  for (let team of teams) {
    team.totalWins += team.winsInSeason;
    team.totalLosses += team.lossesInSeason;
    team.winsInSeason = 0;
    team.lossesInSeason = 0;
  }
}

async function simulateRestOfSeason() {
  // simulate rest of season
  for (let k = 0; k < remainingGames.length; k++) {
    const dates = remainingGames[k].data.dates;
    for (let i = 0; i < dates.length; i++) {
      const games = dates[i].games;
      for (let j = 0; j < games.length; j++) {
        const game = games[j];
        if (game.seriesDescription != "Regular Season") {
          continue;
        }
        let teamID1 = game.teams.home.team.id;
        let teamID2 = game.teams.away.team.id;
        let result = compete(teamID1, teamID2);
        if (result == 0) {
          teams[idToTeamIndex.get(teamID1)].winsInSeason += 1;
          teams[idToTeamIndex.get(teamID2)].lossesInSeason += 1;
        } else {
            teams[idToTeamIndex.get(teamID1)].lossesInSeason += 1;
            teams[idToTeamIndex.get(teamID2)].winsInSeason += 1;
        }
      }
    }
  }
  runPostseason();
  clearSeasonStats();
}

function compareWins(id1, id2) {
  let wins1 = teams[idToTeamIndex.get(id1)].currentWins + teams[idToTeamIndex.get(id1)].winsInSeason;
  let wins2 = teams[idToTeamIndex.get(id2)].currentWins + teams[idToTeamIndex.get(id2)].winsInSeason;
  if (wins1 > wins2) {
    return -1;
  } else if (wins1 < wins2) {
    return 1;
  } else {
    return 0;
  }
}

function runPostseason() {
  let ALPost = [];
  let NLPost = [];
  let ALWCR = [];  /* 2,3 place teams in each division */
  let NLWCR = [];
  for (let i = 0; i < TEAM_IDS.length; i++) {
    TEAM_IDS[i].sort(compareWins);
    if (i < 3) {
      ALPost.push(TEAM_IDS[i][0]);
      teams[idToTeamIndex.get(TEAM_IDS[i][0])].divisionWins += 1;
      ALWCR.push(TEAM_IDS[i][1]);
      ALWCR.push(TEAM_IDS[i][2]);
    } else {
      NLPost.push(TEAM_IDS[i][0]);
      teams[idToTeamIndex.get(TEAM_IDS[i][0])].divisionWins += 1;
      NLWCR.push(TEAM_IDS[i][1]);
      NLWCR.push(TEAM_IDS[i][2]);
    }
  }
  ALPost.sort(compareWins);
  NLPost.sort(compareWins);
  ALWCR.sort(compareWins);
  NLWCR.sort(compareWins);
  for (let i = 0; i < 2; i++) {
    teams[idToTeamIndex.get(ALWCR[i])].WCApps += 1;
    teams[idToTeamIndex.get(NLWCR[i])].WCApps += 1;
    ALPost.push(ALWCR[i]);
    NLPost.push(NLWCR[i]);
  }
  for (let i = 0; i < ALPost.length; i++) {
    teams[idToTeamIndex.get(ALPost[i])].postApps += 1;
    teams[idToTeamIndex.get(NLPost[i])].postApps += 1;
  }
  let alwcLoser = runPostseasonSeries(ALPost[3], ALPost[4], 0);
  ALPost.splice(ALPost.indexOf(alwcLoser), 1);
  let nlwcLoser = runPostseasonSeries(NLPost[3], NLPost[4], 0);
  NLPost.splice(NLPost.indexOf(nlwcLoser), 1);
  let aldsLosers = [];
  let nldsLosers = [];
  aldsLosers.push(runPostseasonSeries(ALPost[0], ALPost[3], 1));
  aldsLosers.push(runPostseasonSeries(ALPost[1], ALPost[2], 1));
  nldsLosers.push(runPostseasonSeries(NLPost[0], NLPost[3], 1));
  nldsLosers.push(runPostseasonSeries(NLPost[1], NLPost[2], 1));
  for (let i = 0; i < aldsLosers.length; i++) {
    ALPost.splice(ALPost.indexOf(aldsLosers[i]), 1);
    NLPost.splice(NLPost.indexOf(nldsLosers[i]), 1);
  }
  let alWinner = runPostseasonSeries(ALPost[0], ALPost[1], 2);
  let nlWinner = runPostseasonSeries(NLPost[0], NLPost[1], 2);
  teams[idToTeamIndex.get(alWinner)].pennantWins += 1;
  teams[idToTeamIndex.get(nlWinner)].pennantWins += 1;
  let wsHome = compareWins(alWinner, nlWinner);
  let winner = 0;
  if (wsHome == -1) {
    winner = runPostseasonSeries(alWinner, nlWinner, 3);
  } else {
    winner = runPostseasonSeries(nlWinner, alWinner, 3);
  }
  teams[idToTeamIndex.get(winner)].champWins += 1;
}

function runPostseasonSeries(id1, id2, stage) {
  /* @param
   * id1: id of team w/ homeadvantage
   * id2: id of other team
   * post stage: 0 - WC, 1 - DS, 2 - CS, 3 - WS
   * @return
   * id of losing team in 0, 1. id of winner in 2,3
   */
  if (stage == 0) {
    let res = compete(id1, id2);
    return res == 0 ? id2 : id1;
  } else if (stage == 1) {
    let wins1 = 0;
    let wins2 = 0;
    compete(id1, id2) == 0 ? wins1++ : wins2++;
    compete(id1, id2) == 0 ? wins1++ : wins2++;
    compete(id2, id1) == 0 ? wins2++ : wins1++;
    compete(id2, id1) == 0 ? wins2++ : wins1++;
    compete(id1, id2) == 0 ? wins1++ : wins2++;
    if (wins1 >= 3) {
      return id2;
    } else {
      return id1;
    }
  } else {
    let wins1 = 0;
    let wins2 = 0;
    compete(id1, id2) == 0 ? wins1++ : wins2++;
    compete(id1, id2) == 0 ? wins1++ : wins2++;
    compete(id2, id1) == 0 ? wins2++ : wins1++;
    compete(id2, id1) == 0 ? wins2++ : wins1++;
    compete(id2, id1) == 0 ? wins2++ : wins1++;
    compete(id1, id2) == 0 ? wins1++ : wins2++;
    compete(id1, id2) == 0 ? wins1++ : wins2++;
    if (wins1 >= 4) {
      return id1;
    } else {
      return id2;
    }
  }
}

function compete(id1, id2) {
  // returns 0 if team1 wins, 1 if team2 wins
  // team1 is home team
  // TODO
  let prob = getProbability(teams[idToTeamIndex.get(id1)], teams[idToTeamIndex.get(id2)]);
  const rand = Math.random();
  if (rand <= prob) {
    return 0;
  } else {
    return 1;
  }
}

function getProbability(team1, team2, pitcher1Rating, pitcher2Rating) {
  /* @param 
   * team1 - home, team2 - away
   * @return probability of team1 winning
   */
  if (pitcher1Rating === undefined) {
    pitcher1Rating = team1.pitcherRating;
  }
  if (pitcher2Rating === undefined) {
    pitcher2Rating = team2.pitcherRating;
  }
  // TEMP (WIP)
  const team1Rating = ((pitcher1Rating + team1.pitcherRating) / 2 + team1.hitterRating) / 2;
  const team2Rating = ((pitcher2Rating + team2.pitcherRating) / 2 + team2.hitterRating) / 2;
  return Math.pow(team1Rating, 3) / (Math.pow(team2Rating, 3) + Math.pow(team1Rating, 3));
}

export async function simulateOneDate(id, date) {
  /* @param
   * id - teamId
   * date - native javascript object
   */
  let gameResponses = [];
  const getData = async () => {
    try {
      const formattedDate = ('0' + parseInt(date.getMonth() + 1)).slice(-2) + '/' +
      ('0' + date.getDate()).slice(-2) + '/' + date.getFullYear();
      const response = await axios.get(`${MLB_API_URL}/schedule/games/?sportId=1&date=${formattedDate}&teamId=${id}`);
      console.log(`${MLB_API_URL}/schedule/games/?sportId=1&date=${formattedDate}&teamId=${id}`);
      console.log(response.data.totalGames);
      for (let i = 0; i < response.data.totalGames; i++) {
        const game = response.data.dates[0].games[i];
        let gameResponse = await simulateOneGame(game, date);
        gameResponse[0][1] = formattedFloat(gameResponse[0][1]);
        gameResponse[0][2] = formattedFloat(gameResponse[0][2]);
        gameResponse[0][3] = formattedFloat(gameResponse[0][3]);
        gameResponse[0][4] = formattedFloat(100 * gameResponse[0][4]);
        gameResponse[1][1] = formattedFloat(gameResponse[1][1]);
        gameResponse[1][2] = formattedFloat(gameResponse[1][2]);
        gameResponse[1][3] = formattedFloat(gameResponse[1][3]);
        gameResponse[1][4] = formattedFloat(100 * gameResponse[1][4]);
        gameResponses.push(gameResponse);
      }
    } catch (error) {
      console.log(error);
    }
  }
  await getData();
  return gameResponses;
}

async function simulateOneGame(game, date) {
  const gameId = game.gamePk;
  const gameBox = await axios.get(`${MLB_API_URL}/game/${gameId}/boxscore`);
  const linescore = await axios.get(`${MLB_API_URL}/game/${gameId}/linescore`);
  const id1  = game.teams.home.team.id;
  const id2 = game.teams.away.team.id;
  // fix divisions later (TODO)
  let team1 = new Team(game.teams.home.team.name, "ALE", id1, date, true);
  await team1.setup();
  let team2 = new Team(game.teams.away.team.name, "ALE", id2, date, true);
  await team2.setup();
  let startingPitcher1 = gameBox.data.teams.home.pitchers[0];
  let startingPitcher2 = gameBox.data.teams.away.pitchers[0];
  if (startingPitcher1 === undefined && game.teams.home.probablePitcher !== undefined) {
    startingPitcher1 = game.teams.home.probablePitcher.id;
  }
  if (startingPitcher2 === undefined && game.teams.away.probablePitcher !== undefined) {
    startingPitcher2 = game.teams.away.probablePitcher.id;
  }
  let startingPitcher1R = team1.pitcherRatings[team1.pitchers.indexOf(startingPitcher1)];
  let startingPitcher2R = team2.pitcherRatings[team2.pitchers.indexOf(startingPitcher2)];
  const prob = getProbability(team1, team2, startingPitcher1R, startingPitcher2R);
  let lineup1 = [];
  for (let i = 0; i < gameBox.data.teams.home.battingOrder.length; i++) {
    if (i == 1) {
      console.log(gameBox.data.teams.home.battingOrder[i]);
    }
    lineup1.push(team1.idToNames.get(gameBox.data.teams.home.battingOrder[i]));
  }
  lineup1.push(team1.idToNames.get(startingPitcher1));
  let lineup2 = [];
  for (let i = 0; i < gameBox.data.teams.away.battingOrder.length; i++) {
    lineup2.push(team2.idToNames.get(gameBox.data.teams.away.battingOrder[i]));
  }
  lineup2.push(team2.idToNames.get(startingPitcher2));
  const runs1 = linescore.data.teams.home.runs;
  const runs2 = linescore.data.teams.away.runs;
  const team1Res = [team1.code, team1.pitcherRating, team1.hitterRating, startingPitcher1R, prob, lineup1, runs1];
  const team2Res = [team2.code, team2.pitcherRating, team2.hitterRating, startingPitcher2R, 1 - prob, lineup2, runs2];
  return [team1Res, team2Res];
}

export async function simulateToday(date = new Date()) {
  await DateProjection.deleteMany({});
  let gameResponses = [];
  const getData = async () => {
    try {
      const formattedDate = ('0' + parseInt(date.getMonth() + 1)).slice(-2) + '/' +
      ('0' + date.getDate()).slice(-2) + '/' + date.getFullYear();
      const response = await axios.get(`${MLB_API_URL}/schedule/games/?sportId=1&date=${formattedDate}&hydrate=probablePitcher`);
      for (let i = 0; i < response.data.totalGames; i++) {
        const game = response.data.dates[0].games[i];
        const gameResponse = await simulateOneGame(game, date);
        gameResponses.push([
          {
            name: gameResponse[0][0],
            pitchingRating: formattedFloat(gameResponse[0][1]),
            hittingRating: formattedFloat(gameResponse[0][2]),
            startingPitcherRating: formattedFloat(gameResponse[0][3]),
            probability: formattedFloat(100 * gameResponse[0][4])
          },
          {
            name: gameResponse[1][0],
            pitchingRating: formattedFloat(gameResponse[1][1]),
            hittingRating: formattedFloat(gameResponse[1][2]),
            startingPitcherRating: formattedFloat(gameResponse[1][3]),
            probability: formattedFloat(100 * gameResponse[1][4])
          }
        ]);
      }
    } catch (error) {
      console.log(error);
    }
  }
  await getData();
  const todayData = new DateProjection({
    date: date, 
    games: gameResponses
  });
  todayData.save();
  console.log("Updated DB With Today's Projections!")
}

function formattedFloat(x) {
  if (x === undefined) {
    return x;
  }
  return parseFloat(x.toPrecision(5));
}

async function addToDB() {
  await TeamResult.deleteMany({});
  let teamResults = [];
  for (let i = 0; i < teams.length; i++) {
    const playoffOdds = formattedFloat(teams[i].postApps * 100 / TOTAL_ITERATIONS);
    const genTeam = new TeamResult({
      code: teams[i].code,
      division: teams[i].division,
      currentWins: teams[i].currentWins,
      currentLosses: teams[i].currentLosses,
      projWins: formattedFloat((teams[i].totalWins / TOTAL_ITERATIONS) + teams[i].currentWins),
      projLosses: formattedFloat((teams[i].totalLosses / TOTAL_ITERATIONS) + teams[i].currentLosses),
      playoffOdds: playoffOdds,
      divisionOdds: formattedFloat(teams[i].divisionWins * 100 / TOTAL_ITERATIONS),
      WCOdds: formattedFloat(teams[i].WCApps * 100 / TOTAL_ITERATIONS),
      pennantOdds: formattedFloat(teams[i].pennantWins * 100 / TOTAL_ITERATIONS),
      championshipOdds: formattedFloat(teams[i].champWins * 100 / TOTAL_ITERATIONS)});
    genTeam.save();
    teamResults.push(
      {
        code: teams[i].code,
        division: teams[i].division,
        odds: playoffOdds
      }
    );
  }
  const date = new Date();
  const formattedDate = date.getFullYear() + '-' + ('0' + parseInt(date.getMonth() + 1)).slice(-2) 
    + '-' + ('0' + date.getDate()).slice(-2);
  await DateResult.deleteMany({date: formattedDate});
  const dateResult = new DateResult({
    date: formattedDate,
    teamResults: teamResults
  });
  dateResult.save();
  console.log("Successfully Updated DB!");
}