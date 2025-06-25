

import { NextRequest } from 'next/server';
import RouteBaseService from '@/lib/service/RouteBaseService';

const URL = process.env.BASE_V2_URL
const SPRINT = "sprint"

export async function GET(req: NextRequest) {

    return RouteBaseService.request(URL + SPRINT + "/getAll", {
        method: 'GET'
        // withAuth default: true
    });
}
