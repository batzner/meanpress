/**
 * Defines the controller for the home page.
 */

class HomeCtrl extends InjectionReceiver {

    static get $inject() {
        return ['$scope', 'angularLoad', 'PostService'];
    }

    constructor(...injections) {
        super(...injections); // Set the injections on this.

        this.$scope.posts = this.PostService.posts.bindableValues;

        // If the posts are not fetched yet, wait for the fetch
        if (!this.PostService.hasPosts()) {
            this.$scope.$on('posts:fetched', () => this.fillTemplate());
        } else {
            this.fillTemplate();
        }

        // TODO: Fix the ordering of posts on the home page

        // Rerun MathJax on updates
        Util.registerMathJaxWatch(this.$scope);
    }

    fillTemplate() {
        this.$scope.posts.forEach(post => post.getDisplayVersion().loadCss(this.angularLoad));
    }
}

angular.module('mlstuff.controllers').controller('HomeCtrl', HomeCtrl);
