/**
 * Defines the controller for the blog's about page. The controller provides small UI functions.
 */

class AboutCtrl extends InjectionReceiver {

    static get $inject() {
        return ['$scope'];
    }

    constructor(...injections) {
        super(...injections); // Set the injections on this.

        $('.show-more').click(this.toggleDetail);
    }

    toggleDetail($event) {
        // Expand / hide additional information in the CV.
        const button = $($event.target);
        button.html(button.html() == 'Show less' ? 'Show more' : 'Show less');
        button.closest('.cv-item').children('.detail').toggle();
    }
}

angular.module('mlstuff.controllers').controller('AboutCtrl', AboutCtrl);
