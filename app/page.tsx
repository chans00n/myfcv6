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
    <div className="min-h-screen bg-background flex flex-col items-center justify-between px-4 py-8 md:py-16">
      {/* Logo Section */}
      <div className="w-full flex justify-center mb-6 md:mb-8">
        <div className="relative w-20 h-20 md:w-24 md:h-24">
          <Image
            src="/logo.png"
            alt="MYFC Logo"
            fill
            className="object-contain"
            priority
          />
        </div>
      </div>

      {/* Main Image Section */}
      <div className="w-full max-w-2xl mx-auto mb-6 md:mb-8">
        <div className="relative w-full aspect-[4/3]">
          <Image
            src="/main-home.png"
            alt="MYFC Home Illustration"
            fill
            className="object-contain"
            priority
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 75vw, 800px"
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-col items-center justify-center text-center mb-8 md:mb-12">
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-2 tracking-tight">
          Elevate Your Routine
        </h1>
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-muted-foreground">
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

