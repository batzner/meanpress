angular.module('mlstuff.controllers').controller('MainCtrl', [
    '$scope',
    '$sce',
    'postsFactory',
    function($scope, $sce, postsFactory) {
        $scope.toTrusted = function(htmlCode) {
            return $sce.trustAsHtml(htmlCode);
        }
        $scope.posts = postsFactory.posts;
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
    'authFactory',
    function($scope, authFactory) {
        $scope.isLoggedIn = authFactory.isLoggedIn;
        $scope.currentUser = authFactory.currentUser;
        $scope.logout = authFactory.logout;
    }
]);
