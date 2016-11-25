/**
 * Defines a controller for the login and register page.
 */

angular.module('mlstuff.controllers').controller('AuthCtrl', [
    '$scope',
    '$state',
    'authFactory',
    function($scope, $state, authFactory) {
        $scope.user = {};

        // Function to display potential error messages. We don't log here, as this is an expected use case (for example
        // for wrong credentials). Logging other errors is done in the authFactory.
        let onError = function(response) {
            if (response.data && response.data.message) {
                $scope.error = response.data.message;
            }
        };

        $scope.register = function() {
            // Call the backend to register. Go home if succeeded.
            authFactory.register($scope.user).then(function(response) {
                $state.go('home');
            }, onError);
        };

        $scope.login = function() {
            // Call the backend to login. Go home on succeeded.
            authFactory.login($scope.user).then(function(response) {
                $state.go('home');
            }, onError);
        };
    }
]);