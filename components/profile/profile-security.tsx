"use client"

import type React from "react"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Loader2, Shield, ShieldAlert, ShieldCheck } from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { toast } from "@/components/ui/use-toast"
import { Progress } from "@/components/ui/progress"
import { useLanguage } from "@/lib/i18n/context"

const passwordFormSchema = z
  .object({
    currentPassword: z.string().min(1, { message: "Current password is required" }),
    newPassword: z
      .string()
      .min(8, { message: "Password must be at least 8 characters" })
      .regex(/[A-Z]/, { message: "Password must contain at least one uppercase letter" })
      .regex(/[a-z]/, { message: "Password must contain at least one lowercase letter" })
      .regex(/[0-9]/, { message: "Password must contain at least one number" })
      .regex(/[^A-Za-z0-9]/, { message: "Password must contain at least one special character" }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  })

type PasswordFormValues = z.infer<typeof passwordFormSchema>

export function ProfileSecurity() {
  const { translations } = useLanguage()
  const t = translations.profile.security

  const [isLoading, setIsLoading] = useState(false)
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false)
  const [passwordStrength, setPasswordStrength] = useState(0)

  const form = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordFormSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  })

  function calculatePasswordStrength(password: string) {
    if (!password) return 0

    let strength = 0

    // Length
    if (password.length >= 8) strength += 20

    // Uppercase
    if (/[A-Z]/.test(password)) strength += 20

    // Lowercase
    if (/[a-z]/.test(password)) strength += 20

    // Numbers
    if (/[0-9]/.test(password)) strength += 20

    // Special characters
    if (/[^A-Za-z0-9]/.test(password)) strength += 20

    return strength
  }

  function onPasswordChange(e: React.ChangeEvent<HTMLInputElement>) {
    const password = e.target.value
    setPasswordStrength(calculatePasswordStrength(password))
    form.setValue("newPassword", password)
  }

  function getStrengthColor(strength: number) {
    if (strength < 40) return "bg-red-500"
    if (strength < 80) return "bg-yellow-500"
    return "bg-green-500"
  }

  function getStrengthText(strength: number) {
    if (strength < 40) return t.changePassword.weak
    if (strength < 80) return t.changePassword.good
    return t.changePassword.strong
  }

  function onSubmit(data: PasswordFormValues) {
    setIsLoading(true)

    // Simulate API call
    setTimeout(() => {
      toast({
        title: t.changePassword.passwordUpdated,
        description: t.changePassword.passwordUpdatedDesc,
      })

      form.reset()
      setPasswordStrength(0)
      setIsLoading(false)
    }, 1000)
  }

  function toggleTwoFactor() {
    setTwoFactorEnabled(!twoFactorEnabled)

    toast({
      title: twoFactorEnabled ? t.twoFactor.twoFactorDisabled : t.twoFactor.twoFactorEnabled,
      description: twoFactorEnabled ? t.twoFactor.twoFactorDisabledDesc : t.twoFactor.twoFactorEnabledDesc,
    })
  }

  const activeSessions = [
    {
      device: "Windows PC",
      browser: "Chrome 112.0.0.0",
      location: "New York, USA",
      ip: "192.168.1.1",
      lastActive: "Active now",
      current: true,
    },
    {
      device: "MacBook Pro",
      browser: "Safari 16.4",
      location: "San Francisco, USA",
      ip: "192.168.1.2",
      lastActive: "2 hours ago",
      current: false,
    },
    {
      device: "iPhone 13",
      browser: "Mobile Safari",
      location: "Boston, USA",
      ip: "192.168.1.3",
      lastActive: "1 day ago",
      current: false,
    },
  ]

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{t.changePassword.title}</CardTitle>
          <CardDescription>{t.changePassword.description}</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="currentPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t.changePassword.currentPassword}</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="Enter your current password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="newPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t.changePassword.newPassword}</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Enter your new password"
                        {...field}
                        onChange={onPasswordChange}
                      />
                    </FormControl>
                    {field.value && (
                      <div className="mt-2 space-y-2">
                        <Progress value={passwordStrength} className={getStrengthColor(passwordStrength)} />
                        <div className="flex justify-between text-xs">
                          <span>{t.changePassword.passwordStrength}</span>
                          <span
                            className={
                              passwordStrength < 40
                                ? "text-red-500"
                                : passwordStrength < 80
                                  ? "text-yellow-500"
                                  : "text-green-500"
                            }
                          >
                            {getStrengthText(passwordStrength)}
                          </span>
                        </div>
                      </div>
                    )}
                    <FormDescription>{t.changePassword.requirements}</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t.changePassword.confirmPassword}</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="Confirm your new password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {t.changePassword.updatePassword}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{t.twoFactor.title}</CardTitle>
          <CardDescription>{t.twoFactor.description}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {twoFactorEnabled ? (
                <ShieldCheck className="h-8 w-8 text-green-500" />
              ) : (
                <ShieldAlert className="h-8 w-8 text-yellow-500" />
              )}
              <div>
                <h4 className="text-sm font-medium">{t.twoFactor.title}</h4>
                <p className="text-sm text-muted-foreground">
                  {twoFactorEnabled ? t.twoFactor.enabled : t.twoFactor.disabled}
                </p>
              </div>
            </div>
            <Switch checked={twoFactorEnabled} onCheckedChange={toggleTwoFactor} />
          </div>

          {twoFactorEnabled && (
            <div className="rounded-md bg-muted p-4">
              <div className="flex items-center space-x-4">
                <Shield className="h-8 w-8 text-muted-foreground" />
                <div>
                  <h4 className="text-sm font-medium">{t.twoFactor.recoveryCodes}</h4>
                  <p className="text-sm text-muted-foreground">{t.twoFactor.recoveryCodesDesc}</p>
                  <Button variant="outline" size="sm" className="mt-2">
                    {t.twoFactor.viewRecoveryCodes}
                  </Button>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{t.activeSessions.title}</CardTitle>
          <CardDescription>{t.activeSessions.description}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {activeSessions.map((session, index) => (
              <div key={index} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
                <div className="space-y-1">
                  <div className="flex items-center">
                    <span className="font-medium">{session.device}</span>
                    {session.current && (
                      <span className="ml-2 text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full">
                        {t.activeSessions.current}
                      </span>
                    )}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {session.browser} • {session.location} • {session.ip}
                  </div>
                  <div className="text-xs text-muted-foreground">{session.lastActive}</div>
                </div>
                {!session.current && (
                  <Button variant="outline" size="sm">
                    {t.activeSessions.revoke}
                  </Button>
                )}
              </div>
            ))}
          </div>
        </CardContent>
        <CardFooter>
          <Button variant="outline" className="w-full">
            {t.activeSessions.logOutAll}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
