import { NextResponse, type NextRequest } from 'next/server'
import { createServerClient } from '@supabase/ssr'

export async function middleware(request: NextRequest) {
  return await updateSession(request)
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}

async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            request.cookies.set(name, value)
          )
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const isAuthRoute =
    request.nextUrl.pathname === "/login" ||
    request.nextUrl.pathname === "/sign-up"

  if (isAuthRoute) {
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      return NextResponse.redirect(new URL("/", process.env.NEXT_PUBLIC_BASE_URL))
    }
  }

  const { searchParams, pathname } = new URL(request.url)

  // ✅ Only run for GET page loads
  if (
    request.method === "GET" &&
    pathname === "/" &&
    !searchParams.get("noteId")
  ) {
    const { data: { user } } = await supabase.auth.getUser()

    if (user) {
      const { newstNoteId } = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/fetch-newest-note?userId=${user.id}`
      ).then(res => res.json())

      if (newstNoteId) {
        const url = request.nextUrl.clone()
        url.searchParams.set("noteId", newstNoteId)
        return NextResponse.redirect(url)
      } else {
        console.log("[middleware] Creating new note for user", user.id)
        const { noteId } = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/api/create-new-note?userId=${user.id}`,
          { method: "POST", headers: { "Content-Type": "application/json" } }
        ).then(res => res.json())
        const url = request.nextUrl.clone()
        url.searchParams.set("noteId", noteId)
        return NextResponse.redirect(url)
      }
    }
  }

  return supabaseResponse
}
