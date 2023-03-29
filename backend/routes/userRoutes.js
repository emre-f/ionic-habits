const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController')
const habitController = require('../controllers/habitController')
const habitRecordController = require('../controllers/habitRecordController')

router.route('/') // Already at /users/
    .get(userController.getAllUsers)
    .post(userController.createNewUser)

router.route('/login')
    .post(userController.loginUser)

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

router.route('/:id/habits/:habitId/records')
    .get(habitRecordController.getAllHabitRecords)
    .post(habitRecordController.createNewHabitRecord)

router.route('/:id/habits/:habitId/records/:recordId')
    .get(habitRecordController.getHabitRecordById)
    .patch(habitRecordController.updateHabitRecord)
    .delete(habitRecordController.deleteHabitRecord)

module.exports = router