import React, { Component } from 'react';
import { Link, Redirect } from 'react-router-dom';
import axios from 'axios';

import CreateTaskList from './CreateTaskList';

const TaskList = props => (
    <li>
        <div className="card card-body">
            <div className="row">
                <div className="col-10">
                    <Link to={'/task-list/' + props.taskList._id}>
                        <h4>{props.taskList.name}</h4>        
                    </Link>
                </div>
                <div className="col-2">
                    <svg className="icon float-right" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" onClick={() => props.deleteTaskList(props.taskList._id)}>
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
    </li>
);

class Dashboard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            firstName: localStorage.getItem('firstName'),
            taskLists: []
        }
    }

    componentDidMount() {
        // retrieves all task lists belonging to current user
        axios.get('http://localhost:8000/users/task-lists/' + localStorage.getItem('userId'))
            .then(res => {
                this.setState({
                    taskLists: res.data
                })
            })
            .catch((err) => {
                console.log(err);
            });
    }
    
    // displays task lists belonging to current user
    displayTaskLists() {
        return this.state.taskLists.map(taskList => {
            return <TaskList taskList={taskList} key={taskList._id} deleteTaskList={this.deleteTaskList} />
        });
    }

    deleteTaskList(id) {
        axios.delete('http://localhost:8000/task-lists/delete/' + id)
            .then(res => {
                window.alert('Successfully deleted task list!');
                window.location.href = `/dashboard`;
            })
            .catch((err) => {
                window.alert('Something went wrong!');
            });
    }

    render() {
        if (localStorage.getItem('loggedIn') === 'false') {
            return <Redirect to="/" />
        } else {
            return (
                <div id="dashboard">
                    <div id="header">
                        <div className="container">
                            <h2>Welcome, { this.state.firstName }!</h2>
                        </div>
                        <CreateTaskList />
                    </div>
                    <div id="task-lists">
                        <div className="container">
                            <h4>Task Lists</h4>
                            <ul className="task-lists">
                                { this.displayTaskLists() }
                            </ul>
                        </div>
                    </div>
                </div>
            );
        }
    }
}

export default Dashboard;