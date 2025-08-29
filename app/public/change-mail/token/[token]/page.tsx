"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Info, Loader2 } from "lucide-react";
import BaseService from "@/lib/service/BaseService";
import { httpMethods } from "@/lib/service/HttpService";
import { EmailChangeResponse, ValidateEmailTokenResponse } from "@/types/user";
import { confirmEmailChangeHelper, rejectEmailChangeHelper, validateEmailTokenHelper } from "@/lib/service/helper/email-change-helper";
import { signOut } from "next-auth/react";
import { useAuthUser } from "@/lib/hooks/useAuthUser";

const enum ActionType {
    CONFIRM = "confirm",
    REJECT = "reject"
}


export default function EmailChangePage() {
    const authUser = useAuthUser();
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
            const response: ValidateEmailTokenResponse | null = await validateEmailTokenHelper(token, { setLoading });

            if (!!response && response.valid) {
                setEmailData(response);
                setTokenValid(response.valid);
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

    const handleAction = useCallback(
        async (action: ActionType.CONFIRM | ActionType.REJECT) => {
            console.log({ action, token, tokenValid });
            if (!token) return;
            if (action !== ActionType.CONFIRM && action !== ActionType.REJECT) return;

            if (action === ActionType.CONFIRM) {
                const response: EmailChangeResponse | null = await confirmEmailChangeHelper(
                    token,
                    { setLoading: setActionLoading }
                );

                if (response?.success) {
                    setMessage({
                        text: response.message || "Email change confirmed successfully.",
                        type: "success",
                    });
                    setTokenValid(false);

                    // ✅ Session sadece authUser varsa silinsin
                    if (authUser) {
                        const currentOrigin = window.location.origin;
                        await fetch("/api/auth/logout");
                        await signOut({ redirect: true, callbackUrl: currentOrigin + "/" });
                    }
                }
            } else if (action === ActionType.REJECT) {
                const response: EmailChangeResponse | null = await rejectEmailChangeHelper(
                    token,
                    { setLoading: setActionLoading }
                );
                if (response?.success) {
                    setMessage({
                        text: response.message || "Email change rejected successfully.",
                        type: "success",
                    });
                    setTokenValid(false);
                }
            }
        },
        [router, token, authUser]
    );


    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
            <div className="w-full max-w-md">
                <Card>
                    <CardHeader>
                        <CardTitle>Email Change Request  </CardTitle>
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
                                        onClick={() => handleAction(ActionType.CONFIRM)}
                                        disabled={actionLoading}
                                    >
                                        {actionLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : "Confirm"}
                                    </Button>
                                    <Button
                                        variant="destructive"
                                        className="flex-1"
                                        onClick={() => handleAction(ActionType.REJECT)}
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
