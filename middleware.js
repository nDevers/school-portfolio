import { NextResponse } from 'next/server';
import { decryptData } from '@/util/crypto.client';
import appConfig from '@/configs/appConfig';

export async function middleware(request) {
    const { cookies, nextUrl } = request;
    const { pathname } = nextUrl;
    const token = cookies.get(appConfig?.CurrentUserToken)?.value;

    const adminURL = pathname.startsWith('/admin');
    const authURL = pathname.startsWith('/auth');
    const mainURL = pathname === '/';

    let userData = null;
    let isAdmin = false;

    if (token) {
        try {
            // Decode encrypted token first
            const decryptedToken = decryptData(token)
            // Verify and decode the token
            const secret = new TextEncoder().encode(process?.env?.JWT_SECRET); // Replace with your secret
            
            const { payload } = await jwtVerify(decryptedToken, secret); // Decodes and verifies
            userData = payload?.currentUser;
            isAdmin = payload?.currentUser?.userType === 'admin' || payload?.currentUser?.userType === 'super-admin';
        } catch (error) {
            console.error('Invalid or expired token:', error);
            userData = null;
        }
    }

    // Handle Authentication for /admin routes
    if (adminURL && !isAdmin) {
        console.log('Redirecting to /auth/login: Unauthenticated access attempt');
        return NextResponse.redirect(new URL('/auth/login', request.url));
    }

    // Redirect authenticated users trying to access login page
    if (isAdmin && authURL) {
        console.log('Redirecting to /admin: Authenticated user trying to access auth URL');
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
        '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
      ],
};
