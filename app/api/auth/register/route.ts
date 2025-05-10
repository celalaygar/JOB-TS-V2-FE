// app/api/auth/register/route.ts

import { NextRequest, NextResponse } from 'next/server';
import BaseService from '@/lib/api/BaseService';

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();

        const result = await BaseService.request<any>('http://localhost:8080/api/auth/register', {
            method: 'POST',
            body,
        });

        return NextResponse.json(result, { status: 200 });
    } catch (error: any) {
        const statusCode = getStatusFromError(error.message);
        return NextResponse.json({ error: error.message }, { status: statusCode });
    }
}

// Utility: parse status code from error message string
function getStatusFromError(message: string): number {
    const match = message.match(/\[(\d{3})\]/);
    return match ? parseInt(match[1], 10) : 500;
}
