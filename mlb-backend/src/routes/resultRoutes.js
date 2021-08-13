import express from 'express';
import { getResults, getResultsByDate, getTeamResultDate, getTodayProjections} from '../controllers/resultsController';

const resultRouter = express.Router();

resultRouter.get('/results', getResults);

resultRouter.get('/date', getResultsByDate);

resultRouter.get('/game', getTeamResultDate);

resultRouter.get('/projections', getTodayProjections);

export default resultRouter;