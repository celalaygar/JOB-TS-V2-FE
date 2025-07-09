
// app/api/v2/project/route.ts
import RouteBaseService from '@/lib/service/RouteBaseService';
import { NextRequest } from 'next/server';

const URL = process.env.BASE_V2_URL
const SPRINT_TASK = "sprint-task"

export async function GET(req: NextRequest,
    { params }: { params: Promise<{ sprintId: string, projectId: string }> }
) {

    const sId = await (await params).sprintId;
    const pId = await (await params).projectId;
    console.log("Fetching sprint tasks for sprintId:", sId, "and projectId:", pId);
    console.log("Request URL:", URL + SPRINT_TASK + "/sprint/" + sId + "/project/" + pId);
    return RouteBaseService.request(URL + SPRINT_TASK + "/sprint/" + sId + "/project/" + pId, {
        method: 'GET'
        // withAuth default: true
    });
}


