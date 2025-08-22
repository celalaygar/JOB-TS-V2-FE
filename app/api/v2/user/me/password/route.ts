import { NextRequest } from 'next/server';
import RouteBaseService from '@/lib/service/RouteBaseService';
import { httpMethods } from '@/lib/service/HttpService';

const URL = process.env.BASE_V2_URL
const USER = "user/me/password"


export async function PATCH(req: NextRequest) {
    const body = await req.json();
    const clientIp = req.ip || req.headers.get('x-forwarded-for') || req.headers.get('remote-address');
    return RouteBaseService.request(URL + USER, {
        method: httpMethods.PATCH,
        body: body,
        clientIp: clientIp, // ✅ IP'yi servise ilet
        // withAuth default: true
    });
}
