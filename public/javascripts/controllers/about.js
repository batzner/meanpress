angular.module('mlstuff.controllers').controller('AboutCtrl', [
    '$scope',
    function($scope) {
        $scope.toggleDetail = function($event) {
            var button = $($event.target);
            button.html(button.html() == 'Show less' ? 'Show more' :
                'Show less');
            button.closest('.cv-item').children('.detail').toggle();
        }
    }
]);
