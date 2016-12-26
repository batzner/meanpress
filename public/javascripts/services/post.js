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
    }

    // HELPER METHODS

    findPostBySlug(slug) {
        return this.posts.bindableValues.find(post => post.matchesSlug(slug));
    }

    hasPosts() {
        return !!this.posts.size;
    }

    // PRIVATE METHODS

    _updatePostMap(postData, overwrite=true) {
        if (!overwrite && postData.versions) postData.versions[0]._id = 'yo';

        // If the post already exists, we update it instead of setting a new reference. Thus,
        // bindings remain existent.
        let post = null;
        if (this.posts.has(postData._id)) {
            if (overwrite) {
                post = this.posts.get(postData._id);
                post.updateProperties(postData);
            }
        } else {
            post = new Post(postData);
            this.posts.set(post._id, post);
        }
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
    _callPostModification(method, url, data) {
        // Clone to prevent modifying the given data
        data = angular.copy(data);

        // Prepare the data for serializing
        this._prepareSerialise(data);

        return method(url, data, {
            headers: {
                Authorization: 'Bearer ' + this.AuthService.token
            }
        }).then(response => {
            // Return the created post to be usable in promises
            return this._updatePostMap(response.data);
        }).catch(this.$log.error);
    }

    _prepareSerialise(data) {
        // TODO: Maybe put this into a EntityService super class
        if (!data) return;

        // Run recursive for arrays
        if (data.constructor === Array){
            data.forEach(v => this._prepareSerialise(v));
        }

        // Prepare all BaseEntity instances (to remove circular references)
        if (data instanceof BaseEntity) {
            // Prepare BaseEntities
            data.prepareForJson();
        }

        // Iterate over the keys for objects
        if (data === Object(data)) {
            for (let key in data) {
                if (!data.hasOwnProperty(key)) continue;
                this._prepareSerialise(data[key]);
            }
        }
    }

    // PUBLIC API CALLING METHODS

    fetchPosts(filterQuery={}, withBody=true) {
        // Construct the request
        let url = 'api/posts';
        let headers = {};
        if (this.AuthService.isLoggedIn()) {
            url = 'api/posts/authorized';
            headers.Authorization = 'Bearer ' + this.AuthService.token;
        }

        let config = {
            headers: headers,
            params: {
                withBody: withBody
            }
        };

        $.extend(config.params, filterQuery);

        return this.$http.get(url, config).then(response => {
            this.$log.debug('Fetched posts. Count: ' + response.data.length);

            // Update the posts. If we didn't fetch the bodies, don't overwrite existing posts
            response.data.forEach(postData => this._updatePostMap(postData, withBody));

            // Broadcast the fetch
            this.$rootScope.$broadcast('posts:fetched');

            // Let Prerender create the snapshot
            window.prerenderReady = true;
        }).catch(this.$log.error);
    }

    createPost(postVersion) {
        const url = '/api/posts';
        return this._callPostModification(this.$http.post, url, postVersion);
    }

    createPostVersion(post, version) {
        const url = '/api/posts/' + post._id + '/version';
        return this._callPostModification(this.$http.post, url, version);
    }

    updatePost(post) {
        const url = '/api/posts/' + post._id;
        
        // We are not allowed to modify the versions, so delete them from the data
        const data = angular.copy(post);
        delete data.versions;
        return this._callPostModification(this.$http.put, url, data);
    }

    deletePost(post) {
        return this.$http.delete('/api/posts/' + post._id, {
            headers: {
                Authorization: 'Bearer ' + this.AuthService.token
            }
        }).then(response => {
            // We don't need to check the response, because all other status codes than 200 will
            // cause an error and this block won't be called.
            this.posts.delete(post._id);
        }).catch(this.$log.error);
    }
}

angular.module('mlstuff.services').service('PostService', PostService);