/**
 * Model for a post in the frontend.
 */

class Post extends BaseEntity {
    /**
     * See constructor of super class.
     */
    constructor(data) {
        super(data);

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

    isPublished() {
        return !!this.publishedVersion;
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