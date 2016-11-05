angular.module('mlstuff.services').factory('authFactory', ['$http', '$window',
    function($http, $window) {
        var auth = {};
        auth.saveToken = function(token) {
            $window.localStorage['auth-token'] = token;
        };
        auth.getToken = function() {
            return $window.localStorage['auth-token'];
        };
        auth.isLoggedIn = function() {
            var token = auth.getToken();

            if (token) {
                // The payload will be base64'd after the first . in the token
                var payload = JSON.parse($window.atob(token.split('.')[1]));

                return payload.exp > Date.now() / 1000;
            } else {
                return false;
            }
        };

        // Call the API endpoints and update the token
        auth.register = function(user) {
            return $http.post('/api/register', user).then(function(response) {
                auth.saveToken(response.data.token);
            });
        };
        auth.login = function(user) {
            return $http.post('/api/login', user).then(function(response) {
                auth.saveToken(response.data.token);
                // Update the page to show unpublished posts as well.
                $window.location.href = '/';
            });
        };
        auth.logout = function() {
            $window.localStorage.removeItem('auth-token');
            // Update the page to hide unpublished posts.
            $window.location.reload();
        };
        return auth;
    }
]);
