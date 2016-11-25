/**
 * Defines the controller for the blog's about page. The controller provides small UI functions.
 */

angular.module('mlstuff.controllers').controller('AboutCtrl', [
    '$scope',
    function($scope) {
        // Add a function to expand / hide additional information in the CV.
        $scope.toggleDetail = function($event) {
            const button = $($event.target);
            button.html(button.html() == 'Show less' ? 'Show more' : 'Show less');
            button.closest('.cv-item').children('.detail').toggle();
        }
    }
]);
