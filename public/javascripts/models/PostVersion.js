/**
 * Model for a post version in the frontend.
 */

class PostVersion {
    /**
     * Construct a PostVersion by passing an object with the same properties as the result of
     * getDefaults(). The given object does not need to have all properties set; only those, who
     * shall be overwritten.
     * @param {Object} data - The properties for the version, which shall overwrite the defaults.
     */
    constructor(data) {
        // Get the default properties for the post and overwrite them with the given data
        Object.assign(this, PostVersion.getDefaults());
        Object.assign(this, data);
    }

    loadCss(angularLoad) {
        // Load all css includes
        // TODO: Refactor logging
        Promise.all(this.cssIncludes.map(url => angularLoad.loadCSS(url)))
            .catch(err => console.error(err));
    }

    loadJs(angularLoad) {
        // Load all js includes
        // TODO: Refactor logging
        Promise.all(this.jsIncludes.map(url => angularLoad.loadJs(url)))
            .catch(err => console.error(err));
    }

    loadScripts(angularLoad) {
        // Load css and js (each ordered, but both simultaneously)
        this.loadCss(angularLoad);
        this.loadJs(angularLoad);
    }

    isPublished() {
        // TODO: Check if corresponding post contains this one as published version
        return true;
    }

    // BUG: This is only for copy pasting
    // TODO: Search for BUG:s
    getScripts() {
        // Split by spaces and newline
        let scripts = this.scripts.replace(/\n/g, " ").split(" ");
        return scripts.map(function (script) {
            return script.trim();
        });
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