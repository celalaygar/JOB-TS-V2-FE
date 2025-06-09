


import { NextRequest } from 'next/server';
import RouteBaseService from '@/lib/service/RouteBaseService';

const URL = process.env.BASE_V2_URL
const USER_ROLES = "project-user-roles"

export async function PUT(req: NextRequest, { params }: { params: Promise<{ roleId: string }> }) {

    const roleId = await (await params).roleId;
    const body = await req.json();
    return RouteBaseService.request(URL + USER_ROLES + "/" + roleId, {
        method: 'PUT',
        body: body
        // withAuth default: true
    });
}
