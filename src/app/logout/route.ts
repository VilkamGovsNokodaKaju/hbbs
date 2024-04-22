import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    cookies().delete('user')
    return NextResponse.redirect(new URL("/login", request.nextUrl))
}