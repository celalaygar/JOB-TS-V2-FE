

import { httpMethods } from '@/lib/service/HttpService';
import RouteBaseService from '@/lib/service/RouteBaseService';
import { NextRequest } from 'next/server';

const URL = process.env.BASE_V2_URL
const EMAIL_CHANGE_PATH = "public/email-change/reject"


export async function GET(req: NextRequest,
    { params }: { params: Promise<{ token: string }> }
) {
    const clientIp = req.ip || req.headers.get('x-forwarded-for') || req.headers.get('remote-address');

    const t = await (await params).token;
    return RouteBaseService.request(URL + EMAIL_CHANGE_PATH + "/" + t, {
        method: httpMethods.GET,
        clientIp: clientIp, // ✅ IP'yi servise ilet
        withAuth: false
    });
}
