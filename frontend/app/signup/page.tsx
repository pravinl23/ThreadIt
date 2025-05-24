"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Pencil } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function SignUpPage() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    // Simple validation
    if (password.length < 8) {
      setError("Password must be at least 8 characters long.")
      setIsLoading(false)
      return
    }

    // Simulate account creation
    setTimeout(() => {
      router.push("/dashboard")
    }, 1500)
  }

  return (
    <div className="flex min-h-screen flex-col bg-black text-white">
      <header className="w-full border-b border-zinc-800 bg-black">
        <div className="container flex h-20 items-center">
          <Link href="/" className="flex items-center space-x-2">
            <Pencil className="h-6 w-6" />
            <span className="inline-block font-bold text-xl tracking-tight">ThreadIt</span>
          </Link>
        </div>
      </header>
      <main className="flex-1 flex items-center justify-center py-12">
        <div className="w-full max-w-md px-8">
          <div className="space-y-6">
            <div className="space-y-2 text-center">
              <h1 className="text-3xl font-bold">Create an account</h1>
              <p className="text-zinc-400">Enter your information to get started</p>
            </div>
            {error && (
              <Alert variant="destructive" className="bg-red-900/20 text-red-300 border-red-900">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-white">
                  Full Name
                </Label>
                <Input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="bg-zinc-900 border-zinc-800 text-white"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email" className="text-white">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="bg-zinc-900 border-zinc-800 text-white"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-white">
                  Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="bg-zinc-900 border-zinc-800 text-white"
                />
                <p className="text-xs text-zinc-500">Password must be at least 8 characters long</p>
              </div>
              <Button
                type="submit"
                className="w-full bg-black text-white border border-zinc-800 hover:bg-zinc-900"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent mr-2" />
                ) : null}
                Create Account
              </Button>
            </form>
            <div className="text-center text-sm">
              <p className="text-zinc-400">
                Already have an account?{" "}
                <Link href="/login" className="text-white hover:underline">
                  Sign in
                </Link>
              </p>
            </div>
          </div>
        </div>
      </main>
      <footer className="w-full border-t border-zinc-800 py-6">
        <div className="container flex flex-col items-center justify-center gap-4 text-center">
          <p className="text-center text-sm text-zinc-500">© 2025 ThreadIt. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
