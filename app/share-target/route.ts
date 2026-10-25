import { NextResponse } from "next/server";

/**
 * Fallback when the share-target service worker is not controlling the page yet.
 * Shared files cannot be recovered here; the SW handles the real POST.
 */
export async function POST(request: Request) {
  const redirectUrl = new URL("/my-shelf", request.url);
  redirectUrl.searchParams.set("share", "needs-sw");
  return NextResponse.redirect(redirectUrl, 303);
}
