import { StatusBadge } from "@/components/status-badge";
import { FDE_STAGES, PHASES } from "@/lib/fde-stages";
import type { Assessment } from "@/lib/types";

export function SectionFde({ assessment }: { assessment: Assessment }) {
  return (
    <section id="fde" className="scroll-mt-24 space-y-6">
      <header className="space-y-2">
        <p className="text-[11px] font-semibold tracking-[0.16em] text-teal-800 uppercase">
          4 · 21-stage FDE model
        </p>
        <h2 className="font-heading text-2xl leading-snug text-pretty break-words sm:text-3xl">
          Status and evidence for every operating-model stage
        </h2>
        <p className="max-w-3xl text-sm leading-relaxed text-muted-foreground">
          Rubric encoded from the 21-stage AI FDE operating model: Discover
          (1–6), Design (7–12), Build & Prove (13–17), Launch & Operate
          (18–21). Each stage ends in a decision. Skipping a gate is how this
          estate degraded.
        </p>
      </header>

      <div className="grid gap-2 sm:grid-cols-4">
        {PHASES.map((p) => {
          const ids = FDE_STAGES.filter((s) => s.phase === p.id).map((s) => s.id);
          const crit = ids.filter(
            (id) => assessment.stages[id]?.status === "Critical Failure"
          ).length;
          const miss = ids.filter(
            (id) => assessment.stages[id]?.status === "Missing"
          ).length;
          return (
            <div key={p.id} className="rounded-xl border border-border bg-card p-3">
              <p className="text-[11px] font-semibold tracking-wide text-muted-foreground uppercase">
                {p.range}
              </p>
              <p className="mt-0.5 text-sm font-medium">{p.label}</p>
              <p className="mt-1 text-[11px] text-muted-foreground">
                {crit} critical · {miss} missing
              </p>
            </div>
          );
        })}
      </div>

      <ol className="space-y-3">
        {FDE_STAGES.map((stage) => {
          const ev = assessment.stages[stage.id];
          return (
            <li
              key={stage.id}
              id={`stage-${stage.id}`}
              className="scroll-mt-24 rounded-2xl border border-border bg-card p-4 sm:p-5"
            >
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="text-[11px] font-semibold tracking-wide text-muted-foreground uppercase">
                    Stage {String(stage.id).padStart(2, "0")} ·{" "}
                    {PHASES.find((p) => p.id === stage.phase)?.label}
                  </p>
                  <h3 className="mt-0.5 text-base font-semibold">{stage.name}</h3>
                  <p className="mt-1 text-sm leading-6 text-muted-foreground">
                    {stage.question}
                  </p>
                </div>
                {ev ? <StatusBadge status={ev.status} className="shrink-0" /> : null}
              </div>

              {ev ? (
                <div className="mt-4 rounded-xl bg-muted/50 p-3">
                  <p className="text-[11px] font-semibold tracking-wide text-muted-foreground uppercase">
                    {ev.inferred ? "Inferred status" : "Bound evidence"}
                  </p>
                  <p className="mt-1 text-sm leading-6">{ev.summary}</p>
                  <ul className="mt-2 space-y-1">
                    {ev.evidence.map((e) => (
                      <li
                        key={e}
                        className="font-mono text-[11px] leading-5 text-muted-foreground"
                      >
                        {e}
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}

              <details className="mt-3">
                <summary className="cursor-pointer text-xs font-medium text-teal-800">
                  Exit criteria, expected artifacts, CGT lens
                </summary>
                <div className="mt-3 grid gap-4 text-sm leading-6 md:grid-cols-3">
                  <div>
                    <p className="text-[11px] font-semibold tracking-wide text-muted-foreground uppercase">
                      Exit criteria
                    </p>
                    <ul className="mt-1 list-disc space-y-1 pl-4">
                      {stage.exitCriteria.map((c) => (
                        <li key={c}>{c}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <p className="text-[11px] font-semibold tracking-wide text-muted-foreground uppercase">
                      Artifacts
                    </p>
                    <ul className="mt-1 list-disc space-y-1 pl-4">
                      {stage.expectedArtifacts.map((c) => (
                        <li key={c}>{c}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <p className="text-[11px] font-semibold tracking-wide text-muted-foreground uppercase">
                      CGT lens
                    </p>
                    <p className="mt-1">{stage.cgtLens}</p>
                  </div>
                </div>
              </details>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
