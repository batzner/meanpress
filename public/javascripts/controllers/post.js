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
        }

        $scope.post = postsFactory.findPostBySlug($stateParams.slug);
        // Expose the isLoggedIn method to the scope.
        $scope.isLoggedIn = authFactory.isLoggedIn;
        $scope.editUrl = $location.path() + 'edit';
        $scope.deletePost = function() {
            postsFactory.delete($scope.post._id);

            $state.go('home');
        };
        // Load the css directly.
        $scope.post.loadCSS(angularLoad);
        // Load the JavaScripts when the page is loaded.
        angular.element(document).ready(function() {
            $scope.post.loadJavaScripts(angularLoad);
        });
    }
]);

angular.module('mlstuff.controllers').controller('AddPostCtrl', [
    '$scope',
    '$stateParams',
    '$state',
    'postsFactory',
    function($scope, $stateParams, $state, postsFactory) {
        $scope.form = {};
        $scope.form.createdAt = new Date();
        $scope.form.createdAt.setSeconds(0, 0);
        $scope.form.submit = function() {
            // The form object has all properties of a post object, so
            // we can directly pass it to the post factory.
            // Clone, so that emptying the form inputs does not affect our
            // HTTP request in the post factory.
            var post = angular.copy($scope.form);
            postsFactory.create(post);

            // Empty the form inputs.
            $scope.form.title = '';
            $scope.form.preview = '';
            $scope.form.body = '';
            $scope.form.scripts = '';
            $scope.form.slug = '';
            $scope.form.metaDescription = '';
            $scope.form.focusKeyword = '';

            // Go home, because we don't know the id of the post
            $state.go('home');
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
            postsFactory.update(post._id, $scope.form);

            // View the post
            $location.path('/post/' + $scope.form.slug);
        };
    }
]);
