import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Vérifier si c'est une route admin (sauf login)
  if (request.nextUrl.pathname.startsWith('/admin') && !request.nextUrl.pathname.startsWith('/admin/login')) {
    // Pour les routes API admin, on laisse passer (elles ont leur propre protection)
    if (request.nextUrl.pathname.startsWith('/admin/api')) {
      return NextResponse.next();
    }

    // Pour les pages admin, on vérifie l'authentification côté client
    // Le middleware côté serveur ne peut pas accéder à localStorage
    // Donc on laisse le layout client faire la vérification et la redirection
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*']
};