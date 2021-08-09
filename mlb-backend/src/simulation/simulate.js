import { TeamResult } from '../models/TeamResult';
import { DateResult } from '../models/DateResult';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

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
      //simulateRestOfSeason();
      loadDummyData();
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
        teamCode: 'NYY',
        division: 'ALE',
        odds: 27.2
      },
      {
        teamCode: 'TB',
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
        teamCode: 'NYY',
        division: 'ALE',
        odds: 22.1
      },
      {
        teamCode: 'TB',
        division: 'ALE',
        odds: 97.1
      }
    ]
  });
  august9.save();
}

function simulateRestOfSeason() {
    let a = 2; // simulateSeason here
}