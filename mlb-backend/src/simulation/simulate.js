import { TeamResult } from '../models/TeamResult';
import { DateResult } from '../models/DateResult';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const TOTAL_GAMES = 162;
const codeToTeamIndex = new Map(); // easy lookups when doing games
let teams = [];
const TOTAL_ITERATIONS = 1000;

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
      setTeams();
      for (let i = 0; i < TOTAL_ITERATIONS; i++) {
        simulateRestOfSeason();
      }
      addToDB();
    }
);

async function loadDummyData() {
  // dummy data as of 8/8
  await TeamResult.deleteMany({});
  const divisions = ['ALE', 'ALC', 'ALW', 'NLE', 'NLC', 'NLW'];
  for (const divisionCur of divisions) {
    const yankees = new TeamResult({
        code: "NYY",
        division: divisionCur,
        currentWins: 61,
        currentLosses: 49,
        projWins: 88.0,
        projLosses: 74.0,
        playoffOdds: 27.2,
        divisionOdds: 1.7,
        WCOdds: 25.5,
        pennantOdds: 2.0,
        championshipOdds: 0.6});
    yankees.save();
    const rays = new TeamResult({
      code: "TB",
      division: divisionCur,
      currentWins: 67,
      currentLosses: 44,
      projWins: 97.2,
      projLosses: 64.8,
      playoffOdds: 96.4,
      divisionOdds: 79.3,
      WCOdds: 17.1,
      pennantOdds: 29.9,
      championshipOdds: 17.2});
    rays.save();
    const redsox = new TeamResult({
      code: "BOS",
      division: divisionCur,
      currentWins: 65,
      currentLosses: 48,
      projWins: 91.3,
      projLosses: 70.7,
      playoffOdds: 61.9,
      divisionOdds: 11.4,
      WCOdds: 50.5,
      pennantOdds: 7.1,
      championshipOdds: 2.9});
    redsox.save();
    const jays = new TeamResult({
      code: "TOR",
      division: divisionCur,
      currentWins: 59,
      currentLosses: 50,
      projWins: 90.6,
      projLosses: 71.4,
      playoffOdds: 54.9,
      divisionOdds: 7.6,
      WCOdds: 47.3,
      pennantOdds: 10.1,
      championshipOdds: 5.8});
    jays.save();
    const orioles = new TeamResult({
      code: "BAL",
      division: divisionCur,
      currentWins: 38,
      currentLosses: 71,
      projWins: 58.9,
      projLosses: 103.1,
      playoffOdds: 0,
      divisionOdds: 0,
      WCOdds: 0,
      pennantOdds: 0,
      championshipOdds: 0});
    orioles.save();
  }
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
  const Mlbplayers = require('mlbplayers');
  var options = {
    path: 'year_2011/month_07/day_23'
  };
  var mlbplayers = new Mlbplayers(options);
  console.log(mlbplayers);
  console.log("hi");
  mlbplayers.get(function (err, players) {
    console.log(players);
  });
}

// Class code is placeholder
export class Pitcher {
  rating;
  hr9;

  constructor(firstName, lastName, playerId) {
    this.firstName = firstName;
    this.lastName = lastName;
    this.playerId = playerId;
    this.getStats();
    this.setRating();
  }

  getStats() {
    this.hr9 = 1.4;
  }

  setRating() {
    this.rating = 1/(this.hr9);
  }
}

export class Position {
  rating;
  ops;

  constructor(firstName, lastName, playerId) {
    this.firstName = firstName;
    this.lastName = lastName;
    this.playerId = playerId;
    this.getStats();
    this.setRating();
  }

  getStats() {
    this.ops = .905;
  }

  setRating() {
    this.rating = ops;
  }
}

export class Team {
  rating; // setRating()
  pitchers = [];
  hitters = [];
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

  constructor(code, division) {
    this.code = code;
    this.division = division;
    this.getCurrentRecord();
    this.getPlayers();
    this.setRating();
  }

  setRating() {
    // TODO
    this.rating = 1500;
  }

  getCurrentRecord() {
    // TODO
    this.currentWins = 81;
    this.currentLosses = 81;
  }

  getPlayers() {
    // TODO
  }
}

function setTeams() {
  let yankees = new Team('NYY', 'ALE');
  codeToTeamIndex.set('NYY', 0);
  teams.push(yankees);
  let redsox = new Team('BOS', 'ALE');
  codeToTeamIndex.set('BOS', 1);
  teams.push(redsox);
  let jays = new Team('TOR', 'ALE');
  codeToTeamIndex.set('TOR', 2);
  teams.push(jays);
  let rays = new Team('TB', 'ALE');
  codeToTeamIndex.set('TB', 3);
  teams.push(rays);
  let orioles = new Team('BAL', 'ALE');
  codeToTeamIndex.set('BAL', 4);
  teams.push(orioles);
  let whitesox = new Team('CWS', 'ALC');
  codeToTeamIndex.set('CWS', 5);
  teams.push(whitesox);
  let indians = new Team('CLE', 'ALC');
  codeToTeamIndex.set('CLE', 6);
  teams.push(indians);
  let tigers = new Team('DET', 'ALC');
  codeToTeamIndex.set('DET', 7);
  teams.push(tigers);
  let royals = new Team('KC', 'ALC');
  codeToTeamIndex.set('KC', 8);
  teams.push(royals);
  let twins = new Team('MIN', 'ALC');
  codeToTeamIndex.set('MIN', 9);
  teams.push(twins);
  let astros = new Team('HOU', 'ALW');
  codeToTeamIndex.set('HOU', 10);
  teams.push(astros);
  let angels = new Team('LAA', 'ALW');
  codeToTeamIndex.set('LAA', 11);
  teams.push(angels);
  let athletics = new Team('OAK', 'ALW');
  codeToTeamIndex.set('OAK', 12);
  teams.push(athletics);
  let mariners = new Team('SEA', 'ALW');
  codeToTeamIndex.set('SEA', 13);
  teams.push(mariners);
  let rangers = new Team('TEX', 'ALW');
  codeToTeamIndex.set('TEX', 14);
  teams.push(rangers);
  let braves = new Team('ATL', 'NLE');
  codeToTeamIndex.set('ATL', 15);
  teams.push(braves);
  let marlins = new Team('MIA', 'NLE');
  codeToTeamIndex.set('MIA', 16);
  teams.push(marlins);
  let mets = new Team('NYM', 'NLE');
  codeToTeamIndex.set('NYM', 17);
  teams.push(mets);
  let phillies = new Team('PHI', 'NLE');
  codeToTeamIndex.set('PHI', 18);
  teams.push(phillies);
  let nationals = new Team('WSH', 'NLE');
  codeToTeamIndex.set('WSH', 19);
  teams.push(nationals);
  let cubs = new Team('CHC', 'NLC');
  codeToTeamIndex.set('CHC', 20);
  teams.push(cubs);
  let reds = new Team('CIN', 'NLC');
  codeToTeamIndex.set('CIN', 21);
  teams.push(reds);
  let brewers = new Team('MIL', 'NLC');
  codeToTeamIndex.set('MIL', 22);
  teams.push(brewers);
  let pirates = new Team('PIT', 'NLC');
  codeToTeamIndex.set('PIT', 23);
  teams.push(pirates);
  let cardinals = new Team('STL', 'NLC');
  codeToTeamIndex.set('STL', 24);
  teams.push(cardinals);
  let diamondbacks = new Team('ARI', 'NLW');
  codeToTeamIndex.set('ARI', 25);
  teams.push(diamondbacks);
  let rockies = new Team('COL', 'NLW');
  codeToTeamIndex.set('COL', 26);
  teams.push(rockies);
  let giants = new Team('SF', 'NLW');
  codeToTeamIndex.set('SF', 27);
  teams.push(giants);
  let padres = new Team('SD', 'NLW');
  codeToTeamIndex.set('SD', 28);
  teams.push(padres);
  let dodgers = new Team('LAD', 'NLW');
  codeToTeamIndex.set('LAD', 29);
  teams.push(dodgers);
}

function clearSeasonStats() {
  for (let team of teams) {
    team.totalWins += team.winsInSeason;
    team.totalLosses += team.lossesInSeason;
    team.winsInSeason = 0;
    team.lossesInSeason = 0;
  }
}

function simulateRestOfSeason() {
  // simulate rest of season
  clearSeasonStats();
}

async function addToDB() {
  await TeamResult.deleteMany({});
  for (let team of teams) {
    const genTeam = new TeamResult({
      code: team.code,
      division: team.division,
      currentWins: team.currentWins,
      currentLosses: team.currentLosses,
      projWins: (team.totalWins / TOTAL_ITERATIONS) + team.currentWins,
      projLosses: (team.totalLosses / TOTAL_ITERATIONS) + team.currentLosses,
      playoffOdds: team.postApps / TOTAL_ITERATIONS,
      divisionOdds: team.divisionWins / TOTAL_ITERATIONS,
      WCOdds: team.WCApps / TOTAL_ITERATIONS,
      pennantOdds: team.pennantWins / TOTAL_ITERATIONS,
      championshipOdds: team.champWins / TOTAL_ITERATIONS});
    genTeam.save();
  }
}