// app/api/auth/register/route.ts

import { NextRequest, NextResponse } from 'next/server';
import RouteBaseService from '@/lib/service/RouteBaseService';

const URL = process.env.BASE_V2_URL
const PROJECTS = "projects"

export async function GET(req: NextRequest) {

    return RouteBaseService.request(URL + PROJECTS, {
        method: 'GET'
        // withAuth default: true
    });
}

export async function POST(req: NextRequest) {
    const body = await req.json();
    return RouteBaseService.request(URL + PROJECTS, {
        method: 'POST',
        body: body
        // withAuth default: true
    });
}
