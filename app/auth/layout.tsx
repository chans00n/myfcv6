import type React from "react"
import { Inter } from "next/font/google"
import Image from "next/image"
import Link from "next/link"

const inter = Inter({ subsets: ["latin"] })

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="mb-8 flex items-center justify-center">
        <Link href="/">
          <div className="flex h-16 w-16 items-center justify-center rounded-md bg-black shadow-lg">
            <Image
              src="https://framerusercontent.com/images/rZbcSd5yZL0dqzWGUJ9UpRh2ToY.jpg"
              alt="MYFC Logo"
              width={32}
              height={64}
              className="w-14 h-16 object-contain"
            />
          </div>
        </Link>
      </div>
      {children}
    </div>
  )
}

