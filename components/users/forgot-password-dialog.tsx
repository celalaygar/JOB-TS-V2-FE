"use client"

import React, { useState, useEffect, useCallback } from "react"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2 } from "lucide-react"
import { forgotPasswordHelper } from "@/lib/service/helper/user-public-helper"
import { PasswordResetRequest, PasswordResetResponse } from "@/types/user"

interface ForgotPasswordDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
}

export function ForgotPasswordDialog({ open, onOpenChange }: ForgotPasswordDialogProps) {
    const [email, setEmail] = useState("")
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState("")
    const [timer, setTimer] = useState(0)

    // Timer countdown
    useEffect(() => {
        let interval: NodeJS.Timeout | null = null
        if (timer > 0) {
            interval = setInterval(() => {
                setTimer((prev) => (prev > 0 ? prev - 1 : 0))
            }, 1000)
        }
        return () => {
            if (interval) clearInterval(interval)
        }
    }, [timer])

    const handleSend = useCallback(async () => {
        if (!email) {
            setMessage("Please enter your email.")
            return
        }

        setMessage("")
        let body: PasswordResetRequest = { email: email }

        const response: PasswordResetResponse | null = await forgotPasswordHelper(body, { setLoading })
        if (response) {
            if (response.success) {
                setMessage("Reset email has been sent.")
                setTimer(120) // 120 seconds countdown
                setEmail("")
            } else {
                setMessage(response.message || "Something went wrong. Please try again.")
            }
        } else {
            setMessage("Something went wrong. Please try again.")
        }

    }, [email])

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[400px]">
                <DialogHeader>
                    <DialogTitle>Forgot Password</DialogTitle>
                    <DialogDescription>
                        Enter your email address to receive a password reset link.
                    </DialogDescription>
                </DialogHeader>

                <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                            id="email"
                            type="email"
                            placeholder="your@email.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            disabled={loading || timer > 0}
                        />
                    </div>

                    {message && (
                        <div
                            className={`text-sm ${message.includes("sent")
                                ? "text-green-600"
                                : "text-red-600"
                                }`}
                        >
                            {message}
                        </div>
                    )}

                    {timer > 0 && (
                        <span className="text-xs text-gray-500">
                            You can request another email in {timer}s
                        </span>
                    )}
                </div>

                <DialogFooter>
                    <Button
                        onClick={handleSend}
                        disabled={loading || timer > 0}
                        className="w-full"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                Sending...
                            </>
                        ) : (
                            "Send Reset Email"
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
