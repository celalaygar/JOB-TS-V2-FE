
// app/api/v2/project/route.ts
import RouteBaseService from '@/lib/service/RouteBaseService';
import { NextRequest } from 'next/server';

const URL = process.env.BASE_V2_URL
const PROJECTS_TASK_COMMENT = "project-task-comment"

export async function GET(req: NextRequest,
    { params }: { params: Promise<{ projectTaskId: string }> }
) {
    const clientIp = req.ip || req.headers.get('x-forwarded-for') || req.headers.get('remote-address');

    const pId = await (await params).projectTaskId;
    return RouteBaseService.request(URL + PROJECTS_TASK_COMMENT + "/" + pId, {
        method: 'GET',
        clientIp: clientIp, // ✅ IP'yi servise ilet
        // withAuth default: true
    });
}
