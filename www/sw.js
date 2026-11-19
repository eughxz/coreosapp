// Core OS service worker: a página sempre vem da rede (cache só sem internet)
const C='coreos-v3';
self.addEventListener('install',e=>{self.skipWaiting()});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==C).map(x=>caches.delete(x)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{const r=e.request;if(r.method!=='GET'||r.url.includes('supabase.co')||r.url.includes('googleapis.com'))return;
const nav=r.mode==='navigate'||/\/(index\.html)?(\?|$)/.test(new URL(r.url).pathname+(new URL(r.url).search?'?':''));
e.respondWith(fetch(nav?new Request(r.url,{cache:'no-store',credentials:r.credentials}):r).then(res=>{if(res.ok||res.type==='opaque'){const cp=res.clone();caches.open(C).then(c=>c.put(nav?'./index.html':r,cp))}return res}).catch(()=>caches.match(nav?'./index.html':r).then(m=>m||caches.match('./index.html'))))});
