var idb=function(e){"use strict";let t,n;const r=new WeakMap,o=new WeakMap,s=new WeakMap,a=new WeakMap,i=new WeakMap;let c={get(e,t,n){if(e instanceof IDBTransaction){if("done"===t)return o.get(e);if("objectStoreNames"===t)return e.objectStoreNames||s.get(e);if("store"===t)return n.objectStoreNames[1]?void 0:n.objectStore(n.objectStoreNames[0])}return p(e[t])},set:(e,t,n)=>(e[t]=n,!0),has:(e,t)=>e instanceof IDBTransaction&&("done"===t||"store"===t)||t in e};function u(e){return e!==IDBDatabase.prototype.transaction||"objectStoreNames"in IDBTransaction.prototype?(n||(n=[IDBCursor.prototype.advance,IDBCursor.prototype.continue,IDBCursor.prototype.continuePrimaryKey])).includes(e)?function(...t){return e.apply(f(this),t),p(r.get(this))}:function(...t){return p(e.apply(f(this),t))}:function(t,...n){const r=e.call(f(this),t,...n);return s.set(r,t.sort?t.sort():[t]),p(r)}}function d(e){return"function"==typeof e?u(e):(e instanceof IDBTransaction&&function(e){if(o.has(e))return;const t=new Promise(((t,n)=>{const r=()=>{e.removeEventListener("complete",o),e.removeEventListener("error",s),e.removeEventListener("abort",s)},o=()=>{t(),r()},s=()=>{n(e.error||new DOMException("AbortError","AbortError")),r()};e.addEventListener("complete",o),e.addEventListener("error",s),e.addEventListener("abort",s)}));o.set(e,t)}(e),n=e,(t||(t=[IDBDatabase,IDBObjectStore,IDBIndex,IDBCursor,IDBTransaction])).some((e=>n instanceof e))?new Proxy(e,c):e);var n}function p(e){if(e instanceof IDBRequest)return function(e){const t=new Promise(((t,n)=>{const r=()=>{e.removeEventListener("success",o),e.removeEventListener("error",s)},o=()=>{t(p(e.result)),r()},s=()=>{n(e.error),r()};e.addEventListener("success",o),e.addEventListener("error",s)}));return t.then((t=>{t instanceof IDBCursor&&r.set(t,e)})).catch((()=>{})),i.set(t,e),t}(e);if(a.has(e))return a.get(e);const t=d(e);return t!==e&&(a.set(e,t),i.set(t,e)),t}const f=e=>i.get(e);const l=["get","getKey","getAll","getAllKeys","count"],D=["put","add","delete","clear"],v=new Map;function b(e,t){if(!(e instanceof IDBDatabase)||t in e||"string"!=typeof t)return;if(v.get(t))return v.get(t);const n=t.replace(/FromIndex$/,""),r=t!==n,o=D.includes(n);if(!(n in(r?IDBIndex:IDBObjectStore).prototype)||!o&&!l.includes(n))return;const s=async function(e,...t){const s=this.transaction(e,o?"readwrite":"readonly");let a=s.store;return r&&(a=a.index(t.shift())),(await Promise.all([a[n](...t),o&&s.done]))[0]};return v.set(t,s),s}return c=(e=>({...e,get:(t,n,r)=>b(t,n)||e.get(t,n,r),has:(t,n)=>!!b(t,n)||e.has(t,n)}))(c),e.deleteDB=function(e,{blocked:t}={}){const n=indexedDB.deleteDatabase(e);return t&&n.addEventListener("blocked",(()=>t())),p(n).then((()=>{}))},e.openDB=function(e,t,{blocked:n,upgrade:r,blocking:o,terminated:s}={}){const a=indexedDB.open(e,t),i=p(a);return r&&a.addEventListener("upgradeneeded",(e=>{r(p(a.result),e.oldVersion,e.newVersion,p(a.transaction))})),n&&a.addEventListener("blocked",(()=>n())),i.then((e=>{s&&e.addEventListener("close",(()=>s())),o&&e.addEventListener("versionchange",(()=>o()))})).catch((()=>{})),i},e.unwrap=f,e.wrap=p,e}({});

let db;
(async () => { db = await idb.openDB("user_1") })();

self.addEventListener('install', function (event) {
  self.skipWaiting();
  event.waitUntil(
    caches.open('v1').then((cache) => {
      return cache.addAll([
        '/',
        '/index.html',
        '/style.css',
        '/app.js',
        '/libs/pug.js',
        '/output/index.html',
        '/images/appkit_avatar.png'
      ]);
    })
  );
});
self.addEventListener('activate', (event) => {
  console.info('Event: Activate');
  event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', function (event) {
  // event.respondWith(caches.match(event.request).then(function(response) {
  //   // caches.match() always resolves
  //   // but in case of success response will have value

  //   if (response !== undefined) {
  //     console.log("Tra ket qua thanh cong!", event.request, response);

  //     if(response.status == 404) {
  //       let newHeaders = new Headers([ ['Content-Type', 'text/css'] ]);
  //       let fakeRes = new Response("body { background: red; }", {
  //         headers: newHeaders,
  //         // status: 200,
  //         // statusText: "OK",
  //         // type: "basic",
  //         url: event.request.url,
  //       });
  //       console.log("Không tìm thấy", fakeRes);
  //       return fakeRes;
  //     }

  //     return response;
  //   } else {
  //     return fetch(event.request).then(function (response) {
  //       // response may be used only once, we need to save clone to put one copy in cache, and serve second one
  //       let responseClone = response.clone();

  //       caches.open('v1').then(function (cache) {
  //         cache.put(event.request, responseClone);
  //       });
  //       return response;
  //     }).catch(function () {
  //       return caches.match('/iamges/appkit_avatar.png');
  //     });
  //   }
  // }));
  console.log("REQUEST: ", event.request);
  event.respondWith(modifyResponse(event.request));
});

// if (self.indexedDB) {
//   //Tạo database
// }

// self.addEventListener('message', function (evt) {
//   console.log('postMessage received:', evt.data);
// });

function createResponse(content, type, custom = "") {
  let header = new Headers([['Content-Type', type], ['X-Appkit', custom]]);
  return new Response(content, { headers: header });
}
function getContentType(extension) {
  let defaultType = "text/html",
      types = {
        css: "text/css",
        scss: "text/css", //SCSS
        sass: "text/css", //SASS
        less: "text/css", //LESS
        styl: "text/css", //Stylus

        js: "text/javascript",
        ts: "text/javascript", //TypeScript
        ls: "text/javascript", //LiveScript
        coffee: "text/javascript", //CoffeeScript
        
        html: "text/html",
        haml: "text/html", //Haml
        md: "text/html", //Markdown
        pug: "text/html", //Pug/Jade
        jade: "text/html", //Jade/Pug
        
        svg: "image/svg+xml",
      }
  return types[extension] || defaultType;
}

async function modifyResponse(request) {
  let response, newURL, newRequest, reservedPath = true;
  const url = request.url,
    hostname = url.split("/")[2],
    protocol = url.split("/")[0],
    baseURL = protocol + "//" + hostname,
    queryString = url.split('?')[1],
    urlParams = queryString ? Object.fromEntries((new URLSearchParams(queryString)).entries()) : null,
    filePath = url.replace(baseURL, "").split('?')[0].split('#')[0], // /bar/foo/filename.ext
    fileExt = filePath.split('.').pop(); //filename.ext
  
  if (db && db.objectStoreNames.contains(hostname)) { //Check nếu hostname là id 1 table trong database
      let fileContent = await db.transaction(hostname).objectStore(hostname).get(filePath);
    if(typeof fileContent === "undefined") {
      console.log("CUSTOM DOMAIN: 404", request, fileExt, fileContent);
      response = await fetch('/404');
    } else {
      let contentType = getContentType(fileExt);
      console.log("CUSTOM DOMAIN: 200", request, fileExt, fileContent);
      response = createResponse(fileContent, contentType);
    }
  } else {
    //Default response. Modify request header
    // let ID = "";
    // if(request.destination === "iframe") {
    //   ID = request.url.split("?").pop().split("=").pop();
    // }
    // let requestHeader = { method: 'GET',
    //            headers: {
    //                'Content-Type': request.headers.get('Content-Type'),
    //                'Sandbox-Id': ID,
    //            },
    //            mode: 'cors',
    //            cache: 'default' };
    // let fpath = filePath;
    // if(!["/style.css", "/libs/pug.js", "/app.js", "/images/appkit_avatar.png", "/"].includes(filePath) ) {
    //   fpath = "/c1" + filePath.replace('/c1', '');
    //   reservedPath = false;
    // }
    
    // newURL = self.origin + fpath;

    // newRequest = new Request(newURL, requestHeader);

    // console.log("TEST REQUEST", newRequest, newURL);
    response = await fetch(request);
  }

  if(url.includes(self.location.origin)) {
    console.log("REQUEST SAME ORIGIN");
    if (response.status == 404 || !response.ok) {
      console.log("404", request);
      // let ID = null;
      // if(request.destination === "iframe") {
      //   ID = request.url.split("?").pop().split("=").pop();
      // }
      if (filePath === "/test/") {
        response = await fetch('/index.html');
      }
      // if (url.includes("/c1")) {
      //   let id = "c1",
      //   path = filePath.replace("/c1", ""),
      //   extension = path.includes(".") ? path.split('.').pop() : null,
      //   fileContent = await db.transaction(id).objectStore(id).get(path);
      //   // Nếu là các file html/htm/pug/jade
      //     if(["html", "htm", "pug", "jade"].includes(extension)) {
      //       fileContent = fileContent.replace("<head>", `<head><base href="/c1/">`);
      //     }
      //   // response = await fetch('/index.html');
        
      //   let contentType = fileContent instanceof Blob ? fileContent.type : getContentType(extension);
      //   // console.log("THOẢ C1", path, contentType, ID);
      //   response = createResponse(fileContent, contentType, ID);
      // } else
      if (url.includes("/view/?id=") && urlParams.id) {
        let id = urlParams.id,
            path = urlParams.path[0] == "/" ? urlParams.path : "/" + urlParams.path,
            extension = path.includes(".") ? path.split('.').pop() : null,
            isFolder = path[path.length - 1] == "/" || !extension ? true : false, //Nếu không có extension hoặc kết thúc là / thì là folder
            fileList = await db.transaction(id).objectStore(id).getAllKeys(),
            fileContent = "";

        if(fileList.includes(path)) {
          fileContent = await db.transaction(id).objectStore(id).get(path);
          //Nếu là các file html/htm/pug/jade
          if(["html", "htm", "pug", "jade"].includes(extension)) {
            fileContent = fileContent.replace("<head>", `<head><base href="https://${id}/">`);
          }
        }else{
          if(path[path.length - 1] !== "/") path+="/";
          let list = '';
          fileList.forEach(p => {
            if(p.includes(path)) { list+= `<p><a href="/view/?id=${id}&path=${p}">${p.replace(path, "")}</a></p>`; }
          });
          if(list.length > 0) {
            //Có thư mục thì check file index
            let checkPath1 = path + "index.html",
              checkPath2 = path + "index.htm",
              newPath = fileList.includes(checkPath1) ? checkPath1 : (fileList.includes(checkPath2) ? checkPath2 : null);
            if(newPath) {
              //Nếu có file index
              let htmlFile = await db.transaction(id).objectStore(id).get(newPath);
              fileContent = htmlFile.replace("<head>", `<head><base href="https://${id}/">`);
            }else{
              //Nếu không có file index thì list các file còn lại
              fileContent = `<h3>${path}</h3><br> This folder doesn't have the default index.html file<br> ${list}`;
            }
          }else{
            //Không tồn tại file/folder
            fileContent = isFolder ? `<h3>${path}</h3><br> Folder not found.` : `<h3>${path.slice(0, -1)}</h3><br> File not found.`;
          }
        }
        let contentType = fileContent instanceof Blob ? fileContent.type : "text/html";
        response = createResponse(fileContent, contentType);
      }
    }
  }
  
  return response;
}
