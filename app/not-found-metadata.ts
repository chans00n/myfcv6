import { Metadata, Viewport } from 'next'

export const metadata: Metadata = {
  title: 'Page Not Found - MYFC',
  description: 'The page you are looking for could not be found.',
}

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#000000' },
  ],
  width: 'device-width',
  initialScale: 1,
} 