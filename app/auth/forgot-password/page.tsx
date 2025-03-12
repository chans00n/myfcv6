"use client"

import { useState } from "react"
import Link from "next/link"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { ArrowLeft, Loader2 } from "lucide-react"
import { Metadata } from 'next'
import ForgotPasswordForm from './forgot-password-form'

const forgotPasswordSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
})

type ForgotPasswordValues = z.infer<typeof forgotPasswordSchema>

export const metadata: Metadata = {
  title: "Reset Password",
  description: "Reset your MYFC account password to regain access to your facial fitness routines."
}

export default function ForgotPasswordPage() {
  return <ForgotPasswordForm />
}

