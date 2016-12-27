/**
 * Definition of the mongoose schema for redirects.
 */

const mongoose = require('mongoose');

const RedirectSchema = new mongoose.Schema(
    {
        from: String,
        to: String
    }, {
        // Add createdAt and modifiedAt fields, which get set and updated automatically.
        timestamps: true
    }
);

module.exports = mongoose.model('Redirect', RedirectSchema);
