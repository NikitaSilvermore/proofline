// Message delivery abstraction (BUILD_SPEC.md §2, §6). One interface, three
// providers, chosen by MESSAGING_PROVIDER:
//   - "log"    (DEFAULT): sends nothing external — just records the intent to the
//              events table. Safe: no live messages until a real rail is set.
//   - "ghl":   triggers a GHL inbound webhook; the NLS GHL workflow does the send
//              (per §6.1 "per-student webhook or tag flip").
//   - "resend": sends an email directly via Resend (the spec's fallback).
//
// Every send is also logged so the console/audit trail always reflects reality.

import { createServiceClient } from "@/lib/supabase/server";

export type MessageKind = "intake_invite" | "weekly_checkin" | "nudge";

export type MessageTarget = {
  studentId: string;
  ghlContactId?: string | null;
  closeLeadId?: string | null;
  closeContactId?: string | null;
  name?: string | null;
  email?: string | null;
  phone?: string | null;
  link?: string | null; // the /intake or /checkin URL
};

export type SendResult = { ok: boolean; provider: string; detail?: string };

function provider(): "log" | "ghl" | "resend" | "close" {
  const p = (process.env.MESSAGING_PROVIDER ?? "log").toLowerCase();
  return p === "ghl" || p === "resend" || p === "close" ? p : "log";
}

// email | sms | both — which channel the Close provider uses. Default email.
function channel(): "email" | "sms" | "both" {
  const c = (process.env.MESSAGING_CHANNEL ?? "email").toLowerCase();
  return c === "sms" || c === "both" ? c : "email";
}

const BODIES: Record<MessageKind, (name: string, link: string) => string> = {
  intake_invite: (n, l) => `Hi ${n}, welcome to NLS! Set your baseline (2 mins): ${l}`,
  weekly_checkin: (n, l) => `Hi ${n}, your 45-second NLS check-in is ready: ${l}`,
  nudge: (n, l) => `Hi ${n}, checking in from NLS Mentorship — pick up where you left off: ${l}`,
};

const SUBJECTS: Record<MessageKind, string> = {
  intake_invite: "Welcome to NLS — set your baseline",
  weekly_checkin: "Your 45-second NLS check-in is ready",
  nudge: "A quick nudge from NLS Mentorship",
};

async function sendViaResend(kind: MessageKind, t: MessageTarget): Promise<SendResult> {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM;
  if (!apiKey || !from || !t.email) {
    return { ok: false, provider: "resend", detail: "missing RESEND_API_KEY/RESEND_FROM/email" };
  }
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from,
      to: t.email,
      subject: SUBJECTS[kind],
      html: `<p>Hi ${t.name ?? "there"},</p><p><a href="${t.link}">${t.link}</a></p><p>— NLS Mentorship</p>`,
    }),
  });
  return { ok: res.ok, provider: "resend", detail: res.ok ? undefined : `http ${res.status}` };
}

async function sendViaGhl(kind: MessageKind, t: MessageTarget): Promise<SendResult> {
  const url = process.env.GHL_INBOUND_WEBHOOK_URL;
  if (!url) return { ok: false, provider: "ghl", detail: "missing GHL_INBOUND_WEBHOOK_URL" };
  // Hand off to the NLS GHL workflow, which owns the actual send + templates.
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(process.env.GHL_API_KEY ? { Authorization: `Bearer ${process.env.GHL_API_KEY}` } : {}),
    },
    body: JSON.stringify({
      type: kind,
      contact_id: t.ghlContactId,
      email: t.email,
      phone: t.phone,
      name: t.name,
      link: t.link,
    }),
  });
  return { ok: res.ok, provider: "ghl", detail: res.ok ? undefined : `http ${res.status}` };
}

// Close CRM (close.com) as CRM + sender. Uses the Close API to log an outbound
// email and/or SMS activity against the student's lead, which Close then sends
// from the connected NLS email/phone. Auth: API key via Basic auth.
async function sendViaClose(kind: MessageKind, t: MessageTarget): Promise<SendResult> {
  const apiKey = process.env.CLOSE_API_KEY;
  if (!apiKey) return { ok: false, provider: "close", detail: "missing CLOSE_API_KEY" };
  if (!t.closeLeadId) return { ok: false, provider: "close", detail: "missing Close lead id" };

  const auth = "Basic " + Buffer.from(`${apiKey}:`).toString("base64");
  const name = t.name ?? "there";
  const link = t.link ?? "";
  const ch = channel();
  const results: string[] = [];
  let anyOk = false;

  // Email
  if ((ch === "email" || ch === "both") && t.email) {
    const res = await fetch("https://api.close.com/api/v1/activity/email/", {
      method: "POST",
      headers: { Authorization: auth, "Content-Type": "application/json" },
      body: JSON.stringify({
        lead_id: t.closeLeadId,
        contact_id: t.closeContactId ?? undefined,
        direction: "outgoing",
        status: "outbox", // queues Close to actually send via the connected account
        to: [t.email],
        sender: process.env.CLOSE_SENDER || undefined,
        subject: SUBJECTS[kind],
        body_text: BODIES[kind](name, link),
        body_html: `<p>Hi ${name},</p><p><a href="${link}">${link}</a></p><p>— NLS Mentorship</p>`,
      }),
    });
    anyOk = anyOk || res.ok;
    results.push(`email ${res.ok ? "ok" : res.status}`);
  }

  // SMS
  if ((ch === "sms" || ch === "both") && t.phone) {
    const res = await fetch("https://api.close.com/api/v1/activity/sms/", {
      method: "POST",
      headers: { Authorization: auth, "Content-Type": "application/json" },
      body: JSON.stringify({
        lead_id: t.closeLeadId,
        contact_id: t.closeContactId ?? undefined,
        direction: "outgoing",
        status: "outbox",
        local_phone: process.env.CLOSE_SMS_NUMBER,
        remote_phone: t.phone,
        text: BODIES[kind](name, link),
      }),
    });
    anyOk = anyOk || res.ok;
    results.push(`sms ${res.ok ? "ok" : res.status}`);
  }

  if (results.length === 0) {
    return { ok: false, provider: "close", detail: "no email/phone for chosen channel" };
  }
  return { ok: anyOk, provider: "close", detail: results.join(", ") };
}

// Send a message and record the attempt. Never throws — a delivery failure must
// not break the cron or a console action; it's logged for follow-up.
export async function sendMessage(kind: MessageKind, t: MessageTarget): Promise<SendResult> {
  const p = provider();
  let result: SendResult;
  try {
    if (p === "resend") result = await sendViaResend(kind, t);
    else if (p === "ghl") result = await sendViaGhl(kind, t);
    else if (p === "close") result = await sendViaClose(kind, t);
    else result = { ok: true, provider: "log", detail: "logged only (no live rail)" };
  } catch (e) {
    result = { ok: false, provider: p, detail: e instanceof Error ? e.message : "send error" };
  }

  try {
    const db = createServiceClient();
    await db.from("events").insert({
      student_id: t.studentId,
      type: kind === "nudge" ? "nudge_sent" : "note",
      payload: {
        message: kind,
        provider: result.provider,
        ok: result.ok,
        detail: result.detail ?? null,
        link: t.link ?? null,
      },
    });
  } catch {
    // Logging the attempt is best-effort; don't fail the send over it.
  }

  return result;
}
