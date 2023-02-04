const mongoose = require('mongoose');
const Habit = require('../models/Habit')

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    habits: [mongoose.model('Habit').schema]
});

module.exports = mongoose.model('User', userSchema);