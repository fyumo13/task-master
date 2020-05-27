import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

class Navbar extends Component {
    constructor(props) {
        super(props);
        this.logout = this.logout.bind(this);
    }

    // logs out current user and returns to login screen
    logout() {
        axios.get('http://localhost:8000/users/logout')
            .then(res => {
                this.setState({
                    userId: localStorage.setItem('userId', null),
                    firstName: localStorage.setItem('firstName', ''),
                    loggedIn: localStorage.setItem('loggedIn', false)
                })
                window.location.href = `/`;
            })
            .catch(err => {
                window.alert(err.message);
            });
    }

    render() {
        return (
            <nav className="navbar navbar-custom fixed-bottom" id="navbar">
                <ul className="navbar-nav">
                    <div className="row">
                        <li className="nav-item">
                            <Link to="/dashboard">
                                <svg className="icon" xmlns="http://www.w3.org/2000/svg" width="32px" height="32px" viewBox="0 0 24 24">
                                    <g data-name="Layer 2">
                                        <g data-name="home">
                                            <rect width="32" height="32" opacity="0"/>
                                            <path d="M20.42 10.18L12.71 2.3a1 1 0 0 0-1.42 0l-7.71 7.89A2 2 0 0 0 3 11.62V20a2 2 0 0 0 1.89 2h14.22A2 2 0 0 0 21 20v-8.38a2.07 2.07 0 0 0-.58-1.44zM10 20v-6h4v6zm9 0h-3v-7a1 1 0 0 0-1-1H9a1 1 0 0 0-1 1v7H5v-8.42l7-7.15 7 7.19z"/>
                                        </g>
                                    </g>
                                </svg>
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link to={'/profile/' + localStorage.getItem('userId') }>
                                <svg className="icon" xmlns="http://www.w3.org/2000/svg" width="32px" height="32px" viewBox="0 0 24 24">
                                    <g data-name="Layer 2">
                                        <g data-name="person">
                                            <rect width="32" height="32" opacity="0"/>
                                            <path d="M12 11a4 4 0 1 0-4-4 4 4 0 0 0 4 4zm0-6a2 2 0 1 1-2 2 2 2 0 0 1 2-2z"/>
                                            <path d="M12 13a7 7 0 0 0-7 7 1 1 0 0 0 2 0 5 5 0 0 1 10 0 1 1 0 0 0 2 0 7 7 0 0 0-7-7z"/>
                                        </g>
                                    </g>
                                </svg>
                            </Link>
                        </li>
                        <li className="nav-item">
                            <svg className="icon" xmlns="http://www.w3.org/2000/svg" width="32px" height="32px" viewBox="0 0 24 24" onClick={this.logout}>
                                <g data-name="Layer 2">
                                    <g data-name="log-out">
                                        <rect width="32" height="32" transform="rotate(90 12 12)" opacity="0"/>
                                        <path d="M7 6a1 1 0 0 0 0-2H5a1 1 0 0 0-1 1v14a1 1 0 0 0 1 1h2a1 1 0 0 0 0-2H6V6z"/>
                                        <path d="M20.82 11.42l-2.82-4a1 1 0 0 0-1.39-.24 1 1 0 0 0-.24 1.4L18.09 11H10a1 1 0 0 0 0 2h8l-1.8 2.4a1 1 0 0 0 .2 1.4 1 1 0 0 0 .6.2 1 1 0 0 0 .8-.4l3-4a1 1 0 0 0 .02-1.18z"/>
                                    </g>
                                </g>
                            </svg>
                        </li>
                    </div>
                </ul>
            </nav>
        );
    }
}

export default Navbar;