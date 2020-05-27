import React, { Component } from 'react';
import { Link, Redirect } from 'react-router-dom';
import axios from 'axios';

class Registration extends Component {
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
            password: '',
            errors: {
                firstName: '',
                lastName: '',
                email: '',
                password: ''
            }
        }
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

        const newUser = {
            firstName: this.state.firstName,
            lastName: this.state.lastName,
            email: this.state.email,
            password: this.state.password
        }; 

        // save current user id into session and log user in after registration
        axios.post('http://localhost:8000/users/register', newUser)
            .then(res => {
                localStorage.setItem('loggedIn', true);
                localStorage.setItem('userId', res.data);
                localStorage.setItem('firstName', res.data.firstName);
                window.location.href = `/dashboard`;
            })
            .catch(err => {
                window.alert(err.message);
            });
    }

    render() {
        if (localStorage.getItem('loggedIn') === 'true') {
            return <Redirect to="/dashboard" />
        } else {
            return (
                <div id="registration">
                    <h3 className="text-center">Register</h3>
                    <form className="form" onSubmit={this.onSubmit}>
                        <div className="form-group">
                            <input
                                type="text"
                                className="form-control"
                                placeholder="First Name"
                                value={this.state.firstName}
                                onChange={this.onChangeFirstName}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Last Name"
                                value={this.state.lastName}
                                onChange={this.onChangeLastName}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <input 
                                type="text"
                                className="form-control"
                                placeholder="Email"
                                value={this.state.email}
                                onChange={this.onChangeEmail}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <input 
                                type="password"
                                className="form-control"
                                placeholder="Password"
                                value={this.state.password}
                                onChange={this.onChangePassword}
                                required
                            />
                            <span>Password must be at least 8 characters, contain 1 uppercase and 1 lowercase alphabetical character, 1 numeric character, and 1 special character (!, @, #, $, %, ^, &, *).</span>
                        </div>
                        <div className="text-right">
                            <button type="submit" className="btn btn-primary" onClick={this.onSubmit}>Register</button>
                        </div>
                        <div className="container text-center">
                            <p>Already a member? <Link to="/login">Login now!</Link></p>
                        </div>
                    </form>
                </div>
            );
        }
    }
}

export default Registration;

