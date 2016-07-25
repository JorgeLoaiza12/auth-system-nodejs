var AuthenticationController = require('./controllers/authentication');
var express = require('express');
var passportService = require('./config/passport');
var passport = require('passport');

// Middleware to require login/auth
var requireAuth = passport.authenticate('jwt', { session: false });  
var requireLogin = passport.authenticate('local', { session: false });  

// Constants for role types
var REQUIRE_ADMIN = "Admin";  
var REQUIRE_OWNER = "Owner";
var REQUIRE_CLIENT = "Client";
var REQUIRE_MEMBER = "Member";

module.exports = function (app) {
	var apiRoutes = express.Router();
	var authRoutes = express.Router();

	// Auth routes //
	// Set auth routes as subgroup/middleware to apiRoutes
	apiRoutes.use('/auth', authRoutes);

	// Registration route
	authRoutes.use('/register', AuthenticationController.register);

	// Login route
	authRoutes.use('/login', requireLogin, AuthenticationController.login);

	apiRoutes.get('/', function (req, res) {
		res.send('There will be dragons in this api.');
	});

	// Set url for api group routes
	app.use('/api', apiRoutes);
};