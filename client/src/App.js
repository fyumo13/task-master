import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import LandingPage from './components/LandingPage';
import Navbar from './components/Navbar';
import Registration from './components/Registration';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import TaskList from './components/TaskList';
import CreateTaskList from './components/CreateTaskList';
import Profile from './components/Profile';

import Logo from './assets/img/logo-big.png';

class App extends Component {
  render() {
    return (
        <Router>
          <div id="main" className="container">
            <div className="container banner">
                <img src={Logo} alt="Task Master Logo" className="logo" />
            </div>
            <div id="content">
              <Switch>
                <Route exact path="/" component={LandingPage} />
                <Route path="/login" component={Login} />
                <Route path="/register" component={Registration} />
                <Route path="/dashboard" component={Dashboard} />
                <Route path="/task-list/:id" component={TaskList} /> 
                <Route path="/create" component={CreateTaskList} />
                <Route path="/profile/:id" component={Profile} />
              </Switch>
            </div>
            <Navbar />
          </div>
        </Router>
    );  
  }
}

export default App;