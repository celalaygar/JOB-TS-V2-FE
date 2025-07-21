


import { NextRequest } from 'next/server';
import RouteBaseService from '@/lib/service/RouteBaseService';

const URL = process.env.BASE_V2_URL
const USER_ROLES = "project-user-roles"

export async function PUT(req: NextRequest, { params }: { params: Promise<{ roleId: string }> }) {

    const roleId = await (await params).roleId;
    const body = await req.json();
    const clientIp = req.ip || req.headers.get('x-forwarded-for') || req.headers.get('remote-address');
    return RouteBaseService.request(URL + USER_ROLES + "/" + roleId, {
        method: 'PUT',
        body: body,
        clientIp: clientIp, // ✅ IP'yi servise ilet
        // withAuth default: true
    });
}
