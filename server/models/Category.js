/**
 * Definition of the mongoose schema for post categories.
 */

const mongoose = require('mongoose');

const CategorySchema = new mongoose.Schema(
    {
        name: String,
        title: String,
        introduction: String,
        isSeries : Boolean,
        navItem: String,
    }, {
        // Add createdAt and modifiedAt fields, which get set and updated automatically.
        timestamps: true
    }
);

module.exports = mongoose.model('Category', CategorySchema);
