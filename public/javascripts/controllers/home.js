/**
 * Defines the controller for the home page.
 */

class HomeCtrl extends InjectionReceiver {

    static get $inject() {
        return ['$scope', 'PostService'];
    }

    constructor(...injections) {
        super(...injections); // Set the injections on this.

        this.$scope.posts = this.PostService.posts.bindableValues;
    }

    onPostsUpdated() {
        this.$scope.postVersions = this.PostService.getSortedPosts()
            .map(post => post.getDisplayVersion());
    }
}

angular.module('mlstuff.controllers').controller('HomeCtrl', HomeCtrl);
