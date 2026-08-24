var CACHE = "regua-nivel-v1";
var ARQ = ["./", "./index.html", "./manifest.webmanifest",
           "./icon-180.png", "./icon-192.png", "./icon-512.png"];

self.addEventListener("install", function(e){
  self.skipWaiting();
  e.waitUntil(caches.open(CACHE).then(function(c){ return c.addAll(ARQ).catch(function(){}); }));
});

self.addEventListener("activate", function(e){
  e.waitUntil(caches.keys().then(function(ks){
    return Promise.all(ks.map(function(k){ return k === CACHE ? null : caches.delete(k); }));
  }).then(function(){ return self.clients.claim(); }));
});

self.addEventListener("fetch", function(e){
  if(e.request.method !== "GET") return;
  e.respondWith(
    fetch(e.request).then(function(res){
      var copia = res.clone();
      caches.open(CACHE).then(function(c){ c.put(e.request, copia); });
      return res;
    }).catch(function(){
      return caches.match(e.request).then(function(r){
        return r || caches.match("./index.html");
      });
    })
  );
});
