

import { NextRequest } from 'next/server';
import RouteBaseService from '@/lib/service/RouteBaseService';

const URL = process.env.BASE_V2_URL
const PROJECTS_TASK = "project-task"

export async function GET(req: NextRequest) {

    return RouteBaseService.request(URL + PROJECTS_TASK, {
        method: 'GET'
        // withAuth default: true
    });
}

export async function POST(req: NextRequest) {
    const body = await req.json();
    return RouteBaseService.request(URL + PROJECTS_TASK, {
        method: 'POST',
        body: body
        // withAuth default: true
    });
}

export async function PUT(req: NextRequest) {
    const body = await req.json();
    return RouteBaseService.request(URL + PROJECTS_TASK, {
        method: 'PUT',
        body: body
        // withAuth default: true
    });
}
