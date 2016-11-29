/**
 * Model for a post version in the frontend.
 */

class PostVersion extends BaseEntity {

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