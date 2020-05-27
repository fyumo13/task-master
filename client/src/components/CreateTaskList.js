import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import axios from 'axios';

class CreateTaskList extends Component {
    constructor(props) {
        super(props);

        this.onChangeName = this.onChangeName.bind(this);
        this.onSubmit = this.onSubmit.bind(this);

        this.state = { 
            name: ''
        }
    }

    onChangeName(e) {
        this.setState({
            name: e.target.value
        });
    }

    onSubmit(e) {
        e.preventDefault();

        const taskList = { name: this.state.name };

        // creates new task list with given name
        axios.post('http://localhost:8000/task-lists/create/' + localStorage.getItem('userId'), taskList)
            .then(res => {
                window.location.href = `/task-list/${res.data._id}`;
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
                <div id="create">
                    <div className="container">
                        <form className="form" onSubmit={this.onSubmit}>
                            <div className="form-group">
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Enter Title"
                                    value={this.state.name}
                                    onChange={this.onChangeName}
                                    required
                                />
                            </div>
                            <div className="text-right">
                                <button type="submit" className="btn btn-primary" onSubmit={this.onSubmit}>Create New Task List</button>
                            </div>
                        </form>
                    </div>
                </div>
            );
        }
    }
}  

export default CreateTaskList;