"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Info, Loader2 } from "lucide-react";
import BaseService from "@/lib/service/BaseService";
import { httpMethods } from "@/lib/service/HttpService";
import { ValidateEmailTokenResponse } from "@/types/user";



export default function EmailChangePage() {
    const params = useParams();
    const router = useRouter();
    const token = params.token as string;

    const [loading, setLoading] = useState(true);
    const [tokenValid, setTokenValid] = useState(false);
    const [emailData, setEmailData] = useState<ValidateEmailTokenResponse | null>(null);
    const [actionLoading, setActionLoading] = useState(false);
    const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' | '' }>({ text: '', type: '' });

    const controlToken = useCallback(async () => {
        setLoading(true);
        try {
            const response: ValidateEmailTokenResponse = await BaseService.request("/api/email-change/validate-token", {
                method: httpMethods.POST,
                body: { token },
            });

            if (response.valid) {
                setEmailData(response);
                setTokenValid(true);
            } else {
                setMessage({ text: "The email change link is invalid or expired.", type: "error" });
            }
        } catch (err: any) {
            setMessage({ text: err.message || "An error occurred during token validation.", type: "error" });
        } finally {
            setLoading(false);
        }
    }, [token]);

    useEffect(() => {
        controlToken();
    }, [controlToken]);

    const handleAction = useCallback(async (action: "confirm" | "reject") => {
        if (!token) return;

    }, [router, token]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
            <div className="w-full max-w-md">
                <Card>
                    <CardHeader>
                        <CardTitle>Email Change Request</CardTitle>
                        <CardDescription>Confirm or reject the requested email change.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {loading ? (
                            <div className="flex justify-center py-8">
                                <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
                            </div>
                        ) : tokenValid && emailData ? (
                            <div className="space-y-4">
                                {/* Information Box */}
                                <div className="flex items-start gap-2 bg-blue-50 p-3 rounded-md border border-blue-100">
                                    <Info className="h-5 w-5 text-blue-500 mt-0.5" />
                                    <div className="text-sm text-blue-700">
                                        <p className="font-semibold mb-1">Are you sure you want to change your email?</p>
                                        <p>
                                            Changing your email will update your account's primary contact. You will receive all future
                                            notifications on the new email address. Please confirm that you want to proceed.
                                        </p>
                                    </div>
                                </div>

                                {/* Message display */}
                                {message.text && (
                                    <div className={`p-3 rounded-md ${message.type === 'error' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                                        {message.text}
                                    </div>
                                )}

                                {/* Email Information */}
                                <div className="text-sm text-gray-700 space-y-1">
                                    <p>
                                        <span className="font-semibold">Current Email:</span> {emailData.currentEmail}
                                    </p>
                                    <p>
                                        <span className="font-semibold">New Email:</span> {emailData.newEmailPending}
                                    </p>
                                </div>

                                {/* Action Buttons */}
                                <div className="flex gap-4 flex-col sm:flex-row">
                                    <Button
                                        className="flex-1"
                                        onClick={() => handleAction("confirm")}
                                        disabled={actionLoading}
                                    >
                                        {actionLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : "Confirm"}
                                    </Button>
                                    <Button
                                        variant="destructive"
                                        className="flex-1"
                                        onClick={() => handleAction("reject")}
                                        disabled={actionLoading}
                                    >
                                        {actionLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : "Reject"}
                                    </Button>
                                </div>
                            </div>
                        ) : (
                            <p className="text-red-500 text-center">Invalid or expired token.</p>
                        )}
                    </CardContent>
                    <CardFooter className="text-center text-sm text-gray-500">
                        If you didn't request this change, you can safely ignore this email.
                    </CardFooter>
                </Card>
            </div>
        </div>
    );
}
