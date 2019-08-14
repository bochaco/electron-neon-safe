// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.

const safe_fetch = require('safe_nodejs');

let url = "safe://mywebsite/test.md";
console.log("Let's fetch content from ", url);

let str = String.fromCharCode.apply(null, safe_fetch(url));
console.log("Fetched content: ", str);
