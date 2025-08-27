

import { httpMethods } from '@/lib/service/HttpService';
import RouteBaseService from '@/lib/service/RouteBaseService';
import { NextRequest } from 'next/server';

const URL = process.env.BASE_V2_URL
const EMAIL_CHANGE_PATH = "public/email-change/validate-token"


export async function POST(req: NextRequest
) {
    const clientIp = req.ip || req.headers.get('x-forwarded-for') || req.headers.get('remote-address');

    const body = await req.json();
    console.log(body)
    return RouteBaseService.request(URL + EMAIL_CHANGE_PATH, {
        method: httpMethods.POST,
        body,
        clientIp: clientIp, // ✅ IP'yi servise ilet
        withAuth: false
    });
}
