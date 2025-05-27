// app/lib/api/RouteBaseService.ts

import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';
import { authOptions } from '@/app/api/auth/[...nextauth]/authOptions';
import BaseService from './BaseService';

interface RouteRequestOptions {
    method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
    headers?: HeadersInit;
    body?: any;
    queryParams?: Record<string, string | number | boolean>;
    withAuth?: boolean; // default: true
}

class RouteBaseService {
    static async request<T>(url: string, options: RouteRequestOptions = {}) {
        const withAuth = options.withAuth !== false;

        let token: string | undefined;

        if (withAuth) {
            const session = await getServerSession(authOptions);
            if (!session || !session.accessToken) {
                return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
            }
            token = session.accessToken;
        }

        const headers: HeadersInit = {
            'Content-Type': 'application/json',
            ...(options.headers || {}),
        };

        if (withAuth && token) {
            headers['Authorization'] = token;
        }
        console.log("RouteBaseService url : " + url)
        try {
            const result = await BaseService.request<T>(url, {
                method: options.method,
                headers,
                body: options.body,
                queryParams: options.queryParams,
            });

            return NextResponse.json(result, { status: 200 });
        } catch (error: any) {
            const statusCode = error?.status || 500;
            return NextResponse.json({ error: error.message || 'Unexpected error' }, { status: statusCode });
        }
    }
}

export default RouteBaseService;
