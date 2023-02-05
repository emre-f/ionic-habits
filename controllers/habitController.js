const User = require('../models/User')
const Habit = require('../models/Habit')
const asyncHandler = require('express-async-handler')
const bcrypt = require('bcrypt')
const mongoose = require('mongoose')

// @desc Get all habits for a user
// @route GET /users/:id/habits
// @access Private
const getAllHabits = asyncHandler(async (req, res) => {
    const { id } = req.params // user's ID

    // Data validation
    if (!id) { return res.status(400).json({ message: "User ID required" }) }
    if (!mongoose.isValidObjectId(id)) { return res.status(400).json({ message: "Invalid user ID" }) }

    // Get habits
    const habits = await User.findById(id).select('habits').lean().exec()
    if (!habits) {
        return res.status(400).json({ message: "User not found" })
    }

    res.json(habits)
})

// @desc Get a habit
// @route GET /users/:id/habits/:id
// @access Private
const getHabitById = asyncHandler(async (req, res) => {
    const { id, habitId } = req.params

    // Validate user & habit IDs
    if (!id) { return res.status(400).json({ message: "User ID required" }) }
    if (!mongoose.isValidObjectId(id)) { return res.status(400).json({ message: "Invalid user ID" }) }
    if (!habitId) { return res.status(400).json({ message: "Habit ID required" }) }
    if (!mongoose.isValidObjectId(habitId)) { return res.status(400).json({ message: "Invalid habit ID" }) }

    // Get habits
    const filteredUser = await User.findById(id).select({ habits: { $elemMatch: {_id: habitId} }}).lean().exec()
    if (!filteredUser) {
        return res.status(400).json({ message: "User not found" })
    }

    const filteredHabits = filteredUser.habits
    if(!filteredHabits?.length) { return res.status(404).json({ message: `Habit not found for user ${id}` }) }

    const habit = filteredHabits[0]
    res.json(habit)
})

// @desc Create habit
// @route POST /users/:id/habits
// @access Private
const createNewHabit = asyncHandler(async (req, res) => {
    const { id } = req.params // user's ID

    if (!id) { return res.status(400).json({ message: "User ID required" }) }
    if (!mongoose.isValidObjectId(id)) { return res.status(400).json({ message: "Invalid user ID" }) }

    const user = await User.findById(id).exec() // No lean, we want save method
    if (!user) { return res.status(400).json({ message: "User not found" }) }

    const { name, unitName, unitMin, unitMax, notes } = req.body

    // Confirm data
    if (!name) { return res.status(400).json({ message: "Name is required" }) }
    if (typeof name !== "string") { return res.status(400).json({ message: "Name must be a string" }) }

    if (unitName && typeof unitName !== "string") {
        return res.status(400).json({ message: "Unit name must be a string" })
    }

    if (notes && typeof notes !== "string") {
        return res.status(400).json({ message: "Notes must be a string" })
    }

    if (typeof unitMin !== "undefined") { // unit min is defined
        if (typeof unitMin !== "number") {
            return res.status(400).json({ message: "Unit min must be a number" })
        } else if (typeof unitMax === "undefined") {
            return res.status(400).json({ message: "Unit min & max must be defined together" })
        }
    }

    if (typeof unitMax !== "undefined") { // unit max is defined
        if (typeof unitMax !== "number") {
            return res.status(400).json({ message: "Unit max must be a number" })
        } else if (typeof unitMin === "undefined") {
            return res.status(400).json({ message: "Unit min & max must be defined together" })
        }
    }

    if (unitMin >= unitMax) {
        return res.status(400).json({ message: "Unit min must be less than unit max" })
    }

    // Check for duplicates
    const habits = user.habits
    if (habits.find(item => item.name === name)) {
        return res.status(409).json({ message: "Duplicate habit name" }) // 409: Conflict
    }

    const habitObject = { name, unitName, unitMin, unitMax, notes }

    // Add the new habit
    user.habits.push(habitObject)

    const updatedUser = await user.save()
    // No need for catch error because asyncHandler will
    res.json({ message: `User ${updatedUser.username} updated` })
})

// @desc Update habit
// @route PATCH /users/:id/habits/:habitId
// @access Private
const updateHabit = asyncHandler(async (req, res) => { console.log("update habit")
    const { id, habitId } = req.params // IDs  
    const { name, unitName, unitMin, unitMax, notes } = req.body

    /// Validate user & habit IDs
    if (!id) { return res.status(400).json({ message: "User ID required" }) }
    if (!mongoose.isValidObjectId(id)) { return res.status(400).json({ message: "Invalid user ID" }) }
    if (!habitId) { return res.status(400).json({ message: "Habit ID required" }) }
    if (!mongoose.isValidObjectId(habitId)) { return res.status(400).json({ message: "Invalid habit ID" }) }

    // Get user
    const user = await User.findById(id).exec() // No lean, we want save method
    if (!user) { return res.status(400).json({ message: "User not found" }) }

    // Get habits
    const filteredUser = await User.findById(id).select({ habits: { $elemMatch: {_id: habitId} }}).lean().exec()
    const filteredHabits = filteredUser.habits
    if(!filteredHabits?.length) { return res.status(404).json({ message: `Habit not found for user ${id}` }) }

    // Confirm data
    if (name && typeof name !== "string") { return res.status(400).json({ message: "Name must be a string" }) }

    if (unitName && typeof unitName !== "string") {
        return res.status(400).json({ message: "Unit name must be a string" })
    }

    if (typeof notes !== "undefined") { // There doesn't have to be notes
        if (typeof notes !== "string") {
            return res.status(400).json({ message: "Notes must be a string" })
        }
    }

    if (typeof unitMin !== "undefined") { // unit min is defined
        if (typeof unitMin !== "number") {
            return res.status(400).json({ message: "Unit min must be a number" })
        } else if (typeof unitMax === "undefined") {
            return res.status(400).json({ message: "Unit min & max must be defined together" })
        }
    }

    if (typeof unitMax !== "undefined") { // unit max is defined
        if (typeof unitMax !== "number") {
            return res.status(400).json({ message: "Unit max must be a number" })
        } else if (typeof unitMin === "undefined") {
            return res.status(400).json({ message: "Unit min & max must be defined together" })
        }
    }

    if (unitMin >= unitMax) {
        return res.status(400).json({ message: "Unit min must be less than unit max" })
    }

    // Check for duplicates
    const habits = user.habits
    if (habits.find(item => item.name === name)) {
        return res.status(409).json({ message: "Duplicate habit name" }) // 409: Conflict
    }

    // Update the habit
    let index = -1 // Find habit
    for (let i = 0; i < user.habits.length; i++) {
        if (user.habits[i]._id == habitId) {
            index = i
            break
        }
    }

    if (name) { user.habits[index].name = name }
    if (unitName) { user.habits[index].unitName = unitName }
    if (typeof unitMin !== "undefined") { user.habits[index].unitMin = unitMin }
    if (typeof unitMax !== "undefined") { user.habits[index].unitMax = unitMax }
    if (typeof notes !== "undefined") { user.habits[index].notes = notes }

    // Now update the user...
    const updatedUser = await user.save()

    // No need for catch error because asyncHandler will
    res.json({ message: `User ${user.username}'s habit ${user.habits[index].name} updated` })
})

// @desc Delete habit
// @route DELETE /users/:id/habits/:habitId
// @access Private
const deleteHabit = asyncHandler(async (req, res) => {
    const { id, habitId } = req.params

    // Validate user & habit IDs
    if (!id) { return res.status(400).json({ message: "User ID required" }) }
    if (!mongoose.isValidObjectId(id)) { return res.status(400).json({ message: "Invalid user ID" }) }
    if (!habitId) { return res.status(400).json({ message: "Habit ID required" }) }
    if (!mongoose.isValidObjectId(habitId)) { return res.status(400).json({ message: "Invalid habit ID" }) }

    const user = await User.findById(id).exec() // No lean, we want save method
    if (!user) {
        return res.status(400).json({ message: "User not found" })
    }

    // Delete the habit
    let index = -1 // Find habit
    for (let i = 0; i < user.habits.length; i++) {
        if (user.habits[i]._id == habitId) {
            index = i
            break
        }
    }

    if (index === -1) {
        return res.status(404).json({ message: `Habit not found for user ${user.username}` })
    }

    let habitToBeRemoved = user.habits[index]
    user.habits.splice(index, 1) // Remove habit (2nd parameter means remove one item only)

    const updatedUser = await user.save()
    // No need for catch error because asyncHandler will
    res.json({ message: `User ${user.username}'s habit ${habitToBeRemoved.name} deleted` })
})

module.exports = {
    getAllHabits,   
    getHabitById,
    createNewHabit,
    updateHabit,
    deleteHabit
}