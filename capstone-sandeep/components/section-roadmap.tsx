import { GOVERNANCE, ROADMAP } from "@/lib/roadmap";

export function SectionRoadmap() {
  return (
    <section id="roadmap" className="scroll-mt-24 space-y-8">
      <header className="space-y-2">
        <p className="text-[11px] font-semibold tracking-[0.16em] text-teal-800 uppercase">
          5 · Remediation plan
        </p>
        <h2 className="font-heading text-2xl leading-snug text-pretty break-words sm:text-3xl">
          Long-term vision and the gates that stop a second collapse
        </h2>
        <p className="max-w-3xl text-sm leading-relaxed text-muted-foreground">
          Transition pattern: strangler fig around a guarded Patient–Collection–Slot–Batch
          spine. Do not rewrite the estate. Do not connect it to MES until Wave 3
          evals are red on identity-swap cases.
        </p>
      </header>

      <ol className="space-y-4">
        {ROADMAP.map((w) => (
          <li key={w.id} className="rounded-2xl border border-border bg-card p-5 sm:p-6">
            <div className="flex flex-wrap items-baseline gap-2">
              <span className="font-mono text-xs font-semibold text-teal-800">{w.id}</span>
              <h3 className="text-base font-semibold">{w.name}</h3>
            </div>
            <p className="mt-2 text-sm leading-7">{w.intent}</p>
            <p className="mt-2 text-[12px] text-muted-foreground">
              Pattern: {w.pattern} · Gates: stages {w.stageGates.join(", ")}
            </p>
            <ul className="mt-3 list-disc space-y-1 pl-5 text-sm leading-6">
              {w.outcomes.map((o) => (
                <li key={o}>{o}</li>
              ))}
            </ul>
          </li>
        ))}
      </ol>

      <div>
        <h3 className="font-heading text-xl">Governance and process changes</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          These are the FDE stage-gates that prevent the next inheritor from
          writing the same assessment.
        </p>
        <ul className="mt-4 grid gap-3 md:grid-cols-2">
          {GOVERNANCE.map((g) => (
            <li key={g.title} className="rounded-xl border border-border bg-card p-4">
              <p className="text-sm font-semibold">{g.title}</p>
              <p className="mt-1 text-sm leading-6 text-muted-foreground">{g.body}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
