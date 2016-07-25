var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt-nodejs');

// Set up User model
var UserSchema = new Schema({
    email: {
        type: String,
        unique: true,
        lowercase: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    profile: {
        firstName: {
            type: String,
            required: true
        },
        lastName: {
            type: String,
            required: true
        }
    },
    role: {
        type: String,
        enum: ['Member', 'Client', 'Owner', 'Admin'],
        default: 'Member'
    },
    resetPasswordToken: { type: String },
    resetPasswordExpires: { type: Date }
}, {
    timestamps: true
});

// Pre-save the user, hash password is modified or new
UserSchema.pre('save', function(next) {
    var user = this;
    var SALT_FACTOR = 5;

    if (!user.isModified('password')) {
        return next();
    }

    bcrypt.genSalt(SALT_FACTOR, function(err, salt) {
        if (err) {
            return next(err);
        }

        bcrypt.hash(user.password, salt, null, function(err, hash) {
            if (err) {
                return next(err);
            }
            user.password = hash;
            next();
        });
    });
});

// Compare password for login
UserSchema.methods.comparePassword = function(candidatePassword, cb) {
    bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
        if (err) {
            return cb(err); }

        cb(null, isMatch);
    });
};

module.exports = mongoose.model('User', UserSchema);