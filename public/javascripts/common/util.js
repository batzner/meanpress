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

/*
 * Extension of the ES6 map, which also supports binding to it's array of values
 */
class BindableMap extends Map {

    constructor(...args) {
        super(...args);
        this.bindableValues = [];
    }

    updateBindableValues() {
        // Clear the array without creating a new one.
        this.bindableValues.length = 0;
        // Push all the new values
        this.bindableValues.push(...Array.from(super.values()));
    }

    clear(...args) {
        super.clear(...args);
        this.updateBindableValues();
    }

    set(...args) {
        super.set(...args);
        this.updateBindableValues();
    }

    delete(...args) {
        super.delete(...args);
        this.updateBindableValues();
    }
}

/**
 * Base model for a backend entity. Can be constructed with a data object. Sets createdAt and
 * updatedAt automatically as dates.
 */
class BaseEntity {

    /**
     * Construct an entity by passing an object with the same properties as the result of
     * getDefaults(). The given object does not need to have all properties set; only those, who
     * shall be overwritten.
     * @param {Object} data - The properties for the entity, which shall overwrite the defaults.
     */
    constructor(data) {
        // Get the default properties for the entity and overwrite them with the given data
        Object.assign(this, this.constructor.getDefaults());
        // Set the given values
        this.updateProperties(data);
    }

    updateProperties(data) {
        // Only allow values that are in the defaults
        Object.keys(this).forEach(key => {
            if (key in data) this[key] = data[key];
        });
    }

    set createdAt(value) {
        this._createdAt = new Date(value);
    }

    get createdAt() {
        return this._createdAt;
    }

    set updatedAt(value) {
        this._updatedAt = new Date(value);
    }

    get updatedAt() {
        return this._updatedAt;
    }

    prepareForJson() {
        // Prepare the properties for json serialization (removing circular references)
    }

    static getDefaults() {
        throw new TypeError('Inheriting classes need to implement their getDefaults');
    }
}