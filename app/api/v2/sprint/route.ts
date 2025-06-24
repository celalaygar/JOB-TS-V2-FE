

import { NextRequest } from 'next/server';
import RouteBaseService from '@/lib/service/RouteBaseService';

const URL = process.env.BASE_V2_URL
const SPRINT = "sprint"

export async function GET(req: NextRequest) {

    return RouteBaseService.request(URL + SPRINT, {
        method: 'GET'
        // withAuth default: true
    });
}

export async function POST(req: NextRequest) {
    const body = await req.json();
    return RouteBaseService.request(URL + SPRINT, {
        method: 'POST',
        body: body
        // withAuth default: true
    });
}
