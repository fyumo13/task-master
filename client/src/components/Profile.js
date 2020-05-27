import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import axios from 'axios';

class Profile extends Component {
    constructor(props) {
        super(props);

        this.onChangeFirstName = this.onChangeFirstName.bind(this);
        this.onChangeLastName = this.onChangeLastName.bind(this);
        this.onChangeEmail = this.onChangeEmail.bind(this);
        this.onChangePassword = this.onChangePassword.bind(this);
        this.onSubmit = this.onSubmit.bind(this);

        this.state = {
            firstName: '',
            lastName: '',
            email: '',
            password: ''
        }
    }

    componentDidMount() {
        axios.get('http://localhost:8000/users/' + this.props.match.params.id)
            .then(res => {
                this.setState({
                    firstName: res.data.firstName,
                    lastName: res.data.lastName,
                    email: res.data.email,
                    password: res.data.password
                });
            })
            .catch((err) => {
                console.log(err);
            });
    }

    onChangeFirstName(e) {
        this.setState({
            firstName: e.target.value
        });
    }

    onChangeLastName(e) {
        this.setState({
            lastName: e.target.value
        });
    }

    onChangeEmail(e) {
        this.setState({
            email: e.target.value
        });
    }

    onChangePassword(e) {
        this.setState({
            password: e.target.value
        });
    }

    onSubmit(e) {
        e.preventDefault();

        const user = { 
            firstName: this.state.firstName,
            lastName: this.state.lastName,
            email: this.state.email,
            password: this.state.password
        };

        axios.put('http://localhost:8000/users/update/' + this.props.match.params.id, user)
            .then(res => {
                localStorage.setItem('firstName', this.state.firstName);
                window.alert('Updated user successfully!');
                window.location.href = `/dashboard`;
            })
            .catch((err) => {
                console.log(err);
            });
    }

    deleteUser() {
        axios.delete('http://localhost:8000/users/delete/' + this.props.match.params.id)
            .then(res => {
                window.alert(res.data.firstName + ' has been deleted!');
                window.location.href = `/`;
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
                <div id="edit-user">
                    <div className="container">
                        <h2>Edit Profile</h2>
                        <form className="form" onSubmit={this.onSubmit}>
                            <div className="form-group">
                                <input
                                    type="text"
                                    className="form-control"
                                    value={this.state.firstName}
                                    onChange={this.onChangeFirstName}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <input
                                    type="text"
                                    className="form-control"
                                    value={this.state.lastName}
                                    onChange={this.onChangeLastName}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <input 
                                    type="text"
                                    className="form-control"
                                    value={this.state.email}
                                    onChange={this.onChangeEmail}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <input 
                                    type="password"
                                    className="form-control"
                                    value={this.state.password}
                                    onChange={this.onChangePassword}
                                    required
                                />
                            </div>
                            <div className="text-right">
                                <button type="submit" className="btn btn-primary" onClick={this.onSubmit}>Edit Profile</button>
                            </div>
                            <div className="text-right">
                                <button type="button" className="btn btn-secondary" onClick={() => this.deleteUser(this.props.match.params.id)}>Delete User</button>
                            </div>
                        </form>
                    </div>
                </div>
            );
        }
    }
}

export default Profile;