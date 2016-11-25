/**
 * Defines general controllers, which are used in index.ejs.
 */

// Controller for the whole app
angular.module('mlstuff.controllers').controller('MainCtrl', [
    '$scope',
    '$sce',
    'angularLoad',
    'authFactory',
    'postsFactory',
    function($scope, $sce, angularLoad, authFactory, postsFactory) {
        // Provide a function to output html code without escaping
        $scope.toTrusted = function(htmlCode) {
            return $sce.trustAsHtml(htmlCode);
        };

        // Expose the isLoggedIn method to the scope.
        $scope.isLoggedIn = authFactory.isLoggedIn;

        // Reset the posts for the scope, if they get updated
        $scope.posts = [];
        let onPostsUpdated = function () {
            $scope.posts = postsFactory.getSortedPosts();
        };

        // Fetch the posts for the first time
        onPostsUpdated();

        // Listen to changes to the posts
        $scope.$on('posts:updated', onPostsUpdated);
    }
]);

// Controller for navigation
angular.module('mlstuff.controllers').controller('NavCtrl', [
    '$scope',
    '$state',
    'authFactory',
    function($scope, $state, authFactory) {
        // TODO: Potentially remove the logout function and currentUser from the scope
        $scope.isLoggedIn = authFactory.isLoggedIn;
        $scope.currentUser = authFactory.currentUser;
        $scope.logout = authFactory.logout;

        // Returns the active CSS class for a nav item, if necessary
        $scope.getClass = function (activeNavItem) {
            // Check, if the given nav item is the current state's nav item.
            return ($state.current.navItem === activeNavItem) ? 'active' : '';
        }
    }
]);
