/**
 * Controller to view a post
 */

class LabCtrl extends InjectionReceiver {

    static get $inject() {
        return ['$scope', '$stateParams', '$location', '$state', '$sce', '$document', '$rootScope',
            'angularLoad', 'usSpinnerService',
            'PostService'];
    }

    constructor(...injections) {
        super(...injections); // Set the injections on this.

        this.$document.ready(() => {
            this.loadScripts();

            // Wrap tables to make them responsive.
            $('table').wrap('<div class="table-container"></div>');

            // Wrap each chart in a div to be able to safely clear the chart.js iframe junk
            $('canvas.chart').wrap('<div></div>')

            // Bring the bootstrap dropdowns to life
            $('.dropdown-menu li a').click(function () {
                const elem = $(this);
                const buttonElem = elem.closest('.btn-group').find('button').first();
                const choiceElem = buttonElem.find('.choice');
                // Set the text on the span
                choiceElem.html(elem.text());
                // Set the selected value on the button
                buttonElem.val(elem.data('value'));
                buttonElem.change();
            });
        });
    }

    loadScripts() {
        const cssIncludes = $('#stylesheets-input').val().split(' ');
        const jsIncludes = $('#javascripts-input').val().split(' ');

        // Load all css includes directly
        Promise.all(cssIncludes.map(url => this.angularLoad.loadCSS(url)))
            .catch(console.error);

        // Load the JavaScripts

        // Wrap each angularLoad Promise in a function returning it. See Util.chainBlockPromises
        // for more detail.
        const blocks = jsIncludes.map(url => {
            return () => this.angularLoad.loadScript(url);
        });

        Util.chainPromiseBlocks(blocks).catch(console.error).then(() => {
            // Execute the Post's script
            if (window.runPostScript) runPostScript();
        });
    }
}

angular.module('mlstuff.controllers').controller('LabCtrl', LabCtrl);

