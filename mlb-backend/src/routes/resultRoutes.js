import express from 'express';
import { getResults, getResultsByDate } from '../controllers/resultsController';

const resultRouter = express.Router();

resultRouter.get('/results', getResults);

resultRouter.get('/date', getResultsByDate);

export default resultRouter;