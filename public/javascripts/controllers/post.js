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

        $scope.post = postsFactory.findPostBySlug($stateParams.slug).getDisplayVersion();
        // Expose the isLoggedIn method to the scope.
        $scope.isLoggedIn = authFactory.isLoggedIn;
        $scope.editUrl = $location.path() + 'edit';
        $scope.deletePost = function() {
            postsFactory.delete($scope.post.id);

            $state.go('home');
        };
        // Load the css directly.
        $scope.post.loadCSS(angularLoad);

        angular.element(document).ready(function() {
            // Load the JavaScripts when the page is loaded.
            $scope.post.loadJavaScripts(angularLoad);
            // wrap tables to make them responsive.
            $('table').wrap("<div class='table-container'></div>");
        });
    }
]);

angular.module('mlstuff.controllers').controller('AddPostCtrl', [
    '$scope',
    '$stateParams',
    '$state',
    '$log',
    'postsFactory',
    function($scope, $stateParams, $state, $log, postsFactory) {
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
        $scope.form.createdAt.setSeconds(0, 0);

        $scope.submit = function(methodName){
            if($scope.form.element.$valid){
                $scope[methodName]();
            }
        };

        $scope.save = function () {
            // The form object has all properties of a post object, so we can directly pass it to the post factory.
            // Clone, so that emptying the form inputs does not affect our HTTP request in the post factory.
            var postData = angular.copy($scope.form);
            postsFactory.create(postData);
        };

        $scope.publish = function() {
            // The form object has all properties of a post object, so we can directly pass it to the post factory.
            // Clone, so that emptying the form inputs does not affect our HTTP request in the post factory.
            var postData = angular.copy($scope.form);
            postsFactory.create(postData).then(function (post) {
                // Publish the post
                post.publishedVersion = post.versions[0];
                postsFactory.update(post);

                // View the post
                $state.go('post', {slug: post.publishedVersion.slug});
            }).catch($log.error);
        };
    }
]);

angular.module('mlstuff.controllers').controller('EditPostCtrl', [
    '$scope',
    '$stateParams',
    '$location',
    'postsFactory',
    function($scope, $stateParams, $location, postsFactory) {
        var post = postsFactory.findPostBySlug($stateParams.slug);
        $scope.form = post;
        // Parse the date string to a Date for the form.
        $scope.form.createdAt = new Date($scope.form.createdAt);
        $scope.form.submit = function() {
            // The form object has all properties of a post object, so
            // we can directly pass it to the post factory.
            postsFactory.update(post.id, $scope.form);

            // View the post
            $location.path('/post/' + $scope.form.slug);
        };
    }
]);
