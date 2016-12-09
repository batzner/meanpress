/**
 * Definition of the mongoose schema for posts.
 */

const mongoose = require('mongoose');

const PostVersionSchema = new mongoose.Schema(
    {
        title: String,
        summary: String,
        preview: String,
        body: String,
        slug: String,
        metaDescription: String,
        focusKeyword: String,
        jsIncludes: [{type: String}],
        cssIncludes: [{type: String}],
        category: String,
        tags: [{type: String}],
        publishedAt: Date,
        post: {type: mongoose.Schema.Types.ObjectId, ref: 'Post'}
    }, {
        // Add createdAt and modifiedAt fields, which get set and updated automatically.
        timestamps: true
    }
);

module.exports = mongoose.model('PostVersion', PostVersionSchema);
