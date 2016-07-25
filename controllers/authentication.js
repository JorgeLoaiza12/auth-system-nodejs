var jwt = require('jsonwebtoken');
var crypto = require('crypto');
var User = require('../models/user');
var config = require('../config/main');

function generateToken(user) {
	return jwt.sign(user, config.secret, {
		expiresIn: 10080 // Seconds = 1 Week
	});
}

// Set up info from request
function setUserInfo(request) {
	return {
		_id: request._id,
	    firstName: request.profile.firstName,
	    lastName: request.profile.lastName,
	    email: request.email,
	    role: request.role
	};
}

// Login Route
exports.login = function (req, res, next) {
	var userInfo = setUserInfo(req.user);

	res.status(200).json({
		token: 'JWT' + generateToken(userInfo),
		user: userInfo
	});
};

// Registration Route
exports.register = function (req, res, next) {
	// Check registration errors
	var email = req.body.email;
	var firstName = req.body.firstName;
	var lastName = req.body.lastName;
	var password = req.body.password;

	if (!email) {
		return res.status(422).send({
			error: 'You must enter an email address.'
		});
	}

	if (!firstName || !lastName) {
		return res.status(422).send({
			error: 'You must enter your full name.'
		});
	}

	if (!password) {
		return res.status(422).send({
			error: 'You must enter a password.'
		});
	}

	User.findOne({ email: email }, function (err, existingUser) {
		if (err) { return next(err); }

		if(existingUser) {
			return res.status(402).send({
				error: 'That email address is already in use.'
			});
		}

		var user = new User({
			email: email,
			password: password,
			profile: { firstName: firstName, lastName: lastName}
		});

		user.save(function(err, user) {
			if (err) { return next(err); }

			var userInfo = setUserInfo(user);

			res.status(201).json({
				token: 'JWT' + generateToken(userInfo),
				user: userInfo
			});
		});
	});
};

// Authorization Role check
exports.roleAuthorization = function(role) {  
  return function(req, res, next) {
    var user = req.user;

    User.findById(user._id, function(err, foundUser) {
      if (err) {
        res.status(422).json({ error: 'No user was found.' });
        return next(err);
      }

      // If user is found, check role.
      if (foundUser.role == role) {
        return next();
      }

      res.status(401).json({ error: 'You are not authorized to view this content.' });
      return next('Unauthorized');
    });
  };
};