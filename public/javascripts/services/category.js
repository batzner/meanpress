/**
 * This service is the interface to the API endpoints for getting and setting posts.
 */

class CategoryService extends InjectionReceiver {

    // Tell angular our injections
    static get $inject() {
        return ['$http', '$rootScope', '$log', 'AuthService'];
    }

    constructor(...injections) {
        super(...injections);
        this.categories = new BindableMap(); // Dictionary mapping uuid (string) to category object

        this.fetchAll();
    }

    // HELPER METHODS

    findCategoryByName(name) {
        return this.categories.bindableValues.find(category => category.name == name);
    }

    hasCategories() {
        return !!this.categories.size;
    }

    // PRIVATE METHODS

    _updateMap(categoryData) {
        // If the category already exists, we update it instead of setting a new reference. Thus,
        // bindings remain existent.
        let category = null;
        if (this.categories.has(categoryData._id)) {
            category = this.posts.get(categoryData._id);
            category.updateProperties(categoryData);
        } else {
            category = new Category(categoryData);
            this.categories.set(category._id, category);
        }
        return category;
    }

    /**
     * Call the API to modify an entity. The called endpoint needs to return an entity as data
     * in the response. This function also updates the entity map with the updated entity. It
     * returns a promise.
     * @param {function} method Needs to be $http.post or $http.put
     * @param {string} url URL to call
     * @param {Object} data Object to pass in the request as data
     * @returns {Promise.<BaseEntity>}
     */
    _callEntityModification(method, url, data) {
        // TODO: Generalize these functions to a EntityService superclass
        // Clone to prevent modifying the given data
        data = angular.copy(data);

        return method(url, data, {
            headers: {
                Authorization: 'Bearer ' + this.AuthService.token
            }
        }).then(response => {
            // Return the created entity to be usable in promises
            return this._updateMap(response.data);
        }).catch(this.$log.error);
    }

    // PUBLIC API CALLING METHODS

    fetchAll() {
        return this.$http.get('api/categories').then(response => {
            this.$log.debug('Fetched all categories. Count: ' + response.data.length);

            // Update the entities
            this.categories.clear();
            response.data.forEach(categoryData => this._updateMap(categoryData));

            // Broadcast the fetch
            this.$rootScope.$broadcast('categories:fetched');
        }).catch(this.$log.error);
    }

    createCategory(category) {
        return this._callEntityModification(this.$http.post, '/api/categories', category);
    }
}

angular.module('mlstuff.services').service('CategoryService', CategoryService);