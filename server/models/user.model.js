const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const bcrypt = require('bcrypt');
const SALT_WORK_FACTOR = 10;
const MAX_LOGIN_ATTEMPTS = 5;
const LOCK_TIME = 60 * 60 * 1000;

const UserSchema = new Schema({
    firstName: {
        type: String,
        required: true,
        match: /[A-Za-z]{2,}/,
        minlength: 2
    },
    lastName: {
        type: String,
        required: true,
        match: /[A-Za-z]{2,}/,
        minlength: 2
    },
    email: {
        type: String,
        required: true,
        match: /^[a-zA-Z0-9\.\+_-]+@[a-zA-Z0-9\._-]+\.[a-zA-z]*$/,
        unique: true,
        minlength: 5
    },
    password: {
        type: String,
        required: true,
        match: /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[\!\@\#\$\%\^\&\*])(?=.{8,})/,
        minlength: 8
    },
    loginAttempts: {
        type: Number,
        required: true,
        default: 0
    },
    lockUntil: {
        type: Number
    },
    taskLists: [
        { type: mongoose.Schema.Types.ObjectId, ref: 'TaskList' }
    ]
}, {
    timestamps: true
});

UserSchema.virtual('isLocked').get(function() {
    return !!(this.lockUntil && this.lockUntil > Date.now());
});

// hash password before saving user
UserSchema.pre('save', function(next) {
    const user = this;

    // only hash the password if it has been modified or is new
    if (!user.isModified('password')) return next();

    bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
        if (err) return next(err);

        // hash password and new salt
        bcrypt.hash(user.password, salt, function(err, hash) {
            if (err) return next(err);

            // override plain text password with the hashed one
            user.password = hash;
            next();
        });
    });
});

// password verification
UserSchema.methods.comparePasword = function(candidatePassword, cb) {
    bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
        if (err) return cb(err);
        cb(null, isMatch);
    });
};

UserSchema.methods.incLoginAttempts = function(cb) {
    if (this.lockUntil && this.lockUntil < Date.now()) {
        return this.update({
            $set: { loginAttempts: 1 },
            $unset: { lockUntil: 1 }
        }, cb);
    }

    let updates = { $inc: { loginAttempts: 1 } };

    if (this.loginAttempts + 1 >= MAX_LOGIN_ATTEMPTS && !this.isLocked) {
        updates.$set = { lockUntil: Date.now() + LOCK_TIME };
    }

    return this.update(updates, cb);
}

let reasons = UserSchema.statics.failedLogin = {
    NOT_FOUND: 0,
    PASSWORD_INCORRECT: 1,
    MAX_ATTEMPTS: 2
}

UserSchema.statics.getAuthenticated = function(email, password, cb) {
    this.findOne({ email: email }, function(err, user) {
        if (err) return cb(err);

        // check if user exists
        if (!user) {
            return cb(null, null, reasons.NOT_FOUND);
        }

        // check if account is currently locked
        if (user.isLocked) {
            return user.incLoginAttempts(function(err) {
                if (err) return cb(err);
                return cb(null, null, reasons.MAX_ATTEMPTS);
            });
        }

        // test for matching password
        user.comparePasword(password, function(err, isMatch) {
            if (err) return cb(err);

            // check if password has a match
            if (isMatch) {
                // return user if no lock or failed attempts
                if (!user.loginAttempts && !user.lockUntil) return cb(null, user);

                // reset attempts and lock info
                let updates = {
                    $set: { loginAttempts: 0 },
                    $unset: { lockUntil: 1 }
                };
                return user.update(updates, function(err) {
                    if (err) return cb(err);
                    return cb(null, user);
                });
            }

            // increment login attempts if password is incorrect
            user.incLoginAttempts(function(err) {
                if (err) return cb(err);
                return cb(null, null, reasons.PASSWORD_INCORRECT);
            });
        });
    });
}

const User = mongoose.model('User', UserSchema);

module.exports = User;