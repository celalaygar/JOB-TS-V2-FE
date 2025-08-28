import { EmailChangeRequest, EmailChangeResponse, ValidateEmailTokenResponse } from "@/types/user";
import { apiCall, FetchEntitiesOptions } from "../api-helpers";
import {
    SEND_CODE_URL,
    VERIFY_AND_SEND_LINK_URL,
    EMAIL_CHANGE_PUBLIC_CONFIRM_URL,
    EMAIL_CHANGE_PUBLIC_REJECT_URL,
    EMAIL_CHANGE_PUBLIC_VALIDATE_TOKEN_URL
} from "../BasePath";
import { httpMethods } from "../HttpService";



export const validateEmailTokenHelper = async (token: string, options: FetchEntitiesOptions): Promise<ValidateEmailTokenResponse | null> => {
    return apiCall<ValidateEmailTokenResponse>({
        url: `${EMAIL_CHANGE_PUBLIC_VALIDATE_TOKEN_URL}`,
        method: httpMethods.POST,
        body: { token },
        setLoading: options.setLoading,
        successMessage: "Email Change Token have been successfully validated.",
        errorMessagePrefix: "Failed to validate Email Change Token",
        successToastTitle: "Email Change Token Loaded",
        errorToastTitle: "Error validating Email Change Token",
    });
}

export const confirmEmailChangeHelper = async (token: string, options: FetchEntitiesOptions): Promise<EmailChangeResponse | null> => {
    return apiCall<EmailChangeResponse>({
        url: `${EMAIL_CHANGE_PUBLIC_CONFIRM_URL}/${token}`,
        method: httpMethods.GET,
        setLoading: options.setLoading,
        successMessage: "Email Change have been successfully confirmed.",
        errorMessagePrefix: "Failed to confirm Email Change",
        successToastTitle: "Email Change Confirmed",
        errorToastTitle: "Error confirming Email Change",
    });
}

export const rejectEmailChangeHelper = async (token: string, options: FetchEntitiesOptions): Promise<EmailChangeResponse | null> => {
    return apiCall<EmailChangeResponse>({
        url: `${EMAIL_CHANGE_PUBLIC_REJECT_URL}/${token}`,
        method: httpMethods.GET,
        setLoading: options.setLoading,
        successMessage: "Email Change have been successfully rejected.",
        errorMessagePrefix: "Failed to reject Email Change",
        successToastTitle: "Email Change Rejected",
        errorToastTitle: "Error rejecting Email Change",
    });
}

export const changeEmailRequestHelper = async (body: EmailChangeRequest, options: FetchEntitiesOptions): Promise<EmailChangeResponse | null> => {
    return apiCall<EmailChangeResponse>({
        url: `${VERIFY_AND_SEND_LINK_URL}`,
        method: httpMethods.POST,
        body: body,
        setLoading: options.setLoading,
        successMessage: "Change Email Request have been successfully sent.",
        errorMessagePrefix: "Failed to send Change Email Request",
        successToastTitle: "Change Email Request Loaded",
        errorToastTitle: "Error sending Change Email Request",
    });
}


export const sendCodeToCurrentEmailHelper = async (options: FetchEntitiesOptions): Promise<EmailChangeResponse | null> => {
    return apiCall<EmailChangeResponse>({
        url: `${SEND_CODE_URL}`,
        method: httpMethods.GET,
        body: null,
        setLoading: options.setLoading,
        successMessage: "Code have been successfully sent.",
        errorMessagePrefix: "Failed to send Code",
        successToastTitle: "Code Loaded",
        errorToastTitle: "Error sending Code",
    });
}
