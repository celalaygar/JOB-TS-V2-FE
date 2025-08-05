

import { NextRequest } from 'next/server';
import RouteBaseService from '@/lib/service/RouteBaseService';

const URL = process.env.BASE_V2_URL
const BACKLOG = "backlog";

export async function GET(req: NextRequest) {
    const clientIp = req.ip || req.headers.get('x-forwarded-for') || req.headers.get('remote-address');

    return RouteBaseService.request(URL + BACKLOG, {
        method: 'GET',
        clientIp: clientIp, // ✅ IP'yi servise ilet    
        // withAuth default: true
    });
}

export async function POST(req: NextRequest) {
    const body = await req.json();
    const clientIp = req.ip || req.headers.get('x-forwarded-for') || req.headers.get('remote-address');
    return RouteBaseService.request(URL + BACKLOG, {
        method: 'POST',
        body: body,
        clientIp: clientIp, // ✅ IP'yi servise ilet                    
        // withAuth default: true
    });
}

export async function PUT(req: NextRequest) {
    const body = await req.json();
    const clientIp = req.ip || req.headers.get('x-forwarded-for') || req.headers.get('remote-address');
    return RouteBaseService.request(URL + BACKLOG, {
        method: 'PUT',
        body: body,
        clientIp: clientIp, // ✅ IP'yi servise ilet 
        // withAuth default: true
    });
}
