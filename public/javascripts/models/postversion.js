/**
 * Model for a post version in the frontend.
 */

class PostVersion extends BaseEntity {

    updateProperties(data) {
        // Convert date strings to Date objects before updating
        if (data.publishedAt !== undefined) data.publishedAt = new Date(data.publishedAt);

        super.updateProperties(data);
    }

    loadCss(angularLoad) {
        // Load all css includes
        Promise.all(this.cssIncludes.map(url => angularLoad.loadCSS(url)))
            .catch(console.error);
    }

    loadJs(angularLoad) {
        // Load all js includes

        // Wrap each angularLoad Promise in a function returning it. See Util.chainBlockPromises
        // for more detail.
        const blocks = this.jsIncludes.map(url => {
            return () => angularLoad.loadScript(url);
        });

        Util.chainPromiseBlocks(blocks).catch(console.error);
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
            title: 'This is title of usual length - Lorem Ipsum Bliblablubb This Might Break the' +
            ' Line',
            category: 'asdf-category',
            tags: ['neural-networks', 'fun', 'implementation', 'theory'],
            preview: 'asdf',
            body: 'asdf',
            slug: 'asdf',
            metaDescription: 'asdf',
            focusKeyword: 'asdf',
            jsIncludes: [],
            cssIncludes: [],
            publishedAt: new Date()
        }
    }

    static getDefaults() {
        return {
            _id: null,
            title: '',
            category: '',
            tags: [],
            preview: '',
            body: '',
            slug: '',
            metaDescription: '',
            focusKeyword: '',
            jsIncludes: [],
            cssIncludes: [],
            post: null,
            publishedAt: new Date(),
            createdAt: new Date(),
            updatedAt: new Date()
        }
    }
}