const app = angular.module('mlstuff', ['ui.router', 'angularLoad', 'angularCSS',
    'mlstuff.controllers', 'mlstuff.services']);

// Create modules for controller definitions in controllers/ and service definitions in services/.
angular.module('mlstuff.controllers', []);
angular.module('mlstuff.services', []);

// Function for restricted states.
const onEnterRestricted = ['$state', 'AuthService', ($state, authService) => {
    // Detect if the user is already logged in before entering the state
    if (authService.isLoggedIn()) {
        $state.go('home');
    }
}];

app.config([
    '$stateProvider',
    '$urlRouterProvider',
    '$locationProvider',
    function ($stateProvider, $urlRouterProvider, $locationProvider) {

        $stateProvider
            .state('home', {
                url: '/',
                templateUrl: '/templates/home.html',
                controller: 'HomeCtrl as controller',
                navItem: 'blog'
            })
            .state('post', {
                url: '/post/{slug}/',
                templateUrl: '/templates/post.html',
                controller: 'PostCtrl as controller',
                navItem: 'blog'
            })
            .state('preview', {
                url: '/post/{slug}/preview',
                templateUrl: '/templates/post.html',
                controller: 'PostCtrl as controller',
                navItem: 'blog',
                params: {
                    preview: true
                }
            })
            .state('edit', {
                url: '/post/{slug}/edit',
                templateUrl: '/templates/edit.html',
                controller: 'EditPostCtrl as controller',
                navItem: 'blog'
            })
            .state('add', {
                url: '/add',
                templateUrl: '/templates/add.html',
                controller: 'EditPostCtrl as controller',
                navItem: 'add'
            })
            .state('category', {
                url: '/category/{name}',
                templateUrl: '/templates/category.html',
                controller: 'CategoryCtrl as controller',
                navItem: 'overwritten-in-controller'
            })
            .state('addCategory', {
                url: '/add-category',
                templateUrl: '/templates/add-category.html',
                controller: 'AddCategoryCtrl as controller',
                navItem: 'add'
            })
            .state('about', {
                url: '/about',
                templateUrl: '/templates/about.html',
                controller: 'AboutCtrl as controller',
                navItem: 'about',
                css: 'stylesheets/about.css'
            })
            .state('login', {
                url: '/login',
                templateUrl: '/templates/login.html',
                controller: 'AuthCtrl as controller',
                onEnter: onEnterRestricted
            })
            .state('register', {
                url: '/register',
                templateUrl: '/templates/register.html',
                controller: 'AuthCtrl as controller',
                onEnter: onEnterRestricted
            });

        $urlRouterProvider.otherwise('/');
        $locationProvider.html5Mode(true);
    }
]);