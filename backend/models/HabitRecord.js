const mongoose = require('mongoose');

const habitRecordSchema = new mongoose.Schema(
    {
        value: {
            type: Number,
            required: true
        },
        date: {
            type: Date,
            required: true
        }
    },
    {
        timestamps: true // Will give us createdAt and updatedAt
    }
);

module.exports = mongoose.model('HabitRecord', habitRecordSchema);