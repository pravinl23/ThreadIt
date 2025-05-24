"use client"

import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface AuthButtonProps {
  className?: string
}

export function LoginButton({ className }: AuthButtonProps) {
  const router = useRouter()

  const handleLogin = () => {
    router.push("/login")
  }

  return (
    <Button
      onClick={handleLogin}
      variant="outline"
      className={cn("bg-white border-white text-black hover:bg-zinc-200 hover:border-zinc-200", className)}
    >
      Log In
    </Button>
  )
}

export function SignUpButton({ className }: AuthButtonProps) {
  const router = useRouter()

  const handleSignUp = () => {
    router.push("/signup")
  }

  return (
    <Button
      onClick={handleSignUp}
      className={cn("bg-black text-white border border-zinc-800 hover:bg-zinc-900", className)}
    >
      Sign Up
    </Button>
  )
}
