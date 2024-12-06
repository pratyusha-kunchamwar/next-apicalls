import { NextResponse } from "next/server";
import { authMiddleware } from "./middleware/api/authMiddleware";
import { request } from "http";

export const config = {
  matcher: "/api/:path*",
};

const authResult = authMiddleware(request);
if (!authResult?.isValid && request.url.includes("/api/blogs/")) {
  return new NextResponse(JSON.stringify({ message: "unauthorized" }), {
    status: 401,
  });
}
export default function middleware(request) {
  return NextResponse.next();
}
