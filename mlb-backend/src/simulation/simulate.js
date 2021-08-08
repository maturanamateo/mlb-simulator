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
      simulateRestOfSeason();
    }
);

simulateRestOfSeason() {
    let a = 2; // simulateSeason here
}