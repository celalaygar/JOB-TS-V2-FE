// app/api/auth/register/route.ts

import BaseService from '@/lib/BaseService';
import { NextRequest, NextResponse } from 'next/server';


export async function POST(req: NextRequest) {
    try {
        const body = await req.json();

        const result = await BaseService.request<any>('http://localhost:8080/api/auth/register', {
            method: 'POST',
            body,
        });

        return NextResponse.json(result, { status: 200 });
    } catch (error: any) {
        const statusCode = error?.status || 500; // ❗ Doğrudan kullan
        return NextResponse.json({ error: error.message || 'Unexpected error' }, { status: statusCode });
    }
}

