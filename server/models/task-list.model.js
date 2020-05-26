const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TaskListSchema = new Schema({
    name: {
        type: String,
        required: true,
        minlength: 2
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    tasks: [
        { type: mongoose.Schema.Types.ObjectId, ref: 'Task' }
    ]
}, {
    timestamps: true
});

const TaskList = mongoose.model('TaskList', TaskListSchema);

module.exports = TaskList;