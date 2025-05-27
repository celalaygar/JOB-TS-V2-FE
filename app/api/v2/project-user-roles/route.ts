// app/api/auth/register/route.ts

import BaseService from '@/lib/service/BaseService';
import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';
import RouteBaseService from '@/lib/service/RouteBaseService';

const URL = process.env.BASE_V2_URL
const USER_ROLES = "project-user-roles"

export async function GET(req: NextRequest) {

    return RouteBaseService.request(URL + USER_ROLES, {
        method: 'GET'
        // withAuth default: true
    });
}

export async function POST(req: NextRequest) {
    const body = await req.json();
    return RouteBaseService.request(URL + USER_ROLES, {
        method: 'POST',
        body: body
        // withAuth default: true
    });
}
