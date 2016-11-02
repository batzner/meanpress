var express = require('express');
var mongoose = require('mongoose');
var passport = require('passport');
var jwt = require('express-jwt');

var router = express.Router();

var Post = mongoose.model('Post');
var User = mongoose.model('User');

// Authentication middleware
var auth = jwt({
    secret: process.env.JWT_SECRET
});

// route middleware that will happen on every request
router.use(function(req, res, next) {
    // log each request to the console
    console.log(req.method, req.url);
    // continue doing what we were doing and go to the route
    next();
});

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index');
});

router.get('/api/posts', function(req, res, next) {
    Post.find(function(err, posts) {
        if (err) return next(err);
        res.json(posts);
    });
});

// Route for adding a post
router.post('/api/posts', auth, function(req, res, next) {
    var post = new Post(req.body);
    console.log(req.body);

    post.save(function(err, post) {
        if (err) {
            return next(err);
        }
        res.json(post);
    });
});

// Route for updating a post
router.post('/api/posts/:id', auth, function(req, res, next) {
    // Find the post to update
    var query = {'_id':req.params.id};
    var options = {upsert: true};
    Post.findOneAndUpdate(query, req.body, options, function(err, post) {
        if (err) return next(err);
        res.json(post);
    })
});

// Register route. Creates a user given a username and password
router.post('/api/register', function(req, res, next) {
    return res.status(400).json({
        message: "Registering is currently not activated."
    });

    if (!req.body.username || !req.body.password) {
        return res.status(400).json({
            message: "Please fill out all fields"
        });
    }

    var user = new User();
    user.username = req.body.username;
    user.setPassword(req.body.password);
    user.save(function(err) {
        if (err) {
            return next(err);
        }
        return res.json({
            token: user.generateJWT()
        });
    });
});

// Login route. Authenticates the user and returns a token
router.post('/api/login', function(req, res, next) {
    if (!req.body.username || !req.body.password) {
        return res.status(400).json({
            message: "Please fill out all fields"
        });
    }

    passport.authenticate('local', function(err, user, info) {
        if (err) {
            return next(err);
        }
        if (user) {
            return res.json({
                token: user.generateJWT()
            });
        } else {
            return res.status(401).json(info);
        }
    })(req, res, next);
});

// This route deals enables HTML5Mode by forwarding missing files to the index
router.get('*', function(req, res) {
    res.render('index');
});

module.exports = router;
