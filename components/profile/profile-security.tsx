"use client"

import React, { useState, useRef, useEffect, useCallback, useMemo } from "react"
import { Loader2, Shield, ShieldAlert, ShieldCheck } from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Progress } from "@/components/ui/progress"
import { useLanguage } from "@/lib/i18n/context"
import { updateMyPasswordHelper } from "@/lib/service/helper/user-helper"
import { ChangePasswordRequest, ChangePasswordResponse } from "@/types/user"
import { useAuthUser, useUpdateAuthToken } from "@/lib/hooks/useAuthUser"

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



export function ProfileSecurity() {
  const authUser = useAuthUser();
  const user = authUser?.user;
  const { translations } = useLanguage()
  const t = translations.profile.security
  const updateAuthToken = useUpdateAuthToken(); // Yeni hook'u çağırın

  // Form state
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  })
  const [errors, setErrors] = useState<Partial<typeof formData>>({})
  const [message, setMessage] = useState<{ text: string; type: "success" | "error" | "" }>({ text: "", type: "" })

  // Loading + 2FA
  const [isLoading, setIsLoading] = useState(false)
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false)

  // Password strength
  const [passwordStrength, setPasswordStrength] = useState(0)

  const calculatePasswordStrength = (password: string) => {
    if (!password) return 0
    let strength = 0
    if (password.length >= 8) strength += 20
    if (/[A-Z]/.test(password)) strength += 20
    if (/[a-z]/.test(password)) strength += 20
    if (/[0-9]/.test(password)) strength += 20
    if (/[^A-Za-z0-9]/.test(password)) strength += 20
    return strength
  }

  const handleChange = useCallback((field: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (field === "newPassword") {
      setPasswordStrength(calculatePasswordStrength(value))
    }
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }))
    }
    setMessage({ text: "", type: "" })
  }, [errors])

  const validateForm = (): boolean => {
    const newErrors: Partial<typeof formData> = {}
    if (!formData.currentPassword || formData.currentPassword.length < 6) {
      newErrors.currentPassword = t.changePassword.errors.currentPasswordRequired
    }
    if (formData.newPassword.length < 8) {
      newErrors.newPassword = t.changePassword.errors.newPasswordRequired
    }
    if (formData.newPassword !== formData.confirmNewPassword) {
      newErrors.confirmNewPassword = t.changePassword.errors.confirmPasswordRequired
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const canSubmit = useMemo(() => {
    return (
      formData.currentPassword.length >= 6 &&
      formData.newPassword.length >= 8 &&
      formData.newPassword === formData.confirmNewPassword
    )
  }, [formData])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm()) {
      setMessage({ text: t.changePassword.errors.general, type: "error" })
      return
    }
    let body: ChangePasswordRequest = {
      currentPassword: formData.currentPassword,
      newPassword: formData.newPassword,
      confirmNewPassword: formData.confirmNewPassword,
    };


    const response: ChangePasswordResponse | null = await updateMyPasswordHelper(body, { setLoading: setIsLoading });
    if (!!response) {
      if (response?.success) {
        // ✅ Session token'ını güncelle
        if (response.newToken) {
          console.log("Updating auth token:", response.newToken);
          await updateAuthToken(response.newToken)
        }

        setMessage({ text: t.changePassword.passwordUpdated, type: "success" })
        setFormData({ currentPassword: "", newPassword: "", confirmNewPassword: "" })
        setPasswordStrength(0)
      } else {
        setMessage({ text: response?.message, type: "error" })
        return;
      }
    }


  }

  const toggleTwoFactor = () => {
    setTwoFactorEnabled(!twoFactorEnabled)
    setMessage({
      text: twoFactorEnabled ? t.twoFactor.twoFactorDisabled : t.twoFactor.twoFactorEnabled,
      type: "success",
    })
  }

  return (
    <div className="space-y-6">
      {/* Change Password */}
      <Card>
        <CardHeader>
          <CardTitle>{t.changePassword.title}</CardTitle>
          <CardDescription>{t.changePassword.description}</CardDescription>
          <div className="text-wrap break-all text-sm text-muted-foreground mt-2">
            {authUser?.token}
          </div>
        </CardHeader>
        <CardContent>
          {message.text && (
            <div
              className={`mb-4 rounded-md p-3 text-center ${message.type === "error"
                ? "bg-red-100 text-red-700 dark:bg-red-800 dark:text-red-200"
                : "bg-green-100 text-green-700 dark:bg-green-800 dark:text-green-200"
                }`}
            >
              {message.text}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Current Password */}
            <div className="space-y-2">
              <label className="text-sm font-medium">{t.changePassword.currentPassword}</label>
              <Input
                type="password"
                placeholder="Enter your current password"
                value={formData.currentPassword}
                onChange={(e) => handleChange("currentPassword", e.target.value)}
              />
              {errors.currentPassword && <p className="text-sm text-red-500">{errors.currentPassword}</p>}
            </div>

            {/* New Password */}
            <div className="space-y-2">
              <label className="text-sm font-medium">{t.changePassword.newPassword}</label>
              <Input
                type="password"
                placeholder="Enter your new password"
                value={formData.newPassword}
                onChange={(e) => handleChange("newPassword", e.target.value)}
              />
              {formData.newPassword && (
                <div className="mt-2 space-y-2">
                  <Progress value={passwordStrength} className="h-2" />
                  <div className="flex justify-between text-xs">
                    <span>{t.changePassword.passwordStrength}</span>
                    <span>{passwordStrength < 40 ? t.changePassword.weak : passwordStrength < 80 ? t.changePassword.good : t.changePassword.strong}</span>
                  </div>
                </div>
              )}
              {errors.newPassword && <p className="text-sm text-red-500">{errors.newPassword}</p>}
            </div>

            {/* Confirm Password */}
            <div className="space-y-2">
              <label className="text-sm font-medium">{t.changePassword.confirmPassword}</label>
              <Input
                type="password"
                placeholder="Confirm your new password"
                value={formData.confirmNewPassword}
                onChange={(e) => handleChange("confirmNewPassword", e.target.value)}
              />
              {errors.confirmNewPassword && <p className="text-sm text-red-500">{errors.confirmNewPassword}</p>}
            </div>

            <Button type="submit" disabled={!canSubmit || isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {t.changePassword.updatePassword}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Two Factor */}
      <Card>
        <CardHeader>
          <CardTitle>{t.twoFactor.title}</CardTitle>
          <CardDescription>{t.twoFactor.description}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {twoFactorEnabled ? <ShieldCheck className="h-8 w-8 text-green-500" /> : <ShieldAlert className="h-8 w-8 text-yellow-500" />}
              <div>
                <h4 className="text-sm font-medium">{t.twoFactor.title}</h4>
                <p className="text-sm text-muted-foreground">{twoFactorEnabled ? t.twoFactor.enabled : t.twoFactor.disabled}</p>
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
