var Post = function() {
    this.title = '';
    this.preview = '';
    this.body = '';
    this.createdAt = new Date();
    this.published = false;
    this.slug = '';
    this.metaDescription = '';
    this.focusKeyword = '';
    this.scripts = '';
};

Post.prototype = {
    loadCSS: function(angularLoad) {
        var scripts = this.getScripts().filter(function(script) {
            return script.endsWith('.css');
        });
        scripts.forEach(function(script) {
            angularLoad.loadCSS(script).catch(function(err) {
                console.error(err);
            })
        });
    },
    loadJavaScripts: function(angularLoad) {
        var scripts = this.getScripts().filter(function(script) {
            return !script.endsWith('.css');
        });
        // Load the JavaScripts asynchronously but ordered
        function loadScript(index) {
            if (index >= scripts.length) return;
            angularLoad.loadScript(scripts[index]).then(function() {
                // Script loaded succesfully load the next one.
                loadScript(index + 1);
            }).catch(function(err) {
                // There was some error loading the script
                console.error(err);
            });
        }

        loadScript(0);
    },
    getScripts: function() {
        // Split by spaces and newlines
        var scripts = this.scripts.replace(/\n/g, " ").split(" ");
        return scripts.map(function(script) {
            return script.trim();
        });
    }
};
