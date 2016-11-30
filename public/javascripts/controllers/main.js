/**
 * Defines general controllers, which are used in index.ejs.
 */

// Controller for the whole app
class MainCtrl extends InjectionReceiver {

    static get $inject() {
        return ['$rootScope', '$sce', '$document', 'AuthService'];
    }

    constructor(...injections) {
        super(...injections); // Set the injections on this.

        this.$rootScope.log = console.log;

        // Wrap tables to make them responsive.
        // TODO: This needs to be called *after* the posts are loaded / displayed
        this.$document.ready(() => {
            $('table').wrap("<div class='table-container'></div>");
        });
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
