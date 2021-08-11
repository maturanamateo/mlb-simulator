import express from 'express';
import { getResults, getResultsByDate, getTeamResultDate } from '../controllers/resultsController';

const resultRouter = express.Router();

resultRouter.get('/results', getResults);

resultRouter.get('/date', getResultsByDate);

resultRouter.get('/game', getTeamResultDate);

export default resultRouter;