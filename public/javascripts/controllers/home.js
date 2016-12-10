/**
 * Defines the controller for the home page.
 */

class HomeCtrl extends InjectionReceiver {

    static get $inject() {
        return ['$scope', '$document', 'angularLoad', 'PostService'];
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
    }

    fillTemplate() {
        this.$scope.posts.forEach(post => post.getDisplayVersion().loadCss(this.angularLoad));

        // Register CSS cleanup on exit
        this.$scope.$on('$destroy', () => {
            this.$scope.posts.forEach(post => post.getDisplayVersion().unloadCss(this.angularLoad));
        });

        // Wrap tables to make them responsive.
        this.$document.ready(() => {
            $('table').wrap("<div class='table-container'></div>");
        });
    }
}

angular.module('mlstuff.controllers').controller('HomeCtrl', HomeCtrl);
