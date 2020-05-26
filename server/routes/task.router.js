const express = require('express');
const TaskController = require('../controllers/task.controller');
const router = express.Router();

router.post('/create/:id', TaskController.createTask);
router.delete('/delete/:id', TaskController.deleteTask);

module.exports = router;