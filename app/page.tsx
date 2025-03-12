import Link from 'next/link'
import Image from 'next/image'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: "MYFC - Elevate Your Routine with Facial Fitness",
  description: "Transform your facial fitness routine with MYFC. Track, manage, and optimize your facial exercises for better results."
}

export const dynamic = "force-static"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-between px-4 py-16">
      {/* Logo Section */}
      <div className="w-full flex justify-center mb-8">
        <div className="relative w-24 h-24">
          <Image
            src="/logo.png"
            alt="MYFC Logo"
            fill
            className="object-contain"
            priority
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-2 tracking-tight">
        Elevate Your Routine
        </h1>
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-muted-foreground">
        with Facial Fitness
        </h1>
      </div>

      {/* Button Section */}
      <div className="w-full max-w-sm space-y-4">
        <Link 
          href="/auth/signup"
          className="w-full bg-primary text-primary-foreground hover:bg-primary/90 inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-12 px-4 py-2"
        >
          Create Account
        </Link>
        <Link
          href="/auth/login"
          className="w-full bg-secondary text-secondary-foreground hover:bg-secondary/90 inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-12 px-4 py-2"
        >
          Sign in
        </Link>
      </div>
    </div>
  )
}

