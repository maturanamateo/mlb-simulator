import logger from 'morgan';
import express from 'express';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import indexRouter from './routes/index';
import dotenv from 'dotenv';
dotenv.config();
const app = express();
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use('/v1', indexRouter);

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
    app.listen(process.env.PORT, () => {
      console.log(`Server started on port ${process.env.PORT}.`);
    });
  }
);

export default app;