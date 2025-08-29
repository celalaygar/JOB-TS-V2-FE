"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useDispatch, useSelector } from "react-redux"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Home, Loader2 } from "lucide-react"
import { login, clearError } from "@/lib/redux/features/auth-slice"
import { useLanguage } from "@/lib/i18n/context"
import { signIn } from 'next-auth/react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ForgotPasswordDialog } from "@/components/users/forgot-password-dialog"

export default function LoginPage() {
  const { language, translations, setLanguage } = useLanguage()
  const router = useRouter()
  const dispatch = useDispatch()
  //const { loading, error } = useSelector((state: any) => state.auth)
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [openForgotPasswordDialog, setOpenForgotPasswordDialog] = useState(false);

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [rememberMe, setRememberMe] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // dispatch(login(email, password) as any)

    // // Redirect to dashboard after successful login
    // // In a real app, this would happen after the async action completes
    setTimeout(() => {
      router.push("/dashboard")
    }, 1500)
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true)
    try {
      const res = await signIn("credentials", {
        email,
        password,
        redirect: false
      });
      if (res?.error !== null) {
        console.log("res?.error ", res?.error)
        setError("Invalid email or password");
      } else {
        router.push("/dashboard")
      }
    } catch (error) {
      console.log(error)
      setError("Invalid email or password");
    }
    setLoading(false)

  };


  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value)
    if (error) dispatch(clearError())
  }

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value)
    if (error) dispatch(clearError())
  }
  const handleLanguageChange = (value: string) => {
    setLanguage(value as "en" | "tr")
  }
  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--fixed-background)] p-4">
      <div className="w-full max-w-xl">
        <div className="relative mb-8">
          <div className="text-center logoDiv">
            <Link href="/" className="inline-flex items-center text-2xl font-bold text-[var(--fixed-primary)]">
              <Home className="mr-2 h-6 w-6" />
              Issue Tracker
            </Link>
            <p className="text-[var(--fixed-sidebar-muted)] mt-2">{translations.register.subtitle}</p>
          </div>

          <div className=" mt-4 sm:mt-2 flex justify-center sm:absolute sm:top-0 sm:right-0 languageDiv" >
            <Select value={language} onValueChange={handleLanguageChange}>
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="Language" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en">
                  <div className="flex items-center">
                    <span className="mr-2">🇺🇸</span> English
                  </div>
                </SelectItem>
                <SelectItem value="tr">
                  <div className="flex items-center">
                    <span className="mr-2">🇹🇷</span> Türkçe
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>


        <Card>
          <CardHeader>
            <CardTitle>Sign In</CardTitle>
            <CardDescription>Enter your email and password to access your account</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin}>
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="name@example.com"
                    value={email}
                    onChange={handleEmailChange}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password">Password</Label>
                    <Link href="#" className="text-sm text-[var(--fixed-primary)]"
                      onClick={() => setOpenForgotPasswordDialog(true)}
                    >
                      Forgot password?
                    </Link>
                  </div>
                  <Input id="password" type="password" value={password} onChange={handlePasswordChange} required />
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="remember"
                    checked={rememberMe}
                    onCheckedChange={(checked) => setRememberMe(!!checked)}
                  />
                  <Label htmlFor="remember" className="text-sm font-normal">
                    Remember me
                  </Label>
                </div>

                {error && (
                  <div className="bg-red-50 p-3 rounded-md border border-red-200">
                    <p className="text-red-600 text-sm">{error}</p>
                  </div>
                )}

                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Signing in...
                    </>
                  ) : (
                    "Sign In"
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
          <CardFooter className="flex justify-center">
            <p className="text-sm text-[var(--fixed-sidebar-muted)]">
              Don't have an account?{" "}
              <Link href="/register" className="text-[var(--fixed-primary)] font-medium">
                Sign up
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>

      <ForgotPasswordDialog open={openForgotPasswordDialog} onOpenChange={setOpenForgotPasswordDialog} />
    </div>
  )
}
