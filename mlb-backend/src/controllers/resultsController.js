import { TeamResult } from '../models/TeamResult';
import { Types } from 'mongoose';

export async function getResults(req, res, next) {
    /* 
     * Order ALE -> ALC -> ALW -> NLE -> NLC -> NLW
     * so easier to interpret on Frontend
     */
    const divisions = ['ALE', 'ALC', 'ALW', 'NLE', 'NLC', 'NLW'];
    let results = [];
    for (const division of divisions) {
        for (let i = 0; i < 6; i++) {
            let result = await TeamResult.find({division: 'ALE'})
                .sort({playoffOdds: -1}).skip(i);
            results.push(result);
        }
    }
    return res.json(results);
}