

import { NextRequest } from 'next/server';
import RouteBaseService from '@/lib/service/RouteBaseService';

const URL = process.env.BASE_V2_URL
const SPRINT_TASK = "sprint-task"

/*
export async function GET(req: NextRequest) {

    return RouteBaseService.request(URL + SPRINT_TASK, {
        method: 'GET'
        // withAuth default: true
    });
}
*/
