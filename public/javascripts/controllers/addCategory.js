/**
 * Controller to add a category
 */

class AddCategoryCtrl extends InjectionReceiver {

    static get $inject() {
        return ['$scope', '$state', '$log', 'CategoryService'];
    }

    constructor(...injections) {
        super(...injections); // Set the injections on this.

        // Provide an object for the form element in the scope http://stackoverflow.com/a/24746842
        this.$scope.form = {};
        this.$scope.category = new Category();
    }

    // Validating function that calls another function only if the form is valid
    submit(methodName) {
        // TODO: This can be superclassed
        if (this.$scope.form.theForm.$valid) {
            this[methodName]();
        }
    }

    add() {
        this.CategoryService.createCategory(this.$scope.category).then(() => {
            // Go home!
            this.$state.go('home');
        }).catch(this.$log.error);
    }
}

angular.module('mlstuff.controllers').controller('AddCategoryCtrl', AddCategoryCtrl);