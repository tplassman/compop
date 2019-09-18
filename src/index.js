/**
 * Pop off and instantiate any components pushed onto global components array
 * @rparam {object} scaffold - Case scaffold where components and state are initialized by markup
 * @rparam {object} classMap - Object mapping component handles to corresponding classes
 * @rparam {object} actions - Object defining actions/commands that components will pub/sub
 * @rparam {Function} cb - Callback function once all components have been initialized
 * @return {void}
 */
function pop({
    scaffold = {},
    classMap = {},
    actions = {},
    cb = null,
}) {
    /**
     * Function to allow component classes to repop components inside dynamically set markup
     * @param {Element}
     */
    function refresh(container = null) {
        if (container === null) {
            return;
        }

        // Get all scripts from markup set in container
        const scripts = container.querySelectorAll('script');

        if (scripts.length === 0) {
            return;
        }

        // Evaluate scripts returned from component markup if for new component
        scripts.forEach(script => { eval(script.textContent); }); // eslint-disable-line no-eval

        // Instantiate components
        pop({ scaffold, classMap, actions, cb });
    }

    // Pop component configs from global array and construct instances
    while (scaffold.components.length > 0) {
        const { components = [], state = {} } = scaffold;
        const config = components.shift();
        const Class = classMap[config.handle];

        if (typeof Class === 'function') {
            new Class({ ...config, state, actions, refresh }); // eslint-disable-line no-new
        }
    }

    if (cb) {
        cb();
    }
}

export default pop;
