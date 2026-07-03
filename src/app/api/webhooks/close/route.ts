import { createHmac, timingSafeEqual } from "crypto";
import { createServiceClient } from "@/lib/supabase/server";
import { newToken } from "@/lib/token";
import { sendMessage } from "@/lib/messaging";

// Close CRM enrolment webhook (replaces the GHL trigger; BUILD_SPEC.md §6.1).
// Close posts here when a new student enrols (e.g. lead enters a "Purchased"
// status). We create the student + signed token and send the intake invite.
//
// Verification, in order:
//   1. Close HMAC signature (CLOSE_SIGNING_KEY) — the real Close path.
//   2. A shared secret (CLOSE_WEBHOOK_SECRET) via header/query — for manual tests.
// Idempotent by close_lead_id.

export const dynamic = "force-dynamic";

function baseUrl(req: Request): string {
  return (process.env.APP_BASE_URL ?? new URL(req.url).origin).replace(/\/$/, "");
}

function verifyCloseSignature(req: Request, raw: string): boolean {
  const key = process.env.CLOSE_SIGNING_KEY;
  const sig = req.headers.get("close-sig-hash");
  const ts = req.headers.get("close-sig-timestamp");
  if (!key || !sig || !ts) return false;
  const expected = createHmac("sha256", key).update(ts + raw).digest("hex");
  try {
    return timingSafeEqual(Buffer.from(expected), Buffer.from(sig));
  } catch {
    return false;
  }
}

function verifySharedSecret(req: Request, url: URL, body: Record<string, unknown>): boolean {
  const expected = process.env.CLOSE_WEBHOOK_SECRET;
  if (!expected) return false;
  const provided =
    req.headers.get("x-webhook-secret") ??
    req.headers.get("authorization")?.replace(/^Bearer\s+/i, "") ??
    (body.secret as string | undefined) ??
    url.searchParams.get("secret") ??
    "";
  return provided === expected;
}

// Pull the first email/phone/name out of a Close lead/contact payload, tolerating
// the various shapes Close event data can take.
function extract(data: Record<string, unknown>) {
  const lead = (data.lead ?? data) as Record<string, unknown>;
  const contacts = (lead.contacts ?? data.contacts ?? []) as Record<string, unknown>[];
  const contact = (contacts[0] ?? data.contact ?? {}) as Record<string, unknown>;

  const emails = (contact.emails ?? lead.emails ?? []) as { email?: string }[];
  const phones = (contact.phones ?? lead.phones ?? []) as { phone?: string }[];

  const name =
    (contact.name as string) ||
    (lead.display_name as string) ||
    (lead.name as string) ||
    "";
  return {
    closeLeadId: (lead.id as string) ?? (data.lead_id as string) ?? null,
    closeContactId: (contact.id as string) ?? null,
    name: name.trim(),
    email: emails[0]?.email?.trim() ?? null,
    phone: phones[0]?.phone?.trim() ?? null,
  };
}

export async function POST(req: Request) {
  const raw = await req.text();
  let payload: Record<string, unknown> = {};
  try {
    payload = JSON.parse(raw) as Record<string, unknown>;
  } catch {
    return Response.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }

  const url = new URL(req.url);
  const authed = verifyCloseSignature(req, raw) || verifySharedSecret(req, url, payload);
  if (!authed) {
    return Response.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  // Close wraps the object under event.data; a manual test may post it flat.
  const event = (payload.event ?? {}) as Record<string, unknown>;
  const data = (event.data ?? payload.data ?? payload) as Record<string, unknown>;
  const { closeLeadId, closeContactId, name, email, phone } = extract(data);

  if (!email || !name) {
    return Response.json({ ok: false, error: "Missing name or email in payload" }, { status: 400 });
  }

  const db = createServiceClient();

  if (closeLeadId) {
    const { data: existing } = await db
      .from("students")
      .select("id, token")
      .eq("close_lead_id", closeLeadId)
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
      close_lead_id: closeLeadId,
      close_contact_id: closeContactId,
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

  await sendMessage("intake_invite", {
    studentId: created.id,
    closeLeadId,
    closeContactId,
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
