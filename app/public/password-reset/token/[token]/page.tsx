"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Lock } from "lucide-react";
import { PasswordResetConfirmRequest, PasswordResetResponse, PasswordResetValidateRequest, PasswordResetValidateResponse } from "@/types/user";
import { resetPasswordHelper, validateResetPasswordHelper } from "@/lib/service/helper/user-public-helper";

// 🔹 Interfaces
export interface ValidateResetTokenResponse {
    valid: boolean;
    message?: string;
}

export interface ResetPasswordResponse {
    success: boolean;
    message?: string;
}

// 🔹 Page Component
export default function ResetPasswordPage() {
    const params = useParams();
    const router = useRouter();
    const token = params.token as string;

    const [loading, setLoading] = useState(true);
    const [tokenValid, setTokenValid] = useState(false);
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [actionLoading, setActionLoading] = useState(false);
    const [message, setMessage] = useState<{ text: string; type: "success" | "error" | "" }>({
        text: "",
        type: "",
    });

    // 🔹 Token kontrol
    const controlToken = useCallback(async () => {
        let bodty: PasswordResetValidateRequest = { token: token };
        const response: PasswordResetValidateResponse | null = await validateResetPasswordHelper(bodty, { setLoading });
        if (!!response && response.valid) {
            setTokenValid(true);
        } else {
            setMessage({ text: response?.message || "The reset link is invalid or expired.", type: "error" });
        }
    }, [token]);

    useEffect(() => {
        controlToken();
    }, [controlToken]);

    // 🔹 Şifre reset işlemi
    const handleResetPassword = useCallback(async () => {
        if (!password || !confirmPassword) {
            setMessage({ text: "Please fill in all fields.", type: "error" });
            return;
        }
        if (password !== confirmPassword) {
            setMessage({ text: "Passwords do not match.", type: "error" });
            return;
        }

        setMessage({ text: "", type: "" });

        let body: PasswordResetConfirmRequest = {
            token: token,
            newPassword: password,
            confirmNewPassword: confirmPassword
        }
        const response: PasswordResetResponse | null = await resetPasswordHelper(body, { setLoading: setActionLoading });

        if (response?.success) {
            setMessage({ text: response.message || "Password has been reset successfully.", type: "success" });
        } else {
            setMessage({ text: response?.message || "Failed to reset password.", type: "error" });
        }

    }, [password, confirmPassword, token, router]);

    // 🔹 Cancel
    const handleCancel = () => {
        router.push("/");
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
            <div className="w-full max-w-md">
                <Card>
                    <CardHeader>
                        <CardTitle>Reset Password</CardTitle>
                        <CardDescription>
                            {tokenValid ? "Enter your new password below." : "Token validation required."}
                        </CardDescription>
                    </CardHeader>

                    <CardContent>
                        <div className="space-y-4">
                            {/* Message */}
                            {message.text && (
                                <div className={`text-center p-3 rounded-md mb-6 ${message.type === 'error' ? 'bg-red-100 text-red-700 dark:bg-red-800 dark:text-red-200' : 'bg-green-100 text-green-700 dark:bg-green-800 dark:text-green-200'}`}>
                                    <p>{message.text}</p>
                                </div>
                            )}
                        </div>
                        {loading ? (
                            <div className="flex justify-center py-8">
                                <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
                            </div>
                        ) : tokenValid && (
                            <div className="space-y-4">


                                {/* Password Input */}
                                <div className="grid gap-2">
                                    <Label htmlFor="password">New Password</Label>
                                    <Input
                                        id="password"
                                        type="password"
                                        placeholder="Enter new password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        disabled={actionLoading}
                                    />
                                </div>

                                {/* Confirm Password Input */}
                                <div className="grid gap-2">
                                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                                    <Input
                                        id="confirmPassword"
                                        type="password"
                                        placeholder="Re-enter new password"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        disabled={actionLoading}
                                    />
                                </div>

                                {/* Action Buttons */}
                                <div className="flex gap-3">
                                    <Button
                                        onClick={handleResetPassword}
                                        disabled={actionLoading}
                                        className="flex-1"
                                    >
                                        {actionLoading ? (
                                            <>
                                                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                                Resetting...
                                            </>
                                        ) : (
                                            <>
                                                <Lock className="h-4 w-4 mr-2" />
                                                Reset Password
                                            </>
                                        )}
                                    </Button>
                                    <Button
                                        variant="outline"
                                        onClick={handleCancel}
                                        className="flex-1"
                                    >
                                        Cancel
                                    </Button>
                                </div>
                            </div>
                        )}
                    </CardContent>

                    <CardFooter className="text-center text-sm text-gray-500">
                        If the reset link has expired, please request a new password reset email.
                    </CardFooter>
                </Card>
            </div>
        </div>
    );
}
