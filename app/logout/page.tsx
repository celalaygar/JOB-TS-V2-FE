"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useDispatch } from "react-redux"
import { logout } from "@/lib/redux/features/auth-slice"
import { Loader2 } from "lucide-react"

export default function LogoutPage() {
  const router = useRouter()
  const dispatch = useDispatch()

  useEffect(() => {
    // Dispatch logout action
    dispatch(logout())

    // Redirect to login page after a short delay
    const timer = setTimeout(() => {
      router.push("/")
    }, 1500)

    return () => clearTimeout(timer)
  }, [dispatch, router])

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
      <h1 className="text-xl font-semibold">Logging out...</h1>
      <p className="text-muted-foreground mt-2">You will be redirected shortly.</p>
    </div>
  )
}
