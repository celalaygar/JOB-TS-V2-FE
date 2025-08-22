

import { httpMethods } from '@/lib/service/HttpService';
import RouteBaseService from '@/lib/service/RouteBaseService';
import { NextRequest } from 'next/server';

const URL = process.env.BASE_V2_URL
const USER = "user"

export async function GET(req: NextRequest) {

    const clientIp = req.ip || req.headers.get('x-forwarded-for') || req.headers.get('remote-address');
    return RouteBaseService.request(URL + USER, {
        method: httpMethods.GET,
        clientIp: clientIp, // ✅ IP'yi servise ilet
        // withAuth default: true
    });
}

