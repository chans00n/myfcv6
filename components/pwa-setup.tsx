"use client"

import { useEffect } from "react"

export function PWASetup() {
  useEffect(() => {
    // This script runs only on the client side
    if (typeof window !== "undefined") {
      // Check if the app is in standalone mode (PWA)
      const isInStandaloneMode =
        window.matchMedia("(display-mode: standalone)").matches ||
        (window.navigator as any).standalone ||
        document.referrer.includes("android-app://")

      if (isInStandaloneMode) {
        // Add a class to the body when running as PWA
        document.body.classList.add("pwa-mode")

        // Force fullscreen on iOS
        if (/iPad|iPhone|iPod/.test(navigator.userAgent)) {
          document.documentElement.style.height = "100vh"
          document.body.style.height = "100vh"
          document.body.style.position = "fixed"
          document.body.style.overflow = "hidden"
          document.body.style.width = "100%"
        }
      }
    }
  }, [])

  return null
}

