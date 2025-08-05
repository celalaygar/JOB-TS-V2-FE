

import { NextRequest } from 'next/server';
import RouteBaseService from '@/lib/service/RouteBaseService';

const URL = process.env.BASE_V2_URL
const PROJECTS_TASK = "project-task"


export async function POST(req: NextRequest,
    { params }: { params: Promise<{ page: string, size: string }> }
) {
    const clientIp = req.ip || req.headers.get('x-forwarded-for') || req.headers.get('remote-address');

    const body = await req.json();
    const p = await (await params).page;
    const s = await (await params).size;
    return RouteBaseService.request(URL + PROJECTS_TASK + "/filter?page=" + p + "&size=" + s, {
        method: 'POST',
        body: body,
        clientIp: clientIp, // ✅ IP'yi servise ilet
        // withAuth default: true
    });
}
