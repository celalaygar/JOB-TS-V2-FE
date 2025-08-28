// All necessary dependencies are imported at the top.
import React, { useState, useCallback, useEffect, useRef, useMemo } from "react";
import { Loader2 } from "lucide-react";
import * as Label from "@radix-ui/react-label";
import { useAuthUser } from "@/lib/hooks/useAuthUser";
import { AuthenticationUser, EmailChangeRequest, EmailChangeResponse } from "@/types/user";
import { changeEmailRequestHelper, sendCodeToCurrentEmailHelper } from "@/lib/service/helper/email-change-helper";

const EmailChangeForm: React.FC = () => {
    const authUser = useAuthUser();
    const user: AuthenticationUser | null = authUser?.user ?? null;

    // State management
    const [countdown, setCountdown] = useState<number>(0);
    const [isCodeSending, setIsCodeSending] = useState<boolean>(false);
    const [isChangingEmail, setIsChangingEmail] = useState<boolean>(false);
    const [formData, setFormData] = useState({
        verificationCode: "",
        newEmail: "",
        currentPassword: "",
    });
    const [errors, setErrors] = useState<Partial<typeof formData>>({});
    const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' | '' }>({ text: '', type: '' });

    const timerRef = useRef<NodeJS.Timeout | null>(null);
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

    useEffect(() => {
        if (countdown > 0) {
            timerRef.current = setInterval(() => {
                setCountdown((prev) => prev - 1);
            }, 1000);
        } else if (timerRef.current) {
            clearInterval(timerRef.current);
        }

        return () => {
            if (timerRef.current) {
                clearInterval(timerRef.current);
            }
        };
    }, [countdown]);

    const handleChange = useCallback((field: keyof typeof formData, value: string) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
        if (errors[field]) {
            setErrors((prev) => ({ ...prev, [field]: undefined }));
        }
        setMessage({ text: '', type: '' });
    }, [errors]);

    const handleCodeChange = useCallback((index: number, value: string) => {
        // Allow only alphanumeric characters
        if (!/^[a-zA-Z0-9]*$/.test(value)) {
            return;
        }

        const newCodeArray = formData.verificationCode.split('');
        newCodeArray[index] = value.toUpperCase();
        handleChange("verificationCode", newCodeArray.join(''));

        if (value && index < 7 && inputRefs.current[index + 1]) {
            inputRefs.current[index + 1]?.focus();
        } else if (!value && index > 0 && !newCodeArray[index - 1] && inputRefs.current[index - 1]) {
            inputRefs.current[index - 1]?.focus();
        }
    }, [formData.verificationCode, handleChange]);


    const handleSendCode = async () => {

        const response: EmailChangeResponse | null = await sendCodeToCurrentEmailHelper({ setLoading: setIsCodeSending });
        if (response && response.success === true) {
            if (response.success === true) {

                await new Promise(resolve => setTimeout(resolve, 1500));
                setCountdown(60);
                if (user !== null) {
                    setMessage({ text: `A verification code has been sent to your current email: ${user.email}.`, type: 'success' });
                }
            } else {
                setMessage({ text: response.message, type: 'error' });
            }
        } else {
            setMessage({ text: "Could not send code. Please try again later.", type: 'error' });
        }

    };

    const validateForm = (): boolean => {
        const newErrors: Partial<typeof formData> = {};
        if (formData.verificationCode.length !== 8) {
            newErrors.verificationCode = "The verification code must be 8 digits long.";
        }
        if (!formData.newEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.newEmail)) {
            newErrors.newEmail = "Please enter a valid email address.";
        }
        if (!formData.currentPassword || formData.currentPassword.length < 6) {
            newErrors.currentPassword = "The password must be at least 6 characters long.";
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const canSubmit = useMemo(() => {
        const { verificationCode, newEmail, currentPassword } = formData;
        return verificationCode.length === 8 &&
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newEmail) &&
            currentPassword.length >= 6;
    }, [formData]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateForm()) {
            setMessage({ text: "Please correct the errors in the form.", type: 'error' });
            return;
        }
        let body: EmailChangeRequest = {
            newEmail: formData.newEmail,
            verificationCode: formData.verificationCode,
            currentPassword: formData.currentPassword,
        }
        const response: EmailChangeResponse | null = await changeEmailRequestHelper(body, { setLoading: setIsChangingEmail })
        if (response) {
            if (response.success === true) {

                await new Promise(resolve => setTimeout(resolve, 2000));
                setMessage({ text: "To complete the email change process, please click the link in  " + body.newEmail + " in your new email adress if you want Your email address has been successfully updated.", type: 'success' });
                setFormData({ verificationCode: "", newEmail: "", currentPassword: "" });
            } else {
                setMessage({ text: response.message, type: 'error' });
            }

        } else {
            console.error("Failed to update email:");
            setMessage({ text: "An error occurred while updating the email. Please check your information and try again.", type: 'error' });
        }
    };

    if (!user) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
                <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
            </div>
        );
    }

    return (
        <div className="flex justify-center bg-gray-50 dark:bg-gray-900 font-inter ">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 w-full max-w-6xl">

                {/* Left Section: Email Change Form */}
                <div className="flex flex-col rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-8 shadow-md">
                    <div className="flex flex-col space-y-1.5 pb-6">
                        <h3 className="font-semibold tracking-tight text-3xl text-gray-900 dark:text-gray-100">Change Email Address</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Update your email. A verification code will be sent to your current email address.</p>
                    </div>

                    {/* On-screen message display */}
                    {message.text && (
                        <div className={`text-center p-3 rounded-md mb-6 ${message.type === 'error' ? 'bg-red-100 text-red-700 dark:bg-red-800 dark:text-red-200' : 'bg-green-100 text-green-700 dark:bg-green-800 dark:text-green-200'}`}>
                            <p>{message.text}</p>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Current Email Input and Send Code Button */}
                        <div className="space-y-2">
                            <Label.Root
                                className="text-sm font-medium leading-none text-gray-700 dark:text-gray-300"
                                htmlFor="current-email"
                            >
                                Current Email
                            </Label.Root>
                            <div className="flex flex-col md:flex-row md:items-center gap-2">
                                <input
                                    id="current-email"
                                    type="email"
                                    value={user?.email || ""}
                                    disabled
                                    className="flex h-10 w-full rounded-md border border-gray-300 bg-gray-50 dark:bg-gray-700 
                 px-3 py-2 text-sm text-gray-800 dark:text-gray-200 
                 ring-offset-background disabled:cursor-not-allowed disabled:opacity-50"
                                />
                                <button
                                    type="button"
                                    onClick={handleSendCode}
                                    disabled={isCodeSending || countdown > 0}
                                    className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium 
                 h-10 px-4 py-2 w-full md:w-32 
                 bg-indigo-600 text-white hover:bg-indigo-700 
                 transition-colors duration-200 disabled:pointer-events-none disabled:opacity-50"
                                >
                                    {isCodeSending ? (
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                    ) : (
                                        <span>{countdown > 0 ? `${countdown}s` : "Send Code"}</span>
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* Verification Code Input */}
                        <div className="space-y-2">
                            <Label.Root
                                className="text-sm font-medium leading-none text-gray-700 dark:text-gray-300"
                                htmlFor="verification-code"
                            >
                                Verification Code
                            </Label.Root>
                            <div className="space-y-2">
                                {/* Responsive grid: mobile → 4 sütun, md → 8 sütun */}
                                <div className="grid grid-cols-4 lg:grid-cols-8 md:grid-cols-8 gap-2">
                                    {Array.from({ length: 8 }).map((_, index) => (
                                        <input
                                            key={index}
                                            ref={(el) => (inputRefs.current[index] = el)}
                                            type="text"
                                            maxLength={1}
                                            value={formData.verificationCode[index] || ""}
                                            onChange={(e) => handleCodeChange(index, e.target.value)}
                                            className="h-12 w-full rounded-md border text-center text-lg font-mono 
                     focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent 
                     transition-all duration-200
                     bg-white dark:bg-gray-700 dark:border-gray-600 border-gray-300 dark:text-white"
                                        />
                                    ))}
                                </div>
                                {errors.verificationCode && (
                                    <p className="text-sm font-medium text-red-500 mt-2">
                                        {errors.verificationCode}
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* New Email Input */}
                        <div className="space-y-2">
                            <Label.Root className="text-sm font-medium leading-none text-gray-700 dark:text-gray-300" htmlFor="new-email">
                                New Email
                            </Label.Root>
                            <input
                                id="new-email"
                                type="email"
                                placeholder="Enter your new email address"
                                value={formData.newEmail}
                                onChange={(e) => handleChange("newEmail", e.target.value)}
                                className="flex h-10 w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 transition-colors duration-200"
                            />
                            {errors.newEmail && <p className="text-sm font-medium text-red-500 mt-2">{errors.newEmail}</p>}
                        </div>

                        {/* Current Password Input */}
                        <div className="space-y-2">
                            <Label.Root className="text-sm font-medium leading-none text-gray-700 dark:text-gray-300" htmlFor="current-password">
                                Current Password
                            </Label.Root>
                            <input
                                id="current-password"
                                type="password"
                                placeholder="Enter your current password"
                                value={formData.currentPassword}
                                onChange={(e) => handleChange("currentPassword", e.target.value)}
                                className="flex h-10 w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 transition-colors duration-200"
                            />
                            {errors.currentPassword && <p className="text-sm font-medium text-red-500 mt-2">{errors.currentPassword}</p>}
                        </div>

                        {/* Change Email Button */}
                        <div className="flex justify-end pt-4">
                            <button
                                type="submit"
                                disabled={!canSubmit || isChangingEmail}
                                className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium h-12 px-6 py-2 bg-indigo-600 text-white hover:bg-indigo-700 transition-colors duration-200 disabled:pointer-events-none disabled:opacity-50"
                            >
                                {isChangingEmail ? (
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                ) : (
                                    <span>Change Email</span>
                                )}
                            </button>
                        </div>
                    </form>
                </div>

                {/* Right Section: User Information Display */}
                <div className="flex flex-col rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-8 shadow-md">
                    <div className="flex items-center space-x-4 pb-6">
                        {/* Avatar Placeholder or image */}
                        <div className="w-16 h-16 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-2xl font-bold text-gray-600 dark:text-gray-400">
                            {user.firstname?.[0]?.toUpperCase() ?? 'U'}
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{`${user.firstname || 'User'} ${user.lastname || ''}`}</h2>
                            <p className="text-sm text-gray-500 dark:text-gray-400">{user.position || 'No Position'}</p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="space-y-1">
                            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">Contact Information</h4>
                            <p className="text-gray-900 dark:text-gray-100 break-words">{user.email}</p>
                            <p className="text-gray-500 dark:text-gray-400">{user.phone || 'No phone number'}</p>
                        </div>

                        <div className="space-y-1">
                            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">Department & Company</h4>
                            <p className="text-gray-900 dark:text-gray-100">{user.department || 'Not specified'}</p>
                            <p className="text-gray-500 dark:text-gray-400">{user.company || 'Not specified'}</p>
                        </div>

                        {user.dateOfBirth && (
                            <div className="space-y-1">
                                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">Date of Birth</h4>
                                <p className="text-gray-900 dark:text-gray-100">{user.dateOfBirth}</p>
                            </div>
                        )}

                        {user.id && (
                            <div className="space-y-1">
                                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">User ID</h4>
                                <p className="text-xs font-mono text-gray-600 dark:text-gray-400 break-all">{user.id}</p>
                            </div>
                        )}

                    </div>
                </div>
            </div>
        </div>
    );
};

export default EmailChangeForm;
