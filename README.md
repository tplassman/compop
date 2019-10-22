# ComPop

JavaScript function to pop component configuration off a global stack and construct corresponding class instances

## Installation

```
npm install --save compop
```

## Usage

1. Scaffold out the global components array and state object in your HTML layout file.
Note: the "YOUR_SITE_GLOBAL" key is a convention to encapsulate your components from other scripts in the `window`

```html
<html>
    <head>
        <title>Your Site</title>
    </head>
    <body>

        <script>
            window[YOUR_SITE_GLOBAL] = { components: [], state: {} };
        </script>

        ...Your HTML components...

        <script src="/scripts/main.js"></script>
    </body>
</html>
```

2. Add HTML components to your site and push a component config onto the glbal array.

```html
<div id="unique-identifier" class="component-handle">

    ...Your component markup...

    <script>
        window[YOUR_SITE_GLOBAL].components.push({
            handle: 'component-handle',
            id: 'unique-identifier',
            // ...any other variables for your component class
        });
    </script>
</div>
```

3. Construct all instances of your components from the corresponding configuration objects specified in the markup.

```javascript
// src/scripts/components/component-handle.js

export default class {
    constructor({
        id,
        // ...any other variables for your component class
        state,
        actions,
        refresh,
    }) {
        // Define elements and variables needed by the component
        const el = document.getElementById(id);

        // Define component functionality
        function handleCustomAction(e) {
            // Get any information from the event
            const { customData } = e.detail;

            // Do something with custom data in response to the event
        }

        // Attach any event listeners
        window.addEventListener(actions.myComponentCustomAction, handleCustomAction);
    }
}
```

```javascript
// src/scripts/main.js

import pop from 'compop'

import ComponentClass from './components/component-handle.js';

const classMap = {
    'component-handle': ComponentClass
};

const actions = {
    myComponentCustomAction: 'my-component-custom-action',
}

// Construct components on DOM content loaded
function handleDOMConentLoaded() {
    const scaffold = window[SITE_HANDLE];

    function cb() {
        // Do something after components initialize
    }

    // Call component constructors
    pop({ scaffold, classMap, actions, cb });
}

// Attach event listener
document.addEventListener('DOMContentLoaded', handleDOMConentLoaded);
```

