var app = angular.module('blog', ['ui.router', 'ngSanitize']);

app.config([
    '$stateProvider',
    '$urlRouterProvider',
    '$locationProvider',
    function($stateProvider, $urlRouterProvider, $locationProvider) {

        $stateProvider
            .state('home', {
                url: '/',
                templateUrl: '/templates/home.html',
                controller: 'MainCtrl',
                resolve: {
                    postsPromise: ['postsFactory', function(postsFactory) {
                        return postsFactory.getAll();
                    }]
                }
            })
            .state('post', {
                url: '/post/{id}',
                templateUrl: '/templates/post.html',
                controller: 'PostCtrl'
            })
            .state('add', {
                url: '/add',
                templateUrl: '/templates/add.html',
                controller: 'AddPostCtrl'
            })
            .state('login', {
                url: '/login',
                templateUrl: '/templates/login.html',
                controller: 'AuthCtrl',
                onEnter: ['$state', 'authFactory', function($state, authFactory) {
                    // Detect if the user is already logged in before entering the state
                    if (authFactory.isLoggedIn()) {
                        $state.go('home');
                    }
                }]
            })
            .state('register', {
                url: '/register',
                templateUrl: '/templates/register.html',
                controller: 'AuthCtrl',
                onEnter: ['$state', 'authFactory', function($state, authFactory) {
                    // Detect if the user is already logged in before entering the state
                    if (authFactory.isLoggedIn()) {
                        $state.go('home');
                    }
                }]
            });

        $urlRouterProvider.otherwise('home');
        $locationProvider.html5Mode(true);
    }
]);

app.factory('postsFactory', ['$http', 'authFactory', function($http, authFactory) {
    var o = {
        posts: []
    };

    o.getAll = function() {
        return $http.get('/api/posts').then(function(response) {
            angular.copy(response.data, o.posts);
        }, function(response) {
            console.log(response.data);
        });
    }

    o.create = function(post) {
        return $http.post('/api/posts', post, {
            headers: {
                Authorization: 'Bearer ' + authFactory.getToken()
            }
        }).then(function(response) {
            o.posts.push(response.data);
        }, function(response) {
            console.log(response.data);
        });
    };
    return o;
}]);

app.factory('authFactory', ['$http', '$window', function($http, $window) {
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
        });
    };
    auth.logout = function() {
        $window.localStorage.removeItem('auth-token');
    };
    return auth;
}]);

app.controller('MainCtrl', [
    '$scope',
    'postsFactory',
    function($scope, postsFactory) {
        $scope.posts = postsFactory.posts;
    }
]);

app.controller('PostCtrl', [
    '$scope',
    '$stateParams',
    'postsFactory',
    function($scope, $stateParams, postsFactory) {
        $scope.post = postsFactory.posts[$stateParams.id];
    }
]);

app.controller('AddPostCtrl', [
    '$scope',
    '$stateParams',
    'postsFactory',
    function($scope, $stateParams, postsFactory) {
        $scope.addPost = function() {
            postsFactory.create({
                title: $scope.title,
                body: '<div>' + $scope.body + '</div>',
            });
            $scope.title = '';
            $scope.body = '';
        };
    }
]);

app.controller('AuthCtrl', [
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
