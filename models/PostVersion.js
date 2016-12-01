/**
 * Definition of the mongoose schema for posts.
 */

const mongoose = require('mongoose');

const PostVersionSchema = new mongoose.Schema(
    {
        title: String,
        preview: String,
        body: String,
        slug: String,
        metaDescription: String,
        focusKeyword: String,
        jsIncludes: [{type: String}],
        cssIncludes: [{type: String}],
        category: String,
        tags: [{type: String}],
        post: {type: mongoose.Schema.Types.ObjectId, ref: 'Post'}
    }, {
        timestamps: true // Will add createdAt and modifiedAt fields, which get set and updated automatically.
    }
);

module.exports = mongoose.model('PostVersion', PostVersionSchema);
