var mongoose = require('mongoose');
var PostVersionSchema = mongoose.model('PostVersion').schema;

var PostSchema = new mongoose.Schema(
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

// Add middleware to cascade-delete the post versions before deleting the post
PostSchema.pre('remove', function(next) {
    PostVersionSchema.remove({ post: this._id }).exec();
    next();
});

module.exports = mongoose.model('Post', PostSchema);
