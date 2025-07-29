

import { NextRequest } from 'next/server';
import RouteBaseService from '@/lib/service/RouteBaseService';

const URL = process.env.BASE_V2_URL
const PROJECT_TEAM_USER_URL = "project-team-user"

// export async function GET(req: NextRequest) {
//     return RouteBaseService.request(URL + PROJECT_TEAM, {
//         method: 'GET'
//         // withAuth default: true
//     });
// }

export async function POST(req: NextRequest) {
    const body = await req.json();
    const clientIp = req.ip || req.headers.get('x-forwarded-for') || req.headers.get('remote-address');
    return RouteBaseService.request(URL + PROJECT_TEAM_USER_URL+"/in-team", {
        method: 'POST',
        body: body,
        clientIp: clientIp, // ✅ IP'yi servise ilet
        // withAuth default: true
    });
}

