// Chrome's currently missing some useful cache methods,
// this polyfill adds them.
// importScripts('serviceworker-cache-polyfill.js');

// Service Worker Toolbox
// importScripts('js/sw-toolbox-master/lib/sw-toolbox.js');
importScripts('js/sw-toolbox/sw-toolbox.js');

// Files to precache
const precacheFiles = [
    './',
    './index.html',
    './js/main.js',
    './css/styles.css'
    // ,  './js/idb.js',
    // './newsdetail.html',
    //  './logging.js',
    // './data/newsitems.json',
    // './data/newsitemdetails.json'
];
 toolbox.precache(precacheFiles);

 console.log('Started', self);
self.addEventListener('install', function(event) {
  self.skipWaiting();
  console.log('Installed', event);
});
self.addEventListener('activate', function(event) {
  console.log('Activated', event);
});


self.addEventListener('fetch', (event) => {
    // Respond to the document with what is returned from 
    event.respondWith(
          caches.match(event.request).then((response) => {
            if ( response ) return response
            return  fetch(event.request)
        })
     ); 
});



self.addEventListener('push', function(event) {
  console.log('[Service Worker] Push Message Received.');
  console.log(`[Service Worker] Push had this data: "${event.data.text()}"`);

  const title = 'Latest News on NewsReader';
  const options = {
    body: 'Click to read latest article',
    icon: 'images/icon.png',
    badge: 'images/badge.png'
  };

  event.waitUntil(self.registration.showNotification(title, options));
});


self.addEventListener('notificationclick', function (event) {
    console.log('Notification click: tag', event.notification.tag);
    event.notification.close();
    const url = './latest.html';
    event.waitUntil(
        clients.matchAll({ type: 'window'}).then(function (windowClients) {
            for (let i = 0; i < windowClients.length; i++) {
                const client = windowClients[i];
                if (client.url === url && 'focus' in client) return client.focus()
            }
            if (clients.openWindow) return clients.openWindow(url)
        })
    );
});
