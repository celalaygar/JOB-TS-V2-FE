
// app/api/v2/project/route.ts
import RouteBaseService from '@/lib/service/RouteBaseService';
import { NextRequest } from 'next/server';

const URL = process.env.BASE_V2_URL
const SPRINT = "sprint"

export async function GET(req: NextRequest,
    { params }: { params: Promise<{ projectId: string }> }
) {

    const pId = await (await params).projectId;
    return RouteBaseService.request(URL + SPRINT + "/non-completed/project/" + pId, {
        method: 'GET'
        // withAuth default: true
    });
}


