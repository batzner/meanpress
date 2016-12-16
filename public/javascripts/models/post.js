/**
 * Model for a post in the frontend.
 */

class Post extends BaseEntity {
    updateProperties(data) {
        // Before setting the properties to this object, we need to cast the post versions
        if (data.versions) {
            data.versions.forEach(v => v.post = this);
            data.versions = data.versions.map(v => new PostVersion(v));
        }

        super.updateProperties(data);

        // After updating the properties, we might need to reset the published version
        if (data.publishedVersion) {
            this.publishedVersion = this.versions.find(v => v._id == data.publishedVersion);
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