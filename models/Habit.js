const mongoose = require('mongoose');
const HabitRecord = require('../models/HabitRecord')

const habitSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true
        },
        unitName: {
            type: String,
            required: true,
            default: "Percentage"
        },
        unitMin: {
            type: Number,
            required: true,
            default: 0
        },
        unitMax: {
            type: Number,
            required: true,
            default: 100
        },
        records: [mongoose.model('HabitRecord').schema],
        notes: {
            type: String,
            default: ""
        }
    },
    {
        timestamps: true // Will give us createdAt and updatedAt
    }
);

module.exports = mongoose.model('Habit', habitSchema);