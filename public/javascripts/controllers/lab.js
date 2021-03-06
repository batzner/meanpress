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

        this.$document.ready(() => this.fillTemplate());
    }

    fillTemplate() {
        this.loadScripts();
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

        // If the scripts are already loaded, the callbacks won't be set again, so we need to use
        // the old ones.
        if (this.PostService.postCallbacks.has('lab')) {
            window.onContentReadyCallbacks = this.PostService.postCallbacks.get('lab');
        } else {
            window.onContentReadyCallbacks = [];
        }

        Util.chainPromiseBlocks(blocks).catch(console.error).then(() => {
            // Save the callbacks for reloading of the page
            this.PostService.postCallbacks.set('lab', window.onContentReadyCallbacks);

            // Execute the Post's scripts
            console.log('Executing the onContentReadyCallbacks. Count: '
                + window.onContentReadyCallbacks.length);
            window.onContentReadyCallbacks.forEach(func => func());
        });
    }
}

angular.module('mlstuff.controllers').controller('LabCtrl', LabCtrl);

