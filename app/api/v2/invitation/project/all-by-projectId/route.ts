

import { NextRequest } from 'next/server';
import RouteBaseService from '@/lib/service/RouteBaseService';

const URL = process.env.BASE_V2_URL
const INVITE_BY_PROJECT_ID = "invitations/project/all-by-projectId"



export async function POST(req: NextRequest) {
    const body = await req.json();
    return RouteBaseService.request(URL + INVITE_BY_PROJECT_ID, {
        method: 'POST',
        body: body
        // withAuth default: true
    });
}
