import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import axios from 'axios';
import TaskForm from './TaskForm';

const Task = props => (
    <li key={props.task._id}>
        <div className="card">
            <div className="container">
                <div className="card-title">
                    <div className="row">
                        <div className="col-10">
                            <h4>{props.task.name}</h4>
                        </div>
                        <div className="col-2">
                            <svg className="icon float-right" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" onClick={() => props.deleteTask(props.task._id)}>
                                <g data-name="Layer 2">
                                    <g data-name="checkmark">
                                        <rect width="24" height="24" opacity="0"/>
                                        <path d="M9.86 18a1 1 0 0 1-.73-.32l-4.86-5.17a1 1 0 1 1 1.46-1.37l4.12 4.39 8.41-9.2a1 1 0 1 1 1.48 1.34l-9.14 10a1 1 0 0 1-.73.33z"/>
                                    </g>
                                </g>
                            </svg>
                        </div>
                    </div>
                </div>
                <div className="card-body">
                    <p>{props.task.description}</p>
                </div>
            </div>
        </div>
    </li>
);

class TaskList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: '',
            tasks: []
        }
    }

    componentDidMount() {
        // retrieves name of current task list
        axios.get('http://localhost:8000/task-lists/populate/' + this.props.match.params.id)
            .then(res => {
                this.setState({
                    name: res.data.name
                });
            })
            .catch((err) => {
                console.log(err);
            })

        // retrieves all tasks belonging to current list
        axios.get('http://localhost:8000/task-lists/' + this.props.match.params.id)
            .then(res => {
                this.setState({
                    tasks: res.data
                });
            })
            .catch((err) => {
                console.log(err);
            });
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevState.tasks !== this.state.tasks) {
            axios.get('http://localhost:8000/task-lists/' + this.props.match.params.id)
                .then(res => {
                    this.setState({
                        tasks: res.data
                    });
                })
                .catch((err) => {
                    console.log(err);
                });
        }
    }

    // displays all tasks belonging to current list
    displayTasks() {
        return this.state.tasks.map(task => {
            return <Task task={task} key={task._id} deleteTask={this.deleteTask} />
        });
    }

    deleteTask(id) {
        axios.delete('http://localhost:8000/tasks/delete/' + id)
            .then(res => {
                window.alert('Successfully deleted task!');
                window.location.href = `/task-list/${this.props.match.params.id}`
            })
            .catch((err) => {
                console.log(err);
            });
    }

    render() {
        if (localStorage.getItem('loggedIn') === 'false') {
            return <Redirect to="/" />
        } else {
            return (
                <div id="task-list">
                    <div id="task-form">
                        <h2>{ this.state.name }</h2>
                        <TaskForm taskListId={this.props.match.params.id} />
                    </div>
                    <div id="tasks">
                        <ul>{ this.displayTasks() }</ul>
                    </div>
                </div>
            );
        }
    }
}

export default TaskList;