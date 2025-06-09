import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';
import { authOptions } from '@/app/api/auth/[...nextauth]/authOptions';

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

interface RequestOptions {
    method?: HttpMethod;
    headers?: HeadersInit;
    body?: any;
    queryParams?: Record<string, string | number | boolean>;
    withAuth?: boolean; // default: true
    returnRawResponse?: boolean; // optional for internal use
}

class RouteBaseService {
    private static buildUrl(url: string, queryParams?: RequestOptions['queryParams']) {
        if (!queryParams) return url;
        const params = new URLSearchParams(queryParams as Record<string, string>);
        return `${url}?${params.toString()}`;
    }

    private static async buildHeaders(withAuth: boolean, customHeaders?: HeadersInit) {
        const headers: HeadersInit = {
            'Content-Type': 'application/json',
            ...(customHeaders || {}),
        };

        if (withAuth) {
            const session = await getServerSession(authOptions);
            if (!session || !session.accessToken) {
                throw {
                    status: 401,
                    message: 'Unauthorized',
                };
            }
            headers['Authorization'] = session.accessToken;
        }

        return headers;
    }

    public static async request<T>(url: string, options: RequestOptions = {}): Promise<NextResponse> {
        const {
            method = 'GET',
            headers: customHeaders,
            body,
            queryParams,
            withAuth = true,
        } = options;

        const fullUrl = this.buildUrl(url, queryParams);
        let headers: HeadersInit;

        try {
            headers = await this.buildHeaders(withAuth, customHeaders);
        } catch (error: any) {
            return NextResponse.json({ error: error.message || 'Unauthorized' }, { status: error.status || 401 });
        }

        const config: RequestInit = {
            method,
            headers,
            body: body ? JSON.stringify(body) : undefined,
        };

        try {
            const response = await fetch(fullUrl, config);
            const contentType = response.headers.get('Content-Type');
            const isJson = contentType?.includes('application/json');

            if (!response.ok) {
                const errorBody = isJson ? await response.json() : await response.text();
                const errorMessage = isJson && (errorBody as any)?.error ? (errorBody as any).error : response.statusText;
                throw {
                    status: response.status,
                    message: errorMessage,
                    raw: errorBody,
                };
            }

            const data = isJson ? await response.json() : await response.text();
            return NextResponse.json(data, { status: 200 });
        } catch (error: any) {
            console.error('RouteBaseService Error:', error);
            return NextResponse.json({ error: error.message || 'Unexpected error' }, { status: error.status || 500 });
        }
    }
}

export default RouteBaseService;
