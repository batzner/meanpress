/**
 * Base implementation for automatic property setting of injections on services, controllers etc.
 */
class InjectionReceiver {
    static get $inject() {
        throw new TypeError('Inheriting classes need to implement their own $inject getter.');
    }

    constructor(...injections) {
        // Get the injection names from the inheriting class
        const names = this.constructor.$inject;
        // Make the injection accessible in the object
        injections.forEach((injection, index) => this[names[index]] = injection);
    }
}