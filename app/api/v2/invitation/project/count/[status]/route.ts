
// app/api/v2/project/route.ts
import RouteBaseService from '@/lib/service/RouteBaseService';
import { NextRequest } from 'next/server';


const URL = process.env.BASE_V2_URL
const INVITATIONS_PROJECT = "invitations/project"

export async function GET(req: NextRequest,
    { params }: { params: Promise<{ status: string }> }
) {
    const clientIp = req.ip || req.headers.get('x-forwarded-for') || req.headers.get('remote-address');

    const st = await (await params).status;
    return RouteBaseService.request(URL + INVITATIONS_PROJECT + "/count/" + st, {
        method: 'GET',
        clientIp: clientIp, // ✅ IP'yi servise ilet
        // withAuth default: true
    });
}

