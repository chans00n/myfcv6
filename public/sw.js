const CACHE_NAME = "myfc-cache-v1"
const urlsToCache = [
  "/",
  "/dashboard",
  "/workouts",
  "/movements",
  "/favorites",
  "/settings",
  "/offline",
  "/manifest.json",
]

// Install a service worker
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => {
        console.log("Opened cache")
        // Try to cache each URL, but don't fail if some are missing
        return Promise.allSettled(
          urlsToCache.map((url) =>
            fetch(url)
              .then((response) => {
                if (!response.ok) {
                  throw new Error(`Failed to fetch ${url}`)
                }
                return cache.put(url, response)
              })
              .catch((error) => {
                console.warn(`Caching failed for ${url}:`, error)
                // Continue despite the error
                return Promise.resolve()
              }),
          ),
        )
      })
      .then(() => self.skipWaiting()), // Force activation
  )
})

// Cache and return requests
self.addEventListener("fetch", (event) => {
  // Skip cross-origin requests
  if (!event.request.url.startsWith(self.location.origin)) {
    return
  }

  event.respondWith(
    caches.match(event.request).then((response) => {
      // Cache hit - return response
      if (response) {
        return response
      }

      // Clone the request
      const fetchRequest = event.request.clone()

      return fetch(fetchRequest)
        .then((response) => {
          // Check if we received a valid response
          if (!response || response.status !== 200 || response.type !== "basic") {
            return response
          }

          // Clone the response
          const responseToCache = response.clone()

          caches.open(CACHE_NAME).then((cache) => {
            // Don't cache API requests or other dynamic content
            if (!event.request.url.includes("/api/")) {
              cache.put(event.request, responseToCache)
            }
          })

          return response
        })
        .catch(() => {
          // If the network is unavailable and the requested resource is an HTML page,
          // serve the offline page
          if (event.request.headers.get("Accept")?.includes("text/html")) {
            return caches.match("/offline")
          }

          // For other resources, just fail
          return new Response("Network error", {
            status: 408,
            headers: { "Content-Type": "text/plain" },
          })
        })
    }),
  )
})

// Update a service worker
self.addEventListener("activate", (event) => {
  const cacheWhitelist = [CACHE_NAME]
  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheWhitelist.indexOf(cacheName) === -1) {
              return caches.delete(cacheName)
            }
          }),
        )
      })
      .then(() => self.clients.claim()), // Take control of all clients
  )
})

// Handle push events for notifications
self.addEventListener("push", (event) => {
  let notificationData = {}

  try {
    notificationData = event.data.json()
  } catch (e) {
    notificationData = {
      title: "New Notification",
      body: event.data ? event.data.text() : "No payload",
      icon: "https://raw.githubusercontent.com/chans00n/myfacecoach/main/public/AppIcon.appiconset/196.png",
    }
  }

  const title = notificationData.title || "MYFC Notification"
  const options = {
    body: notificationData.body || "You have a new notification",
    icon:
      notificationData.icon ||
      "https://raw.githubusercontent.com/chans00n/myfacecoach/main/public/AppIcon.appiconset/196.png",
    badge: "https://raw.githubusercontent.com/chans00n/myfacecoach/main/public/AppIcon.appiconset/48.png",
    data: {
      url: notificationData.url || "/",
      actionId: notificationData.actionId,
    },
    actions: notificationData.actions || [
      {
        action: "view",
        title: "View",
      },
      {
        action: "dismiss",
        title: "Dismiss",
      },
    ],
    vibrate: [100, 50, 100],
    timestamp: notificationData.timestamp || Date.now(),
  }

  event.waitUntil(self.registration.showNotification(title, options))
})

// Handle notification click events
self.addEventListener("notificationclick", (event) => {
  event.notification.close()

  const notificationData = event.notification.data
  let url = "/"

  if (event.action === "view" && notificationData.url) {
    url = notificationData.url
  } else if (event.action === "dismiss") {
    return // Do nothing, just close the notification
  } else if (notificationData.url) {
    // Default action when clicking the notification body
    url = notificationData.url
  }

  // Record analytics for the notification click
  const analyticsData = {
    action: event.action || "default",
    notificationId: notificationData.actionId,
    timestamp: Date.now(),
  }

  event.waitUntil(
    Promise.all([
      // Open the target URL
      clients.openWindow(url),

      // Send analytics data
      fetch("/api/notification-analytics", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(analyticsData),
      }).catch((err) => console.error("Failed to send analytics", err)),
    ]),
  )
})

// Handle notification close events (without user interaction)
self.addEventListener("notificationclose", (event) => {
  const notificationData = event.notification.data

  // Record analytics for the notification dismissal
  if (notificationData && notificationData.actionId) {
    const analyticsData = {
      action: "dismissed",
      notificationId: notificationData.actionId,
      timestamp: Date.now(),
    }

    fetch("/api/notification-analytics", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(analyticsData),
    }).catch((err) => console.error("Failed to send analytics", err))
  }
})

// Handle push subscription change
self.addEventListener("pushsubscriptionchange", (event) => {
  event.waitUntil(
    fetch("/api/push/update-subscription", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        oldSubscription: event.oldSubscription ? event.oldSubscription.toJSON() : null,
        newSubscription: event.newSubscription ? event.newSubscription.toJSON() : null,
      }),
    }),
  )
})

