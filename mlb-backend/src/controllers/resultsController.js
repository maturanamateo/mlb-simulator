import { TeamResult } from '../models/TeamResult';
import { DateResult } from '../models/DateResult';
import { Types } from 'mongoose';

export async function getResults(req, res, next) {
    /* 
     * Order ALE -> ALC -> ALW -> NLE -> NLC -> NLW
     * so easier to interpret on Frontend
     */
    const divisions = ['ALE', 'ALC', 'ALW', 'NLE', 'NLC', 'NLW'];
    let results = [];
    for (const division of divisions) {
        for (let i = 0; i < 5; i++) {
            let result = await TeamResult.findOne({division: division})
                .sort({playoffOdds: -1, divisionOdds: -1, pennantOdds: -1}).skip(i);
            results.push(result);
        }
    }
    return res.json(results);
}

export async function getResultsByDate(req, res, next) {
    const date = Date(req.body.date);
    let dateString = date.toISOString().slice(0, 10);
    let results = [];
    results = await DateResult.find({date: new Date(dateString)});
    return res.json(results);
}