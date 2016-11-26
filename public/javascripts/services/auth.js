/**
 * This service is the interface to the backend for authentication and authorization. See
 * https://thinkster.io/mean-stack-tutorial for details.
 */

class AuthService extends InjectionReceiver{

    // Tell angular our injections
    static get $inject() {
        return ['$http', '$window'];
    }

    constructor(...injections) {
        super(...injections);
    }

    get token() {
        return this.$window.localStorage['auth-token'];
    }

    set token(token) {
        this.$window.localStorage['auth-token'] = token;
    }

    isLoggedIn() {
        // A user is logged in, if there is an auth-token that is not expired
        if (!this.token) return false;

        // Get the payload and check that it is not expired
        // The payload will be base64'd after the first . in the token
        const payload = JSON.parse(this.$window.atob(this.token.split('.')[1]));
        return payload.exp > Date.now() / 1000;
    }

    register(user) {
        // Call the API endpoint and update the token on success
        return this.$http.post('/api/register', user).then(response => {
            this.token = response.data.token;
        });
    }

    login(user) {
        // Call the API endpoint and update the token on success
        return this.$http.post('/api/login', user).then(response => {
            this.token = response.data.token;
            // Update the page to show unpublished posts as well.
            this.$window.location.href = '/';
        });
    }

    logout() {
        delete this.$window.localStorage['auth-token'];
        // Update the page to hide unpublished posts.
        this.$window.location.reload();
    }
}

angular.module('mlstuff.services').service('AuthService', AuthService);
