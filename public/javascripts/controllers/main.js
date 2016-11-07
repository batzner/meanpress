angular.module('mlstuff.controllers').controller('MainCtrl', [
    '$scope',
    '$sce',
    'angularLoad',
    'postsFactory',
    function($scope, $sce, angularLoad, postsFactory) {
        $scope.toTrusted = function(htmlCode) {
            return $sce.trustAsHtml(htmlCode);
        }
        $scope.posts = postsFactory.posts;
        // Load the css of all posts
        $scope.posts.forEach(function (post) {
            post.loadCSS(angularLoad);
        })
    }
]);

angular.module('mlstuff.controllers').controller('AuthCtrl', [
    '$scope',
    '$state',
    'authFactory',
    function($scope, $state, authFactory) {
        $scope.user = {};

        var onError = function(response) {
            if (response.data && response.data.message) {
                $scope.error = response.data.message;
            } else {
                response.statusText;
            }
        }

        $scope.register = function() {
            authFactory.register($scope.user).then(function(response) {
                $state.go('home');
            }, onError);
        };

        $scope.login = function() {
            authFactory.login($scope.user).then(function(response) {
                $state.go('home');
            }, onError);
        };
    }
]);

app.controller('NavCtrl', [
    '$scope',
    '$state',
    'authFactory',
    function($scope, $state, authFactory) {
        $scope.isLoggedIn = authFactory.isLoggedIn;
        $scope.currentUser = authFactory.currentUser;
        $scope.logout = authFactory.logout;
        $scope.getClass = function (activeNavItem) {
            // Check, if the given nav item is the current state's nav item.
            return ($state.current.navItem === activeNavItem) ? 'active' : '';
        }
    }
]);
