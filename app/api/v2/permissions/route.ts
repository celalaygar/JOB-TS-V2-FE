

import { NextRequest, NextResponse } from 'next/server';
import RouteBaseService from '@/lib/service/RouteBaseService';

const URL = process.env.BASE_V2_URL
const PERMISSION = "permissions"

export async function GET(req: NextRequest) {

    return RouteBaseService.request(URL + PERMISSION + "/project-user-role", {
        method: 'GET'
        // withAuth default: true
    });
}

