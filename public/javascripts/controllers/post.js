/**
 * Controller to view a post
 */

class PostCtrl extends InjectionReceiver {

    static get $inject() {
        return ['$scope', '$stateParams', '$location', '$state', '$sce', '$document', 'angularLoad',
            'PostService'];
    }

    constructor(...injections) {
        super(...injections); // Set the injections on this.

        // If the posts are not fetched yet, wait for the fetch
        if (!this.PostService.hasPosts()) {
            this.$scope.$on('posts:fetched', () => this.fillTemplate());
        } else {
            this.fillTemplate();
        }

        // Rerun MathJax on updates
        Util.registerMathJaxWatch(this.$scope);
    }


    fillTemplate() {
        this.post = this.PostService.findPostBySlug(this.$stateParams.slug);

        if (!this.post) return;

        // Set the variables on the scope
        if (this.$stateParams.preview) {
            this.$scope.postVersion = this.post.getCurrentVersion();
        } else {
            this.$scope.postVersion = this.post.getDisplayVersion();
        }
        this.$scope.editUrl = this.$state.href('edit', {slug: this.$stateParams.slug});

        this.loadScripts();
    }

    deletePost() {
        this.PostService.deletePost(this.post).then(() => this.$state.go('home'));
    }

    loadScripts() {
        // Load the css directly.
        this.$scope.postVersion.loadCss(this.angularLoad);

        this.$document.ready(() => {
            // Load the JavaScripts when the page is loaded.
            this.$scope.postVersion.loadJs(this.angularLoad);
        });

        // Register JS/CSS cleanup on exit
        this.$scope.$on('$destroy', () => {
            this.$scope.postVersion.unloadCss(this.$document);
            this.$scope.postVersion.unloadJs(this.$document);
        });
    }
}

angular.module('mlstuff.controllers').controller('PostCtrl', PostCtrl);

