import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Routes yang perlu proteksi
  const protectedRoutes = {
    '/customer': 'customer',
    '/employee': 'employee',
    '/admin': 'admin',
  };

  // Cek apakah route perlu proteksi
  const requiresAuth = Object.keys(protectedRoutes).some((route) =>
    pathname.startsWith(route)
  );

  if (requiresAuth) {
    // Dalam implementasi real, check ke session/token
    // Untuk demo ini, kami skip middleware check karena auth disimpan di store
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/customer/:path*', '/employee/:path*', '/admin/:path*'],
};
