/**
 * Definition of the mongoose schema for posts.
 */

const mongoose = require('mongoose');
const PostVersion = mongoose.model('PostVersion');

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
    }, {
        timestamps: true // Will add createdAt and modifiedAt fields, which get set and updated automatically.
    }
);

// Add middleware to cascade-delete the post versions before deleting the post
PostSchema.pre('remove', function (next) {
    PostVersion.remove({post: this._id}).exec();
    next();
});

module.exports = mongoose.model('Post', PostSchema);
