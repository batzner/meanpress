/**
 * Defines controllers to view and edit / add a single post.
 */

// Controller to view a post
class PostCtrl extends InjectionReceiver {

    static get $inject() {
        return ['$scope', '$stateParams', '$location', '$state', '$sce', 'angularLoad',
            'PostService'];
    }

    constructor(...injections) {
        super(...injections); // Set the injections on this.

        this.post = this.PostService.findPostBySlug(this.$stateParams.slug);

        // Set the variables on the scope
        this.$scope.postVersion = this.post.getDisplayVersion();
        this.$scope.editUrl = this.$location.path() + 'edit';

        this.loadScripts();
    }

    deletePost() {
        this.PostService.delete(this.post).then(() => this.$state.go('home'));
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

// Controller to edit or add a post
class EditPostCtrl extends InjectionReceiver {

    static get $inject() {
        return ['$scope', '$stateParams', '$state', '$log', 'PostService'];
    }

    constructor(...injections) {
        super(...injections); // Set the injections on this.

        // If we edit an existing post, load the post
        const slug = this.$stateParams.slug;
        this.post = slug ? this.PostService.findPostBySlug(slug) : null;

        // Fill the template
        this.fillForm();
    }

    fillForm() {
        // Prefill the form with the post values / defaults
        if (this.post) {
            // TODO: Ensure that editing the $scope.form does not update the post's current version
            this.$scope.form = this.post.getCurrentVersion();

            // Use the post's created at instead of the post version's date
            this.$scope.form.createdAt = new Date(post.createdAt);
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
            return this.PostService.addVersion(this.post, this.$scope.form)
        } else {
            return this.PostService.create(this.$scope.form);
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
            this.$state.go('post', {slug: post.publishedVersion.slug});
        }).catch(this.$log.error);
    }

    publish() {
        // Save the post, view it and publish it
        this.savePost().then(post => {
            // Publish the post
            post.publishedVersion = post.getCurrentVersion();
            return this.PostService.update(post);
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
