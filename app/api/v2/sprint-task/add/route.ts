

import { NextRequest } from 'next/server';
import RouteBaseService from '@/lib/service/RouteBaseService';

const URL = process.env.BASE_V2_URL
const SPRINT_TASK = "sprint-task"


export async function POST(req: NextRequest) {
    const body = await req.json();
    return RouteBaseService.request(URL + SPRINT_TASK + "/add", {
        method: 'POST',
        body: body
        // withAuth default: true
    });
}
