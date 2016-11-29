/**
 * Model for a post version in the frontend.
 */

class PostVersion extends BaseEntity {

    constructor(data) {
        super(data);

        // The post *must* be set, because PostVersions are weakly associated
        if (!this.post) {
            throw new ReferenceError('Tried to construct a PostVersion without a post set.');
        }

        if (!(this.post instanceof Post)) {
            throw new TypeError('post is set, but not an instance of Post.');
        }
    }

    loadCss(angularLoad) {
        // Load all css includes
        Promise.all(this.cssIncludes.map(url => angularLoad.loadCSS(url)))
            .catch(console.error);
    }

    loadJs(angularLoad) {
        // Load all js includes
        Promise.all(this.jsIncludes.map(url => angularLoad.loadJs(url)))
            .catch(console.error);
    }

    isPublished() {
        return this.post && this.post.publishedVersion == this;
    }

    copyForJson() {
        const result = super.copyForJson();
        // Make the post reference an id
        result.post = result.post._id;
        return result;
    }

    static getDefaults() {
        return {
            _id: null,
            title: '',
            preview: '',
            body: '',
            slug: '',
            metaDescription: '',
            focusKeyword: '',
            jsIncludes: [],
            cssIncludes: [],
            post: null,
            createdAt: new Date(),
            updatedAt: new Date()
        }
    }
}