"use client"

import { useEffect, useState } from "react"
import FavoritesContent from "./favorites-content"

export default function FavoritesClientPage() {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  if (!isClient) {
    return null
  }

  return <FavoritesContent />
} 