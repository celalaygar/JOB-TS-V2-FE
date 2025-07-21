

import { NextRequest } from 'next/server';
import RouteBaseService from '@/lib/service/RouteBaseService';

const URL = process.env.BASE_V2_URL
const USER_ROLES = "project-user-roles"

export async function GET(req: NextRequest) {

    const clientIp = req.ip || req.headers.get('x-forwarded-for') || req.headers.get('remote-address');
    return RouteBaseService.request(URL + USER_ROLES, {
        method: 'GET', clientIp: clientIp // ✅ IP'yi servise ilet
        // withAuth default: true
    });
}

export async function POST(req: NextRequest) {
    const body = await req.json();
    const clientIp = req.ip || req.headers.get('x-forwarded-for') || req.headers.get('remote-address');
    return RouteBaseService.request(URL + USER_ROLES, {
        method: 'POST',
        body: body,
        clientIp: clientIp, // ✅ IP'yi servise ilet
        // withAuth default: true
    });
}
