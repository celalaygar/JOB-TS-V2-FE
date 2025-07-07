
// app/api/v2/project/route.ts
import RouteBaseService from '@/lib/service/RouteBaseService';
import { NextRequest } from 'next/server';

const URL = process.env.BASE_V2_URL
const PROJECTS_TASK = "project-task"

export async function GET(req: NextRequest,
    { params }: { params: Promise<{ projectTaskId: string }> }
) {

    const pId = await (await params).projectTaskId;
    return RouteBaseService.request(URL + PROJECTS_TASK + "/" + pId, {
        method: 'GET'
        // withAuth default: true
    });
}


export async function PUT(req: NextRequest,
    { params }: { params: Promise<{ projectTaskId: string }> }
) {
    const body = await req.json();
    const pId = await (await params).projectTaskId;
    return RouteBaseService.request(URL + PROJECTS_TASK + "/" + pId, {
        method: 'PUT',
        body: body
        // withAuth default: true
    });
}
