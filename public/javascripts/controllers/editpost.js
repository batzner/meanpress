/**
 * Controller to edit or add a post
 */

class EditPostCtrl extends InjectionReceiver {

    static get $inject() {
        return ['$scope', '$stateParams', '$state', '$log', '$q', 'PostService'];
    }

    constructor(...injections) {
        super(...injections); // Set the injections on this.

        this.setPost().then(() => this.fillTemplate());
    }

    /**
     * Returns a promise, which sets the post and returns it. If we are in the Add state, the post
     * will be null.
     * @returns {Promise.<Post>}
     */
    setPost() {
        // Exit early, if we don't need to set a post
        const slug = this.$stateParams.slug;
        if (!slug) {
            this.post = null;
            return this.$q.when(this.post);
        }

        //If the posts are not present, we need to fetch them first
        if (!this.PostService.getPosts()) {
            return this.PostService.fetchAll().then(() => {
                // Set the post and return it
                this.post = this.PostService.findPostBySlug(slug);
                return this.post;
            });
        } else {
            this.post = this.PostService.findPostBySlug(slug);
            return this.$q.when(this.post);
        }
    }

    fillTemplate() {
        // Prefill the form with the post values / defaults
        if (this.post) {
            // TODO: Ensure that editing the $scope.form does not update the post's current version
            this.$scope.form = this.post.getCurrentVersion();

            // Use the post's created at instead of the post version's date
            this.$scope.form.createdAt = new Date(this.post.createdAt);
        } else {
            this.$scope.form = {
                // TODO: make this an empty object
                title: 'asdf',
                preview: 'asdf',
                body: 'asdf',
                slug: 'asdf',
                metaDescription: 'asdf',
                focusKeyword: 'asdf'
            };
            this.$scope.form.createdAt = new Date();
        }

        // Form cosmetics
        this.$scope.form.createdAt.setSeconds(0, 0);
    }

    // Validating function that calls another function only if the form is valid
    submit(methodName) {
        if (this.$scope.form.element.$valid) {
            this[methodName]();
        }
    }

    savePost() {
        // Either add a version or create the post. This function returns a promise used by
        // save, publish and preview.
        if (this.post) {
            return this.PostService.createPostVersion(this.post, this.$scope.form)
        } else {
            return this.PostService.createPost(this.$scope.form);
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
        this.savePost().then(post => {
            // View the post
            this.$state.go('post', {slug: post.getCurrentVersion().slug});
        }).catch(this.$log.error);
    }

    publish() {
        // Save the post, view it and publish it
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
        // TODO: Don't save the post, but update it to unpublished
    }
}

angular.module('mlstuff.controllers').controller('EditPostCtrl', EditPostCtrl);