const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController')
const habitController = require('../controllers/habitController')

router.route('/') // Already at /users/
    .get(userController.getAllUsers)
    .post(userController.createNewUser)

router.route('/:id')
    .get(userController.getUserById)
    .patch(userController.updateUser)
    .delete(userController.deleteUser)

router.route('/:id/habits') // Already at /users/:id/habits
    .get(habitController.getAllHabits)
    .post(habitController.createNewHabit)

router.route('/:id/habits/:habitId')
    .get(habitController.getHabitById)
    .patch(habitController.updateHabit)
    .delete(habitController.deleteHabit)

module.exports = router