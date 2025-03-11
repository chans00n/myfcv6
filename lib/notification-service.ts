// This service handles push notification subscriptions and permissions

export type NotificationPermissionState = "default" | "granted" | "denied" | "unsupported"

export interface PushSubscription {
  endpoint: string
  expirationTime: number | null
  keys: {
    p256dh: string
    auth: string
  }
}

class NotificationService {
  private readonly vapidPublicKey =
    "BLBz-YrPwMdQM5gunpPUEo9TSILGQwRgNN8_Nnxx8eGNpX9-4RKt0bZUOa1VILn-6cHnRNGdbRck_JUzYpXC-8A"

  constructor() {
    // Initialize service
  }

  /**
   * Check if the browser supports push notifications
   */
  public isPushSupported(): boolean {
    return "serviceWorker" in navigator && "PushManager" in window && "Notification" in window
  }

  /**
   * Get the current notification permission state
   */
  public getPermissionState(): NotificationPermissionState {
    if (!this.isPushSupported()) {
      return "unsupported"
    }

    return Notification.permission as NotificationPermissionState
  }

  /**
   * Request permission to show notifications
   */
  public async requestPermission(): Promise<NotificationPermissionState> {
    if (!this.isPushSupported()) {
      return "unsupported"
    }

    try {
      const permission = await Notification.requestPermission()
      return permission as NotificationPermissionState
    } catch (error) {
      console.error("Error requesting notification permission:", error)
      return "default"
    }
  }

  /**
   * Subscribe to push notifications
   */
  public async subscribeToPush(): Promise<PushSubscription | null> {
    if (!this.isPushSupported()) {
      return null
    }

    try {
      const registration = await navigator.serviceWorker.ready

      // Get the existing subscription if there is one
      let subscription = await registration.pushManager.getSubscription()

      if (subscription) {
        // Already subscribed
        return subscription.toJSON() as unknown as PushSubscription
      }

      // Subscribe the user
      subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: this.urlBase64ToUint8Array(this.vapidPublicKey),
      })

      // Send the subscription to the server
      await this.saveSubscription(subscription)

      return subscription.toJSON() as unknown as PushSubscription
    } catch (error) {
      console.error("Error subscribing to push notifications:", error)
      return null
    }
  }

  /**
   * Unsubscribe from push notifications
   */
  public async unsubscribeFromPush(): Promise<boolean> {
    if (!this.isPushSupported()) {
      return false
    }

    try {
      const registration = await navigator.serviceWorker.ready
      const subscription = await registration.pushManager.getSubscription()

      if (!subscription) {
        return true // Already unsubscribed
      }

      // Unsubscribe from push
      const success = await subscription.unsubscribe()

      if (success) {
        // Remove the subscription from the server
        await this.deleteSubscription(subscription)
      }

      return success
    } catch (error) {
      console.error("Error unsubscribing from push notifications:", error)
      return false
    }
  }

  /**
   * Get the current push subscription if any
   */
  public async getCurrentSubscription(): Promise<PushSubscription | null> {
    if (!this.isPushSupported()) {
      return null
    }

    try {
      const registration = await navigator.serviceWorker.ready
      const subscription = await registration.pushManager.getSubscription()

      if (!subscription) {
        return null
      }

      return subscription.toJSON() as unknown as PushSubscription
    } catch (error) {
      console.error("Error getting current subscription:", error)
      return null
    }
  }

  /**
   * Save the subscription to the server
   */
  private async saveSubscription(subscription: PushSubscription): Promise<boolean> {
    try {
      const response = await fetch("/api/push/subscribe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          subscription: subscription.toJSON(),
        }),
      })

      return response.ok
    } catch (error) {
      console.error("Error saving subscription to server:", error)
      return false
    }
  }

  /**
   * Delete the subscription from the server
   */
  private async deleteSubscription(subscription: PushSubscription): Promise<boolean> {
    try {
      const response = await fetch("/api/push/unsubscribe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          subscription: subscription.toJSON(),
        }),
      })

      return response.ok
    } catch (error) {
      console.error("Error deleting subscription from server:", error)
      return false
    }
  }

  /**
   * Convert a base64 string to a Uint8Array for the applicationServerKey
   */
  private urlBase64ToUint8Array(base64String: string): Uint8Array {
    const padding = "=".repeat((4 - (base64String.length % 4)) % 4)
    const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/")

    const rawData = window.atob(base64)
    const outputArray = new Uint8Array(rawData.length)

    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i)
    }

    return outputArray
  }
}

// Create a singleton instance
const notificationService = new NotificationService()

export default notificationService

