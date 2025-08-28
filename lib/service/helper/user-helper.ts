import { ChangePasswordRequest, ChangePasswordResponse, RegisterRequest, UserDto } from "@/types/user";
import { apiCall, FetchEntitiesOptions } from "../api-helpers";
import {
    USER_UPDATE_ME_PASSWORD_URL,
    USER_UPDATE_ME_URL
} from "../BasePath";
import { httpMethods } from "../HttpService";


export const updateMyInformationHelper = async (body: RegisterRequest, options: FetchEntitiesOptions): Promise<UserDto | null> => {
    return apiCall<UserDto>({
        url: `${USER_UPDATE_ME_URL}`,
        method: httpMethods.PATCH,
        body: body,
        setLoading: options.setLoading,
        successMessage: `My İnformation has been updated.`,
        errorMessagePrefix: "Failed to update My İnformation",
        successToastTitle: "My İnformation Updated",
        errorToastTitle: "Error Updating My İnformation",
    });
};


export const updateMyPasswordHelper = async (body: ChangePasswordRequest, options: FetchEntitiesOptions): Promise<ChangePasswordResponse | null> => {
    return apiCall<ChangePasswordResponse>({
        url: `${USER_UPDATE_ME_PASSWORD_URL}`,
        method: httpMethods.PATCH,
        body: body,
        setLoading: options.setLoading,
        successMessage: `My password has been updated.`,
        errorMessagePrefix: "Failed to update My password",
        successToastTitle: "My password Updated",
        errorToastTitle: "Error Updating My password",
    });
};

