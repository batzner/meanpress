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

        // Split by spaces and newlines
        var scripts = $scope.post.scripts.replace(/\n/g, " ").split(" ");
        scripts = scripts.map(function(script) {
            return script.trim();
        });
        var css = scripts.filter(function(script) {
            return script.endsWith('.css');
        });
        var javaScripts = scripts.filter(function(script) {
            return !script.endsWith('.css');
        });

        // Load the css directly.
        css.forEach(function(script) {
            angularLoad.loadCSS(script).catch(function(err) {
                console.error(err);
            })
        });

        // Load the JavaScripts asynchronously but ordered, when the page is
        // loaded.
        function loadScript(index) {
            if (index >= javaScripts.length) return;
            angularLoad.loadScript(javaScripts[index]).then(function() {
                // Script loaded succesfully load the next one.
                loadScript(index + 1);
            }).catch(function(err) {
                // There was some error loading the script
                console.error(err);
            });
        }
        angular.element(document).ready(function() {
            loadScript(0);
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
