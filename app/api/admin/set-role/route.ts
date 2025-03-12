import { NextResponse } from "next/server"
import { setAdminRole } from "@/app/actions/admin"

export async function POST(request: Request) {
  try {
    const { userId } = await request.json()
    
    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      )
    }

    const result = await setAdminRole(userId)
    return NextResponse.json(result)
  } catch (error: any) {
    console.error("Error setting admin role:", error)
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }
} 