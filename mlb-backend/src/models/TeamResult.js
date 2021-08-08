import mongoose, { Schema } from 'mongoose';

const teamResultSchema = new Schema({
    code: {
        type: String,
        required: true
    },
    division: {
        type: String,
        enum: ['ALE', 'ALC', 'ALW', 'NLE', 'NLC', 'NLW'],
        requried: true
    },
    currentWins: {
        type: Number,
        required: true
    },
    currentLosses: {
        type: Number,
        required: true
    },
    projWins: {
        type: Number,
        required: true
    },
    projLosses: {
        type: Number,
        required: true
    },
    playoffOdds: {
        type: Number,
        required: true
    },
    divisionOdds: {
        type: Number,
        required: true
    },
    WCOdds: {
        type: Number,
        required: true
    },
    pennantOdds: {
        type: Number,
        required: true
    },
    championshipOdds: {
        type: Number,
        required: true
    }
});

export default mongoose.model('Result', teamResultSchema)