# littlemarkdown

Javascript library that helps you convert simplified markdown to HTML

## Installation

### npm (server-side)

    npm install littlemarkdown

### CDN

You can also use one of several CDNs available:

* github CDN

        https://cdn.rawgit.com/Tonkean/lightMarkdown/<version tag>/dist/littlemarkdown.min.js

## Quick Example

### Node

```js
const littlemarkdown  = require('littlemarkdown');
const text = 'This should be *bold*';
const html = littlemarkdown(text);
```

### Browser

```js
const text = 'This should be *bold*';
const html = littlemarkdown(text);
```

### Output 

Both examples should output...

    <p>This should be <b>bold</b></p>
    
## Tests

A suite of tests is available which require node.js.  Once node is installed, run the following command from the project root to install the dependencies:

    npm install

Once installed the tests can be run from the project root using:

    npm test

New test cases can easily be added.  Create a light markdown file (ending in `.lmd`) which contains the markdown to test.  Create a `.html` file of the exact same name.  It will automatically be tested when the tests are executed with `mocha`.

