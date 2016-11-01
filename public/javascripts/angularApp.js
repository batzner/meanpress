var app = angular.module('blog', ['ui.router']);

app.config([
    '$stateProvider',
    '$urlRouterProvider',
    '$locationProvider',
    function($stateProvider, $urlRouterProvider, $locationProvider) {

        $stateProvider
            .state('/', {
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
            });

        $urlRouterProvider.otherwise('/');
        $locationProvider.html5Mode(true);
    }
]);

app.factory('postsFactory', ['$http', function($http) {
    var o = {
        posts: []
    };

    o.getAll = function() {
        return $http.get('/api/posts').then(
            function(response) {
                angular.copy(response.data, o.posts);
            },
            function(response) {
                console.log(response);
            }
        );
    }

    o.create = function(post) {
        return $http.post('/api/posts', post).success(function(data) {
            o.posts.push(data);
        });
    };
    return o;
}])

app.controller('MainCtrl', [
    '$scope',
    'postsFactory',
    function($scope, postsFactory) {
        $scope.posts = postsFactory.posts;
        $scope.render = function(e) {
            return $(e).html();
        }

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
                body: $scope.body,
            });
            $scope.title = '';
            $scope.body = '';
        };
    }
]);
