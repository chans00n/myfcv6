import { Metadata } from 'next'
import SignupForm from './signup-form'

export const metadata: Metadata = {
  title: "Create Account",
  description: "Create your MYFC account and start your facial fitness journey today."
}

export default function SignupPage() {
  return <SignupForm />
}

