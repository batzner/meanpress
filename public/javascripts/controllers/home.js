/**
 * Defines the controller for the home page.
 */

class HomeCtrl extends InjectionReceiver {

    static get $inject() {
        return ['$scope', '$document', '$timeout', 'angularLoad', 'usSpinnerService',
            'PostService'];
    }

    constructor(...injections) {
        super(...injections); // Set the injections on this.

        this.$scope.posts = this.PostService.posts.bindableValues;

        // If the posts are not fetched yet, wait for the fetch
        if (!this.PostService.hasPosts()) {
            // Fetch the posts without body first, then with
            this.PostService.fetchPosts({}, false);

            // Show a spinner
            this.usSpinnerService.spin('spinner');

            let postListener = this.$scope.$on('posts:fetched', () => {
                postListener(); // Remove this listener
                this.usSpinnerService.stop('spinner');
                this.fillTemplate();
            });
        } else {
            this.fillTemplate();
        }
    }

    fillTemplate() {
        // Hide the spinner
        this.usSpinnerService.stop('spinner');

        this.$scope.posts.forEach(post => post.getDisplayVersion().loadCss(this.angularLoad));

        // Wrap tables to make them responsive.
        this.$document.ready(() => {
            $('table').wrap("<div class='table-container'></div>");
        });
    }
}

angular.module('mlstuff.controllers').controller('HomeCtrl', HomeCtrl);
