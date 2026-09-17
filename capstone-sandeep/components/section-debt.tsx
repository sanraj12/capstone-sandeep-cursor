import { StatusBadge } from "@/components/status-badge";
import type { Assessment } from "@/lib/types";

export function SectionDebt({ assessment }: { assessment: Assessment }) {
  return (
    <section id="debt" className="scroll-mt-24 space-y-6">
      <header className="space-y-2">
        <p className="text-[11px] font-semibold tracking-[0.16em] text-teal-800 uppercase">
          3 · Problems and technical debt
        </p>
        <h2 className="font-heading text-2xl leading-snug text-pretty break-words sm:text-3xl">
          Architectural flaws, maintainability, security, tests
        </h2>
        <p className="max-w-3xl text-sm leading-relaxed text-muted-foreground">
          Ranked by harm: identity and unsupervised release first, then dual
          spines, then missing evals, then packaging. Cosmetic refactors wait.
        </p>
      </header>

      <div className="space-y-4">
        {assessment.problems.map((p) => (
          <article
            key={p.title}
            className="rounded-2xl border border-border bg-card p-5 sm:p-6"
          >
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-base font-semibold">{p.title}</h3>
              <span
                className={
                  p.severity === "high"
                    ? "rounded-full bg-red-50 px-2 py-0.5 text-[11px] font-medium text-red-800"
                    : p.severity === "medium"
                      ? "rounded-full bg-amber-50 px-2 py-0.5 text-[11px] font-medium text-amber-900"
                      : "rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-700"
                }
              >
                {p.severity} severity
              </span>
            </div>
            <p className="mt-2 text-sm leading-7 text-foreground/90">{p.body}</p>
            <ul className="mt-3 space-y-1">
              {p.evidence.map((e) => (
                <li
                  key={e}
                  className="font-mono text-[11px] leading-5 text-muted-foreground"
                >
                  {e}
                </li>
              ))}
            </ul>
          </article>
        ))}
      </div>

      {assessment.securityHits.length ? (
        <div className="rounded-2xl border border-red-200 bg-red-50/60 p-5">
          <h3 className="text-sm font-semibold text-red-900">
            Security & unsafe-execution hits
          </h3>
          <ul className="mt-3 space-y-1">
            {assessment.securityHits.map((h) => (
              <li key={h} className="font-mono text-[11px] text-red-900/80">
                {h}
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <p className="text-sm text-muted-foreground">
          {assessment.source === "archive"
            ? "No secret-like assignments or eval/pickle patterns matched the inspector’s rules. That is not a penetration test."
            : "Security posture is unknown until the archive is bound. Default assumption: treat as unsafe to connect to plant systems."}
        </p>
      )}

      <div className="rounded-2xl border border-border bg-card p-5">
        <div className="flex items-center justify-between gap-3">
          <h3 className="text-sm font-semibold">Testing & observability</h3>
          <StatusBadge status={assessment.stages[16]?.status ?? "Missing"} />
        </div>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          {assessment.testFiles.length
            ? `${assessment.testFiles.length} test file(s) detected. Extend them with identity-swap, slot-collision, and illegal-transition cases before adding more UI.`
            : "No test files detected (or archive unbound). Stage 16 is the cheapest gate that prevents a second decade of unfalsifiable orchestration."}
        </p>
        {assessment.testFiles.length ? (
          <ul className="mt-3 max-h-40 space-y-1 overflow-auto">
            {assessment.testFiles.map((t) => (
              <li key={t} className="font-mono text-[11px] text-muted-foreground">
                {t}
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    </section>
  );
}
