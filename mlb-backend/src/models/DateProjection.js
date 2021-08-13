import mongoose, { Schema } from 'mongoose';

const dateProjectionSchema = new Schema({
    date: {
        type: Date,
        default: Date.now,
        required: true
    },
    games: [
        [
            {
                name: {
                    type: String,
                    required: true
                },
                pitchingRating: {
                    type: Number,
                    required: true
                },
                hittingRating: {
                    type: Number,
                    required: true
                },
                startingPitcherRating: {
                    type: Number,
                    required: true
                },
                probability: {
                    type: Number,
                    required: true
                }
            }
        ]
    ]
});

export const DateProjection = mongoose.model('DateProjection', dateProjectionSchema);