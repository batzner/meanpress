angular.module('mlstuff.services').factory('PostService', ['$http', '$rootScope', '$log',
    'AuthService',
    function ($http, $rootScope, $log, AuthService) {

        // Create an object which represents the factory
        const o = {
            posts: new Map() // Dictionary mapping uuid (string) to post object
        };

        // HELPER METHODS

        o.getPosts = function () {
            return Array.from(this.posts.values());
        };

        o.findPostBySlug = function (slug) {
            const result = this.getPosts().find(post => post.matchesSlug(slug));
            if (!result) console.log('Could not find post by slug.');
            return result;
        };

        o.getSortedPosts = function () {
            // Return all posts in descending order (by creation date)
            return this.getPosts().sort((first, second) => -(first.createdAt - second.createdAt));
        };

        // API CALLING METHODS

        o.fetchAll = function () {
            let url = 'api/posts';
            let headers = {};
            if (AuthService.isLoggedIn()) {
                url = 'api/posts/all';
                headers.Authorization = 'Bearer ' + AuthService.token;
            }

            return $http.get(url, {
                headers: headers
            }).then(function (response) {
                $log.debug('Fetched all posts. Count: '+response.data.length);
                // Update the posts
                o.posts = new Map();
                response.data.forEach(function (postData) {
                    // Create a new post and set it in the dict
                    let post = new Post(postData);
                    o.posts.set(post._id, post);
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
                    Authorization: 'Bearer ' + AuthService.token
                }
            }).then(function (response) {
                console.log(response);
                // Create a new post and set it in the dict
                let post = new Post(response.data);
                o.posts.set(post._id, post);
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
                    Authorization: 'Bearer ' + AuthService.token
                }
            }).then(function (response) {
                console.log(response);
                // Update the post
                post = new Post(response.data);
                o.posts.set(post._id, post);
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
                    Authorization: 'Bearer ' + AuthService.token
                }
            }).then(function (response) {
                console.log(response);
                // Update the post
                post = new Post(response.data);
                o.posts.set(post._id, post);
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
                    Authorization: 'Bearer ' + AuthService.token
                }
            }).then(function (response) {
                // TODO: Check the response
                o.posts.delete(post._id);

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
