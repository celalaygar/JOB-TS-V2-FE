// app/api/auth/register/route.ts

import { NextRequest } from 'next/server';
import RouteBaseService from '@/lib/service/RouteBaseService';

const URL = process.env.BASE_V2_URL
const PROJECT_TEAM = "project-team"
const PROJECT_TEAM_DETAIL = PROJECT_TEAM + "/get-team-detail"


export async function POST(req: NextRequest) {
    const body = await req.json();
    return RouteBaseService.request(URL + PROJECT_TEAM_DETAIL, {
        method: 'POST',
        body: body
        // withAuth default: true
    });
}

