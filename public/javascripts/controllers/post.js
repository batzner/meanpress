/**
 * Controller to view a post
 */

class PostCtrl extends InjectionReceiver {

    static get $inject() {
        return ['$scope', '$stateParams', '$location', '$state', '$sce', '$document', '$rootScope',
            'angularLoad', 'usSpinnerService',
            'PostService', 'CategoryService'];
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
        this.$scope.editUrl = this.$state.href('edit', {slug: this.$stateParams.slug});
        let category = this.CategoryService.findCategoryByName(this.$scope.postVersion.category);
        if (category && category.isSeries) {
            this.$scope.categoryTitle = category.title;
        }

        this.$rootScope.htmlTitle = (this.$scope.postVersion.htmlTitle
            || this.$scope.postVersion.title);
        this.$rootScope.metaDescription = this.$scope.postVersion.metaDescription;

        this.loadScripts();
        this.loadDisqus();
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

    loadDisqus() {
        /**
        *  RECOMMENDED CONFIGURATION VARIABLES: EDIT AND UNCOMMENT THE SECTION BELOW TO INSERT DYNAMIC VALUES FROM YOUR PLATFORM OR CMS.
        *  LEARN WHY DEFINING THESE VARIABLES IS IMPORTANT: https://disqus.com/admin/universalcode/#configuration-variables*/

        let PAGE_URL = window.location.href;
        let PAGE_IDENTIFIER = this.post._id;
        var disqus_config = function () {
            this.page.url = PAGE_URL;  // Replace PAGE_URL with your page's canonical URL variable
            this.page.identifier = PAGE_IDENTIFIER; // Replace PAGE_IDENTIFIER with your page's unique identifier variable
        };

        if (window.DISQUS) {
            DISQUS.reset({reload: true, config: disqus_config});
        } else {
            (function() { // DON'T EDIT BELOW THIS LINE
            var d = document, s = d.createElement('script');
            s.src = '//mlowl.disqus.com/embed.js';
            s.setAttribute('data-timestamp', +new Date());
            (d.head || d.body).appendChild(s);
            })();
        }
    }
}

angular.module('mlstuff.controllers').controller('PostCtrl', PostCtrl);

