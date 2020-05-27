import React, { Component } from 'react';
import { Link, Redirect } from 'react-router-dom';
import axios from 'axios';

class Login extends Component {
    constructor(props) {
        super(props);

        this.onChangeEmail = this.onChangeEmail.bind(this);
        this.onChangePassword = this.onChangePassword.bind(this);
        this.onSubmit = this.onSubmit.bind(this);

        this.state = {
            email: '',
            password: '',
            errors: []
        }
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
            email: this.state.email,
            password: this.state.password
        };

        // save current user id into session and log user in
        axios.post('http://localhost:8000/users/login', user)
            .then(res => {
                localStorage.setItem('loggedIn', true);
                localStorage.setItem('userId', res.data.id);
                localStorage.setItem('firstName', res.data.firstName);
                window.location.href = `/dashboard`;
            })
            .catch(err => {
                window.alert(err.message);
            })

        this.setState({
            email: '',
            password: ''
        });
    }

    render() {
        if (localStorage.getItem('loggedIn') === 'true') {
            return <Redirect to="/dashboard" />
        } else {
            return (
                <div id="login">
                    <h3 className="text-center">Login</h3>
                    <form className="form" onSubmit={this.onSubmit}>
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
                        </div>
                        <div className="text-right">
                            <button type="submit" className="btn btn-primary" onClick={this.onSubmit}>Login</button>
                        </div>
                        <div className="container text-center">
                            <p>Not a member yet? <Link to="/register">Register now!</Link></p>
                        </div>
                    </form>
                </div>
            );
        }
    }
}

export default Login;