
// app/api/v2/project/route.ts
import RouteBaseService from '@/lib/service/RouteBaseService';
import { NextRequest } from 'next/server';

const URL = process.env.BASE_V2_URL
const SPRINT = "sprint"

export async function PUT(req: NextRequest,
    { params }: { params: Promise<{ sprintId: string }> }
) {

    const sId = await (await params).sprintId;
    const body = await req.json();
    return RouteBaseService.request(URL + SPRINT + "/" + sId, {
        method: 'PUT',
        body: body
        // withAuth default: true
    });
}

