
// app/api/v2/project/route.ts

import RouteBaseService from '@/lib/service/RouteBaseService';
import { NextRequest } from 'next/server';

const URL = process.env.BASE_V2_URL
const PROJECTS_T_STATUS = "project-task-status"

export async function GET(req: NextRequest,
    { params }: { params: Promise<{ projectId: string }> }
) {

    const pId = await (await params).projectId;
    return RouteBaseService.request(URL + PROJECTS_T_STATUS + "/project/" + pId, {
        method: 'GET'
        // withAuth default: true
    });
}

