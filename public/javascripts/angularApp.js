var app = angular.module('mlstuff', ['ui.router', 'angularLoad', 'mlstuff.controllers', 'mlstuff.services']);

// Create modules for controller definitions in controllers/ and factory
// definitions in factories/.
angular.module('mlstuff.controllers', []);
angular.module('mlstuff.services', []);

app.config([
    '$stateProvider',
    '$urlRouterProvider',
    '$locationProvider',
    function($stateProvider, $urlRouterProvider, $locationProvider) {

        $stateProvider
            .state('home', {
                url: '/',
                templateUrl: '/templates/home.html',
                controller: 'MainCtrl'
            })
            .state('post', {
                url: '/post/{slug}/',
                templateUrl: '/templates/post.html',
                controller: 'PostCtrl'
            })
            .state('edit', {
                url: '/post/{slug}/edit',
                templateUrl: '/templates/edit.html',
                controller: 'EditPostCtrl'
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

        $urlRouterProvider.otherwise('/');
        $locationProvider.html5Mode(true);
    }
]);
