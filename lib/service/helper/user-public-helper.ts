import { ChangePasswordRequest, ChangePasswordResponse, PasswordResetConfirmRequest, PasswordResetRequest, PasswordResetResponse, PasswordResetValidateRequest, PasswordResetValidateResponse, RegisterRequest, UserDto } from "@/types/user";
import { apiCall, FetchEntitiesOptions } from "../api-helpers";
import {
    PASSWORD_RESET_PUBLIC_VALIDATE_TOKEN_URL,
    FORGOT_PASSWORD_URL,
    PASSWORD_RESET_URL
} from "../BasePath";
import { httpMethods } from "../HttpService";


export const forgotPasswordHelper = async (body: PasswordResetRequest, options: FetchEntitiesOptions): Promise<PasswordResetResponse | null> => {
    return apiCall<PasswordResetResponse>({
        url: `${FORGOT_PASSWORD_URL}`,
        method: httpMethods.POST,
        body: body,
        setLoading: options.setLoading,
        successMessage: `Password reset link has been sent to your email.`,
        errorMessagePrefix: "Failed to send password reset link",
        successToastTitle: "Password Reset Link Sent",
        errorToastTitle: "Error Sending Password Reset Link",
    });
}

export const validateResetPasswordHelper = async (body: PasswordResetValidateRequest, options: FetchEntitiesOptions): Promise<PasswordResetValidateResponse | null> => {
    return apiCall<PasswordResetValidateResponse>({
        url: `${PASSWORD_RESET_PUBLIC_VALIDATE_TOKEN_URL}`,
        method: httpMethods.POST,
        body: body,
        setLoading: options.setLoading,
        successMessage: `Password reset token is valid.`,
        errorMessagePrefix: "Failed to validate password reset token",
        successToastTitle: "Password Reset Token Validated",
        errorToastTitle: "Error Validating Password Reset Token",
    });
}

export const resetPasswordHelper = async (body: PasswordResetConfirmRequest, options: FetchEntitiesOptions): Promise<PasswordResetResponse | null> => {
    return apiCall<PasswordResetResponse>({
        url: `${PASSWORD_RESET_URL}`,
        method: httpMethods.POST,
        body: body,
        setLoading: options.setLoading,
        successMessage: `Password has been reset successfully.`,
        errorMessagePrefix: "Failed to reset password",
        successToastTitle: "Password Reset Successful",
        errorToastTitle: "Error Resetting Password",
    });
}
