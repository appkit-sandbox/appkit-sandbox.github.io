var idb=function(e){"use strict";let t,n;const r=new WeakMap,o=new WeakMap,s=new WeakMap,a=new WeakMap,i=new WeakMap;let c={get(e,t,n){if(e instanceof IDBTransaction){if("done"===t)return o.get(e);if("objectStoreNames"===t)return e.objectStoreNames||s.get(e);if("store"===t)return n.objectStoreNames[1]?void 0:n.objectStore(n.objectStoreNames[0])}return p(e[t])},set:(e,t,n)=>(e[t]=n,!0),has:(e,t)=>e instanceof IDBTransaction&&("done"===t||"store"===t)||t in e};function u(e){return e!==IDBDatabase.prototype.transaction||"objectStoreNames"in IDBTransaction.prototype?(n||(n=[IDBCursor.prototype.advance,IDBCursor.prototype.continue,IDBCursor.prototype.continuePrimaryKey])).includes(e)?function(...t){return e.apply(f(this),t),p(r.get(this))}:function(...t){return p(e.apply(f(this),t))}:function(t,...n){const r=e.call(f(this),t,...n);return s.set(r,t.sort?t.sort():[t]),p(r)}}function d(e){return"function"==typeof e?u(e):(e instanceof IDBTransaction&&function(e){if(o.has(e))return;const t=new Promise(((t,n)=>{const r=()=>{e.removeEventListener("complete",o),e.removeEventListener("error",s),e.removeEventListener("abort",s)},o=()=>{t(),r()},s=()=>{n(e.error||new DOMException("AbortError","AbortError")),r()};e.addEventListener("complete",o),e.addEventListener("error",s),e.addEventListener("abort",s)}));o.set(e,t)}(e),n=e,(t||(t=[IDBDatabase,IDBObjectStore,IDBIndex,IDBCursor,IDBTransaction])).some((e=>n instanceof e))?new Proxy(e,c):e);var n}function p(e){if(e instanceof IDBRequest)return function(e){const t=new Promise(((t,n)=>{const r=()=>{e.removeEventListener("success",o),e.removeEventListener("error",s)},o=()=>{t(p(e.result)),r()},s=()=>{n(e.error),r()};e.addEventListener("success",o),e.addEventListener("error",s)}));return t.then((t=>{t instanceof IDBCursor&&r.set(t,e)})).catch((()=>{})),i.set(t,e),t}(e);if(a.has(e))return a.get(e);const t=d(e);return t!==e&&(a.set(e,t),i.set(t,e)),t}const f=e=>i.get(e);const l=["get","getKey","getAll","getAllKeys","count"],D=["put","add","delete","clear"],v=new Map;function b(e,t){if(!(e instanceof IDBDatabase)||t in e||"string"!=typeof t)return;if(v.get(t))return v.get(t);const n=t.replace(/FromIndex$/,""),r=t!==n,o=D.includes(n);if(!(n in(r?IDBIndex:IDBObjectStore).prototype)||!o&&!l.includes(n))return;const s=async function(e,...t){const s=this.transaction(e,o?"readwrite":"readonly");let a=s.store;return r&&(a=a.index(t.shift())),(await Promise.all([a[n](...t),o&&s.done]))[0]};return v.set(t,s),s}return c=(e=>({...e,get:(t,n,r)=>b(t,n)||e.get(t,n,r),has:(t,n)=>!!b(t,n)||e.has(t,n)}))(c),e.deleteDB=function(e,{blocked:t}={}){const n=indexedDB.deleteDatabase(e);return t&&n.addEventListener("blocked",(()=>t())),p(n).then((()=>{}))},e.openDB=function(e,t,{blocked:n,upgrade:r,blocking:o,terminated:s}={}){const a=indexedDB.open(e,t),i=p(a);return r&&a.addEventListener("upgradeneeded",(e=>{r(p(a.result),e.oldVersion,e.newVersion,p(a.transaction))})),n&&a.addEventListener("blocked",(()=>n())),i.then((e=>{s&&e.addEventListener("close",(()=>s())),o&&e.addEventListener("versionchange",(()=>o()))})).catch((()=>{})),i},e.unwrap=f,e.wrap=p,e}({});

window.pug = require('pug'); //Register PUG compiler

// register service worker
// const projectId = Math.random().toString(36).substring(7); //Random project id
var db;

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/service-worker.js', { scope: '/'}).then(function (reg) {
    if (reg.installing) {
      console.log('Service worker installing');
    } else if (reg.waiting) {
      console.log('Service worker installed');
    } else if (reg.active) {
      console.log('Service worker active');
      //Gừi indentity qua SW
      // navigator.serviceWorker.controller.postMessage({id: "test message"})
      appendOutput();
    }
    
  }).catch(function (error) {
    // registration failed
    console.log('Registration failed with ' + error);
  });

  // When SW state change to active
  navigator.serviceWorker.addEventListener('controllerchange', async function () {
    console.log('ControllerChange...');
    appendOutput();
  });
}

// if (!window.indexedDB) { };

(async () => {
  //...
  const dbName = 'user_1'
  const storeName = 'c1'
  const version = 1;
  
  let img = await fetch('images/appkit_avatar.png').then(res => res.blob());

  db = await idb.openDB(dbName, version,{
    upgrade(db, oldVersion, newVersion, transaction) {
      const store = db.createObjectStore(storeName)
      store.put('@import "style2.css"; body { background: #fc0; }', '/css/style1.css');
      store.put('h2 { font-size: 70px; }', '/css/style2.css');
      store.put('import { fn } from "./js2.js"; window.foo = "Xuan Hung"; console.log("Log tu ben trong ne!", foo); text.innerHTML = fn(foo);', '/js/js1.js');
      store.put('export function fn(t) { return "I was exported from JS2. My name is - " + t} ', '/js/js2.js');
      store.put(img, '/images/photo.png');
      store.put('<!DOCTYPE html><html><head><link id="css1" href="/css/style1.css" rel="stylesheet"><script type="module" src="/js/js1.js"></script></head><body><h2>Title</h2> Hello <a href="/">baby</a>! <div id="text"></div><img src="/images/photo.png" alt="no_image" width="200" /></body></html>', '/index.html')
    }
  })
})()

window.onloadIframe = () => {
  let output = document.getElementById('output');
  let iframeWindow = output.contentWindow || output.contentDocument.document || output.contentDocument;
  iframeWindow.parent = null;
  let filePath = currentURL.value[0] == "/" ? currentURL.value : "/" + currentURL.value;
  iframeWindow.history.replaceState({}, '', window.location.origin + filePath);

  iframeWindow.onpopstate = function(event) {
    console.log(`location: ${iframeWindow.document.location}, state: ${JSON.stringify(event.state)}`);
  }
}

function appendOutput() {
  document.getElementById("ifm").innerHTML = `<iframe onload="onloadIframe();" sandbox="allow-same-origin allow-scripts allow-popups" id="output" src="/view/?id=c1&path=/index.html"></iframe>`; //'<iframe id="output" src="/c1/index.html?id=c1"></iframe>';
}


function render(src) {
  if(src) {
    src = src.replace("<head>", '<head><base href="/c1/">');
    let iframe = output.contentWindow || output.contentDocument.document || output.contentDocument;
      iframe.document.open();
      iframe.document.write(src);
      iframe.document.close();
  }
}

async function putFile(store, fileContent, fileName, preprocessor) {
  let content = fileContent;
  if(preprocessor) {
    switch (preprocessor) {
      case "pug":
        content = pug.render(fileContent, { pretty: false });
      default:
        break;
    }
  }
  await db.put(store, content, fileName);
}
window.onload = async function() {
  // setTimeout(function(){ appendOutput(); }, 500);
  //Write to iframe
  
  //First Init
  // let initHTML = '<html> <head><base href="http://c1/"> <meta charset="utf-8"> <title>Test<\/title><link id="css1" href="/css/style1.css" rel="stylesheet"> <script>console.log(location);<\/script><\/head> <body> <h2>Title</h2> Hello baby! <\/body> <\/html>';
  // render(initHTML);
  // let blob = await fetch('gallery/myLittleVader.jpg').then(r => r.blob());
  // console.log(blob);

  addFile.onclick = async () => {
    // let fileContent = await db.transaction("c1").objectStore("c1").get("/css/style1.css");
    console.log("Nội dung file", fileName.value, fileContent.value);
    let fileExt = fileName.value.split(".").pop(); //get file extension
    if(fileExt !== "pug") fileExt = null;
    putFile("c1", fileContent.value, fileName.value, fileExt);    
  }

  listFile.onclick = async () => {
    let flist = await db.transaction("c1").objectStore("c1").getAllKeys();
    console.log("Danh sách file", flist);
  }

  go.onclick = async () => {
    let output = document.getElementById('output');
    let filePath = currentURL.value[0] == "/" ? currentURL.value : "/" + currentURL.value;
    output.src= '/view/?id=c1&path=' + filePath;
    // let fileContent = await db.transaction("c1").objectStore("c1").get(filePath);
    console.log("Current URL:", filePath);
    // // if (fileContent !== undefined) 
    // render(fileContent, true);
  }
  
}