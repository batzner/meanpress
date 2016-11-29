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
        Promise.all(this.jsIncludes.map(url => angularLoad.loadJs(url)))
            .catch(console.error);
    }

    isPublished() {
        // TODO: Check if corresponding post contains this one as published version
        return true;
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
            createdAt: new Date(),
            updatedAt: new Date()
        }
    }
}