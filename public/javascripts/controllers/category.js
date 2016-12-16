/**
 * Defines the controller for the category page.
 */

class CategoryCtrl extends InjectionReceiver {

    static get $inject() {
        return ['$scope', '$document', '$stateParams', '$state',
            'angularLoad', 'usSpinnerService', 'PostService', 'CategoryService'];
    }

    constructor(...injections) {
        super(...injections); // Set the injections on this.

        this.$scope.posts = this.PostService.posts.bindableValues;

        // If the posts are not fetched yet, wait for the fetch
        if (!this.PostService.hasPosts() || !this.CategoryService.hasCategories()) {
            // Fetch all posts in this category
            this.PostService.fetchPosts({category:this.$stateParams.name}, true);

            // Show a spinner
            this.usSpinnerService.spin('spinner');

            let postListener = this.$scope.$on('posts:fetched', () => {
                postListener(); // Remove this listener
                if (this.CategoryService.hasCategories()) this.fillTemplate();
            });
            let categoryListener = this.$scope.$on('categories:fetched', () => {
                categoryListener(); // Remove this listener
                if (this.PostService.hasPosts()) this.fillTemplate();
            });
        } else {
            this.fillTemplate();
        }
    }

    fillTemplate() {
        // Hide the spinner
        this.usSpinnerService.stop('spinner');

        this.$scope.category = this.CategoryService.findCategoryByName(this.$stateParams.name);

        // Highlight this category in the navigation
        this.$state.current.navItem = this.$scope.category.navItem;

        // Filter the posts by category and sort them
        this.$scope.posts = this.$scope.posts
            .filter(post => {
                return post.getDisplayVersion().category == this.$stateParams.name;
            })
            .sort((a, b) => {
                // Sort the posts date-ascending, if they are a series
                if (this.$scope.category.isSeries) {
                    return a.getDisplayVersion().publishedAt - b.getDisplayVersion().publishedAt;
                } else {
                    return b.getDisplayVersion().publishedAt - a.getDisplayVersion().publishedAt;
                }
            });


        this.$scope.posts.forEach(post => post.getDisplayVersion().loadCss(this.angularLoad));

        // Wrap tables to make them responsive.
        this.$document.ready(() => {
            $('table').wrap("<div class='table-container'></div>");
        });
    }
}

angular.module('mlstuff.controllers').controller('CategoryCtrl', CategoryCtrl);
