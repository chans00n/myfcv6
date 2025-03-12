import { Metadata } from 'next'
import ResetPasswordForm from './reset-password-form'

export const metadata: Metadata = {
  title: "Set New Password",
  description: "Create a new password for your MYFC account to secure your facial fitness journey."
}

export default function ResetPasswordPage() {
  return <ResetPasswordForm />
}

