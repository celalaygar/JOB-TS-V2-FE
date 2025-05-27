// app/api/auth/register/route.ts

import BaseService from '@/lib/service/BaseService';
import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';
import RouteBaseService from '@/lib/service/RouteBaseService';

const URL = process.env.BASE_V2_URL
const PROJECT_TEAM = "project-team"

// export async function GET(req: NextRequest) {
//     return RouteBaseService.request(URL + PROJECT_TEAM, {
//         method: 'GET'
//         // withAuth default: true
//     });
// }

export async function POST(req: NextRequest) {
    const body = await req.json();
    return RouteBaseService.request(URL + PROJECT_TEAM, {
        method: 'POST',
        body: body
        // withAuth default: true
    });
}

export async function PUT(req: NextRequest) {
    const body = await req.json();
    return RouteBaseService.request(URL + PROJECT_TEAM, {
        method: 'PUT',
        body: body
        // withAuth default: true
    });
}
