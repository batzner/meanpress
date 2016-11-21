angular.module('mlstuff.services').factory('postsFactory', ['$http', '$rootScope', 'authFactory',
    function ($http, $rootScope, authFactory) {

        // Create an object which represents the factory
        var o = {
            posts: {} // Dictionary mapping uuid (string) to post object
        };

        // HELPER METHODS

        o.findPostBySlug = function (slug) {
            var result = null;
            Object.values(o.posts).some(function (post) {
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

        o.getSortedPosts = function () {
            // Return all posts in descending order (by creation date)
            return Object.values(o.posts).sort(function (first, second) {
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
            }).catch(function (error) {
                console.log(error.data);
            });
        };

        o.create = function (postVersion) {
            return $http.post('/api/posts', postVersion, {
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
            }).catch(function (error) {
                throw new Error('Creating the post failed.' + error.data);
            });
        };

        o.addVersion = function (post, version) {
            return $http.post('/api/posts/' + post._id + '/version', version, {
                headers: {
                    Authorization: 'Bearer ' + authFactory.getToken()
                }
            }).then(function (response) {
                console.log(response);
                // Update the post
                post = new Post(response.data);
                o.posts[post._id] = post;
                // Broadcast the update
                $rootScope.$broadcast('posts:updated', o.posts);

                // Return the updated post to be usable in promises
                return post;
            }).catch(function (error) {
                throw new Error('Adding a version failed.' + error.data);
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
                post = new Post(response.data);
                o.posts[post._id] = post;
                // Broadcast the update
                $rootScope.$broadcast('posts:updated', o.posts);

                // Return the updated post to be usable in promises
                return post;
            }).catch(function (error) {
                throw new Error('Updating the post failed.' + error.data);
            });
        };

        o.delete = function (post) {
            return $http.delete('/api/posts/' + post._id, {
                headers: {
                    Authorization: 'Bearer ' + authFactory.getToken()
                }
            }).then(function (response) {
                // TODO: Check the response
                delete o.posts[post._id];

                // Broadcast the update
                $rootScope.$broadcast('posts:updated', o.posts);
            }).catch(function (error) {
                console.log(error.data);
            });
        };

        // Make sure that all posts are present. This could also be ensured with a
        // promise in the states using this factory.
        o.fetchAll();
        return o;
    }]);
