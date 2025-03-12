"use client"

import { useEffect, useState } from "react"
import dynamic from "next/dynamic"

const FavoritesClientPage = dynamic(() => import("./client-page"), {
  loading: () => null,
})

export default function ClientWrapper({ fallback }: { fallback: React.ReactNode }) {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  if (!isClient) {
    return fallback
  }

  return <FavoritesClientPage />
} 