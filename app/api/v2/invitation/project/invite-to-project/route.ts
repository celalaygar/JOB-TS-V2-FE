

import { NextRequest, NextResponse } from 'next/server';
import RouteBaseService from '@/lib/service/RouteBaseService';

const URL = process.env.BASE_V2_URL
const INVITE_TO_PROJECT = "invitations/project/inviteToProject"


export async function POST(req: NextRequest) {
    const body = await req.json();
    return RouteBaseService.request(URL + INVITE_TO_PROJECT, {
        method: 'POST',
        body: body
        // withAuth default: true
    });
}
