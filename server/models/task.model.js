const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TaskSchema = new Schema({
    name: {
        type: String,
        required: true,
        minlength: 2
    },
    description: {
        type: String
    },
    taskList: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'TaskList'
    }
}, {
    timestamps: true
});

const Task = mongoose.model('Task', TaskSchema);

module.exports = Task;