import DynamicWrapper from "./dynamic-wrapper"
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: "Sign In",
  description: "Sign in to your MYFC account to access your facial fitness routines and track your progress."
}

export const dynamic = "force-static"

export default function LoginPage() {
  return <DynamicWrapper />
}

