// app/lib/api/BaseService.ts



type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

interface RequestOptions {
    method?: HttpMethod;
    headers?: HeadersInit;
    body?: any;
    queryParams?: Record<string, string | number | boolean>;
}

class BaseService {
    private static buildUrl(url: string, queryParams?: RequestOptions['queryParams']) {
        if (!queryParams) return url;
        const params = new URLSearchParams(queryParams as any);
        return `${url}?${params.toString()}`;
    }

    public static async request<T>(url: string, options: RequestOptions = {}): Promise<T> {
        const fullUrl = this.buildUrl(url, options.queryParams);
        const config: RequestInit = {
            method: options.method || 'GET',
            headers: {
                'Content-Type': 'application/json',
                ...(options.headers || {}),
            },
            body: options.body ? JSON.stringify(options.body) : undefined,
        };

        try {
            const response = await fetch(fullUrl, config);
            const contentType = response.headers.get('Content-Type');
            const isJson = contentType?.includes('application/json');

            if (!response.ok) {
                const errorBody = isJson ? await response.json() : await response.text();
                const errorMessage = isJson && errorBody?.error ? errorBody.error : response.statusText;
                throw {
                    status: response.status,
                    message: errorMessage,
                    raw: errorBody,
                };
            }

            return isJson ? await response.json() : ((await response.text()) as any);
        } catch (error: any) {
            console.error("BaseService url catch: " + url)
            console.error('BaseService API Request Error:', error);
            let body = {
                status: error?.status,
                message: error?.message || 'Unexpected error',
                raw: error?.raw?.raw || error,
            };
            console.error('BaseService API Request Error body:', body);
            throw body;
        }
    }
}

export default BaseService;
