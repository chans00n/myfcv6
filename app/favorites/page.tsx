import { Suspense } from "react"
import { default as dynamicImport } from "next/dynamic"

// Move dynamic config to a separate variable
const config = {
  dynamic: "force-static",
} as const
export const dynamic = config.dynamic

const LoadingFallback = () => (
  <div className="min-h-screen bg-background">
    <div className="container flex items-center justify-center min-h-[100vh]">
      <div className="w-full max-w-md p-6 text-center">
        <div className="animate-pulse">
          <div className="h-8 w-32 bg-muted rounded mb-4 mx-auto"></div>
          <div className="h-4 w-48 bg-muted rounded mb-8 mx-auto"></div>
          <div className="space-y-3">
            <div className="h-20 bg-muted rounded"></div>
            <div className="h-20 bg-muted rounded"></div>
            <div className="h-20 bg-muted rounded"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
)

// Use the imported dynamic function
const ClientPage = dynamicImport(() => import("./client-page"), {
  loading: LoadingFallback,
})

export default function FavoritesPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <ClientPage />
    </Suspense>
  )
}

