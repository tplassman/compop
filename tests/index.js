// 1. Build mock scaffold
const SITE_HANDLE = 'test';

const window = {
    SITE_HANDLE: { components: [], state: {} , storage: 'queue' },
};

// 2. Push new component onto scaffold
window.SITE_HANDLE.components.push({ handle: 'test', id: 'unique-id' });

// 3. Instantiate components from scaffold
const pop = require('../dist/index.js').default;
const Test = require('./components/test.js');
const scaffold = window.SITE_HANDLE;
const classMap = {
    'test': Test
};
const actions = {
    testAction: 'TEST_ACTION'
}

function cb() {
    // Do something after components initialize
    console.log('Finished instantiation.');
}

pop({ scaffold, classMap, actions, cb });
