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
 * Extension of the ES6 map, which also supports binding to it's array of values. Unfortunately,
 * we can't subclass Map, because of Babel: http://stackoverflow.com/questions/29434406/create-a-class-extending-from-es6-map/29436039#29436039
 * Therefore, we provide all Map methods.
 *
 * Even though we can just reset the array on the scope in the controller, this class prevents
 * having to send broadcasts through the whole app.
 */
class BindableMap {

    constructor(...args) {
        this.bindableValues = [];
        this.map = new Map(...args);
    }

    updateBindableValues() {
        // Clear the array without creating a new one.
        this.bindableValues.length = 0;
        // Push all the new values
        this.bindableValues.push(...Array.from(this.map.values()));
    }

    get size() {
        return this.map.size;
    }

    clear(...args) {
        this.map.clear(...args);
        this.updateBindableValues();
    }

    set(...args) {
        this.map.set(...args);
        this.updateBindableValues();
    }

    delete(...args) {
        this.map.delete(...args);
        this.updateBindableValues();
    }

    entries(...args) {
        return this.map.entries(...args);
    }

    forEach(...args) {
        return this.map.forEach(...args);
    }

    get(...args) {
        return this.map.get(...args);
    }

    has(...args) {
        return this.map.has(...args);
    }

    keys(...args) {
        return this.map.keys(...args);
    }

    values(...args) {
        return this.map.values(...args);
    }

    [Symbol.iterator]() {
        return this.map[Symbol.iterator]();
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
    constructor(data = {}) {
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

class Util {
    static objectValues(obj) {
        return Object.keys(obj).map(key => obj[key]);
    }

    static chainPromiseBlocks(blocks) {
        // Chains an array of functions, which return a promise to a sequence of then calls. The
        // blocks should each return a promise, just like in a then block.

        // Start the chain with an empty promise
        const start = Promise.resolve();
        return blocks.reduce((reduced, block) => {
            // Add the block to the chain by calling then on the reduced promise. The block
            // returning the promise will be called, when all promises so far are resolved.
            return reduced.then(block);
        }, start);
    }

    static colorCellsByLogValue() {
        $('[data-transform="color-cells-by-log-value"]').each((index, element) => {
            const cells = $(element).find('td');

            // Determine the min and max log values
            let min = null;
            let max = null;
            cells.each((index, cell) => {
                cell = $(cell);
                let val = parseFloat(cell.html());
                if (!isNaN(val)) {
                    val = Math.log(val);
                    min = min ? Math.min(min, val) : val;
                    max = max ? Math.max(max, val) : val;
                }
            });

            // Color each cell based on its value
            cells.each((index, cell) => {
                cell = $(cell);
                let val = parseFloat(cell.html());
                if (!isNaN(val)) {
                    val = Math.log(val);
                    let percentage = (val-min) / (max-min);
                    cell.css('background-color', 'rgba(229,115,115,'+percentage+')');
                }
            });
        });
    }

    static processPageElements() {
        // Wrap tables to make them responsive.
        $('table').filter((index, element) => !($(element).parent().hasClass('table-container')))
            .wrap('<div class="table-container"></div>');

        // Wrap each chart with siblings in a div to be able to safely clear the chart.js iframe
        // junk
        $('canvas.chart').filter((index, element) => $(element).siblings()).wrap('<div></div>');

        // Bring the bootstrap dropdowns to life
        $('.dropdown-menu li a').off('click').click(function () {
            selectDropdownItem($(this));
        });

        // Activate the show more toggles
        $('.show-more').off('click').click($event => {
            // Expand / hide additional information
            const button = $($event.target);
            const target = $('#' + button.data('target-id'));
            const showText = button.data('show-text') || 'Show more';
            const hideText = button.data('hide-text') || 'Show less';
            // If the target is visible, it won't be after this block.
            button.html(target.is(':visible') ? showText : hideText);
            target.slideToggle();
        });

        // Apply the transforms
        Util.colorCellsByLogValue();

        Util.runHighlighting();
    }

    static runHighlighting() {
        MathJax.Hub.Queue(["Typeset", MathJax.Hub]); // Run Mathjax

        // Run hljs
        $('pre code').each(function (i, block) {
            hljs.highlightBlock(block);
        });
    }

    static processPageContinuously(scope, angularLoad) {
        // Watch the scope and rerun highlighting on changes (state changes for example). Also,
        // this runs the highlighting initally.

        // If all libs are already loaded, we can directly set the watch. Otherwise, we have to wait
        const setWatch = () => {
            Util.processPageElements(); // Run the processing initially

            // Set the watch for updates
            scope.$watch(function () {
                Util.processPageElements();
                return true;
            });
        };

        if (window.MathJax) {
            setWatch();
        } else {
            scope.$on('highlighting:loaded', () => setWatch());
            Util.loadHighlightingLibs(scope, angularLoad);
        }
    }

    static loadHighlightingLibs($rootScope, angularLoad) {
        // Load MathJax and then broadcast the event
        const mathjaxJsPath = 'https://cdn.mathjax.org/mathjax/latest/MathJax.js?config=TeX-MML-AM_CHTML';

        Promise.all([angularLoad.loadScript(mathjaxJsPath)])
            .then(() => {
                // Broadcast
                $rootScope.$broadcast('highlighting:loaded');
            });
    }
}