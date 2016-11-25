var Post = function (data) {
    // If called with new Post(), 'this' will be the Post object

    // If no data is given, set it to an empty object to enable accessing properties
    data = data || {};
    this._id = data._id || null;
    this.createdAt = data.createdAt || new Date();
    this.updatedAt = data.updatedAt || new Date();
    this.publishedVersion = data.publishedVersion ? new PostVersion(data.publishedVersion) : null;
    this.versions = [];

    // Cast the versions
    if (data.versions) {
        var that = this;
        data.versions.forEach(function (versionData) {
            // Create a new version except for the published version
            if(that.publishedVersion && versionData._id == that.publishedVersion._id) {
                that.versions.push(that.publishedVersion);
            } else {
                that.versions.push(new PostVersion(versionData));
            }
        });
    }

    // If called with new Post(), return this; will be inserted here automatically
};

// We don't declare the following methods in the upper constructor, because then they would be copied to each
// new Post instance. The following methods are shared as opposed to the properties above.
Post.prototype = {
    constructor: Post, // Since we assign an object literal to the prototype, we need to redefine the constructor
    getCurrentVersion: function () {
        // Returns the last version of this post or null, if it doesn't have a version.
        return this.versions.length ? this.versions[this.versions.length - 1] : null;
    },
    getDisplayVersion: function () {
        // Returns the published version or the current version, if none is published
        return this.publishedVersion ? this.publishedVersion : this.getCurrentVersion();
    },
    matchesSlug: function(slug) {
        // Check, if this posts matches a given slug
        return this.versions.some(v => v.slug == slug);
    }
};