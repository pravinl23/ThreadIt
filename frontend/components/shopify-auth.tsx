"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface ShopifyAuthProps {
  className?: string
}

export function ShopifyAuth({ className }: ShopifyAuthProps) {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleLogin = async () => {
    setIsLoading(true)

    // Simulate authentication process
    setTimeout(() => {
      // After successful authentication, redirect to empty page
      router.push("/dashboard")
      setIsLoading(false)
    }, 1500)
  }

  return (
    <Button
      onClick={handleLogin}
      className={cn("gap-2 bg-[#008060] hover:bg-[#006e52] text-white font-medium", className)}
      disabled={isLoading}
    >
      {isLoading ? (
        <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
      ) : (
        <svg
          className="h-4 w-4"
          viewBox="0 0 109.5 124.5"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
          focusable="false"
        >
          <path
            d="M74.7,14.8c0,0-1.4,0.4-3.7,1.1c-0.4-1.3-1-2.8-1.8-4.4c-2.6-5-6.5-7.7-11.1-7.7c0,0,0,0,0,0c-0.3,0-0.6,0-1,0.1
            c-0.1-0.2-0.3-0.3-0.4-0.5c-2-2.2-4.6-3.2-7.7-3.1c-6,0.2-12,4.5-16.8,12.2c-3.4,5.4-6,12.2-6.7,17.5c-6.9,2.1-11.7,3.6-11.8,3.7
            c-3.5,1.1-3.6,1.2-4,4.5C9.2,40.6,0,111.5,0,111.5l75.6,13V14.8C75.2,14.8,75,14.8,74.7,14.8z M57.2,20.8
            c-4,1.2-8.4,2.6-12.7,3.9c1.2-4.7,3.6-9.4,6.4-12.5c1.1-1.1,2.6-2.4,4.3-3.1C56.9,12.5,57.4,17.1,57.2,20.8z M45.7,8.8
            c1.4,0,2.6,0.3,3.6,0.9c-1.6,0.8-3.2,2.1-4.7,3.6c-3.8,4.1-6.7,10.5-7.9,16.6c-3.6,1.1-7.2,2.2-10.5,3.2
            C28.2,23.3,36.8,9.1,45.7,8.8z M37.2,55.1c0.4,6.4,17.3,7.8,18.3,22.9c0.7,11.9-6.3,20-16.4,20.6c-12.2,0.8-18.9-6.4-18.9-6.4
            l2.6-11c0,0,6.7,5.1,12.1,4.7c3.5-0.2,4.8-3.1,4.6-5.1c-0.5-8.4-14.3-7.9-15.2-21.7C23.5,45.5,33.5,35.3,48.7,34.4
            c5.6-0.3,8.4,1.1,8.4,1.1l-3.3,12.3c0,0-3.7-1.7-8.1-1.4C40.4,46.8,37.1,49.6,37.2,55.1z M63.3,9.9c1.4,0.4,2.6,1.3,3.7,2.8
            c1.7,2.5,2.8,6,3.5,8.5c-2.1,0.7-4.5,1.4-7.1,2.2C63.3,19.2,63.2,14.5,63.3,9.9z"
            fill="currentColor"
          />
          <path
            d="M109.5,124.5l-34.2-9.3l-26.7-73.2l11.9-2.5c0,0,9.9,33.7,10,34.1c0.1,0.3,0.3,0.3,0.5,0.2c0.2-0.1,2.8-0.8,5.1-1.4
            c3-0.8,4.3-1.3,4.3-1.3s-7.7-26.2-8-27.2c-0.3-1,0.3-1.5,1-1.7c0.7-0.2,10.2-2.8,11.7-3.2c1.5-0.4,2.4-0.8,5.1,1.2
            c2.6,2,9.5,11.9,9.5,11.9L109.5,124.5z"
            fill="currentColor"
          />
        </svg>
      )}
      Sign in with Shopify
    </Button>
  )
}
