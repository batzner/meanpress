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
        this.posts = new BindableMap(); // Dictionary mapping uuid (string) to post object

        this.fetchAll();
    }

    // HELPER METHODS

    findPostBySlug(slug) {
        const result = this.posts.bindableValues.find(post => post.matchesSlug(slug));
        if (!result) console.log('Could not find post by slug.');
        return result;
    }

    updatePostMap(postData) {
        // If the post already exists, we update it instead of setting a new reference. Thus,
        // bindings remain existent.
        let post = null;
        if (this.posts.has(postData._id)) {
            post = this.posts.get(postData._id);
            post.updateProperties(postData);
        } else {
            post = new Post(postData);
            this.posts.set(post._id, post);
        }
        return post;
    }

    hasPosts() {
        return !!this.posts.size;
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
        // Prepare the data for serializing
        data = this.prepareSerialise(data);

        return method(url, data, {
            headers: {
                Authorization: 'Bearer ' + this.AuthService.token
            }
        }).then(response => {
            // Return the created post to be usable in promises
            return this.updatePostMap(response.data);
        }).catch(this.$log.error);
    }

    prepareSerialise(data) {
        // Prepare all BaseEntity instances (to remove circular references)
        if (data instanceof BaseEntity) {
            // Prepare BaseEntities
            return data.copyForJson();
        }
        else if (variable.constructor === Array){
            // Run recursive for arrays
            data = data.map(this.prepareSerialise);
        } else {
            // Run recursive for objects
            for (let key in data) {
                if (!data.hasOwnProperty(key)) continue;
                data[key] = this.prepareSerialise(data[key]);
            }
        }
        return data;
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
            this.posts.clear();
            response.data.forEach(postData => this.updatePostMap(postData));

            // Broadcast the fetch
            this.$rootScope.$broadcast('posts:fetched', this.posts);
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
        return this.$http.delete('/api/posts/' + post._id, {
            headers: {
                Authorization: 'Bearer ' + this.AuthService.token
            }
        }).then(response => {
            // TODO: Check the response
            this.posts.delete(post._id);

            // Broadcast the update
            this.$rootScope.$broadcast('posts:updated', this.posts);
        }).catch(this.$log.error);
    }
}

angular.module('mlstuff.services').service('PostService', PostService);