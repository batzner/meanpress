var app = angular.module('mlstuff', ['ui.router', 'angularLoad', 'angularCSS', 'mlstuff.controllers', 'mlstuff.services']);

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
                controller: 'MainCtrl',
                navItem: 'blog'
            })
            .state('post', {
                url: '/post/{slug}/',
                templateUrl: '/templates/post.html',
                controller: 'PostCtrl',
                navItem: 'blog'
            })
            .state('edit', {
                url: '/post/{slug}/edit',
                templateUrl: '/templates/edit.html',
                controller: 'EditPostCtrl',
                navItem: 'blog'
            })
            .state('add', {
                url: '/add',
                templateUrl: '/templates/add.html',
                controller: 'EditPostCtrl',
                navItem: 'add'
            })
            .state('about', {
                url: '/about',
                templateUrl: '/templates/about.html',
                controller: 'AboutCtrl',
                navItem: 'about',
                css: 'stylesheets/about.css'
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