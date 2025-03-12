import DynamicWrapper from "./_not-found/dynamic-wrapper"
import { Metadata, Viewport } from "next"

export const dynamic = "force-static"

export const viewport: Viewport = {
  themeColor: "#000000",
  width: "device-width",
  initialScale: 1
}

export const metadata: Metadata = {
  title: "Page Not Found - MYFC",
  description: "The page you're looking for doesn't exist or has been moved."
}

export default function NotFound() {
  return <DynamicWrapper />
} 