import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import axios from 'axios';

class TaskForm extends Component {
    constructor(props) {
        super(props);

        this.onChangeName = this.onChangeName.bind(this);
        this.onChangeDescription = this.onChangeDescription.bind(this);
        this.onSubmit = this.onSubmit.bind(this);

        this.state = {
            name: '',
            description: ''
        }
    }
    
    onChangeName(e) {
        this.setState({
            name: e.target.value
        });
    }

    onChangeDescription(e) {
        this.setState({
            description: e.target.value
        });
    }

    onSubmit(e) {
        e.preventDefault();

        const task = {
            name: this.state.name,
            description: this.state.description
        };

        // adds new task to task list
        axios.post('http://localhost:8000/tasks/create/' + this.props.taskListId, task)
            .catch((err) => {
                console.log(err);
            });
    }

    render() {
        if (localStorage.getItem('loggedIn') === 'false') {
            return <Redirect to="/" />
        } else {
            return (
                <div className="task-form">
                    <form className="form" onSubmit={this.onSubmit}>
                        <div className="form-group">
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Enter Task"
                                value={this.state.name}
                                onChange={this.onChangeName}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Enter Description"
                                value={this.state.description}
                                onChange={this.onChangeDescription}
                            />
                        </div>
                        <div className="text-right">
                            <button type="submit" className="btn btn-primary" onClick={this.onSubmit}>Enter Task</button>
                        </div>
                    </form>
                </div>
            );
        }
    }
}

export default TaskForm;