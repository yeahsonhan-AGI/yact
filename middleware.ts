import { updateSession } from '@/lib/supabase/middleware'
import { type NextRequest, NextResponse } from 'next/server'

export async function middleware(request: NextRequest) {
  // Skip onboarding check for auth and onboarding pages
  const isAuthPage = request.nextUrl.pathname.startsWith('/signin') ||
                      request.nextUrl.pathname.startsWith('/signup') ||
                      request.nextUrl.pathname.startsWith('/auth/callback') ||
                      request.nextUrl.pathname.startsWith('/onboarding')

  if (isAuthPage) {
    return await updateSession(request)
  }

  // Check if user has completed onboarding via cookie
  const onboardingComplete = request.cookies.get('onboarding-complete')?.value

  if (!onboardingComplete && request.nextUrl.pathname === '/') {
    // Redirect to onboarding for first-time visitors
    const url = request.nextUrl.clone()
    url.pathname = '/onboarding'
    return NextResponse.redirect(url)
  }

  return await updateSession(request)
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
