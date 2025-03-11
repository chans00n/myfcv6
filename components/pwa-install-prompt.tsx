"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Download, X } from "lucide-react"

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>
}

export function PWAInstallPrompt() {
  const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [showPrompt, setShowPrompt] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  // Function to detect if the device is mobile
  const isMobileDevice = () => {
    const mobileRegex = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i
    const isMobileUserAgent = mobileRegex.test(navigator.userAgent)
    const isTouchDevice = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0)
    const isNarrowScreen = window.innerWidth <= 768
    
    // Consider it mobile only if it's both a touch device and either has a mobile user agent or narrow screen
    return isTouchDevice && (isMobileUserAgent || isNarrowScreen)
  }

  useEffect(() => {
    // Check if the device is mobile
    const checkMobile = () => {
      const mobile = isMobileDevice()
      setIsMobile(mobile)
      console.log('Device check:', {
        isMobile: mobile,
        userAgent: navigator.userAgent,
        width: window.innerWidth,
        isTouch: ('ontouchstart' in window) || (navigator.maxTouchPoints > 0)
      })
    }

    // Initial check
    checkMobile()

    // Add resize listener
    window.addEventListener('resize', checkMobile)

    const handler = (e: Event) => {
      e.preventDefault()
      setInstallPrompt(e as BeforeInstallPromptEvent)
      // Only show prompt on mobile devices
      if (isMobileDevice()) {
        setShowPrompt(true)
        console.log('Install prompt triggered on mobile device')
      } else {
        console.log('Install prompt suppressed on desktop device')
      }
    }

    window.addEventListener("beforeinstallprompt", handler)

    // Check if already installed
    const isStandalone = window.matchMedia("(display-mode: standalone)").matches
    if (isStandalone) {
      setShowPrompt(false)
      console.log('App is already installed in standalone mode')
    }

    return () => {
      window.removeEventListener("beforeinstallprompt", handler)
      window.removeEventListener('resize', checkMobile)
    }
  }, [])

  const handleInstall = async () => {
    if (!installPrompt) return

    await installPrompt.prompt()
    const choiceResult = await installPrompt.userChoice

    if (choiceResult.outcome === "accepted") {
      console.log("User accepted the install prompt")
    } else {
      console.log("User dismissed the install prompt")
    }

    setInstallPrompt(null)
    setShowPrompt(false)
  }

  // More strict conditions for showing the prompt
  const shouldShowPrompt = showPrompt && isMobile && installPrompt && !window.matchMedia("(display-mode: standalone)").matches

  if (!shouldShowPrompt) {
    console.log('Prompt hidden due to:', {
      showPrompt,
      isMobile,
      hasInstallPrompt: !!installPrompt,
      isStandalone: window.matchMedia("(display-mode: standalone)").matches
    })
    return null
  }

  return (
    <div className="fixed bottom-16 left-0 right-0 mx-auto max-w-sm p-4 bg-card rounded-lg shadow-lg z-50 m-4 border border-border">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h3 className="font-medium mb-1">Install MYFC App</h3>
          <p className="text-sm text-muted-foreground mb-3">
            Install this app on your device for quick access to your workouts, even offline.
          </p>
          <Button onClick={handleInstall} size="sm" className="w-full">
            <Download className="mr-2 h-4 w-4" />
            Install App
          </Button>
        </div>
        <Button variant="ghost" size="icon" className="h-8 w-8 -mt-1 -mr-1" onClick={() => setShowPrompt(false)}>
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </Button>
      </div>
    </div>
  )
}

