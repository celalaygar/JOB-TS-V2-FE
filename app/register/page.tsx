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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Home, Loader2 } from "lucide-react"
import { register, clearError } from "@/lib/redux/features/auth-slice"
import { useLanguage } from "@/lib/i18n/context"

export default function RegisterPage() {
  const { translations } = useLanguage()
  const router = useRouter()
  const dispatch = useDispatch()
  const { loading, error } = useSelector((state: any) => state.auth)

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "Developer",
  })
  const [formErrors, setFormErrors] = useState<Record<string, string>>({})

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))

    // Clear error when user types
    if (formErrors[name]) {
      setFormErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }

    // Clear Redux error
    if (error) {
      dispatch(clearError())
    }
  }

  const handleRoleChange = (value: string) => {
    setFormData((prev) => ({ ...prev, role: value }))
  }

  const validateForm = () => {
    const errors: Record<string, string> = {}

    if (!formData.name.trim()) {
      errors.name = translations.register.errors.nameRequired
    }

    if (!formData.email.trim()) {
      errors.email = translations.register.errors.emailRequired
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = translations.register.errors.emailInvalid
    }

    if (!formData.password) {
      errors.password = translations.register.errors.passwordRequired
    } else if (formData.password.length < 6) {
      errors.password = translations.register.errors.passwordLength
    }

    if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = translations.register.errors.passwordsMatch
    }

    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (validateForm()) {
      dispatch(register(formData.name, formData.email, formData.password, formData.role) as any)

      // Redirect to dashboard after successful registration
      // In a real app, this would happen after the async action completes
      setTimeout(() => {
        router.push("/dashboard")
      }, 1500)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--fixed-background)] p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center text-2xl font-bold text-[var(--fixed-primary)]">
            <Home className="mr-2 h-6 w-6" />
            Issue Tracker
          </Link>
          <p className="text-[var(--fixed-sidebar-muted)] mt-2">{translations.register.subtitle}</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{translations.register.title}</CardTitle>
            <CardDescription>{translations.register.description}</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit}>
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">{translations.register.nameLabel}</Label>
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    placeholder={translations.register.namePlaceholder}
                    value={formData.name}
                    onChange={handleChange}
                    className={formErrors.name ? "border-red-500" : ""}
                  />
                  {formErrors.name && <p className="text-red-500 text-xs mt-1">{formErrors.name}</p>}
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="email">{translations.register.emailLabel}</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder={translations.register.emailPlaceholder}
                    value={formData.email}
                    onChange={handleChange}
                    className={formErrors.email ? "border-red-500" : ""}
                  />
                  {formErrors.email && <p className="text-red-500 text-xs mt-1">{formErrors.email}</p>}
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="password">{translations.register.passwordLabel}</Label>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleChange}
                    className={formErrors.password ? "border-red-500" : ""}
                  />
                  {formErrors.password && <p className="text-red-500 text-xs mt-1">{formErrors.password}</p>}
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="confirmPassword">{translations.register.confirmPasswordLabel}</Label>
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className={formErrors.confirmPassword ? "border-red-500" : ""}
                  />
                  {formErrors.confirmPassword && (
                    <p className="text-red-500 text-xs mt-1">{formErrors.confirmPassword}</p>
                  )}
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="role">{translations.register.roleLabel}</Label>
                  <Select value={formData.role} onValueChange={handleRoleChange}>
                    <SelectTrigger>
                      <SelectValue placeholder={translations.register.rolePlaceholder} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Developer">{translations.register.roles.developer}</SelectItem>
                      <SelectItem value="Designer">{translations.register.roles.designer}</SelectItem>
                      <SelectItem value="Product Manager">{translations.register.roles.productManager}</SelectItem>
                      <SelectItem value="QA Engineer">{translations.register.roles.qaEngineer}</SelectItem>
                    </SelectContent>
                  </Select>
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
                      {translations.register.processingButton}
                    </>
                  ) : (
                    translations.register.submitButton
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
          <CardFooter className="flex justify-center">
            <p className="text-sm text-[var(--fixed-sidebar-muted)]">
              {translations.register.haveAccount}{" "}
              <Link href="/" className="text-[var(--fixed-primary)] font-medium">
                {translations.register.signIn}
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
