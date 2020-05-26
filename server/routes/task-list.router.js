const express = require('express');
const TaskListController = require('../controllers/task-list.controller');
const router = express.Router();

router.post('/create/:id', TaskListController.createTaskList);
router.get('/', TaskListController.displayTaskLists);
router.get('/:id', TaskListController.displayTaskList);
router.get('/populate/:id', TaskListController.userByTaskList);
router.delete('/delete/:id', TaskListController.deleteTaskList);

module.exports = router;