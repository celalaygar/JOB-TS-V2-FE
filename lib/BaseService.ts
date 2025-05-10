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

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`[${response.status}] ${response.statusText}: ${errorText}`);
            }

            const contentType = response.headers.get('Content-Type');
            if (contentType?.includes('application/json')) {
                return await response.json();
            } else {
                // if response is not JSON
                return (await response.text()) as any;
            }
        } catch (error: any) {
            console.error('API Request Error:', error.message);
            throw new Error(`API Error: ${error.message}`);
        }
    }
}

export default BaseService;
