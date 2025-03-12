import { Metadata } from 'next'
import ForgotPasswordForm from './forgot-password-form'

export const metadata: Metadata = {
  title: "Reset Password",
  description: "Reset your MYFC account password to regain access to your facial fitness routines."
}

export default function ForgotPasswordPage() {
  return <ForgotPasswordForm />
}

