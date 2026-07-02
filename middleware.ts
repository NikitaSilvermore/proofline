import { updateSession } from "@/lib/supabase/middleware";
import { type NextRequest } from "next/server";

// Only run session refresh on the console + auth surfaces (BUILD_SPEC.md §2).
export async function middleware(request: NextRequest) {
  return updateSession(request);
}

export const config = {
  matcher: ["/console/:path*", "/auth/:path*"],
};
