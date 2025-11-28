"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export const useAdminAuth = () => {
  const router = useRouter()

  const checkAdminAuth = () => {
    try {
      const adminSession = localStorage.getItem("admin_session")
      
      if (!adminSession) {
        router.push("/admin/login")
        return false
      }

      const session = JSON.parse(adminSession)
      const sessionAge = Date.now() - session.timestamp
      const maxAge = 24 * 60 * 60 * 1000 // 24 hours in milliseconds
      
      if (sessionAge > maxAge) {
        localStorage.removeItem("admin_session")
        router.push("/admin/login")
        return false
      }

      return true
    } catch (error) {
      console.error("Admin auth error:", error)
      router.push("/admin/login")
      return false
    }
  }

  const signOut = () => {
    localStorage.removeItem("admin_session")
    router.push("/admin/login")
  }

  const isAuthenticated = () => {
    try {
      const adminSession = localStorage.getItem("admin_session")
      
      if (!adminSession) {
        return false
      }

      const session = JSON.parse(adminSession)
      const sessionAge = Date.now() - session.timestamp
      const maxAge = 24 * 60 * 60 * 1000 // 24 hours
      
      if (sessionAge > maxAge) {
        localStorage.removeItem("admin_session")
        return false
      }

      return true
    } catch (error) {
      return false
    }
  }

  return {
    checkAdminAuth,
    signOut,
    isAuthenticated
  }
}

// Admin route protection component
export const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  const { checkAdminAuth } = useAdminAuth()

  useEffect(() => {
    checkAdminAuth()
  }, [])

  return <>{children}</>
}