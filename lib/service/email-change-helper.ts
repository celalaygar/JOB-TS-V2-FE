import { apiCall, FetchEntitiesOptions } from "./api-helpers";
import { SEND_CODE_URL } from "./BasePath";
import { httpMethods } from "./HttpService";






export const sendCodeToCurrentEmailHelper = async (options: FetchEntitiesOptions): Promise<Boolean | null> => {
    return apiCall<Boolean>({
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
