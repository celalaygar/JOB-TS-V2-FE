

import { NextRequest } from 'next/server';
import RouteBaseService from '@/lib/service/RouteBaseService';

const URL = process.env.BASE_V2_URL
const INVITATION_DECLINE = "invitations/project/decline"


export async function POST(req: NextRequest) {
    const clientIp = req.ip || req.headers.get('x-forwarded-for') || req.headers.get('remote-address');

    const body = await req.json();
    return RouteBaseService.request(URL + INVITATION_DECLINE, {
        method: 'POST',
        body: body,
        clientIp: clientIp, // ✅ IP'yi servise ilet
        // withAuth default: true
    });
}
