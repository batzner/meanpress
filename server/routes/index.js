const REGISTRATION_ENABLED = false;

const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const jwt = require('express-jwt');
const config = require('../config/general');
const winston = require('winston');

const router = express.Router();

const Post = mongoose.model('Post');
const PostVersion = mongoose.model('PostVersion');
const User = mongoose.model('User');
const Category = mongoose.model('Category');
const Redirect = mongoose.model('Redirect');

// Authentication middleware
const auth = jwt({
    secret: config.JWT_SECRET
});

function getIndexTemplateName() {
    return process.env.NODE_ENV === 'production' ? 'index-prod' : 'index';
}

function getIdsToPopulate(posts, withUnpublished) {
    // Return an array containing all published ids and, if specified, all last ids as well.
    let ids = [];
    posts.forEach(post => {
        if (post.publishedVersion) ids.push(post.publishedVersion);
        const last = post.versions.length - 1;
        if (withUnpublished && last >= 0) ids.push(post.versions[last]);
    });
    return ids;
}

function removeBody(post) {
    post.versions.forEach(version => {
        version.body = '';
    });
}

// route middleware that will happen on every request
router.use(function (req, res, next) {
    // log each request to the console
    console.log(req.method, req.url);
    // continue doing what we were doing and go to the route
    next();
});

router.get('/api/categories', function (req, res, next) {
    Category.find().then(categories => res.json(categories));
});

// Route for adding a category
router.post('/api/categories', auth, function (req, res, next) {
    // Ignore a passed id
    delete req.body._id;

    const category = new Category(req.body);
    category.save().then(category => res.json(category)).catch(next);
});

function getPosts(req, res, next, withUnpublished = false) {
    // For each criterium, we need to find one post version fulfilling it
    let criteria = [];
    if (req.query.category !== undefined) {
        criteria.push({versions: {$elemMatch: {category: req.query.category}}});
    }
    if (req.query.slug !== undefined) {
        criteria.push({versions: {$elemMatch: {slug: req.query.slug}}});
    }

    let query = criteria.length ? {$and: criteria} : {};

    // Check for URL parameters
    const startDate = new Date();
    Post.find(query)
        .then(posts => {
            // Only populate the published and the last version
            let idsToPopulate = getIdsToPopulate(posts, withUnpublished);
            return PostVersion.populate(posts, {
                path: 'versions',
                match: {
                    _id: {$in: idsToPopulate}
                }
            });
        })
        .then(posts => {
            // Filter posts that don't have a version at all after filtering the versions
            posts = posts.filter(post => post.versions.length);

            // Only send skeletons, if wanted
            if (req.query.withBody == 'false') posts.forEach(removeBody);

            winston.info(`Time to answer: ${new Date() - startDate} req.query: ${
                JSON.stringify(req.query)}`);
            res.json(posts);
        })
        .catch(next);
}

router.get('/api/posts', function (req, res, next) {
    getPosts(req, res, next);
});

router.get('/api/posts/authorized', auth, function (req, res, next) {
    getPosts(req, res, next, true);
});

// Route for adding a post
router.post('/api/posts', auth, function (req, res, next) {
    // Ignore a passed id for the post version
    delete req.body._id;

    const post = new Post();
    const postVersion = new PostVersion(req.body);
    postVersion.post = post._id;

    // Save the post and the version and return the post.
    postVersion.save().then(postVersion => {
        post.versions = [postVersion];
        return post.save();
    }).then(post => {
        res.json(post);
    }).catch(next);
});

// Route for adding a post version
router.post('/api/posts/:id/version', auth, function (req, res, next) {
    // Ignore a passed id for the post version
    delete req.body._id;

    // Create the post version
    let postVersion = new PostVersion(req.body);
    postVersion.post = mongoose.Types.ObjectId(req.params.id);

    postVersion.save()
        .then(postVersion => {
            // Find the post
            return Post.findOne({'_id': postVersion.post});
        }).then(post => {
        // Update the post
        post.versions.push(postVersion);
        return post.save();
    }).then(post => {
        // Get the updated post with populated fields
        return Post.populate(post, 'versions');
    }).then(post => {
        // Return the post
        res.json(post);
    }).catch(next);
});

// Route for updating a post
router.put('/api/posts/:id', auth, function (req, res, next) {
    // Find the post to update
    const query = {
        '_id': mongoose.Types.ObjectId(req.params.id)
    };

    // Don't allow any modification of post versions
    if (req.body.versions !== undefined) {
        res.status(400).json({
            message: "Modification of the versions field is not allowed in this route."
        });
    }

    Post.findOneAndUpdate(query, req.body, {'new': true})
        .then(function (post) {
            // Get the updated post with populated fields
            return Post.populate(post, 'versions');
        }).then(function (post) {
        res.json(post);
    }).catch(function (err) {
        next(err);
    });
});

// Route for deleting a post
router.delete('/api/posts/:id', auth, function (req, res, next) {
    // Find the post to update
    const query = {
        '_id': mongoose.Types.ObjectId(req.params.id)
    };
    Post.findOne(query)
        .then(post => post.remove())
        .then(() => {
            res.json({
                message: 'Successfully deleted'
            });
        }).catch(next);
});

// Register route. Creates a user given a username and password
router.post('/api/register', function (req, res, next) {
    if (!REGISTRATION_ENABLED) {
        return res.status(400).json({
            message: "Registering is currently not activated."
        });
    }

    if (!req.body.username || !req.body.password) {
        return res.status(400).json({
            message: "Please fill out all fields"
        });
    }

    var user = new User();
    user.username = req.body.username;
    user.setPassword(req.body.password);
    user.save(function (err) {
        if (err) {
            return next(err);
        }
        return res.json({
            token: user.generateJWT()
        });
    });
});

// Login route. Authenticates the user and returns a token
router.post('/api/login', function (req, res, next) {
    if (!req.body.username || !req.body.password) {
        return res.status(400).json({
            message: "Please fill out all fields"
        });
    }

    passport.authenticate('local', function (err, user, info) {
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

// This route deals enables HTML5Mode by forwarding missing files to the index. This needs to be
// at the end, because it is a catch all
router.get('*', function (req, res) {
    // Check, if there is a redirect for the requested url
    if (req.url.length > 0) {
        Redirect.findOne({from: req.url})
            .then(redirect => {
                if (redirect) {
                    res.redirect(redirect.to);
                }
                else {
                    // Let the frontend handle the url
                    res.render(getIndexTemplateName());
                }
            })
            .catch(() => {
                res.render(getIndexTemplateName());
            });
    } else {
        // Let the frontend handle the url
        res.render(getIndexTemplateName());
    }
});

module.exports = router;
