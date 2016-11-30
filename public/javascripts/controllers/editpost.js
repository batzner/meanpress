/**
 * Controller to edit or add a post
 */

class EditPostCtrl extends InjectionReceiver {

    static get $inject() {
        return ['$scope', '$stateParams', '$state', '$log', '$q', 'PostService'];
    }

    constructor(...injections) {
        super(...injections); // Set the injections on this.

        // Provide an object for the form element in the scope http://stackoverflow.com/a/24746842
        this.$scope.form = {};

        // If we are editing a post and the posts are not fetched yet, wait for the fetch
        if (this.$stateParams.slug && !this.PostService.hasPosts()) {
            this.$scope.$on('posts:fetched', () => this.fillTemplate());
        } else {
            this.fillTemplate();
        }
    }

    fillTemplate() {
        console.log('Filling template');
        this.$scope.post = this.PostService.findPostBySlug(this.$stateParams.slug);

        // Prefill the form with the post values / defaults
        if (this.$scope.post) {
            // Ensure that editing the $scope.form does not update the post's current version
            this.$scope.postVersion = angular.copy(this.$scope.post.getCurrentVersion());
        } else {
            this.$scope.postVersion = new PostVersion({
                // TODO: Make the setting of asdf to string automated, if debug mode is enabled.
                title: 'asdf',
                preview: 'asdf',
                body: 'asdf',
                slug: 'asdf',
                metaDescription: 'asdf',
                focusKeyword: 'asdf'
            });
        }

        // Form cosmetics
        this.$scope.postVersion.createdAt.setSeconds(0, 0);
    }

    // Validating function that calls another function only if the form is valid
    submit(methodName) {
        if (this.$scope.form.theForm.$valid) {
            this[methodName]();
        }
    }

    savePost() {
        // TODO: Cascade deletion of post versions
        // Preprocess the form inputs
        /* TODO: let includeStringToList = (str) => str.replace(/\n/g, ' ').split(' ').map(s =>
         s.trim());
        this.$scope.form.jsIncludes = includeStringToList(this.$scope.form.jsIncludes);
        this.$scope.form.cssIncludes = includeStringToList(this.$scope.form.cssIncludes);
         */

        // Either add a version or create the post. This function returns a promise used by
        // save, publish and preview.
        if (this.$scope.post) {
            // Create the post version in the backend
            return this.PostService.createPostVersion(this.$scope.post, this.$scope.postVersion)
        } else {
            // Create the post and postversion in the backend
            return this.PostService.createPost(this.$scope.postVersion);
        }
    }

    save() {
        // Save the post and change the url
        this.savePost().then(post => {
            // Change the state to the edit state
            this.$state.go('edit', {slug: post.getCurrentVersion().slug});
        }).catch(this.$log.error);
    }

    preview() {
        // Save the post and view it without publishing
        // Don't view the post, but only the current post version. Also, open the post in a new tab.
        this.savePost().then(post => {
            // View the post
            this.$state.go('preview', {slug: post.getCurrentVersion().slug});
        }).catch(this.$log.error);
    }

    publish() {
        // Save the post, publish it and view it
        this.savePost().then(post => {
            // Publish the post
            post.publishedVersion = post.getCurrentVersion();
            return this.PostService.updatePost(post);
        }).then(post => {
            // View the post
            this.$state.go('post', {slug: post.publishedVersion.slug});
        }).catch(this.$log.error);
    }

    unpublish() {
        if (!this.$scope.post) {
            console.error('Trying to unpublish a post in add mode / post not set in scope.');
            return;
        }

        this.$scope.post.publishedVersion = null;
        this.PostService.updatePost(post);
    }
}

angular.module('mlstuff.controllers').controller('EditPostCtrl', EditPostCtrl);