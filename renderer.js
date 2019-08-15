// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.

const APP_ID = "net.maidsafe.safe_browser";
const APP_NAME = "SAFE Browser";
const APP_VENDOR = "MaidSafe.net Ltd";

const { Safe } = require('safe_nodejs');

let safe = new Safe();

console.log("Authorising application...");
let auth_credentials = safe.auth_app(APP_ID, APP_NAME, APP_VENDOR, 15000);

console.log("Connecting to the Network...");
safe.connect("net.maidsafe.safe_nodejs", auth_credentials);

let url = "safe://mywebsite/myfile.txt";
console.log("Let's fetch content from ", url);

let safe_data = safe.fetch(url);
if (safe_data.PublishedImmutableData) {
  let str = String.fromCharCode.apply(null, safe_data.PublishedImmutableData.data);
  console.log("Fetched content: ", str);
}

let url_v0 = `${url}?v=0`;
console.log("Let's fetch v0 of the content from ", url_v0);

let safe_data_v0 = safe.fetch(url_v0);
if (safe_data_v0.PublishedImmutableData) {
  let str_v0 = String.fromCharCode.apply(null, safe_data_v0.PublishedImmutableData.data);
  console.log("Fetched content: ", str_v0);
}

let url_root = "safe://mywebsite";
console.log("Let's fetch v0 of the content from ", url_root);

let safe_data_root = safe.fetch(url_root);
if (safe_data_root.PublishedImmutableData) {
  console.log("I wasn't expecting that type of SafeData: ", safe_data_root);
} else if (safe_data_root.FilesContainer){
  console.log("Fetched root raw content: ", safe_data_root);
}
