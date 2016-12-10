/**
 * Defines the controller for the blog's about page. The controller provides small UI functions.
 */

class AboutCtrl extends InjectionReceiver {

    static get $inject() {
        return ['$scope'];
    }

    constructor(...injections) {
        super(...injections); // Set the injections on this.

        $('.show-more').click(this.showDetail);
        $('.show-more-toggle').click(this.toggleDetail);
    }

    showDetail($event) {
        // Show the detail
        const button = $($event.target);
        const target = $('#'+button.data('targetId'));
        button.hide();
        target.show();
    }

    toggleDetail($event) {
        // Expand / hide additional information in the CV.
        const button = $($event.target);
        const target = $('#'+button.data('targetId'));
        button.html(button.html() == 'Show less' ? 'Show more' : 'Show less');
        target.slideToggle();
    }
}

angular.module('mlstuff.controllers').controller('AboutCtrl', AboutCtrl);
