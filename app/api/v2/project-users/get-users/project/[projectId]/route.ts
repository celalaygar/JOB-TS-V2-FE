
// app/api/v2/project/route.ts
import RouteBaseService from '@/lib/service/RouteBaseService';
import { NextRequest, NextResponse } from 'next/server';

const URL = process.env.BASE_V2_URL
const PROJECT_USER = "project-users/get-users/project"

export async function GET(req: NextRequest,
    { params }: { params: Promise<{ projectId: string }> }
) {

    const pId = await (await params).projectId;
    return RouteBaseService.request(URL + PROJECT_USER + "/" + pId, {
        method: 'GET'
        // withAuth default: true
    });
}

