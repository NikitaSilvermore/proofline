import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// Magic-link callback (BUILD_SPEC.md §2). Exchanges the PKCE code for a session
// cookie, then sends the team member on to the console.
export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const next = url.searchParams.get("next") ?? "/console";

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      return NextResponse.redirect(new URL(next, url.origin));
    }
  }

  return NextResponse.redirect(new URL("/console/login?error=link", url.origin));
}
