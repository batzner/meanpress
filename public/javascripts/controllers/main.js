/**
 * Defines general controllers, which are used in index.ejs.
 */

// Controller for the whole app
class MainCtrl extends InjectionReceiver {

    static get $inject() {
        // Inject the services so that posts and categories are loaded in all states
        // (asynchronous anyways).
        return ['$rootScope', '$sce', '$document', '$window', '$stateParams', '$state', '$timeout',
            'angularLoad',
            'AuthService', 'PostService', 'CategoryService'];
    }

    constructor(...injections) {
        super(...injections); // Set the injections on this.

        this.$rootScope.log = console.log;

        // Highlight the content
        Util.processPageContinuously(this.$rootScope, this.angularLoad);

        // $viewContentLoaded will be broadcastet twice. Once for the root view and once for
        // the ui-view. We only want to fetch the posts once.
        let fetchingPosts = false;
        this.$rootScope.$on('$viewContentLoaded', () => {
            // Scroll to the top on new pages
            this.$window.scrollTo(0, 0);

            // Set a timeout, so that this gets called in the next cycle, when the ui-view's
            // controller is loaded as well. Thus, the child controller can issue prioritized
            // requests. http://stackoverflow.com/a/27197922/2628369
            if (!fetchingPosts) {
                this.$timeout(() => this.PostService.fetchPosts(), 0);
                fetchingPosts = true;
            }
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
