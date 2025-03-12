"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"

export default function AdminSetupPage() {
  const [isLoading, setIsLoading] = useState(false)

  const setAdminRole = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/admin/set-role', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          userId: 'a18fa4ce-c0ba-4a0b-b9ff-5f245537ab42'
        })
      })

      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to set admin role')
      }

      toast.success('Admin role set successfully')
      console.log('Response:', data)
    } catch (error: any) {
      toast.error('Failed to set admin role', {
        description: error.message
      })
      console.error('Error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container py-10">
      <h1 className="text-2xl font-bold mb-8">Admin Setup</h1>
      <Button 
        onClick={setAdminRole} 
        disabled={isLoading}
      >
        {isLoading ? 'Setting admin role...' : 'Set Admin Role'}
      </Button>
    </div>
  )
} 