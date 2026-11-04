import { NextResponse, type NextRequest } from "next/server";

// The storefront uses Cloudinary's optimized delivery directly. Reject direct
// requests to Next's image optimizer until the upstream SVG bypass is patched.
export function middleware(_request: NextRequest) {
  return new NextResponse(null, { status: 404 });
}

export const config = {
  matcher: ["/_next/image"],
};
