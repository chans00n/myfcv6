"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Loader2 } from "lucide-react"
import { useAuth } from "@/context/auth-context"
import { getSupabaseBrowserClient } from "@/lib/supabase/client"
import type { Database } from "@/types/supabase"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"

const loginFormSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(8, { message: "Password must be at least 8 characters" }),
  rememberMe: z.boolean().default(false),
})

type LoginFormValues = z.infer<typeof loginFormSchema>

export default function LoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isLoading, setIsLoading] = useState(false)
  const { signIn } = useAuth()
  const supabase = getSupabaseBrowserClient()

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  })

  useEffect(() => {
    const verified = searchParams.get("verified")
    if (verified === "success") {
      toast.success("Email verified successfully!", {
        description: "You can now log in to your account.",
      })
    } else if (verified === "pending") {
      toast.info("Please verify your email", {
        description: "Check your inbox for a verification link.",
      })
    }
  }, [searchParams])

  async function onSubmit(data: LoginFormValues) {
    setIsLoading(true)

    try {
      const redirectTo = searchParams.get("redirectTo")
      console.log('Login - Starting sign in process')
      
      const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      })
      
      if (signInError) throw signInError
      
      console.log('Login - Sign in successful, checking session')
      const { data: { user } } = await supabase.auth.getUser()
      console.log('Login - User data:', {
        id: user?.id,
        email: user?.email,
        metadata: user?.user_metadata,
        role: user?.user_metadata?.role
      })
      
      // Check if user is trying to access admin routes
      if (redirectTo?.startsWith('/admin')) {
        const userRole = user?.user_metadata?.role
        console.log('Login - Checking admin access:', {
          redirectTo,
          userRole,
          hasMetadata: !!user?.user_metadata
        })
        
        if (userRole !== 'admin') {
          console.log('Login - Access denied: not an admin')
          toast.error("Access denied", {
            description: "You do not have permission to access the admin area.",
          })
          router.push('/')
          return
        }
      }
      
      console.log('Login - Redirecting to:', redirectTo || "/dashboard")
      router.push(redirectTo || "/dashboard")
      toast.success("Welcome back!", {
        description: "Successfully signed in to your account.",
      })
    } catch (error: any) {
      console.error("Login error:", error)
      toast.error("Failed to sign in", {
        description: error?.message || "Please check your credentials and try again.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
      <div className="flex flex-col space-y-2 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">Welcome back</h1>
        <p className="text-sm text-muted-foreground">Enter your credentials to sign in to your account</p>
      </div>

      <Card>
        <CardContent className="pt-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="name@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="••••••••" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex items-center justify-between">
                <FormField
                  control={form.control}
                  name="rememberMe"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center space-x-2 space-y-0">
                      <FormControl>
                        <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                      <FormLabel className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                        Remember me
                      </FormLabel>
                    </FormItem>
                  )}
                />
                <Link href="/auth/forgot-password" className="text-sm font-medium text-primary hover:underline">
                  Forgot password?
                </Link>
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  "Sign in"
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex flex-col">
          <div className="mt-2 text-center text-sm">
            Don&apos;t have an account?{" "}
            <Link href="/auth/signup" className="font-medium text-primary hover:underline">
              Sign up
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
} 