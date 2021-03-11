/**
 * Emit event - wrapper around CustomEvent API
 * @param {string} handle - a string representing the name of the event
 * @param {object} payload - data to be passed via the event to listening functions
 * @param {EventTarget} target - target to emit/broadcast event to
 */
function emit(handle, payload, target = window) {
    const event = new CustomEvent(handle, { detail: payload });

    target.dispatchEvent(event);
}

/**
 * Listen for custom event and execute callback on EventTarget
 * @param {string} handle - a string representing the name of the event
 * @param {function} cb - function to call w/ event argument when event is emitted
 * @param {EventTarget} target - target to attach listener to
 */
function on(handle, cb, target = window) {
    target.addEventListener(handle, cb);
}

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
    // Get order of instantiation from storage key in scaffold
    const { storage = 'queue' } = scaffold;
    // Create events object to wrap methods to send and receive events (messages) between components
    const events = { emit, on };

    // Keep track of global state to pass back to callback function
    let finalState = {};

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

        // Evaluate scripts returned from component markup if for new component
        scripts.forEach(script => { eval(script.textContent); });

        // Instantiate components
        pop({ scaffold, classMap, actions, cb });
    }

    // Pop component configs from global array and construct instances
    while ((scaffold.components || []).length > 0) {
        const { components = [], state = {} } = scaffold;
        const config = storage === 'stack' ? components.pop() : components.shift();
        const Class = classMap[config.handle];

        if (typeof Class === 'function') {
            try {
                new Class({
                    ...config,
                    state,
                    actions,
                    events,
                    refresh,
                });

                finalState = { ...finalState, ...state };
            } catch(error) {
                console.error(error);
            }
        }
    }

    if (cb) {
        cb({ state: finalState, events, refresh });
    }
}

export default pop;
