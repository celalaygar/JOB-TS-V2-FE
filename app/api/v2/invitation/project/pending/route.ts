

import { NextRequest } from 'next/server';
import RouteBaseService from '@/lib/service/RouteBaseService';

const URL = process.env.BASE_V2_URL
const INVITATION_BY_PENDING = "invitations/project/pending"

export async function GET(req: NextRequest) {

    return RouteBaseService.request(URL + INVITATION_BY_PENDING, {
        method: 'GET'
        // withAuth default: true
    });
}

