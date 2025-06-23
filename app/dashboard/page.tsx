'use client'

import { useAuth } from "@/contexts/AuthContext"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { useRouter } from "next/navigation"

export default function DashboardPage() {
  const { user, logout } = useAuth()
  const router = useRouter()

  const handleLogout = () => {
    logout()
    router.push('/login')
  }

  if (!user) {
    return (
      <div className="flex min-h-svh w-full items-center justify-center p-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Access Denied</h1>
          <p className="mt-2 text-gray-600">Please log in to access the dashboard.</p>
          <Button 
            onClick={() => router.push('/login')} 
            className="mt-4"
          >
            Go to Login
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle>Welcome to Your Dashboard</CardTitle>
            <CardDescription>
              You have successfully logged in to your account
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">User Information</h3>
              <div className="space-y-1 text-sm">
                <p><span className="font-medium">Username:</span> {user.username}</p>
                <p><span className="font-medium">Email:</span> {user.email}</p>
                <p><span className="font-medium">User ID:</span> {user.id}</p>
              </div>
            </div>
            
            <div className="pt-4 border-t">
              <Button onClick={handleLogout} variant="outline">
                Logout
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}