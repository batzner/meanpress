/**
 * Model for a post version in the frontend.
 */

class PostVersion extends BaseEntity {

    loadCss(angularLoad) {
        // Load all css includes
        Promise.all(this.cssIncludes.map(url => angularLoad.loadCSS(url)))
            .catch(console.error);
    }

    loadJs(angularLoad) {
        // Load all js includes
        Promise.all(this.jsIncludes.map(url => angularLoad.loadScript(url)))
            .catch(console.error);
    }

    isPublished() {
        return this.post && this.post.publishedVersion == this;
    }

    prepareForJson() {
        // Make the post reference an id
        if (this.post) this.post = this.post._id;
    }

    static getDebugValues() {
        return {
            title: 'asdf',
            preview: 'asdf',
            body: 'asdf',
            slug: 'asdf',
            metaDescription: 'asdf',
            focusKeyword: 'asdf',
            jsIncludes: [],
            cssIncludes: [],
            createdAt: new Date()
        }
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