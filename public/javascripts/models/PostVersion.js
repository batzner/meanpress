var PostVersion = function() {
    this.title = '';
    this.preview = '';
    this.body = '';
    this.slug = '';
    this.metaDescription = '';
    this.focusKeyword = '';
    this.jsIncludes = [];
    this.cssIncludes = [];
    this.post = null;
    this.createdAt = new Date();
    this.updatedAt = new Date();
};

PostVersion.prototype = {
    loadCss: function(angularLoad) {
        cssIncludes.forEach(function(url) {
            angularLoad.loadCSS(url).catch(function(err) {
                console.error(err);
            })
        });
    },
    loadJs: function(angularLoad) {
        // Load the JavaScripts asynchronously but ordered
        function loadScript(index) {
            if (index >= scripts.length) return;
            angularLoad.loadScript(jsIncludes[index]).then(function() {
                // Script loaded succesfully. Load the next one.
                loadScript(index + 1);
            }).catch(function(err) {
                console.error(err);
            });
        }

        loadScript(0);
    },
    loadScripts: function (angularLoad) {
        loadCss(angularLoad);
        loadJs(angularLoad);
    },

    // BUG: This is only for copy pasting
    getScripts: function() {
        // Split by spaces and newlines
        var scripts = this.scripts.replace(/\n/g, " ").split(" ");
        return scripts.map(function(script) {
            return script.trim();
        });
    }
};
