import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

export async function proxy(request: NextRequest) {
  const token = request.cookies.get("taqat_session")?.value;
  if (!token)
    return NextResponse.redirect(
      new URL(`/login?next=${encodeURIComponent(request.nextUrl.pathname)}`, request.url),
    );
  try {
    const secret = new TextEncoder().encode(process.env.AUTH_SECRET ?? "");
    const { payload } = await jwtVerify(token, secret);
    if (request.nextUrl.pathname.startsWith("/admin") && payload.role !== "ADMIN")
      return NextResponse.redirect(new URL("/", request.url));
    return NextResponse.next();
  } catch {
    return NextResponse.redirect(
      new URL(`/login?next=${encodeURIComponent(request.nextUrl.pathname)}`, request.url),
    );
  }
}

export const config = { matcher: ["/account/:path*", "/admin/:path*"] };
