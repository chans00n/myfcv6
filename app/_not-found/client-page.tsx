"use client"

import Link from "next/link"

export default function NotFoundClientPage() {
  return (
    <div className="min-h-screen bg-black text-white font-sans">
      <div className="container flex items-center justify-center min-h-screen p-4">
        <div className="w-full max-w-md p-6 bg-[#1a1a1a] rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Page Not Found</h2>
          <p className="text-gray-400 mb-6">
            The page you're looking for doesn't exist or has been moved.
          </p>
          <Link
            href="/"
            className="inline-flex items-center justify-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  )
} 