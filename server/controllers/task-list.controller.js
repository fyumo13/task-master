const router = require('express').Router();
const TaskList = require('../models/task-list.model');
const User = require('../models/user.model');

// creates new task list and saves it to database
createTaskList = async (req, res) => {
    user = req.params;
    userId = user.id;

    const { name } = req.body;
    const taskList = await TaskList.create({ 
        name,
        user: userId
    });
    await taskList.save();

    const userById = await User.findById(userId);

    userById.taskLists.push(taskList);
    await userById.save();

    return res.send(taskList);
}

// displays all tasks lists in database
displayTaskLists = async (req, res) => {
    const taskList = await TaskList.find();
    return res.send(taskList);
}

// displays single, specific task list
displayTaskList = async (req, res) => {
    const { id } = req.params;
    const taskList = await TaskList.findById(id).populate('tasks');

    res.send(taskList.tasks);
}

userByTaskList = async (req, res) => {
    const { id } = req.params;
    const userByTaskList = await TaskList.findById(id).populate('user');
    res.send(userByTaskList);
}

// deletes selected task list
deleteTaskList = async (req, res) => {
    await TaskList.findOneAndDelete({ _id: req.params.id }, (err, taskList) => {
        if (err) {
            res.send(err);
        } else {
            res.send(taskList);
        }
    });
}

module.exports = {
    createTaskList,
    displayTaskLists,
    displayTaskList,
    userByTaskList,
    deleteTaskList
}