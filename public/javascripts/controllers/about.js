/**
 * Defines the controller for the blog's about page. The controller provides small UI functions.
 */

class AboutCtrl extends InjectionReceiver {

    static get $inject() {
        return ['$scope'];
    }

    constructor(...injections) {
        super(...injections); // Set the injections on this.

        // Activate the show more toggles
        $('.show-more').click($event => {
            // Expand / hide additional information
            const button = $($event.target);
            const target = $('#' + button.data('target-id'));
            const showText = button.data('show-text') || 'Show more';
            const hideText = button.data('hide-text') || 'Show less';
            // If the target is visible, it won't be after this block.
            button.html(target.is(':visible') ? showText : hideText);
            target.slideToggle();
        });
    }
}

angular.module('mlstuff.controllers').controller('AboutCtrl', AboutCtrl);
