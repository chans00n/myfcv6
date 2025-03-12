"use client"

import dynamic from "next/dynamic"

const FavoritesClientPage = dynamic(() => import("./client-page"), {
  ssr: false,
  loading: () => null,
})

export default function ClientWrapper({ fallback }: { fallback: React.ReactNode }) {
  return <FavoritesClientPage />
} 