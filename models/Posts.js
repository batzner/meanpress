/**
 * Definition of the mongoose schema for posts.
 */

const mongoose = require('mongoose');
const PostVersionSchema = mongoose.model('PostVersion').schema;

const PostSchema = new mongoose.Schema(
    {
        versions: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'PostVersion'
        }],
        publishedVersion: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'PostVersion'
        }
    },{
        timestamps: true
    }
);

// Add middleware to cascade-deconste the post versions before deconsting the post
PostSchema.pre('remove', function(next) {
    PostVersionSchema.remove({ post: this._id }).exec();
    next();
});

module.exports = mongoose.model('Post', PostSchema);
