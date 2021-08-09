import { TeamResult } from '../models/TeamResult';
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
  await TeamResult.deleteMany({});
  const yankees = new TeamResult({
      code: "NYY",
      division: 'ALE',
      currentWins: 61,
      currentLosses: 49,
      projWins: 88.0,
      projLosses: 74.0,
      playoffOdds: 27.2,
      divisionOdds: 1.7,
      WCOdds: 25.5,
      pennantOdds: 2.0,
      championshipOdds: 0.6
  });
  yankees.save();
}

function simulateRestOfSeason() {
    let a = 2; // simulateSeason here
}