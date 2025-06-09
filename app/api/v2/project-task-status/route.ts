

import { NextRequest } from 'next/server';
import RouteBaseService from '@/lib/service/RouteBaseService';

const URL = process.env.BASE_V2_URL
const PROJECTS_T_STATUS = "project-task-status"


export async function POST(req: NextRequest) {
    const body = await req.json();
    return RouteBaseService.request(URL + PROJECTS_T_STATUS, {
        method: 'POST',
        body: body
        // withAuth default: true
    });
}

export async function PUT(req: NextRequest) {
    const body = await req.json();
    return RouteBaseService.request(URL + PROJECTS_T_STATUS + "/" + body.id, {
        method: 'PUT',
        body: body
        // withAuth default: true
    });
}
