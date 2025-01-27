import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

import appConfig from '@/configs/appConfig';

import { decryptData } from '@/util/crypto.client';
import corsMiddleware from '@/middlewares/cors.middleare';

export async function middleware(request) {
    const { cookies, nextUrl } = request;
    const { pathname } = nextUrl;
    const token = cookies.get(appConfig?.CurrentUserToken)?.value;

    const isAPI = pathname.startsWith('/api');
    const adminURL = pathname.startsWith('/admin');
    const authURL = pathname.startsWith('/auth');
    // const mainURL = pathname === '/';

    // let userData = null;
    let isAdmin = false;

    // API routes: CORS and permissions
    if (isAPI) {
        // Run CORS handling
        const corsResponse = corsMiddleware(request);
        if (corsResponse) return corsResponse;

        // If all checks pass, allow the request to proceed
        return null;
    }

    if (token) {
        try {
            const decryptedToken = decryptData(token);
            const secret = new TextEncoder().encode(
                process?.env?.JWT_ACCESS_TOKEN_SECRET
            );
            const { payload } = await jwtVerify(decryptedToken, secret);
            // userData = payload?.currentUser;
            isAdmin =
                payload?.currentUser?.userType === 'admin' ||
                payload?.currentUser?.userType === 'super-admin';

            console.info(
                `######## Current user: ${payload?.currentUser?.userType} ########`
            );
        } catch (error) {
            console.error('Invalid or expired token:', error.message);
            // userData = null;

            // Clear both the token and refreshToken cookies
            const response = NextResponse.next();
            response.cookies.set(appConfig?.CurrentUserToken, '', {
                httpOnly: true,
                secure: true,
                maxAge: -1, // Immediately expire the token cookie
            });
            response.cookies.set(appConfig?.CurrentUserRefToken, '', {
                httpOnly: true,
                secure: true,
                maxAge: -1, // Immediately expire the refresh token cookie
            });
            return response;
        }
    }

    // Handle Authentication for /admin routes
    if (adminURL && !isAdmin) {
        console.info(
            'Redirecting to /auth/login: Unauthenticated access attempt'
        );
        return NextResponse.redirect(new URL('/auth/login', request.url));
    }

    // Redirect authenticated users trying to access login page
    if (isAdmin && authURL) {
        console.info(
            'Redirecting to /admin: Authenticated user trying to access auth URL'
        );
        return NextResponse.redirect(new URL('/admin', request.url));
    }

    return NextResponse.next();
}

export const config = {
    // matcher: ['/api/:path*', '/admin/:path*', '/((?!_next/static|_next/image|.*\\.png$).*)'],
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico, sitemap.xml, robots.txt (metadata files)
         */
        '/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
    ],
};
