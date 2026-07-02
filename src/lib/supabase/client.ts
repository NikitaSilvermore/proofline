import { createBrowserClient } from "@supabase/ssr";

// Browser-side Supabase client (anon key only). Used by client components.
// RLS is the security boundary — never ship the service-role key here
// (BUILD_SPEC.md §7).
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
}
