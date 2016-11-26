/**
 * Defines the controller for the home page.
 */

class HomeCtrl extends InjectionReceiver {

    static get $inject() {
        return ['$scope', 'PostService'];
    }

    constructor(...injections) {
        super(...injections); // Set the injections on this.

        // Fetch the posts for the first time
        this.onPostsUpdated();

        // Listen to changes to the posts
        this.$scope.$on('posts:updated', () => this.onPostsUpdated());
    }

    onPostsUpdated() {
        this.$scope.postVersions = this.PostService.getSortedPosts()
            .map(post => post.getDisplayVersion());
    }
}

angular.module('mlstuff.controllers').controller('HomeCtrl', HomeCtrl);
