"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import styles from "../console.module.css";

// Console login (BUILD_SPEC.md §2). Supabase magic link; access is restricted to
// the email allowlist by the console page + RLS. No passwords.
export default function ConsoleLogin() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOtp({
      email: email.trim(),
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback?next=/console`,
      },
    });
    setLoading(false);
    if (error) setError(error.message);
    else setSent(true);
  }

  return (
    <div className={styles.loginWrap}>
      <div className={styles.loginCard}>
        <div className={styles.loginTitle}>Support console</div>
        <div className={styles.loginSub}>
          Team access only. Enter your NLS email and we&apos;ll send you a magic
          sign-in link — no password.
        </div>
        {sent ? (
          <div className={styles.loginMsg}>
            Check your inbox — a sign-in link is on its way to{" "}
            <strong>{email}</strong>. Open it on this device.
          </div>
        ) : (
          <form onSubmit={submit}>
            <input
              className={styles.loginInput}
              type="email"
              required
              autoFocus
              placeholder="you@nlsmentorship.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <button className={styles.loginBtn} type="submit" disabled={loading}>
              {loading ? "Sending…" : "Email me a sign-in link"}
            </button>
          </form>
        )}
        {error && <div className={styles.loginErr}>{error}</div>}
      </div>
    </div>
  );
}
