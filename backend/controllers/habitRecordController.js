const User = require('../models/User')
const asyncHandler = require('express-async-handler')
const mongoose = require('mongoose')

// @desc Get all records for a habit
// @route GET /users/:id/habits/:habitId/records
// @access Private
const getAllHabitRecords = asyncHandler(async (req, res) => {
    const { id, habitId } = req.params

    // 0. Validate IDs
    if (!id) { return res.status(400).json({ message: "User ID required" }) }
    if (!mongoose.isValidObjectId(id)) { return res.status(400).json({ message: "Invalid user ID" }) }
    if (!habitId) { return res.status(400).json({ message: "Habit ID required" }) }
    if (!mongoose.isValidObjectId(habitId)) { return res.status(400).json({ message: "Invalid habit ID" }) }

    // 1. Find user & habit
    const filteredUser = await User.findById(id).select({ habits: { $elemMatch: {_id: habitId} }}).lean().exec()
    if (!filteredUser) {
        return res.status(400).json({ message: "User not found" })
    }

    const filteredHabits = filteredUser.habits
    if(!filteredHabits?.length) { return res.status(404).json({ message: `Habit not found for user ${id}` }) }

    const habit = filteredHabits[0]

    // 2. Get records
    if (!habit.records?.length) { 
        return res.status(404).json({ message: `No records found for habit ${habitId}` }) 
    }

    res.json(habit.records)
})

// @desc Get a habit record
// @route GET /users/:id/habits/:id/records/:recordId
// @access Private
const getHabitRecordById = asyncHandler(async (req, res) => {
    const { id, habitId, recordId } = req.params

    // 0. Validate IDs
    if (!id) { return res.status(400).json({ message: "User ID required" }) }
    if (!mongoose.isValidObjectId(id)) { return res.status(400).json({ message: "Invalid user ID" }) }
    if (!habitId) { return res.status(400).json({ message: "Habit ID required" }) }
    if (!mongoose.isValidObjectId(habitId)) { return res.status(400).json({ message: "Invalid habit ID" }) }
    if (!recordId) { return res.status(400).json({ message: "Record ID required" }) }
    if (!mongoose.isValidObjectId(recordId)) { return res.status(400).json({ message: "Invalid record ID" }) }

    // 1. Get user & habit
    const filteredUser = await User.findById(id).select({ habits: { $elemMatch: {_id: habitId} }}).lean().exec()
    if (!filteredUser) {
        return res.status(400).json({ message: "User not found" })
    }

    const filteredHabits = filteredUser.habits
    if(!filteredHabits?.length) { return res.status(404).json({ message: `Habit not found for user ${id}` }) }

    const habit = filteredHabits[0]

    // 2. Find specific record from habit's records
    let index = -1
    for (let i = 0; i < habit.records.length; i++) {
        if (habit.records[i]._id == recordId) {
            index = i
            break
        }
    }
    if (index === -1) { return res.status(404).json({ message: `Record not found for habit ${habitId}` }) } 

    res.json(habit.records[index])
})

// @desc Create habit record
// @route POST /users/:id/habits/:habitId/records
// @access Private
const createNewHabitRecord = asyncHandler(async (req, res) => {
    const { id, habitId } = req.params

    // 0. Validate IDs
    if (!id) { return res.status(400).json({ message: "User ID required" }) }
    if (!mongoose.isValidObjectId(id)) { return res.status(400).json({ message: "Invalid user ID" }) }
    if (!habitId) { return res.status(400).json({ message: "Habit ID required" }) }
    if (!mongoose.isValidObjectId(habitId)) { return res.status(400).json({ message: "Invalid habit ID" }) }

    const user = await User.findById(id).exec() // No lean, we want save method

    // 1. Get user & habit
    const filteredUser = await User.findById(id).select({ habits: { $elemMatch: {_id: habitId} }}).lean().exec()
    if (!filteredUser) {
        return res.status(400).json({ message: "User not found" })
    }

    const filteredHabits = filteredUser.habits
    if(!filteredHabits?.length) { return res.status(404).json({ message: `Habit not found for user ${id}` }) }

    const habit = filteredHabits[0]

    // 2. Get & validate data
    const { value, date } = req.body

    if (typeof value === "undefined") { return res.status(400).json({ message: "Value is required" }) }
    if (typeof value !== "number") { return res.status(400).json({ message: "Value must be a number" }) }

    if (value < habit.unitMin || value > habit.unitMax) {
        return res.status(400).json({ message: `Value must be between the minimum value (${habit.unitMin}) and maximum value (${habit.unitMax})` })
    }

    if (typeof date === "undefined") { return res.status(400).json({ message: "Date is required" }) }
    let dateStructure = new Date(date)
    if (dateStructure.toString() === "Invalid Date") { return res.status(400).json({ message: "Invalid date" }) }

    // 3. Check for duplicate dates
    const records = habit.records
    if (records.find(item => item.date.toString() === dateStructure.toString())) {
        return res.status(409).json({ message: "Duplicate date" }) // Conflict
    }

    // 4. Create & insert record
    const recordObject = { value, date }

    let index = -1 // Find habit
    for (let i = 0; i < user.habits.length; i++) {
        if (user.habits[i]._id == habitId) {
            index = i
            break
        }
    }

    if (index === -1) { return res.status(404).json({ message: "Habit not found" }) }

    // Add the new habit
    user.habits[index].records.push(recordObject)

    const updatedUser = await user.save()
    // No need for catch error because asyncHandler will
    res.json({ message: `User ${updatedUser.username}'s ${habit.name} habit updated` })
})

// @desc Update habit record
// @route PATCH /users/:id/habits/:habitId/records/:recordId
// @access Private
const updateHabitRecord = asyncHandler(async (req, res) => { console.log("update habit")
    const { id, habitId, recordId } = req.params // IDs  

    // 0. Validate IDs
    if (!id) { return res.status(400).json({ message: "User ID required" }) }
    if (!mongoose.isValidObjectId(id)) { return res.status(400).json({ message: "Invalid user ID" }) }
    if (!habitId) { return res.status(400).json({ message: "Habit ID required" }) }
    if (!mongoose.isValidObjectId(habitId)) { return res.status(400).json({ message: "Invalid habit ID" }) }
    if (!recordId) { return res.status(400).json({ message: "Record ID required" }) }
    if (!mongoose.isValidObjectId(recordId)) { return res.status(400).json({ message: "Invalid record ID" }) }

    // 1. Get user & habit
    // Get user
    const user = await User.findById(id).exec() // No lean, we want save method
    if (!user) { return res.status(400).json({ message: "User not found" }) }

    const filteredUser = await User.findById(id).select({ habits: { $elemMatch: {_id: habitId} }}).lean().exec()
    if (!filteredUser) {
        return res.status(400).json({ message: "User not found" })
    }

    const filteredHabits = filteredUser.habits
    if(!filteredHabits?.length) { return res.status(404).json({ message: `Habit not found for user ${id}` }) }

    const habit = filteredHabits[0]

    // 2. Find record
    let recordIndex = -1
    for (let i = 0; i < habit.records.length; i++) {
        if (habit.records[i]._id == recordId) {
            recordIndex = i
            break
        }
    }
    if (recordIndex === -1) { return res.status(404).json({ message: `Record not found for habit ${habitId}` }) } 

    // 3. Get & validate data
    const { value, date } = req.body

    if (typeof value === "undefined" && typeof date === "undefined") {
        return res.status(400).json({ message: "Not updating any value" })
    }

    if (typeof value !== "undefined") {
        if (typeof value !== "number") {
            return res.status(400).json({ message: "Value must be a number" })
        } else {
            if (value < habit.unitMin || value > habit.unitMax) {
                return res.status(400).json({ message: `Value must be between the minimum value (${habit.unitMin}) and maximum value (${habit.unitMax})` })
            }
        }
    }

    let dateStructure = undefined
    if (typeof date !== "undefined") {
        dateStructure = new Date(date)
        if (dateStructure.toString() === "Invalid Date") { return res.status(400).json({ message: "Invalid date" }) }
    }

    // 3. Check for duplicate dates
    const records = habit.records

    if (typeof date !== "undefined") {
        if (records.find(item => item.date.toString() === dateStructure.toString())) {
            return res.status(409).json({ message: "Duplicate date" }) // Conflict
        }
    }

    // 4. Update record
    let habitIndex = -1 // Find habit
    for (let i = 0; i < user.habits.length; i++) {
        if (user.habits[i]._id == habitId) {
            habitIndex = i
            break
        }
    }

    if (habitIndex === -1) { return res.status(404).json({ message: "Habit not found" }) }

    // Update the record
    if (typeof value !== "undefined") { user.habits[habitIndex].records[recordIndex].value = value }
    if (typeof date !== "undefined") { user.habits[habitIndex].records[recordIndex].date = dateStructure }

    // Now update the user...
    const updatedUser = await user.save()

    // No need for catch error because asyncHandler will
    res.json({ message: `User ${user.username}'s habit ${user.habits[habitIndex].name}'s record with ID ${recordId} was updated` })
})

// @desc Delete habit's record by ID
// @route DELETE /users/:id/habits/:habitId/records/:recordId
// @access Private
const deleteHabitRecord = asyncHandler(async (req, res) => {
    const { id, habitId, recordId } = req.params

    // 0. Validate IDs
    if (!id) { return res.status(400).json({ message: "User ID required" }) }
    if (!mongoose.isValidObjectId(id)) { return res.status(400).json({ message: "Invalid user ID" }) }
    if (!habitId) { return res.status(400).json({ message: "Habit ID required" }) }
    if (!mongoose.isValidObjectId(habitId)) { return res.status(400).json({ message: "Invalid habit ID" }) }
    if (!recordId) { return res.status(400).json({ message: "Record ID required" }) }
    if (!mongoose.isValidObjectId(recordId)) { return res.status(400).json({ message: "Invalid record ID" }) }

    // 1. Get user
    const user = await User.findById(id).exec() // No lean, we want save method
    if (!user) {
        return res.status(400).json({ message: "User not found" })
    }

    // 2. Get habit
    let habitIndex = -1
    for (let i = 0; i < user.habits.length; i++) {
        if (user.habits[i]._id == habitId) {
            habitIndex = i
            break
        }
    }
    if (habitIndex === -1) { return res.status(404).json({ message: `Habit not found for user ${id}` }) }

    // 2. Find specific record from habit's records
    let recordIndex = -1
    for (let i = 0; i < user.habits[habitIndex].records.length; i++) {
        if (user.habits[habitIndex].records[i]._id == recordId) {
            recordIndex = i
            break
        }
    }
    if (recordIndex === -1) { return res.status(404).json({ message: `Record not found for habit ${habitId}` }) } 

    // 3. Delete record
    user.habits[habitIndex].records.splice(recordIndex, 1) // Remove record (2nd parameter means remove one item only)

    const updatedUser = await user.save()
    // No need for catch error because asyncHandler will
    res.json({ message: `User ${user.username}'s habit ${user.habits[habitIndex].name}'s record with ID ${recordId} was deleted` })
})

module.exports = {
    getAllHabitRecords,   
    getHabitRecordById,
    createNewHabitRecord,
    updateHabitRecord,
    deleteHabitRecord
}