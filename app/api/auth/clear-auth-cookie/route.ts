import { cookies } from "next/headers"
import { NextResponse } from "next/server"

export async function POST() {
  try {
    const response = new NextResponse(
      JSON.stringify({ success: true }),
      { status: 200 }
    )

    // Clear Supabase auth cookies
    response.cookies.set({
      name: 'sb-access-token',
      value: '',
      path: '/',
      expires: new Date(0),
      secure: true,
      sameSite: 'lax'
    })
    response.cookies.set({
      name: 'sb-refresh-token',
      value: '',
      path: '/',
      expires: new Date(0),
      secure: true,
      sameSite: 'lax'
    })
    
    return response
  } catch (error) {
    console.error('Error clearing auth cookies:', error)
    return NextResponse.json(
      { error: 'Failed to clear auth cookies' },
      { status: 500 }
    )
  }
} 