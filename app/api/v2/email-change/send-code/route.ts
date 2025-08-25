

import { httpMethods } from '@/lib/service/HttpService';
import RouteBaseService from '@/lib/service/RouteBaseService';
import { NextRequest } from 'next/server';

const URL = process.env.BASE_V2_URL
const EMAIL_CHANGE_PATH = "email-change/send-code"


export async function GET(req: NextRequest) {
    const clientIp = req.ip || req.headers.get('x-forwarded-for') || req.headers.get('remote-address');
    console.log("EMAIL_CHANGE_PATH ------------------------------------------")
    console.log(EMAIL_CHANGE_PATH)
    return RouteBaseService.request(URL + EMAIL_CHANGE_PATH, {
        method: httpMethods.GET,
        clientIp: clientIp, // ✅ IP'yi servise ilet
        // withAuth default: true
    });
}
