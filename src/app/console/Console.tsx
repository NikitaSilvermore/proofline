"use client";

import { useState, useTransition } from "react";
import styles from "./console.module.css";
import type { ConsoleView } from "@/lib/console";
import {
  nudgeStudent,
  requestTestimonial,
  markNextMilestone,
  draftCaseStudy,
  signOut,
} from "./actions";

type Filter = "all" | "red" | "amber" | "green";

export default function Console({ view }: { view: ConsoleView }) {
  const [filter, setFilter] = useState<Filter>("all");
  const [nudged, setNudged] = useState<Set<string>>(
    new Set(view.needsAttention.filter((n) => n.nudged).map((n) => n.id)),
  );
  const [requested, setRequested] = useState<Set<string>>(
    new Set(view.harvest.filter((h) => h.requested).map((h) => h.id)),
  );
  const [draft, setDraft] = useState<{ name: string; text: string } | null>(null);
  const [, startTransition] = useTransition();

  const dateChip = new Date(view.now).toLocaleDateString("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });

  const counts = {
    all: view.roster.length,
    red: view.roster.filter((r) => r.rag === "red").length,
    amber: view.roster.filter((r) => r.rag === "amber").length,
    green: view.roster.filter((r) => r.rag === "green").length,
  };
  const rows = view.roster.filter((r) => filter === "all" || r.rag === filter);

  function doNudge(id: string) {
    setNudged((s) => new Set(s).add(id));
    startTransition(() => void nudgeStudent(id));
  }
  function doRequest(id: string) {
    setRequested((s) => new Set(s).add(id));
    startTransition(() => void requestTestimonial(id));
  }
  function doMark(id: string) {
    startTransition(() => void markNextMilestone(id));
  }
  function doDraft(id: string, name: string) {
    startTransition(async () => {
      const text = await draftCaseStudy(id);
      setDraft({ name, text });
    });
  }

  return (
    <div className={styles.page}>
      <div className={styles.ribbon}>Proofline for NLS Mentorship &middot; Support console</div>

      <header className={styles.masthead}>
        <div className={styles.mastheadInner}>
          <div className={styles.brand}>
            <div className={styles.monogram}>NLS</div>
            <div>
              <div className={styles.brandName}>NLS Mentorship</div>
              <div className={styles.brandSub}>Support console</div>
            </div>
          </div>
          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <span className={styles.dateChip}>
              {dateChip} &middot; {view.activeCount} active
            </span>
            <button className={styles.signout} onClick={() => startTransition(() => void signOut())}>
              Sign out
            </button>
          </div>
        </div>
      </header>

      <main className={styles.main}>
        <div className={styles.pageHead}>
          <h1 className={styles.h1}>Today, in thirty seconds.</h1>
          <span className={styles.pageSub}>Reds first. Everything else is on track.</span>
        </div>

        {/* STAT STRIP */}
        <div className={styles.stats}>
          <div className={`${styles.stat} ${styles.red}`}>
            <div className={styles.statNum}>{view.stats.needsAttention}</div>
            <div className={styles.statLabel}>Needs attention</div>
          </div>
          <div className={`${styles.stat} ${styles.amber}`}>
            <div className={styles.statNum}>{view.stats.watch}</div>
            <div className={styles.statLabel}>Watch list</div>
          </div>
          <div className={`${styles.stat} ${styles.green}`}>
            <div className={styles.statNum}>{view.stats.onTrack}</div>
            <div className={styles.statLabel}>On track</div>
          </div>
          <div className={styles.stat}>
            <div className={styles.statNum}>{view.stats.responseRate}%</div>
            <div className={styles.statLabel}>Check-in response</div>
          </div>
          <div className={styles.stat}>
            <div className={styles.statNum}>{view.stats.milestonesThisWeek}</div>
            <div className={styles.statLabel}>Milestones this week</div>
          </div>
        </div>

        {/* ATTENTION + HARVEST */}
        <div className={styles.band}>
          <div>
            <div className={styles.bandHead}>
              <h2 className={styles.h2}>Needs attention</h2>
              <span className={styles.bandNote}>Why each student is red — and what to do</span>
            </div>
            <div className={styles.attnStack}>
              {view.needsAttention.length === 0 && (
                <div className={styles.harvestEmpty}>No reds right now. 🎉</div>
              )}
              {view.needsAttention.map((n) => (
                <div key={n.id} className={styles.attn}>
                  <div className={styles.attnAvatar}>{n.initials}</div>
                  <div className={styles.attnBody}>
                    <div className={styles.attnName}>
                      {n.name} <span className="mo">Month {n.monthLabel}</span>
                    </div>
                    <div className={styles.attnReason}>{n.reason}</div>
                  </div>
                  <div className={styles.attnActions}>
                    {nudged.has(n.id) ? (
                      <button className={`${styles.btnSm} ${styles.done}`} disabled>
                        Sent ✓
                      </button>
                    ) : (
                      <button
                        className={`${styles.btnSm} ${styles.primary}`}
                        onClick={() => doNudge(n.id)}
                      >
                        Send nudge
                      </button>
                    )}
                    <a className={styles.btnSm} href={`/p/${n.token}`} target="_blank" rel="noreferrer">
                      View student
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <div className={styles.bandHead}>
              <h2 className={styles.h2}>Wins to harvest</h2>
              <span className={styles.bandNote}>Ask while it&apos;s hot</span>
            </div>
            <div className={styles.harvest}>
              {view.harvest.length === 0 && (
                <div className={styles.harvestEmpty}>
                  No fresh milestones to harvest this fortnight.
                </div>
              )}
              {view.harvest.map((h) => (
                <div key={h.id} className={styles.harvestItem}>
                  <div className={styles.medal}>★</div>
                  <div className={styles.harvestBody}>
                    <div className={styles.harvestName}>{h.name}</div>
                    <div className={styles.harvestDetail}>
                      {h.label} &middot; {h.when}
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: 6 }}>
                    {requested.has(h.id) ? (
                      <button className={`${styles.btnSm} ${styles.done}`} disabled>
                        Requested ✓
                      </button>
                    ) : (
                      <button className={styles.btnSm} onClick={() => doRequest(h.id)}>
                        Request testimonial
                      </button>
                    )}
                    <button className={styles.btnSm} onClick={() => doDraft(h.id, h.name)}>
                      Draft case study
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ROSTER */}
        <section className={styles.rosterSection}>
          <div className={styles.rosterHead}>
            <h2 className={styles.h2}>Full roster</h2>
            <div className={styles.filters}>
              {(["all", "red", "amber", "green"] as Filter[]).map((f) => (
                <button
                  key={f}
                  className={filter === f ? styles.on : ""}
                  onClick={() => setFilter(f)}
                >
                  {f[0].toUpperCase() + f.slice(1)} <span className={styles.cnt}>{counts[f]}</span>
                </button>
              ))}
            </div>
          </div>

          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Student</th>
                  <th>Month</th>
                  <th>Streak</th>
                  <th>Last check-in</th>
                  <th>Vs baseline</th>
                  <th>Milestones</th>
                  <th>Status</th>
                  <th>Why</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.id}>
                    <td>
                      <a className={styles.stu} href={`/p/${r.token}`} target="_blank" rel="noreferrer">
                        <span className={styles.av}>{r.initials}</span>
                        {r.name}
                      </a>
                    </td>
                    <td className={styles.mono}>{r.monthLabel}</td>
                    <td className={styles.mono}>{r.streak > 0 ? `${r.streak} wk` : "—"}</td>
                    <td className={`${styles.mono} ${r.lastCheckinStale ? styles.stale : ""}`}>
                      {r.lastCheckin}
                    </td>
                    <td className={`${styles.mono} ${styles[r.vsBaseline.dir]}`}>
                      {r.vsBaseline.text}
                    </td>
                    <td className={styles.mono}>
                      {r.milestonesLabel}{" "}
                      <button
                        className={styles.btnSm}
                        style={{ padding: "2px 8px", fontSize: 11, marginLeft: 4 }}
                        title="Mark next milestone done"
                        onClick={() => doMark(r.id)}
                      >
                        ＋
                      </button>
                    </td>
                    <td>
                      <span className={`${styles.status} ${styles[r.rag]}`}>
                        <span className="d" />
                        {r.rag === "none" ? "—" : r.rag[0].toUpperCase() + r.rag.slice(1)}
                      </span>
                    </td>
                    <td className={styles.why}>{r.why}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className={styles.rosterNote}>
            Showing {rows.length} of {view.roster.length}. Reds always sort to the top.
          </p>
        </section>
      </main>

      <footer className={styles.footer}>
        <div>One page. Thirty seconds a day. No meetings.</div>
        <div className={styles.powered}>Powered by Proofline</div>
      </footer>

      {draft && (
        <div className={styles.draftBackdrop} onClick={() => setDraft(null)}>
          <div className={styles.draftModal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.bandHead}>
              <h2 className={styles.h2}>Case study draft — {draft.name}</h2>
              <button className={styles.btnSm} onClick={() => setDraft(null)}>
                Close
              </button>
            </div>
            <textarea
              className={styles.draftTextarea}
              defaultValue={draft.text}
              aria-label="Case study draft"
            />
            <p className={styles.bandNote} style={{ marginTop: 10 }}>
              Interpolated from real baseline + check-in data. Copy into your doc and edit.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
