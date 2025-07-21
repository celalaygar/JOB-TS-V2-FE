
// app/api/v2/project/route.ts
import RouteBaseService from '@/lib/service/RouteBaseService';
import { NextRequest } from 'next/server';

const URL = process.env.BASE_V2_URL
const SPRINT = "sprint"

export async function GET(req: NextRequest,
    { params }: { params: Promise<{ sprintId: string }> }
) {
    const clientIp = req.ip || req.headers.get('x-forwarded-for') || req.headers.get('remote-address');

    const sId = await (await params).sprintId;
    return RouteBaseService.request(URL + SPRINT + "/" + sId, {
        method: 'GET',
        clientIp: clientIp,
        // withAuth default: true
    });
}

export async function PUT(req: NextRequest,
    { params }: { params: Promise<{ sprintId: string }> }
) {

    const clientIp = req.ip || req.headers.get('x-forwarded-for') || req.headers.get('remote-address');
    const sId = await (await params).sprintId;
    const body = await req.json();
    return RouteBaseService.request(URL + SPRINT + "/" + sId, {
        method: 'PUT',
        body: body,
        clientIp: clientIp, // ✅ IP'yi servise ilet
        // withAuth default: true
    });
}

