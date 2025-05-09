import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { links } from './data/links';

// Middleware fonksiyonu
export async function middleware(request: NextRequest) {
    const token = await getToken({ req: request, secret: process.env.SECRET_KEY });

    //const cookies = parse(request.headers.get('cookie') || '');


    // Kullanıcı giriş yapmışsa, login sayfasına erişimini engelle
    if (token && request.nextUrl.pathname === links.login) {
        return NextResponse.redirect(new URL(links.dashboard, request.url));
    }

    // Kullanıcı giriş yapmamışsa, giriş yapılması gereken sayfalara erişimini engelle
    if (!token && request.nextUrl.pathname !== links.login && request.nextUrl.pathname !== links.register) {
        return NextResponse.redirect(new URL(links.login, request.url));
    }

    // Diğer durumlarda isteği devam ettir
    return NextResponse.next();
}


export const config = {
    matcher: [
        '/',
        '/backlog',
        '/companies',
        '/companies/:id([a-zA-Z0-9\-]+)',
        '/dashboard',
        '/kanban',
        '/logout',
        '/my-company',
        '/notifications',
        '/profile',
        '/projects',
        '/projects/:id([a-zA-Z0-9\-]+)',
        '/projects/:id([a-zA-Z0-9\-]+)/status-management',
        '/register',
        '/reports',
        '/request-approvals/leave',
        '/request-approvals/overtime',
        '/request-approvals/spending',
        '/request/leave',
        '/request/overtime',
        '/request/spending',
        '/sprints',
        '/tasks',
        '/tasks/new',
        '/tasks/:taskId([a-zA-Z0-9\-]+)',
        '/tasks/:taskId([a-zA-Z0-9\-]+)/edit',
        '/teams/project-teams',
        '/teams/:projectId([a-zA-Z0-9\-]+)/:teamId([a-zA-Z0-9\-]+)',
        '/teams/company-teams/:companyId([a-zA-Z0-9\-]+)/:teamId([a-zA-Z0-9\-]+)',
        '/users',
        '/weekly-board',
    ],
};
