import { createServiceClient } from "@/lib/supabase/server";
import { newToken } from "@/lib/token";
import { sendMessage } from "@/lib/messaging";

// Enrolment webhook (BUILD_SPEC.md §6.1). GHL posts a new purchase here; we
// create the student + signed token and return the intake URL for GHL to store
// in the `proofline_intake_url` contact field and send from the NLS sender.
//
// Verified with a shared secret (GHL_WEBHOOK_SECRET) via the `x-webhook-secret`
// header, `Authorization: Bearer`, or a `secret` field/query param.
// Idempotent by ghl_contact_id: re-posting returns the same student + token.

export const dynamic = "force-dynamic";

function baseUrl(req: Request): string {
  return (process.env.APP_BASE_URL ?? new URL(req.url).origin).replace(/\/$/, "");
}

function pickName(body: Record<string, unknown>): string {
  const full = (body.name ?? body.full_name ?? body.fullName) as string | undefined;
  if (full && full.trim()) return full.trim();
  const first = (body.first_name ?? body.firstName ?? "") as string;
  const last = (body.last_name ?? body.lastName ?? "") as string;
  return `${first} ${last}`.trim();
}

export async function POST(req: Request) {
  const expected = process.env.GHL_WEBHOOK_SECRET;
  if (!expected) {
    return Response.json({ ok: false, error: "Webhook not configured" }, { status: 503 });
  }

  let body: Record<string, unknown> = {};
  try {
    body = (await req.json()) as Record<string, unknown>;
  } catch {
    return Response.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }

  const url = new URL(req.url);
  const provided =
    req.headers.get("x-webhook-secret") ??
    req.headers.get("authorization")?.replace(/^Bearer\s+/i, "") ??
    (body.secret as string | undefined) ??
    url.searchParams.get("secret") ??
    "";
  if (provided !== expected) {
    return Response.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  const ghlContactId = (body.contact_id ?? body.contactId ?? body.id) as string | undefined;
  const email = (body.email as string | undefined)?.trim();
  const name = pickName(body);
  const phone = (body.phone as string | undefined)?.trim() ?? null;

  if (!email || !name) {
    return Response.json({ ok: false, error: "Missing name or email" }, { status: 400 });
  }

  const db = createServiceClient();

  // Idempotent: return the existing student if this GHL contact is already known.
  if (ghlContactId) {
    const { data: existing } = await db
      .from("students")
      .select("id, token")
      .eq("ghl_contact_id", ghlContactId)
      .maybeSingle();
    if (existing) {
      return Response.json({
        ok: true,
        student_id: existing.id,
        token: existing.token,
        intake_url: `${baseUrl(req)}/intake/${existing.token}`,
        existing: true,
      });
    }
  }

  const token = newToken();
  const { data: created, error } = await db
    .from("students")
    .insert({
      ghl_contact_id: ghlContactId ?? null,
      name,
      email,
      phone,
      status: "invited",
      token,
    })
    .select("id, token")
    .single();

  if (error || !created) {
    return Response.json({ ok: false, error: "Could not create student" }, { status: 500 });
  }

  const intakeUrl = `${baseUrl(req)}/intake/${created.token}`;

  // Fire the intake invite (default provider is "log" — nothing sends live yet).
  await sendMessage("intake_invite", {
    studentId: created.id,
    ghlContactId: ghlContactId ?? null,
    name,
    email,
    phone,
    link: intakeUrl,
  });

  return Response.json({
    ok: true,
    student_id: created.id,
    token: created.token,
    intake_url: intakeUrl,
  });
}
