/**
 * Defines controllers to view and edit / add a single post.
 */

// Controller to view a post
angular.module('mlstuff.controllers').controller('PostCtrl', [
    '$scope',
    '$stateParams',
    '$location',
    '$state',
    '$sce',
    'angularLoad',
    'postsFactory',
    function($scope, $stateParams, $location, $state, $sce, angularLoad, postsFactory) {
        const post = postsFactory.findPostBySlug($stateParams.slug);
        $scope.postVersion = post.getDisplayVersion();
        $scope.editUrl = $location.path() + 'edit';

        // Load the css directly.
        $scope.postVersion.loadCss(angularLoad);

        angular.element(document).ready(function() {
            // Load the JavaScripts when the page is loaded.
            $scope.postVersion.loadJs(angularLoad);
            // wrap tables to make them responsive.
            $('table').wrap("<div class='table-container'></div>");
        });

        $scope.deletePost = function() {
            postsFactory.delete(post).then(function () {
                $state.go('home');
            });
        };
    }
]);

// Controller to edit or add a post
angular.module('mlstuff.controllers').controller('EditPostCtrl', [
    '$scope',
    '$stateParams',
    '$state',
    '$log',
    'postsFactory',
    function($scope, $stateParams, $state, $log, postsFactory) {
        // If we edit an existing post, load the post
        const post = $stateParams.slug ? postsFactory.findPostBySlug($stateParams.slug) : null;

        // Prefill the form with the post values / defaults
        if (post) {
            // TODO: Ensure that editing the $scope.form does not update the post's current version
            $scope.form = post.getCurrentVersion();

            // Use the post's created at instead of the post version's date
            $scope.form.createdAt = new Date(post.createdAt);
        } else {
            $scope.form = {
                // TODO: make this an empty object
                title: 'asdf',
                preview: 'asdf',
                body: 'asdf',
                slug: 'asdf',
                metaDescription: 'asdf',
                focusKeyword: 'asdf'
            };
            $scope.form.createdAt = new Date();
        }

        // Form cosmetics
        $scope.form.createdAt.setSeconds(0, 0);

        // Validating function that calls another function only if the form is valid
        $scope.submit = function(methodName){
            if($scope.form.element.$valid){
                $scope[methodName]();
            }
        };

        // Either add a version or create the post. This function returns a promise used by save, publish and preview
        let savePost = () => post ? postsFactory.addVersion(post, $scope.form) : postsFactory.create($scope.form);

        $scope.save = function() {
            // Save the post and change the url
            savePost().then(function (post) {
                // Change the state to the edit state
                $state.go('edit', {slug: post.getCurrentVersion().slug});
            }).catch($log.error);
        };

        $scope.preview = function() {
            // Save the post and view it without publishing
            savePost().then(function (post){
                // View the post
                $state.go('post', {slug: post.publishedVersion.slug});
            }).catch($log.error);
        };

        $scope.publish = function() {
            // Save the post, view it and publish it
            savePost().then(function (post) {
                // Publish the post
                post.publishedVersion = post.getCurrentVersion();
                return postsFactory.update(post);
            }).then(function (post){
                // View the post
                $state.go('post', {slug: post.publishedVersion.slug});
            }).catch($log.error);
        };

        $scope.unpublish = function() {
            // TODO: Don't save the post, but update it to unpublished
        };
    }
]);
