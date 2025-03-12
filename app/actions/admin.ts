"use server"

export async function setAdminRole(userId: string) {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_SUPABASE_URL}/auth/v1/admin/users/${userId}`,
    {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`
      },
      body: JSON.stringify({
        user_metadata: {
          role: 'admin'
        }
      })
    }
  )

  if (!response.ok) {
    const error = await response.json()
    throw new Error(`Failed to set admin role: ${JSON.stringify(error)}`)
  }

  return response.json()
} 