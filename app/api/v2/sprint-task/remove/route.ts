

import { NextRequest } from 'next/server';
import RouteBaseService from '@/lib/service/RouteBaseService';

const URL = process.env.BASE_V2_URL
const SPRINT_TASK = "sprint-task"


export async function POST(req: NextRequest) {
    const clientIp = req.ip || req.headers.get('x-forwarded-for') || req.headers.get('remote-address');
    const body = await req.json();
    return RouteBaseService.request(URL + SPRINT_TASK + "/remove", {
        method: 'POST',
        body: body,
        clientIp: clientIp, // ✅ IP'yi servise ilet
        // withAuth default: true
    });
}
