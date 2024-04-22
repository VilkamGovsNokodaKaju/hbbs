import { NextResponse, type NextRequest } from "next/server";

export function middleware(request: NextRequest) {
    const currentUser = request.cookies.get("user")?.value
    const code = request.nextUrl.searchParams.get("code")

    if (currentUser && request.nextUrl.pathname.startsWith("/login")) {
        return Response.redirect(new URL("/", request.nextUrl))
    }

    if (code && request.nextUrl.pathname.startsWith("/login")) {
        const response = NextResponse.redirect(new URL("/", request.nextUrl))
        response.cookies.set("user", code, { secure: true, httpOnly: true, sameSite: 'strict', maxAge: 60 * 60 * 24 * 1 })
        return response
    }
}