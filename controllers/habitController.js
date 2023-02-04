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

    if (!id) {
        return res.status(400).json({ message: "User ID required" })
    }

    // Is user ID valid?
    if (!mongoose.isValidObjectId(id)) {
        return res.status(400).json({ message: "Invalid user ID" })
    }

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
    if (!name) {
        return res.status(400).json({ message: "Name is required" })
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

// @desc Update user
// @route PATCH /users
// @access Private
const updateHabit = asyncHandler(async (req, res) => {
    // const { id, username, roles, active, password } = req.body

    // // Confirm data
    // if (!id || !username || !Array.isArray(roles) || !roles.length || typeof active !== 'boolean') {
    //     return res.status(400).json({ message: "All fields are required" })
    // }

    // const user = await User.findById(id).exec() // No lean, we want save method

    // if (!user) { 
    //     return res.status(400).json({ message: "User not found" })
    // }

    // // Check for duplicate
    // const duplicate = await User.findOne({ username }).lean().exec()
    // // Allow updates to the ORIGINAL user
    // if (duplicate && duplicate?._id.toString() !== id) {
    //     return res.status(409).json({ message: "Duplicate username" })
    // }

    // // Now update the user...
    // user.username = username
    // user.roles = roles
    // user.active = active

    // if (password) {
    //     const hashedPwd = await bcrypt.hash(password, 10) // Hash pw
    //     user.password = hashedPwd
    // }

    // const updatedUser = await user.save()
    // // No need for catch error because asyncHandler will
    // res.json({ message: `User ${updatedUser.username} updated` })
})

// @desc Delete user
// @route DELETE /users
// @access Private
const deleteHabit = asyncHandler(async (req, res) => {
    // const { id } = req.body

    // if (!id) {
    //     return res.status(400).json({ message: "User ID required" })
    // }

    // // Is user ID valid?
    // if (!mongoose.isValidObjectId(id)) {
    //     return res.status(400).json({ message: "Invalid user ID" })
    // }

    // const habit = await Habit.findOne({ user: id }).lean().exec()
    // if (habit) {
    //     return res.status(400).json({ message: "User has saved habits, cannot delete" })
    // }

    // const user = await User.findByIdAndDelete(id).exec()

    // if (!user) {
    //     return res.status(400).json({ message: "User not found" })
    // }

    // const result = await user.deleteOne()

    // const reply = `Username ${result.username} with ID ${result._id} deleted`

    // res.json(reply)
})

module.exports = {
    getAllHabits,   
    getHabitById,
    createNewHabit,
    updateHabit,
    deleteHabit
}