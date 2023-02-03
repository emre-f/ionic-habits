const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);

const habitSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId, // Referring to user type
            required: true,
            ref: 'User'
        },
        type: {
            type: mongoose.Schema.Types.ObjectId, // Kind of habit
            required: true
        },
        value: {
            type: Number,
            required: true
        },
        notes: {
            type: String,
            required: false
        }
    },
    {
        timestamps: true // Will give us createdAt and updatedAt
    }
);

// Will track numbers and assign them
habitSchema.plugin(AutoIncrement, {
    inc_field: 'ticket',
    id: 'ticketNums',
    start_seq: 0
})

module.exports = mongoose.model('Habit', habitSchema);