/**
 * Defines a controller for the login and register page.
 */

class AuthCtrl extends InjectionReceiver {

    static get $inject() {
        return ['$scope', '$state', 'AuthService'];
    }

    constructor(...injections) {
        super(...injections); // Set the injections on this.
    }

    onError(response) {
        // Display the error in the template's error box
        if (response.data && response.data.message) {
            this.$scope.error = response.data.message;
        }
    }

    register() {
        // Call the backend to register. Go home if succeeded.
        this.AuthService.register(this.$scope.user)
            .then(() => this.$state.go('home'), response => this.onError(response));
    }

    login() {
        // Call the backend to login. Go home if succeeded.
        this.AuthService.login(this.$scope.user)
            .then(() => this.$state.go('home'), response => this.onError(response));
    }
}

angular.module('mlstuff.controllers').controller('AuthCtrl', AuthCtrl);