const User = require('../models/User')
const asyncHandler = require('express-async-handler')
const bcrypt = require('bcrypt')
const mongoose = require('mongoose')
const jwt = require('jsonwebtoken');

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

    // Invalid ID
    if (!mongoose.isValidObjectId(id)) { return res.status(400).json({ message: "Invalid user ID" }) }

    const user = await User.findById(id).select('-password').lean().exec() // No lean, we want save method

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

    if (typeof username !== 'string' || typeof password !== 'string') {
        return res.status(400).json({ message: "Username & password must be strings" })
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
    const id = req.params.id
    const { username, password } = req.body

    // Confirm data
    if (!id) { return res.status(400).json({ message: "User ID required" }) }

    // Invalid ID
    if (!mongoose.isValidObjectId(id)) { return res.status(400).json({ message: "Invalid user ID" }) }

    const user = await User.findById(id).exec() // No lean, we want save method
    if (!user) { return res.status(400).json({ message: "User not found" }) }

    if (typeof username !== 'string' || typeof password !== 'string') {
        return res.status(400).json({ message: "Username & password must be strings" })
    }

    // Check for duplicate
    const duplicate = await User.findOne({ username }).lean().exec()

    // Allow updates to the ORIGINAL user
    if (duplicate && duplicate?._id.toString() !== id) {
        return res.status(409).json({ message: "Duplicate username" })
    }

    // Now update the user...
    if (username) { user.username = username }

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
    const id = req.params.id

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

// @desc Login user
// @route POST users/login
// @access Public
const loginUser = asyncHandler(async (req, res) => {
    const { username, password } = req.body

    // Confirm data
    if (!username || !password) {
        return res.status(400).json({ message: "Username & password is required" })
    }

    if (typeof username !== 'string' || typeof password !== 'string') {
        return res.status(400).json({ message: "Username & password must be strings" })
    }

    const foundUser = await User.findOne({ username }).lean().exec() // .exec() returns a promise

    if (!foundUser) {
        return res.status(404).json({ message: "User not found" })
    }

    const match = await bcrypt.compare(password, foundUser.password)

    if (!match) {
        return res.status(401).json({ message: "Incorrect password" })
    }

    const jwtToken = jwt.sign(
        { id: foundUser._id }, 
        process.env.JWT_SECRET, 
        { expiresIn: '24h' }
    )

    res.status(200).json({ 
        message: "Login successful", 
        token: jwtToken,
        username: foundUser.username,
        id: foundUser._id
    })
})

module.exports = {
    getAllUsers,   
    getUserById,
    createNewUser,
    updateUser,
    deleteUser,
    loginUser
}