var passport = require('passport');
var User = require('../models/user');
var config = require('./main');
var JwtStrategy = require('passport-jwt').Strategy;
var ExtractJwt = require('passport-jwt').ExtractJwt;
var LocalStrategy = require('passport-local');

var localOptions = { usernameField: 'email' };

// Setting up local login strategy
var localLogin = new LocalStrategy(localOptions, function (email, password, done) {
	User.findOne({ email: email }, function (err, user) {
		if (err) { return done(err); }
		if (!user) {
			return done(null, false, {
				error: 'Your login details could not be verified. Please try again.'
			});
		}

		user.comparePassword(password, function (err, isMatch) {
			if (err) { return done(err); }
			if (!isMatch) {
				return done(null, false, {
					error: 'Your login details could not be verified. Please try again.'
				});
			}

			return done(null, user);
		});
	});
});

// JWT authentication options
var jwtOptions = {
	// Telling passport to check authorization header for JWT
	jwtFromRequest: ExtractJwt.fromAuthHeader(),
	secretOrKey: config.secret
};

// Setting up JWT login strategy
var jwtLogin = new JwtStrategy(jwtOptions, function(payload, done) {
	User.findById(payload._id, function (err, user) {
		if (err) { return done(err, false); }

		if (user) {
			done(null, user);
		} else {
			done(null, false);
		}
	});
});	

passport.use(jwtLogin);  
passport.use(localLogin);  