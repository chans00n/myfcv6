import type React from "react"
import type { Metadata, Viewport } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Providers } from "./providers"

const inter = Inter({ subsets: ["latin"] })

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
  themeColor: "#a4b61a"
}

export const metadata: Metadata = {
  title: "MYFC Dashboard",
  description: "Dashboard for MYFC application",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "MYFC",
  },
  icons: {
    icon: [
      {
        url: "/placeholder-logo.png",
        sizes: "196x196",
        type: "image/png",
      }
    ],
    apple: [
      {
        url: "/placeholder-logo.png",
        sizes: "180x180",
        type: "image/png",
      }
    ],
    shortcut: [
      {
        url: "/placeholder-logo.png",
        sizes: "32x32",
        type: "image/png",
      }
    ]
  }
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-touch-fullscreen" content="yes" />
        <meta name="apple-mobile-web-app-title" content="MYFC" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover"
        />

        {/* Favicon */}
        <link
          rel="icon"
          href="/placeholder-logo.png"
        />
        <link
          rel="shortcut icon"
          href="/placeholder-logo.png"
        />

        {/* iOS icons */}
        <link
          rel="apple-touch-icon"
          href="/placeholder-logo.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="152x152"
          href="/AppIcon.appiconset/152.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="167x167"
          href="/AppIcon.appiconset/167.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="120x120"
          href="/AppIcon.appiconset/120.png"
        />

        <style>{`
          :root {
            --sat: env(safe-area-inset-top);
            --sar: env(safe-area-inset-right);
            --sab: env(safe-area-inset-bottom);
            --sal: env(safe-area-inset-left);
          }

          html {
            height: 100%;
          }

          body {
            height: 100%;
            -webkit-overflow-scrolling: touch;
            padding: env(safe-area-inset-top) env(safe-area-inset-right) env(safe-area-inset-bottom) env(safe-area-inset-left);
          }

          /* PWA mode specific styles */
          @media all and (display-mode: standalone) {
            body {
              height: 100%;
              overflow: auto;
            }
            
            /* Adjust for mobile nav at bottom */
            .mobile-nav-padding {
              padding-bottom: calc(env(safe-area-inset-bottom) + 60px);
            }
          }
        `}</style>
      </head>
      <body className={inter.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}