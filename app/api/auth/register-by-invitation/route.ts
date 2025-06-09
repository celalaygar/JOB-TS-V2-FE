// app/api/auth/register/route.ts

import BaseService from '@/lib/service/BaseService';
import RouteBaseService from '@/lib/service/RouteBaseService';
import { NextRequest, NextResponse } from 'next/server';

const URL = process.env.BASE_URL
const REGISTER_PATH = URL + 'auth/register-by-invitation'

export async function POST(req: NextRequest) {
    const body = await req.json();
    return RouteBaseService.request(REGISTER_PATH, {
        method: 'POST',
        body: body,
        withAuth: false
        // withAuth default: true
    });
}

/*
export async function POST(req: NextRequest) {
    try {
        const body = await req.json();

        const result = await BaseService.request<any>(URL + 'auth/register-by-invitation', {
            method: 'POST',
            body,
        });

        return NextResponse.json(result, { status: 200 });
    } catch (error: any) {
        const statusCode = error?.status || 500; // ❗ Doğrudan kullan
        return NextResponse.json({ error: error.message || 'Unexpected error' }, { status: statusCode });
    }
}
*/
