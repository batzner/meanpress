angular.module('mlstuff.controllers').controller('PostCtrl', [
    '$scope',
    '$stateParams',
    '$location',
    '$state',
    '$sce',
    'angularLoad',
    'postsFactory',
    'authFactory',
    function($scope, $stateParams, $location, $state, $sce, angularLoad, postsFactory, authFactory) {
        $scope.toTrusted = function(htmlCode) {
            return $sce.trustAsHtml(htmlCode);
        };

        var post = postsFactory.findPostBySlug($stateParams.slug);
        $scope.postVersion = post.getDisplayVersion();
        // Expose the isLoggedIn method to the scope.
        $scope.isLoggedIn = authFactory.isLoggedIn;
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

angular.module('mlstuff.controllers').controller('EditPostCtrl', [
    '$scope',
    '$stateParams',
    '$state',
    '$log',
    'postsFactory',
    function($scope, $stateParams, $state, $log, postsFactory) {
        // If we edit an existing post, load the post
        var post = $stateParams.slug ? postsFactory.findPostBySlug($stateParams.slug) : null;

        // Prefill the form with the post values / defaults
        if (post) {
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

        $scope.save = function () {
            if (post) {
                // Add a new post version
                postsFactory.addVersion(post, $scope.form);
            } else {
                // Create a new post
                postsFactory.create($scope.form).then(function (post) {
                    // Change the state to the edit state
                    $state.go('edit', {slug: post.getCurrentVersion().slug});
                });
            }
        };

        $scope.publish = function() {
            // Update the post and store the promise
            var promise = null;
            if (post) {
                // Add a new post version
                promise = postsFactory.addVersion(post, $scope.form);
            } else {
                // Create a new post
                promise = postsFactory.create($scope.form);
            }

            // Publish the post and view it
            promise.then(function (post) {
                // Publish the post
                post.publishedVersion = post.getCurrentVersion();
                postsFactory.update(post);

                // View the post
                $state.go('post', {slug: post.publishedVersion.slug});
            }).catch($log.error);
        };
    }
]);
