

import { NextRequest } from 'next/server';
import RouteBaseService from '@/lib/service/RouteBaseService';

const URL = process.env.BASE_V2_URL
const PERMISSION = "permissions"

export async function GET(req: NextRequest) {
    const clientIp = req.ip || req.headers.get('x-forwarded-for') || req.headers.get('remote-address');

    return RouteBaseService.request(URL + PERMISSION + "/project-user-role", {
        method: 'GET',
        clientIp: clientIp, // ✅ IP'yi servise ilet
        // withAuth default: true
    });
}

