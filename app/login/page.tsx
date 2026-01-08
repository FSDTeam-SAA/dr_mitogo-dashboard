"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { signIn, getSession, useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"

export default function LoginPage() {
  const router = useRouter()
  const { status } = useSession()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (status === "authenticated") {
      router.replace("/")
    }
  }, [status, router])

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()

    if (!email.trim() || !password) {
      toast.error("Email and password are required")
      return
    }

    setLoading(true)
    try {
      const result = await signIn("credentials", {
        redirect: false,
        email: email.trim(),
        password,
      })

      if (result?.error) {
        const message = result.error === "CredentialsSignin" ? "Invalid credentials" : result.error
        toast.error(message)
        setLoading(false)
        return
      }

      const session = await getSession()
      if (session?.accessToken) {
        window.localStorage.setItem("adminToken", session.accessToken)
      }

      toast.success("Login successful")
      router.replace("/")
    } catch (error: any) {
      toast.error(error.message || "Login failed")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-secondary/20 px-4">
      <div className="w-full max-w-md bg-white border border-border rounded-xl shadow-lg p-8">
        <h1 className="text-2xl font-bold text-foreground">Admin Login</h1>
        <p className="text-sm text-muted-foreground mt-2">
          Sign in to manage the Casa Rancha platform.
        </p>

        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">Email</label>
            <Input
              type="email"
              placeholder="admin@example.com"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
          </div>
          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">Password</label>
            <Input
              type="password"
              placeholder="Your password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Signing in..." : "Sign In"}
          </Button>
        </form>
      </div>
    </div>
  )
}
