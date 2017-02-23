const app = angular.module('mlstuff', ['ui.router', 'angularLoad', 'angularCSS', 'angularSpinner',
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
                navItem: 'blog',
                params: {
                    showSpinner: true
                }
            })
            .state('post', {
                url: '/post/{slug}/',
                templateUrl: '/templates/post.html',
                controller: 'PostCtrl as controller',
                navItem: 'blog',
                params: {
                    showSpinner: true
                }
            })
            .state('lab', {
                url: '/lab/',
                templateUrl: '/templates/lab.html',
                controller: 'LabCtrl as controller',
                navItem: 'lab',
                params: {
                    showSpinner: true
                }
            })
            .state('preview', {
                url: '/post/{slug}/preview/',
                templateUrl: '/templates/post.html',
                controller: 'PostCtrl as controller',
                navItem: 'blog',
                params: {
                    preview: true
                }
            })
            .state('edit', {
                url: '/post/{slug}/edit/',
                templateUrl: '/templates/edit.html',
                controller: 'EditPostCtrl as controller',
                navItem: 'blog'
            })
            .state('add', {
                url: '/add/',
                templateUrl: '/templates/add.html',
                controller: 'EditPostCtrl as controller',
                navItem: 'add'
            })
            .state('category', {
                url: '/category/{name}/',
                templateUrl: '/templates/category.html',
                controller: 'CategoryCtrl as controller',
                navItem: 'overwritten-in-controller',
                params: {
                    showSpinner: true
                }
            })
            .state('addCategory', {
                url: '/add-category/',
                templateUrl: '/templates/add-category.html',
                controller: 'AddCategoryCtrl as controller',
                navItem: 'add'
            })
            .state('about', {
                url: '/about/',
                templateUrl: '/templates/about.html',
                controller: 'AboutCtrl as controller',
                navItem: 'about',
                css: 'stylesheets/about.css'
            })
            .state('login', {
                url: '/login/',
                templateUrl: '/templates/login.html',
                controller: 'AuthCtrl as controller',
                onEnter: onEnterRestricted
            })
            .state('register', {
                url: '/register/',
                templateUrl: '/templates/register.html',
                controller: 'AuthCtrl as controller',
                onEnter: onEnterRestricted
            });

        $urlRouterProvider.otherwise('/');
        $locationProvider.html5Mode(true);
    }
]);

// SEO and Google Analytics initializations
app.run(['$rootScope', '$window', '$location', 'AuthService',
    function ($rootScope, $window, $location, AuthService) {
    // Initialise GAnalytics
    if (typeof $window.ga === 'function' && !AuthService.isLoggedIn()) {
        $window.ga('set', 'anonymizeIp', true);
        $window.ga('create', 'UA-70748485-2', 'auto');
    }

    $rootScope.$on('$stateChangeSuccess', function () {
        // Set the default page title and SEO info
        $rootScope.htmlTitle = 'MLOwl - Machine Learning et al.';
        $rootScope.metaDescription = 'Blog about TensorFlow, LSTMs, Neural Networks and Machine Learning in general';

        // Send the page view to Google Analytics
        if (typeof $window.ga === 'function' && !AuthService.isLoggedIn()) {
            $window.ga('send', 'pageview', $location.path());
        }
    });
}]);

app.config(['usSpinnerConfigProvider', function (usSpinnerConfigProvider) {
    usSpinnerConfigProvider.setDefaults({
        lines: 14 // The number of lines to draw
        , length: 15 // The length of each line
        , width: 5 // The line thickness
        , radius: 30 // The radius of the inner circle
        , scale: 1 // Scales overall size of the spinner
        , corners: 0 // Corner roundness (0..1)
        , color: '#c8cbd7' // #rgb or #rrggbb or array of colors
        , opacity: 0.25 // Opacity of the lines
        , rotate: 0 // The rotation offset
        , direction: 1 // 1: clockwise, -1: counterclockwise
        , speed: 1 // Rounds per second
        , trail: 60 // Afterglow percentage
        , fps: 20 // Frames per second when using setTimeout() as a fallback for CSS
        , zIndex: 2e9 // The z-index (defaults to 2000000000)
        , className: 'spinner' // The CSS class to assign to the spinner
        , top: '50%' // Top position relative to parent
        , left: '50%' // Left position relative to parent
        , shadow: false // Whether to render a shadow
        , hwaccel: false // Whether to use hardware acceleration
        , position: 'absolute' // Element positioning
    });
}]);