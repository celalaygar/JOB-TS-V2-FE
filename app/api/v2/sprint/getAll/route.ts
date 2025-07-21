

import { NextRequest } from 'next/server';
import RouteBaseService from '@/lib/service/RouteBaseService';

const URL = process.env.BASE_V2_URL
const SPRINT = "sprint"

export async function GET(req: NextRequest) {
    const clientIp = req.ip || req.headers.get('x-forwarded-for') || req.headers.get('remote-address');
    console.log("Client IP:", clientIp); // Log the client IP for debugging
    console.log("Client IP:", req.ip); // Log the client IP for debugging
    console.log("Client IP:", req.url); // Log the client IP for debugging
    console.log("Client IP:", req.nextUrl); // Log the client IP for debugging
    return RouteBaseService.request(URL + SPRINT + "/getAll", {
        method: 'GET', clientIp: clientIp, // ✅ IP'yi servise ilet
        // withAuth default: true
    });
}
