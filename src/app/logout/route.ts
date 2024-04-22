import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: Request) {
    cookies().delete('user')
    return NextResponse.redirect(new URL("/login", request.url))
}