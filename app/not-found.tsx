import Link from "next/link"

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container flex items-center justify-center min-h-[100vh]">
        <div className="w-full max-w-md p-6 bg-card text-card-foreground rounded-lg shadow-sm">
          <div className="space-y-1.5 p-6">
            <h2 className="text-2xl font-semibold leading-none tracking-tight">Page Not Found</h2>
          </div>
          <div className="p-6">
            <p className="text-muted-foreground">The page you're looking for doesn't exist or has been moved.</p>
          </div>
          <div className="flex items-center p-6">
            <Link
              href="/"
              className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
} 