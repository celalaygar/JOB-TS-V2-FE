
// app/api/v2/project/route.ts
import { httpMethods } from '@/lib/service/HttpService';
import RouteBaseService from '@/lib/service/RouteBaseService';
import { NextRequest } from 'next/server';

const URL = process.env.BASE_V2_URL
const PROJECTS_TASK_COMMENT = "project-task-comment"


export async function DELETE(req: NextRequest,
    { params }: { params: Promise<{ commentId: string, taskId: string }> }
) {
    const clientIp = req.ip || req.headers.get('x-forwarded-for') || req.headers.get('remote-address');
    const c = await (await params).commentId;
    const t = await (await params).taskId;
    return RouteBaseService.request(URL + PROJECTS_TASK_COMMENT + "/delete/" + c + "/task/" + t, {
        method: httpMethods.DELETE,
        clientIp: clientIp, // ✅ IP'yi servise ilet
        // withAuth default: true
    });
}
