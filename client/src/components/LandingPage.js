import React, { Component } from 'react';
import { Link, Redirect } from 'react-router-dom';

import Hero from '../assets/img/hero.png';

class LandingPage extends Component {
    render() {
        if (localStorage.getItem('loggedIn') === 'true') {
            return <Redirect to="/dashboard" />
        } else {
            return (
                <div id="landing-page" className="text-center">
                    <img src={Hero} alt="Hero" className="hero" />
                    <h2>It's time to organize your life!</h2>
                    <div className="container">
                        <Link to="/login" className="btn btn-primary">Login</Link>
                        <Link to="/register" className="btn btn-outline-primary">Register</Link>
                    </div>
                </div>
            );
        }
    }
}

export default LandingPage;