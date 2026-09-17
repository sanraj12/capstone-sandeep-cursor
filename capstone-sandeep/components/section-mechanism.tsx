import {
  FIRST_AI_SLICES,
  MECHANISM_GUIDE,
  MECHANISM_ROWS,
  MECHANISM_VERDICT,
  type AiVerdict,
  type Mechanism,
} from "@/lib/mechanism";

const VERDICT_STYLE: Record<AiVerdict, string> = {
  "Forbidden as AI": "bg-red-50 text-red-800 border-red-200",
  "Not required": "bg-slate-100 text-slate-700 border-slate-200",
  "Optional value": "bg-teal-50 text-teal-800 border-teal-200",
  "Use after spine exists": "bg-amber-50 text-amber-900 border-amber-200",
};

const MECH_STYLE: Record<Mechanism, string> = {
  "Rules / software": "text-foreground",
  "Classical ML": "text-teal-800",
  RAG: "text-teal-800",
  GenAI: "text-teal-800",
  "Agentic AI": "text-amber-900",
  Human: "text-foreground",
};

export function SectionMechanism() {
  const forbidden = MECHANISM_ROWS.filter((r) => r.verdict === "Forbidden as AI");
  const optional = MECHANISM_ROWS.filter(
    (r) => r.verdict === "Optional value" || r.verdict === "Use after spine exists"
  );

  return (
    <section id="mechanism" className="scroll-mt-24 space-y-8">
      <header className="space-y-2">
        <p className="text-[11px] font-semibold tracking-[0.16em] text-teal-800 uppercase">
          6 · Do we need AI?
        </p>
        <h2 className="font-heading text-2xl leading-snug text-pretty break-words sm:text-3xl">
          Smallest sufficient mechanism — where AI belongs, and where it must not
        </h2>
        <p className="max-w-3xl text-sm leading-relaxed text-muted-foreground">
          FDE Stage 8. Pick the cheapest mechanism that can be verified. Do not
          start from a model and hunt for a workflow.
        </p>
      </header>

      <article className="rounded-2xl border border-red-200 bg-red-50/50 p-5 sm:p-6">
        <p className="text-[11px] font-semibold tracking-wide text-red-800 uppercase">
          Verdict
        </p>
        <h3 className="mt-1 font-heading text-xl leading-snug">{MECHANISM_VERDICT.headline}</h3>
        <p className="mt-3 text-sm leading-7 text-foreground/90">{MECHANISM_VERDICT.body}</p>
      </article>

      <div>
        <h3 className="text-sm font-semibold tracking-tight">What each mechanism is for</h3>
        <ul className="mt-3 grid gap-3 md:grid-cols-2">
          {MECHANISM_GUIDE.map((g) => (
            <li key={g.kind} className="rounded-xl border border-border bg-card p-4">
              <p className="text-sm font-semibold">{g.kind}</p>
              <p className="mt-2 text-sm leading-6">{g.useWhen}</p>
              <p className="mt-2 text-xs leading-5 text-muted-foreground">
                Not for: {g.notFor}
              </p>
            </li>
          ))}
        </ul>
      </div>

      <div className="space-y-3">
        <h3 className="text-sm font-semibold tracking-tight">
          Forbidden as AI — these stay software or human
        </h3>
        <p className="text-sm text-muted-foreground">
          If an agent or model owns any of these, the estate cannot be validated
          and must not touch a plant system.
        </p>
        <ul className="space-y-3">
          {forbidden.map((r) => (
            <li key={r.step} className="rounded-xl border border-border bg-card p-4">
              <div className="flex flex-wrap items-center gap-2">
                <span
                  className={`rounded-full border px-2 py-0.5 text-[11px] font-medium ${VERDICT_STYLE[r.verdict]}`}
                >
                  {r.verdict}
                </span>
                <span className={`text-xs font-semibold ${MECH_STYLE[r.mechanism]}`}>
                  {r.mechanism}
                </span>
                <span className="text-[11px] text-muted-foreground">{r.owner}</span>
              </div>
              <p className="mt-2 text-sm font-medium">{r.step}</p>
              <p className="mt-1 text-sm leading-6">{r.purpose}</p>
              {r.whyNotAi ? (
                <p className="mt-1 text-sm leading-6 text-muted-foreground">{r.whyNotAi}</p>
              ) : null}
              <p className="mt-2 text-xs text-muted-foreground">Gate: {r.humanGate}</p>
            </li>
          ))}
        </ul>
      </div>

      <div className="space-y-3">
        <h3 className="text-sm font-semibold tracking-tight">
          Justified AI / ML use cases — after the spine exists
        </h3>
        <p className="text-sm text-muted-foreground">
          These are translation, retrieval, drafting, or ranking jobs. They sit
          beside the orchestrator. They never write COI, slots, or disposition.
        </p>
        <div className="overflow-x-auto rounded-2xl border border-border bg-card">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead className="border-b border-border bg-muted/40 text-[11px] tracking-wide text-muted-foreground uppercase">
              <tr>
                <th className="px-3 py-2 font-semibold">Step</th>
                <th className="px-3 py-2 font-semibold">Mechanism</th>
                <th className="px-3 py-2 font-semibold">Purpose</th>
                <th className="px-3 py-2 font-semibold">Human gate</th>
              </tr>
            </thead>
            <tbody>
              {optional.map((r) => (
                <tr key={r.step} className="border-b border-border last:border-0">
                  <td className="px-3 py-3 align-top">
                    <p className="font-medium">{r.step}</p>
                    <p className="mt-1 text-[11px] text-muted-foreground">{r.owner}</p>
                    <span
                      className={`mt-1 inline-flex rounded-full border px-2 py-0.5 text-[10px] font-medium ${VERDICT_STYLE[r.verdict]}`}
                    >
                      {r.verdict}
                    </span>
                  </td>
                  <td className={`px-3 py-3 align-top text-xs font-semibold ${MECH_STYLE[r.mechanism]}`}>
                    {r.mechanism}
                  </td>
                  <td className="px-3 py-3 align-top leading-6">{r.purpose}</td>
                  <td className="px-3 py-3 align-top text-xs leading-5 text-muted-foreground">
                    {r.humanGate}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div>
        <h3 className="text-sm font-semibold tracking-tight">
          If you still want an AI slice, build these three — in this order
        </h3>
        <ol className="mt-3 space-y-3">
          {FIRST_AI_SLICES.map((s) => (
            <li key={s.id} className="rounded-xl border border-border bg-card p-4">
              <p className="font-mono text-[11px] font-semibold text-teal-800">{s.id}</p>
              <p className="mt-0.5 text-sm font-semibold">{s.title}</p>
              <p className="mt-2 text-sm leading-6">{s.why}</p>
              <p className="mt-2 text-xs leading-5 text-muted-foreground">
                Envelope: {s.envelope}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
