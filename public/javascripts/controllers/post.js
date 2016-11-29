/**
 * Controller to view a post
 */

class PostCtrl extends InjectionReceiver {

    static get $inject() {
        return ['$scope', '$stateParams', '$location', '$state', '$sce', 'angularLoad',
            'PostService'];
    }

    constructor(...injections) {
        super(...injections); // Set the injections on this.

        // If the posts are not fetched yet, wait for the fetch
        if (!this.PostService.hasPosts()) {
            this.$scope.$on('posts:fetched', this.fillTemplate);
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
        this.$scope.editUrl = this.$state.href('edit', {slug: this.$stateParams.slug});

        this.loadScripts();
    }

    deletePost() {
        this.PostService.deletePost(this.post).then(() => this.$state.go('home'));
    }

    loadScripts() {
        // TODO: Put this into the PostVersion model?
        // Load the css directly.
        this.$scope.postVersion.loadCss(this.angularLoad);

        // TODO: Change to $document
        angular.element(document).ready(() => {
            // Load the JavaScripts when the page is loaded.
            this.$scope.postVersion.loadJs(this.angularLoad);

            // wrap tables to make them responsive.
            // TODO: Should this go in here? Not rather in MainCtrl?
            $('table').wrap("<div class='table-container'></div>");
        });
    }
}

angular.module('mlstuff.controllers').controller('PostCtrl', PostCtrl);

