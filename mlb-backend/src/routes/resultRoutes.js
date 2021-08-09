import express from 'express';
import { getResults } from '../controllers/resultsController';

const router = express.Router();

router.get('/results', getResults);

export default router;