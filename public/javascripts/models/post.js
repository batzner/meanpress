var Post = function () {
    this.createdAt = new Date();
    this.updatedAt = new Date();
    this.versions = [];
    this.publishedVersion = null;
};

Post.prototype = {
    getCurrentVersion: function () {
        // Returns the last version of this post or null, if it doesn't have a version.
        return versions.length ? versions[version.length - 1] : null;
    },
    getDisplayVersion: function () {
        // Returns the published version or the current version, if none is published
        return publishedVersion ? publishedVersion : this.getCurrentVersion();
    }
};
