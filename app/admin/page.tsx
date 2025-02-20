"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { AdminDashboard } from "@/components/admin-dashboard"
import { User, Lock } from "lucide-react"

export default function AdminPage() {
  const [adminLoggedIn, setAdminLoggedIn] = useState(false)
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")

  const handleLogin = () => {
    // TODO: Implement proper authentication
    if (username === "admin" && password === "admin123") {
      setAdminLoggedIn(true)
    } else {
      alert("Invalid credentials")
    }
  }

  if (!adminLoggedIn) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-2xl">Admin Login</CardTitle>
            <CardDescription>Enter your credentials to access the admin dashboard</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-2">
              <User className="h-4 w-4 text-gray-500" />
              <Input placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
            </div>
            <div className="flex items-center space-x-2">
              <Lock className="h-4 w-4 text-gray-500" />
              <Input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button onClick={handleLogin} className="w-full">
              Login
            </Button>
          </CardFooter>
        </Card>
      </div>
    )
  }

  return <AdminDashboard adminLoggedIn={adminLoggedIn} setAdminLoggedIn={setAdminLoggedIn} />
}
