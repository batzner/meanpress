angular.module('mlstuff.services').factory('postsFactory', ['$http', 'authFactory', function($http, authFactory) {
    var o = {
        posts: []
    };

    o.getAll = function() {
        var url = 'api/posts';
        var headers = {};
        if (authFactory.isLoggedIn()) {
            url = 'api/posts/all';
            headers.Authorization = 'Bearer ' + authFactory.getToken();
        }

        return $http.get(url, {
            headers: headers
        }).then(function(response) {
            angular.copy(response.data, o.posts);
            o.posts = o.posts.map(function (postData) {
                return $.extend(new Post(), postData);
            });
        }, function(response) {
            console.log(response.data);
        });
    }

    o.create = function(postData) {
        return $http.post('/api/posts', postData, {
            headers: {
                Authorization: 'Bearer ' + authFactory.getToken()
            }
        }).then(function(response) {
            var post = $.extend(new Post(), response.data);
            o.posts.push(post);
        }, function(response) {
            console.log(response.data);
        });
    };

    o.update = function(id, post) {
        return $http.post('/api/posts/' + id, post, {
            headers: {
                Authorization: 'Bearer ' + authFactory.getToken()
            }
        }).then(function(response) {
            var post = $.extend(new Post(), response.data);
            o.posts[id] = post;
        }, function(response) {
            console.log(response.data);
        });
    }

    o.delete = function(id) {
        return $http.delete('/api/posts/' + id, {
            headers: {
                Authorization: 'Bearer ' + authFactory.getToken()
            }
        }).then(function(response) {
            for (var i = 0; i < o.posts.length; i++) {
                if (o.posts[i]._id == id) o.posts.splice(i, 1);
                return;
            }
        }, function(response) {
            console.log(response.data);
        });
    }

    o.findPostBySlug = function(slug) {
        for (var i = 0; i < o.posts.length; i++) {
            if (o.posts[i].slug == slug) return o.posts[i];
        }
        console.log('Could not find post by slug.');
        return null;
    }

    o.loadScripts = function(post) {

    }

    // Make sure that all posts are present. This could also be ensured with a
    // promise in the states using this factory.
    o.getAll();
    return o;
}]);
