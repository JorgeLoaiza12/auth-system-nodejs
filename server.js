var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var logger = require('morgan');
var router = require('./router');
var mongoose = require('mongoose');
var config = require('./config/main');

// Log in the console
app.use(logger('dev'));

// DB connect
mongoose.connect(config.database);

// Setting BodyParser, get data in body or params
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Enable CORS from client-side
app.use(function(req, res, next) {  
  res.header("Access-Control-Allow-Origin", "*");
  res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization, Access-Control-Allow-Credentials");
  res.header("Access-Control-Allow-Credentials", "true");
  next();
});

// Start the server
var server = app.listen(config.port);
console.log('Your server is running on port ' + config.port + '.');

router(app);