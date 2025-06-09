

import { NextRequest, NextResponse } from 'next/server';
import RouteBaseService from '@/lib/service/RouteBaseService';

const URL = process.env.BASE_V2_URL
const INVITATION_ACCEPT = "invitations/project/accept"


export async function POST(req: NextRequest) {
    const body = await req.json();
    return RouteBaseService.request(URL + INVITATION_ACCEPT, {
        method: 'POST',
        body: body
        // withAuth default: true
    });
}
