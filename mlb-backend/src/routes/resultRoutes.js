import express from 'express';
import { getResults } from '../controllers/resultsController';

const resultRouter = express.Router();

resultRouter.get('/results', getResults);

export default resultRouter;