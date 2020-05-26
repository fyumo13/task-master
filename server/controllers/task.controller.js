const router = require('express').Router();
const Task = require('../models/task.model');
const TaskList = require('../models/task-list.model');

// creates new task and saves to database
createTask = async (req, res) => {
    taskList = req.params;
    taskListId = taskList.id;
    
    const { name, description } = req.body;
    const task = await Task.create({
        name,
        description,
        taskList: taskListId
    });
    await task.save();

    const taskListById = await TaskList.findById(taskListId);

    taskListById.tasks.push(task);
    await taskListById.save();

    return res.send(taskListById);
}

// deletes specific task
deleteTask = async (req, res) => {
    await Task.findOneAndDelete({ _id: req.params.id }, (err, task) => {
        if (err) {
            res.send(err);
        } else {
            res.send(task);
        }
    });
}

module.exports = { 
    createTask,
    deleteTask
}