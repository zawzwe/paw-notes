import { updateSession } from "@/lib/supabase/proxy";
import { type NextRequest } from "next/server";
import createIntlMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

const handleI18n = createIntlMiddleware(routing);

export async function proxy(request: NextRequest) {
  // Run i18n first — it handles locale detection and routing
  const response = await handleI18n(request);

  // Run Supabase session refresh, passing through the i18n response
  return await updateSession(request, response);
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
