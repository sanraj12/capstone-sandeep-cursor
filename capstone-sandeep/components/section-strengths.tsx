import type { Assessment } from "@/lib/types";

export function SectionStrengths({ assessment }: { assessment: Assessment }) {
  return (
    <section id="strengths" className="scroll-mt-24 space-y-6">
      <header className="space-y-2">
        <p className="text-[11px] font-semibold tracking-[0.16em] text-teal-800 uppercase">
          2 · What is working
        </p>
        <h2 className="font-heading text-2xl leading-snug text-pretty break-words sm:text-3xl">
          Stable core, useful patterns, and value already delivered
        </h2>
        <p className="max-w-3xl text-sm leading-relaxed text-muted-foreground">
          Brownfield work starts by protecting what is true. Do not rewrite the
          outcome boundary, the implied scope fence, or any adapter that already
          tells the truth about a handoff.
        </p>
      </header>
      <ol className="space-y-4">
        {assessment.strengths.map((s, i) => (
          <li key={s.title} className="rounded-2xl border border-border bg-card p-5 sm:p-6">
            <p className="text-[11px] font-semibold tracking-wide text-teal-800 uppercase">
              Strength {String(i + 1).padStart(2, "0")}
            </p>
            <h3 className="mt-1 text-base font-semibold">{s.title}</h3>
            <p className="mt-2 text-sm leading-7 text-foreground/90">{s.body}</p>
            <ul className="mt-3 space-y-1">
              {s.evidence.map((e) => (
                <li
                  key={e}
                  className="font-mono text-[11px] leading-5 text-muted-foreground"
                >
                  {e}
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ol>
    </section>
  );
}
