
// app/api/v2/project/route.ts
import RouteBaseService from '@/lib/service/RouteBaseService';
import { NextRequest } from 'next/server';

const URL = process.env.BASE_V2_URL
const SPRINT_TASK = "sprint-task"

export async function GET(req: NextRequest,
    { params }: { params: Promise<{ sprintId: string, projectId: string }> }
) {
    // ✅ NextRequest'ten client IP'yi al
    const clientIp = req.ip || req.headers.get('x-forwarded-for') || req.headers.get('remote-address');

    const sId = await (await params).sprintId;
    const pId = await (await params).projectId;
    return RouteBaseService.request(URL + SPRINT_TASK + "/sprint/" + sId + "/project/" + pId, {
        method: 'GET',
        clientIp: clientIp, // ✅ IP'yi servise ilet
        // withAuth default: true
    });
}


