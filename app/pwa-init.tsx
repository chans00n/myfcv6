"use client"

import { useEffect } from "react"
import { registerServiceWorker } from "./pwa"
import notificationService from "@/lib/notification-service"

export function PWAInitializer() {
  useEffect(() => {
    // Register service worker
    registerServiceWorker()

    // Check if we should auto-request notification permission
    // This is a good practice to do after user interaction
    const shouldRequestPermission = localStorage.getItem("should-request-notifications")
    if (shouldRequestPermission === "true") {
      const permissionState = notificationService.getPermissionState()

      if (permissionState === "default") {
        // Wait a bit before requesting to avoid overwhelming the user
        setTimeout(() => {
          notificationService.requestPermission().then((permission) => {
            if (permission === "granted") {
              notificationService.subscribeToPush()
            }
            // Clear the flag regardless of the outcome
            localStorage.removeItem("should-request-notifications")
          })
        }, 3000)
      } else {
        // Clear the flag if we already have a permission state
        localStorage.removeItem("should-request-notifications")
      }
    }
  }, [])

  return null
}

