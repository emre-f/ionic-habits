const User = require('../models/User')
const asyncHandler = require('express-async-handler')
const bcrypt = require('bcrypt')
const mongoose = require('mongoose')

// @desc Get all users
// @route GET /users
// @access Private
const getAllUsers = asyncHandler(async (req, res) => {
    const users = await User.find().select('-password').lean() // -password b.c. we don't need it, .lean() returns a plain JS object
    if (!users?.length) {
        return res.status(404).json({ message: "No users found" })
    }

    res.json(users)
})

// @desc Get a users
// @route GET /users/:id
// @access Private
const getUserById = asyncHandler(async (req, res) => {
    let id = req.params.id

    const user = await User.findById(id).lean().exec() // No lean, we want save method

    if (!user) { 
        return res.status(400).json({ message: "User not found" })
    }

    res.json(user)
})

// @desc Create user
// @route POST /users
// @access Private
const createNewUser = asyncHandler(async (req, res) => {
    const { username, password } = req.body

    // Confirm data
    if (!username || !password) {
        return res.status(400).json({ message: "Username & password is required" })
    }

    // Check for duplicates
    const duplicate = await User.findOne({ username }).lean().exec() // .exec() returns a promise

    if (duplicate) {
        return res.status(409).json({ message: "Duplicate username" }) // 409: Conflict
    }

    // Hash password
    const hashedPwd = await bcrypt.hash(password, 10) // 10 salt rounds

    const userObject = { username, 'password': hashedPwd }

    // Create & store new user
    const user = await User.create(userObject)

    if (user) { // created
        res.status(201).json({ message: `New user ${username} created` })
    } else {
        res.status(400).json({ message: 'Invalid user data received' })
    }
})

// @desc Update user
// @route PATCH /users
// @access Private
const updateUser = asyncHandler(async (req, res) => {
    const { id, username, password, habits } = req.body

    // Confirm data
    if (!id || !username || !Array.isArray(habits)) {
        return res.status(400).json({ message: "All fields are required" })
    }

    const user = await User.findById(id).exec() // No lean, we want save method

    if (!user) { 
        return res.status(400).json({ message: "User not found" })
    }

    // Check for duplicate
    const duplicate = await User.findOne({ username }).lean().exec()
    // Allow updates to the ORIGINAL user
    if (duplicate && duplicate?._id.toString() !== id) {
        return res.status(409).json({ message: "Duplicate username" })
    }

    // Now update the user...
    user.username = username
    user.habits = habits

    if (password) {
        const hashedPwd = await bcrypt.hash(password, 10) // Hash pw
        user.password = hashedPwd
    }

    const updatedUser = await user.save()
    // No need for catch error because asyncHandler will
    res.json({ message: `User ${updatedUser.username} updated` })
})

// @desc Delete user
// @route DELETE /users
// @access Private
const deleteUser = asyncHandler(async (req, res) => {
    const { id } = req.body

    if (!id) {
        return res.status(400).json({ message: "User ID required" })
    }

    // Is user ID valid?
    if (!mongoose.isValidObjectId(id)) {
        return res.status(400).json({ message: "Invalid user ID" })
    }

    const user = await User.findByIdAndDelete(id).exec()

    if (!user) {
        return res.status(400).json({ message: "User not found" })
    }

    const result = await user.deleteOne()

    const reply = `Username ${result.username} with ID ${result._id} deleted`

    res.json(reply)
})

module.exports = {
    getAllUsers,   
    getUserById,
    createNewUser,
    updateUser,
    deleteUser
}