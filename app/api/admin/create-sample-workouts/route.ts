import { NextResponse } from "next/server"
import { createSampleWorkouts } from "@/scripts/create-sample-workouts"

export async function POST() {
  try {
    await createSampleWorkouts()
    return NextResponse.json({ message: "Sample workouts created successfully" })
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }
} 