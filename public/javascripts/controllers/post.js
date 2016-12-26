/**
 * Controller to view a post
 */

class PostCtrl extends InjectionReceiver {

    static get $inject() {
        return ['$scope', '$stateParams', '$location', '$state', '$sce', '$document', '$rootScope',
            'angularLoad', 'usSpinnerService',
            'PostService'];
    }

    constructor(...injections) {
        super(...injections); // Set the injections on this.

        // If the posts are not fetched yet, wait for the fetch
        if (!this.PostService.hasPosts()) {
            // Fetch this post with priority
            this.PostService.fetchPosts({slug: this.$stateParams.slug});

            // Show a spinner
            this.usSpinnerService.spin('spinner');

            // TODO: Clicking fast on a skeleton post will leave the skeleton empty forever on a
            // post page.

            // Keep the listener, so that updates of the posts will renew the post version.
            // Otherwise, the post version will be different from its post's post version,
            // because the post created a new post version but the old post version is still
            // referenced by this scope.
            this.$scope.$on('posts:fetched', () => {
                this.usSpinnerService.stop('spinner');
                this.fillTemplate();
            });
        } else {
            this.fillTemplate();
        }
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

        this.$rootScope.htmlTitle = (this.$scope.postVersion.htmlTitle
            || this.$scope.postVersion.title);
        this.$rootScope.metaDescription = this.$scope.postVersion.metaDescription;
        this.$scope.editUrl = this.$state.href('edit', {slug: this.$stateParams.slug});

        this.loadScripts();

        // Wrap tables to make them responsive.
        this.$document.ready(() => {
            $('table').wrap("<div class='table-container'></div>");
        });
    }

    deletePost() {
        this.PostService.deletePost(this.post).then(() => this.$state.go('home'));
    }

    loadScripts() {
        // Load the css directly.
        this.$scope.postVersion.loadCss(this.angularLoad);

        this.$document.ready(() => {
            // Load the JavaScripts when the page is loaded.
            this.$scope.postVersion.loadJs(this.angularLoad)
                .then(() => {
                    // Execute the Post's script
                    if (window.runPostScript) runPostScript();
                });
        });
    }
}

angular.module('mlstuff.controllers').controller('PostCtrl', PostCtrl);

