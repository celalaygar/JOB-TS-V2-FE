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
