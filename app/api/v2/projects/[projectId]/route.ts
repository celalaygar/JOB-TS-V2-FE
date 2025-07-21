
// app/api/v2/project/route.ts
import RouteBaseService from '@/lib/service/RouteBaseService';
import { NextRequest } from 'next/server';

const URL = process.env.BASE_V2_URL

export async function GET(req: NextRequest,
    { params }: { params: Promise<{ projectId: string }> }
) {

    const clientIp = req.ip || req.headers.get('x-forwarded-for') || req.headers.get('remote-address');
    const pId = await (await params).projectId;
    return RouteBaseService.request(URL + "projects/" + pId, {
        method: 'GET',
        clientIp: clientIp, // ✅ IP'yi servise ilet
        // withAuth default: true
    });
}

