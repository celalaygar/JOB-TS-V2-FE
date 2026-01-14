import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { links } from './data/links';

export async function middleware(request: NextRequest) {
    const token = await getToken({ req: request, secret: process.env.SECRET_KEY });

    const path = request.nextUrl.pathname;


    // Token YOKKEN erişilebilecek sayfalar
    const publicPaths = [
        links.login,
        links.register,
    ];

    const isInvitePath = path.startsWith('/register/invite/');

    // Token yoksa, sadece login/register/register/invite/... yollarına izin ver
    if (!token) {
        if (!publicPaths.includes(path) && !isInvitePath) {
            return NextResponse.redirect(new URL(links.login, request.url));
        }
    }

    // Token varsa, login/register/register/invite/... yollarına gidemesin → dashboard’a yönlendir
    if (token) {
        if (publicPaths.includes(path) || isInvitePath) {
            return NextResponse.redirect(new URL(links.dashboard, request.url));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        '/',
        '/backlog',
        '/dashboard',
        '/kanban',
        '/logout',
        '/notifications',
        '/profile',
        '/projects',
        '/projects/:id([a-zA-Z0-9\-]+)',
        '/projects/:id([a-zA-Z0-9\-]+)/status-management',
        '/register',
        '/register/invite/:token([a-zA-Z0-9\-]+)',
        '/tasks',
        '/tasks/:taskId([a-zA-Z0-9\-]+)',
        '/tasks/:taskId([a-zA-Z0-9\-]+)/edit',
        '/teams/project-teams',
        '/teams/:projectId([a-zA-Z0-9\-]+)/:teamId([a-zA-Z0-9\-]+)',
        /*
                '/tasks/new',
                '/teams/company-teams/:companyId([a-zA-Z0-9\-]+)/:teamId([a-zA-Z0-9\-]+)',
                '/users',
                '/weekly-board',
                '/companies',
                '/companies/:id([a-zA-Z0-9\-]+)',
                '/reports',
                '/request-approvals/leave',
                '/request-approvals/overtime',
                '/request-approvals/spending',
                '/request/leave',
                '/request/overtime',
                '/request/spending',
                '/my-company',
                '/sprints',
        */
    ],
};
