import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";
import { hasEnvVars } from "../utils";

export async function updateSession(
  request: NextRequest,
  incomingResponse?: NextResponse,
) {
  let supabaseResponse =
    incomingResponse ??
    NextResponse.next({
      request,
    });

  if (!hasEnvVars) {
    return supabaseResponse;
  }

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          );
          // Preserve the incoming response (with i18n headers), or create new
          supabaseResponse =
            incomingResponse ??
            NextResponse.next({
              request,
            });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  const { data } = await supabase.auth.getClaims();
  const user = data?.claims;

  const pathname = request.nextUrl.pathname;

  // Public paths that don't require authentication
  const isPublicPath =
    pathname === "/" ||
    pathname.match(/^\/(en|zh)\/?$/) ||
    pathname.startsWith("/auth") ||
    pathname.match(/^\/(en|zh)\/auth/);

  if (!user && !isPublicPath) {
    const url = request.nextUrl.clone();
    url.pathname = "/auth/login";
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}
