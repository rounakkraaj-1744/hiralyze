"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"

interface AuthLinkProps {
  href: string
  requiredRole: 'candidate' | 'recruiter' | 'admin' | 'talent'
  children: React.ReactNode
  className?: string
  variant?: "default" | "outline" | "secondary" | "ghost" | "link" | "destructive" | null | undefined
}

export default function AuthLink({ href, requiredRole, children, className, variant }: AuthLinkProps) {
  const [user, setUser] = useState<{ role: string } | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users/profile`, {
          credentials: 'include',
        })
        if (res.ok) {
          const data = await res.json()
          setUser(data.data.user)
        }
      } catch (error) {
        // Not logged in, which is fine.
      } finally {
        setIsLoading(false)
      }
    }
    fetchUser()
  }, [])

  const handleClick = () => {
    if (isLoading) {
      return
    }

    if (!user) {
      router.push('/auth')
      return
    }

    if (user.role === requiredRole) {
      router.push(href)
    } else {
      toast({
        title: "Access Denied",
        description: `You are logged in as a ${user.role}. Please use the correct portal.`,
        variant: "destructive",
      })
      // Optional: redirect to their correct dashboard
      if (user.role === 'candidate') {
        router.push('/candidate-portal')
      } else {
        router.push('/talent-manager')
      }
    }
  }

  return (
    <Button onClick={handleClick} className={className} variant={variant} disabled={isLoading}>
      {isLoading ? "Loading..." : children}
    </Button>
  )
}
