const router = require('express').Router();
const User = require('../models/user.model');
let session;

// creates new user and saves to database with valid info
register = async (req, res) => {
    const body = req.body;

    if (!body) {
        return res.status(400).json({
            success: false,
            error: 'You must provide the required information!'
        });
    }

    const user = new User(body);

    if (!user) {
        return res.status(400).json({
            success: false,
            error: err
        });
    }

    user
        .save()
        .then(() => {
            req.session.userId = user._id;
            return res.status(201).json({
                success: true,
                id: user._id,
                firstName: user.firstName,
                message: 'New user registered!'  
            });
        })
        .catch(err => {
            return res.status(400).json({
                err,
                message: 'Unable to register user!'
            });
        });
}

// logs existing user in with valid credentials
login = async (req, res) => {
    const body = req.body;

    if (!body) {
        return res.status(400).json({
            success: false,
            error: 'You must provide the required information!'
        });
    }

    User.getAuthenticated(req.body.email, req.body.password, function(err, user, reason) {
        if (err) throw err;

        if (user) {
            // stores user info into session vars
            req.session.userId = user._id
            User.find({ email: req.body.email })
                .then(() => {
                    return res.status(201).json({
                        success: true,
                        id: req.session.userId,
                        firstName: user.firstName,
                        message: 'You are now logged in!'
                    });
                })
                .catch(err => res.status(400).json({ err }));
        } 

        const reasons = User.failedLogin;
        switch (reason) {
            case reasons.NOT_FOUND:
            case reasons.PASSWORD_INCORRECT:
                res.status(400).json('Incorrect email or password!');
                break;
            case reasons.MAX_ATTEMPTS:
                res.status(400).json('Too many log in attempts!');
                break;
        }
    });
}

// logs out current user
logout = async (req, res) => {
    if (req.session) {
        req.session.destroy((err) => {
            if (err) {
                return res.status(400).json({
                    success: false,
                    error: err
                });
            }

            return res.status(200).json({
                success: true,
                message: 'Logged out successfully!'
            });
        });
    } else {
        res.redirect('/');
    }
}

// displays all users in database
displayUsers = async (req, res) => {
    const user = await User.find();
    return res.send(user);
}

// displays info about current user
displayUser = async (req, res) => {
    await User.findOne({ _id: req.params.id }, (err, user) => {
        if (err) {
            res.send(err);
        } else {
            res.send(user);
        }
    });
}

// displays task lists specific to current user
taskListsByUser = async (req, res) => {
    const { id } = req.params;
    const user = await User.findById(id).populate('taskLists');

    res.send(user.taskLists);
}

// edits current user's personal info
updateUser = async (req, res) => {
    const body = req.body;

    if (!body) {
        return res.status(400).json({
            success: false,
            error: 'You must provide the required information!'
        });
    }

    User.findOne({ _id: req.params.id }, (err, user) => {
        if (err) {
            return res.status(404).json({
                err,
                message: 'User not found!'
            });
        }
        
        user.firstName = body.firstName;
        user.lastName = body.lastName;
        user.email = body.email;
        user.password = body.password;
        
        user
            .save()
            .then(() => { res.send(user) }) 
            .catch(err => { res.send(err) });
    });
}

// deletes selected user
deleteUser = async (req, res) => {
    await User.findOneAndDelete({ _id: req.params.id }, (err, user) => {
        if (err) {
            res.send(err);
        } else {
            res.send(user);
        }
    });
}

module.exports = { 
    register,
    login,
    logout,
    displayUsers,
    displayUser,
    taskListsByUser,
    updateUser,
    deleteUser
}