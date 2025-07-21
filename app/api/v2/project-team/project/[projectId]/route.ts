
// app/api/v2/project/route.ts

import RouteBaseService from '@/lib/service/RouteBaseService';
import { NextRequest } from 'next/server';

const URL = process.env.BASE_V2_URL
const PROJECT_TEAM = "project-team"

export async function GET(req: NextRequest,
    { params }: { params: Promise<{ projectId: string }> }
) {

    const clientIp = req.ip || req.headers.get('x-forwarded-for') || req.headers.get('remote-address');
    const pId = await (await params).projectId;
    return RouteBaseService.request(URL + PROJECT_TEAM + "/project/" + pId, {
        method: 'GET',
        clientIp: clientIp, // ✅ IP'yi servise ilet
        // withAuth default: true
    });
}

