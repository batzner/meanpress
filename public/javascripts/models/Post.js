/**
 * Model for a post in the frontend.
 */

class Post {
    /**
     * Construct a post by passing an object with the same properties as the result of getDefaults()
     * The given object does not need to have all properties set; only those, who shall be
     * overwritten.
     * @param {Object} data - The properties for the post, which shall overwrite the defaults.
     */
    constructor(data) {
        // Get the default properties for the post and overwrite them with the given data
        Object.assign(this, Post.getDefaults());
        Object.assign(this, data);

        // Convert all versions to PostVersions
        this.versions = this.versions.map(v => new PostVersion(v));

        // Set the published version to one of the versions
        if (this.publishedVersion) {
            this.publishedVersion = this.versions.find(v => v._id == this.publishedVersion._id);
        }
    }

    getCurrentVersion() {
        // Returns the last version of this post or null, if it doesn't have a version.
        return this.versions.length ? this.versions[this.versions.length - 1] : null;
    }

    getDisplayVersion() {
        // Returns the published version or the current version, if none is published
        return this.publishedVersion ? this.publishedVersion : this.getCurrentVersion();
    }

    matchesSlug(slug) {
        // Check, if this posts matches a given slug
        return this.versions.some(v => v.slug == slug);
    }

    static getDefaults() {
        return {
            _id: null,
            createdAt: new Date(),
            updatedAt: new Date(),
            publishedVersion: null,
            versions: []
        }
    }
}