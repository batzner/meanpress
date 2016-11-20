var mongoose = require('mongoose');

var PostVersionSchema = new mongoose.Schema(
    {
        title: String,
        preview: String,
        body: String,
        slug: String,
        metaDescription: String,
        focusKeyword: String,
        jsIncludes: [{ type: String }],
        cssIncludes: [{ type: String }],
        post: { type: mongoose.Schema.Types.ObjectId, ref: 'Post'}
    },{
        timestamps: true
    }
);

module.exports = mongoose.model('PostVersion', PostVersionSchema);
