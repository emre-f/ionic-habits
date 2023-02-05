const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);

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
        records: [{ // Past readings
            type: Number,
            required: false
        }],
        notes: {
            type: String,
            default: ""
        }
    },
    {
        timestamps: true // Will give us createdAt and updatedAt
    }
);

// // Will track numbers and assign them
// habitSchema.plugin(AutoIncrement, {
//     inc_field: 'ticket',
//     id: 'ticketNums',
//     start_seq: 0
// })

module.exports = mongoose.model('Habit', habitSchema);