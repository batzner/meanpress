let PostVersion = function(data) {
    data = data || {};
    this._id = data._id || null;
    this.title = data.title || '';
    this.preview = data.preview || '';
    this.body = data.body || '';
    this.slug = data.slug || '';
    this.metaDescription = data.metaDescription || '';
    this.focusKeyword = data.focusKeyword || '';
    this.jsIncludes = data.jsIncludes || [];
    this.cssIncludes = data.cssIncludes || [];
    this.createdAt = data.createdAt || new Date();
    this.updatedAt = data.updatedAt || new Date();
};

PostVersion.prototype = {
    constructor: PostVersion,
    loadCss: function(angularLoad) {
        this.cssIncludes.forEach(function(url) {
            angularLoad.loadCSS(url).catch(function(err) {
                console.error(err);
            })
        });
    },
    loadJs: function(angularLoad) {
        // Load the JavaScripts asynchronously but ordered
        let that = this;
        function loadScript(index) {
            if (index >= that.jsIncludes.length) return;
            angularLoad.loadScript(that.jsIncludes[index]).then(function() {
                // Script loaded succesfully. Load the next one.
                loadScript(index + 1);
            }).catch(function(err) {
                console.error(err);
            });
        }

        loadScript(0);
    },
    loadScripts: function (angularLoad) {
        this.loadCss(angularLoad);
        this.loadJs(angularLoad);
    },
    isPublished: function () {
        // TODO: Check if corresponding post contains this one as published version
        return true;
    },

    // BUG: This is only for copy pasting
    getScripts: function() {
        // Split by spaces and newline
        let scripts = this.scripts.replace(/\n/g, " ").split(" ");
        return scripts.map(function(script) {
            return script.trim();
        });
    }
};
