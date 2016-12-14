var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var compression = require('compression');

// Load the config
var config = require('./config/general');

// Load the models
var mongoose = require('mongoose');
require('./models/PostVersion');
require('./models/Post');
require('./models/User');
require('./models/Category');

// Load Passport for authentication
var passport = require('passport');
require('./config/passport');

var routes = require('./routes/index');
var users = require('./routes/users');

var app = express();

const PUBLIC_DIR = (process.env.NODE_ENV === 'production') ? '../dist' : '../public';

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(favicon(path.join(__dirname, PUBLIC_DIR, 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({
    extended: false,
    limit: '50mb'
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, PUBLIC_DIR)));

// Initialise passport
app.use(passport.initialize());

// Use Compression to serve files
app.use(compression());

app.use('/', routes);
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (process.env.NODE_ENV === 'development') {
    app.use(function(err, req, res, next) {
        console.error(err);
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    console.error(err);
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

module.exports = app;

// Connect to the mongodb
mongoose.connect(config.MONGO_URL);
