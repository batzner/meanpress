/**
 * This service is the interface to the API endpoints for getting and setting posts.
 */

class PostService extends InjectionReceiver {

    // Tell angular our injections
    static get $inject() {
        return ['$http', '$rootScope', '$log', 'AuthService'];
    }

    constructor(...injections) {
        super(...injections);
        this.posts = new Map(); // Dictionary mapping uuid (string) to post object

        this.fetchAll();
    }

    // HELPER METHODS

    getPosts() {
        return Array.from(this.posts.values());
    }

    findPostBySlug(slug) {
        const result = this.getPosts().find(post => post.matchesSlug(slug));
        if (!result) console.log('Could not find post by slug.');
        return result;
    }

    getSortedPosts() {
        // Return all posts in descending order (by creation date)
        return this.getPosts().sort((first, second) => -(first.createdAt - second.createdAt));
    }

    updatePostLocally(postData, broadcastUpdate = true) {
        const post = new Post(postData);
        this.posts.set(post._id, post);

        if (broadcastUpdate) this.$rootScope.$broadcast('posts:updated', this.posts);
        return post;
    }

    /**
     * Call the API to modify a post. The called endpoint needs to return a post as data in the
     * response. This function also updates the posts list with the updated post. It returns a
     * promise.
     * @param {function} method Needs to be $http.post or $http.put
     * @param {string} url URL to call
     * @param {Object} data Object to pass in the request as data
     * @returns {Promise.<Post>}
     */
    callPostModification(method, url, data) {
        return method(url, data, {
            headers: {
                Authorization: 'Bearer ' + this.AuthService.token
            }
        }).then(response => {
            // Return the created post to be usable in promises
            return this.updatePostLocally(response.data);
        }).catch(this.$log.error);
    }

    // API CALLING METHODS

    fetchAll() {
        // Construct the request
        let url = 'api/posts';
        let headers = {};
        if (this.AuthService.isLoggedIn()) {
            url = 'api/posts/all';
            headers.Authorization = 'Bearer ' + this.AuthService.token;
        }

        return this.$http.get(url, {
            headers: headers
        }).then(response => {
            this.$log.debug('Fetched all posts. Count: ' + response.data.length);

            // Update the posts
            this.posts = new Map();
            response.data.forEach(postData => this.updatePost(postData, false));

            // Broadcast the update
            this.$rootScope.$broadcast('posts:updated', this.posts);
        }).catch(this.$log.error);
    }

    createPost(postVersion) {
        const url = '/api/posts';
        return this.callPostModification(this.$http.post, url, postVersion);
    }

    createPostVersion(post, version) {
        const url = '/api/posts/' + post._id + '/version';
        return this.callPostModification(this.$http.post, url, version);
    }

    updatePost(post) {
        const url = '/api/posts/' + post._id;
        return this.callPostModification(this.$http.put, url, post);
    }

    deletePost(post) {
        return $http.delete('/api/posts/' + post._id, {
            headers: {
                Authorization: 'Bearer ' + this.AuthService.token
            }
        }).then(response => {
            // TODO: Check the response
            this.posts.delete(post._id);

            // Broadcast the update
            $rootScope.$broadcast('posts:updated', this.posts);
        }).catch(this.$log.error);
    }
}

angular.module('mlstuff.services').service('PostService', PostService);