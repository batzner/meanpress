angular.module('mlstuff.services').factory('postsFactory', ['$http', '$rootScope', 'authFactory',
    function ($http, $rootScope, authFactory) {

        // Create an object which represents the factory
        var o = {
            posts: {} // Dictionary mapping uuid (string) to post object
        };

        // HELPER METHODS

        o.findPostBySlug = function (slug) {
            var result = null;
            Object.values(o.posts).some(function(post) {
                // Check, if any of the versions contained the slug
                var containsSlug = function (version) {
                    return version.slug == slug;
                };
                if (post.versions.some(containsSlug)) {
                    // Overwrite the result and exit
                    result = post;
                    return true;
                }
                return false;
            });
            if (!result) console.log('Could not find post by slug.');
            return result;
        };

        o.getPublishedPosts = function () {
            // Return all publishd posts in descending order (by creation date)
            return Object.values(o.posts).filter(function (post) {
                // Make sure, the published version is set.
                return post.publishedVersion;
            }).sort(function (first, second) {
                // Sort the posts by creation date (descending). For this, negate the natural ordering.
                return -(first.createdAt - second.createdAt);
            });
        };

        // API CALLING METHODS

        o.fetchAll = function () {
            var url = 'api/posts';
            var headers = {};
            if (authFactory.isLoggedIn()) {
                url = 'api/posts/all';
                headers.Authorization = 'Bearer ' + authFactory.getToken();
            }

            return $http.get(url, {
                headers: headers
            }).then(function (response) {
                // Update the posts
                o.posts = {};
                response.data.forEach(function (post) {
                    // Create a new post and set it in the dict
                    o.posts[post._id] = new Post(post);
                });
                // Broadcast the update
                $rootScope.$broadcast('posts:updated', o.posts);
            }, function (response) {
                console.log(response.data);
            });
        };

        o.create = function (postData) {
            return $http.post('/api/posts', postData, {
                headers: {
                    Authorization: 'Bearer ' + authFactory.getToken()
                }
            }).then(function (response) {
                console.log(response);
                // Create a new post and set it in the dict
                var post = new Post(response.data);
                o.posts[post._id] = post;
                // Broadcast the update
                $rootScope.$broadcast('posts:updated', o.posts);

                // Return the created post to be usable in promises
                return post;
            }, function (response) {
                throw new Error('Creating the post failed.' + response.data);
            });
        };

        o.update = function (post) {
            return $http.put('/api/posts/' + post._id, post, {
                headers: {
                    Authorization: 'Bearer ' + authFactory.getToken()
                }
            }).then(function (response) {
                console.log(response);
                // Update the post
                o.posts[post._id] = new Post(response.data);
                // Broadcast the update
                $rootScope.$broadcast('posts:updated', o.posts);

                // Return the updated post to be usable in promises
                return post;
            }, function (response) {
                throw new Error('Updating the post failed.' + response.data);
            });
        };

        o.delete = function (post) {
            return $http.delete('/api/posts/' + post._id, {
                headers: {
                    Authorization: 'Bearer ' + authFactory.getToken()
                }
            }).then(function (response) {
                for (var i = 0; i < o.posts.length; i++) {
                    if (o.posts[i].id == id) o.posts.splice(i, 1);
                    return;
                }
            }, function (response) {
                console.log(response.data);
            });
        };

        // Make sure that all posts are present. This could also be ensured with a
        // promise in the states using this factory.
        o.fetchAll();
        return o;
    }]);
