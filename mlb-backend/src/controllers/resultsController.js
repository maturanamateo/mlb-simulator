import { TeamResult } from '../models/TeamResult';
import { DateResult } from '../models/DateResult';
import { DateProjection } from '../models/DateProjection';
import { simulateOneDate } from '../simulation/simulate';
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
                .sort({playoffOdds: -1, divisionOdds: -1, pennantOdds: -1, currentLosses: 1}).skip(i);
            results.push(result);
        }
    }
    return res.json(results);
}

export async function getResultsByDate(req, res, next) {
    let results = [];
    results = await DateResult.find({}).sort({date: 1});
    return res.json(results);
}

export async function getTeamResultDate(req, res, next) {
    const teamId = req.query.id;
    const dateString = req.query.date;
    if (teamId === undefined || dateString === undefined) {
        const error = new Error("Invalid teamId or date");
        error.statusCode = 404;
        throw error;
    }
    /* e.g. 08-09-2021 */
    const date = new Date(dateString.substring(6, 10), parseInt(dateString.substring(0, 2)) - 1, dateString.substring(3, 5));
    const response = await simulateOneDate(teamId, date);
    return res.json(response);
}

export async function getTodayProjections(req, res, next) {
    const result = await DateProjection.find({});
    if (result.length != 1) {
        const error = new Error("More than 1 result in DB");
        error.statusCode = 404;
        throw error;
    }
    return res.json(result[0]);
}