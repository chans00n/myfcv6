"use client"

import Link from "next/link"

export default function NotFoundClientPage() {
  return (
    <html>
      <head>
        <title>Page Not Found - MYFC</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body>
        <div style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '1rem',
          backgroundColor: '#000',
          color: '#fff',
          fontFamily: 'system-ui, -apple-system, sans-serif'
        }}>
          <div style={{
            maxWidth: '28rem',
            width: '100%',
            padding: '1.5rem',
            backgroundColor: '#1a1a1a',
            borderRadius: '0.5rem',
            boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
          }}>
            <h2 style={{
              fontSize: '1.5rem',
              fontWeight: '600',
              marginBottom: '1rem'
            }}>Page Not Found</h2>
            <p style={{
              color: '#9ca3af',
              marginBottom: '1.5rem'
            }}>The page you're looking for doesn't exist or has been moved.</p>
            <Link href="/" style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '0.5rem 1rem',
              backgroundColor: '#3b82f6',
              color: '#fff',
              borderRadius: '0.375rem',
              fontSize: '0.875rem',
              fontWeight: '500',
              textDecoration: 'none'
            }}>
              Back to Home
            </Link>
          </div>
        </div>
      </body>
    </html>
  )
} 