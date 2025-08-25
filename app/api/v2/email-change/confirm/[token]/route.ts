

import { httpMethods } from '@/lib/service/HttpService';
import RouteBaseService from '@/lib/service/RouteBaseService';
import { NextRequest } from 'next/server';

const URL = process.env.BASE_V2_URL
const EMAIL_CHANGE_PATH = "email-change/confirm"


export async function POST(req: NextRequest,
    { params }: { params: Promise<{ token: string }> }
) {
    const clientIp = req.ip || req.headers.get('x-forwarded-for') || req.headers.get('remote-address');

    const body = await req.json();
    const t = await (await params).token;
    return RouteBaseService.request(URL + EMAIL_CHANGE_PATH + "/" + t, {
        method: 'POST',
        body: body,
        clientIp: clientIp, // ✅ IP'yi servise ilet
        // withAuth default: true
    });
}
