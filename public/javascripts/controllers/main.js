/**
 * Defines general controllers, which are used in index.ejs.
 */

// Controller for the whole app
class MainCtrl extends InjectionReceiver {

    static get $inject() {
        return ['$sce', 'AuthService'];
    }

    constructor(...injections) {
        super(...injections); // Set the injections on this.
    }

    isLoggedIn() {
        return this.AuthService.isLoggedIn();
    }

    toTrusted(element) {
        return this.$sce.trustAsHtml(element);
    }
}

angular.module('mlstuff.controllers').controller('MainCtrl', MainCtrl);

// Controller for navigation
class NavCtrl extends InjectionReceiver {

    static get $inject() {
        return ['$scope', '$state', 'AuthService'];
    }

    constructor(...injections) {
        super(...injections); // Set the injections on this.
    }

    getClass(navItem) {
        // Return the active CSS class for a nav item, if it is active
        return (this.$state.current.navItem === navItem) ? 'active' : '';
    }
    
    logout() {
        this.AuthService.logout();
    }
}

angular.module('mlstuff.controllers').controller('NavCtrl', NavCtrl);