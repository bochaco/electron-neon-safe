// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.

const APP_ID = "net.maidsafe.safe_browser";
const APP_NAME = "SAFE Browser";
const APP_VENDOR = "MaidSafe.net Ltd";

const { Safe } = require('safe-nodejs');

let safe = new Safe();

console.log("Authorising application...");
let auth_credentials = safe.auth_app(APP_ID, APP_NAME, APP_VENDOR);

console.log("Connecting to the Network...");
safe.connect("net.maidsafe.safe-nodejs", auth_credentials);

// FilesContainer create
console.log("Creating FilesContainer...");
let files_container = safe.files_container_create("testfolder/", "", false, false);
console.log("FilesContainer created: ", files_container);

// FilesContainer get
let safe_data = safe.files_container_get(files_container[0]);
console.log("Fetched FilesContainer content: ", safe_data);

// FilesContainer sync
console.log("Sync-ing FilesContainer...");
safe.files_container_sync("testfolder/subfolder", files_container[0], false, false, false, false);
safe_data = safe.files_container_get(files_container[0]);
console.log("FilesContainer synced: ", safe_data);

// PublishedImmutableData put
console.log("Putting PublishedImmutableData...");
let buffer = Uint8Array.from([72, 101, 108, 108, 111, 32, 69, 108, 101, 99, 116, 114, 111, 110, 33, 33, 33, 10]);
let immd_url = safe.files_put_published_immutable(buffer.buffer);
console.log("PublishedImmutableData put: ", immd_url);

// PublishedImmutableData get
console.log("Let's fetch PublishedImmutableData from ", immd_url);
safe_data = safe.files_get_published_immutable(immd_url);
console.log("Fetched PublishedImmutableData content: ", safe_data);

// Create an NRS public name
let random = Math.floor(Math.random() * Math.floor(1000));
let nrs_name = `mypubname-${random}`;
console.log("Let's link NRS name to ", files_container[0]);
let nrs_map_data = safe.nrs_map_container_create(nrs_name, `${files_container[0]}?v=0`, true, true, false);
console.log("NRS Map Container created: ", nrs_map_data);

// Add a subname to the NRS public name
console.log("Let's link subname to ", immd_url);
nrs_map_data = safe.nrs_map_container_add(`subname.${nrs_name}`, immd_url, false, true, false);
console.log("NRS Map Container updated: ", nrs_map_data);

// Fetch NRS Map Container
console.log("Fetch NRS Map ", nrs_name);
nrs_map_data = safe.nrs_map_container_get(nrs_name);
console.log("NRS Map Container fetched: ", nrs_map_data);

// Remove a subname from the NRS public name
console.log("Let's remove subname");
nrs_map_data = safe.nrs_map_container_remove(`subname.${nrs_name}`, false);
console.log("NRS Map Container updated: ", nrs_map_data);

// Let's parse a URL
console.log("Let's parse ", `safe://${nrs_name}`);
let parsed_url = safe.parse_url(`safe://${nrs_name}`);
console.log("Parsed URL: ", parsed_url);

// Let's parse ann resolve a URL
console.log("Let's parse and resolve ", `safe://${nrs_name}`);
parsed_url = safe.parse_and_resolve_url(`safe://${nrs_name}`);
console.log("Parsed and resolved URL: ", parsed_url);

let url = `${files_container[0]}/test.md`;
console.log("Let's fetch content from ", url);

safe_data = safe.fetch(url);
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

let url_root = files_container[0];
console.log("Let's fetch v0 of the content from ", url_root);

let safe_data_root = safe.fetch(url_root);
if (safe_data_root.PublishedImmutableData) {
  console.log("I wasn't expecting that type of SafeData: ", safe_data_root);
} else if (safe_data_root.FilesContainer){
  console.log("Fetched root raw content: ", safe_data_root);
}
