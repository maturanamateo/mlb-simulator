import mongoose, { Schema } from 'mongoose';

const dateResultSchema = new Schema({
    date: {
        type: Date,
        required: true
    },
    teamResults: [
        {
            teamCode: {
                type: String,
                required: true
            },
            division: {
                type: String,
                enum: ['ALE', 'ALC', 'ALW', 'NLE', 'NLC', 'NLW'],
                required: true
            },
            odds: {
                type: Number,
                required: true
            }
        }
    ]
});

export const DateResult = mongoose.model('DateResult', dateResultSchema);