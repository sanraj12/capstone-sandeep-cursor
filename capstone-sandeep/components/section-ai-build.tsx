import {
  BUILD_STEPS,
  KB_BUILD_STEPS,
  KB_PLANES,
  MODELS,
  VECTOR_OPTIONS,
  VECTOR_VERDICT,
} from "@/lib/ai-implementation";

export function SectionAiBuild() {
  return (
    <section id="ai-build" className="scroll-mt-24 space-y-8">
      <header className="space-y-2">
        <p className="text-[11px] font-semibold tracking-[0.16em] text-teal-800 uppercase">
          7 · Implement the AI slice
        </p>
        <h2 className="font-heading text-2xl leading-snug text-pretty break-words sm:text-3xl">
          Models, vector store, knowledge base, and build sequence
        </h2>
        <p className="max-w-3xl text-sm leading-relaxed text-muted-foreground">
          This is how to implement A1 (packet drafter) and A2 (blocker brief)
          without putting a model in the orchestration spine.
        </p>
      </header>

      <article className="rounded-2xl border border-teal-200 bg-teal-50/50 p-5 sm:p-6">
        <p className="text-[11px] font-semibold tracking-wide text-teal-800 uppercase">
          Vector database
        </p>
        <h3 className="mt-1 font-heading text-xl leading-snug">{VECTOR_VERDICT.headline}</h3>
        <p className="mt-3 text-sm leading-7">{VECTOR_VERDICT.body}</p>
      </article>

      <ul className="grid gap-3 md:grid-cols-3">
        {VECTOR_OPTIONS.map((v) => (
          <li key={v.name} className="rounded-xl border border-border bg-card p-4">
            <p className="text-[11px] font-semibold tracking-wide text-teal-800 uppercase">
              {v.effort}
            </p>
            <p className="mt-1 text-sm font-semibold">{v.name}</p>
            <p className="mt-2 text-sm leading-6">{v.when}</p>
            <p className="mt-2 text-xs leading-5 text-muted-foreground">Skip if: {v.notWhen}</p>
          </li>
        ))}
      </ul>

      <div>
        <h3 className="text-sm font-semibold tracking-tight">Model comparison</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          One drafter, one embedding model, frozen versions. A second model is
          only for eval (critic), not for a second spine.
        </p>
        <div className="mt-3 overflow-x-auto rounded-2xl border border-border bg-card">
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead className="border-b border-border bg-muted/40 text-[11px] tracking-wide text-muted-foreground uppercase">
              <tr>
                <th className="px-3 py-2 font-semibold">Model</th>
                <th className="px-3 py-2 font-semibold">Role</th>
                <th className="px-3 py-2 font-semibold">Use when</th>
                <th className="px-3 py-2 font-semibold">Limits</th>
              </tr>
            </thead>
            <tbody>
              {MODELS.map((m) => (
                <tr key={m.name} className="border-b border-border last:border-0">
                  <td className="px-3 py-3 align-top">
                    <p className="font-medium">{m.name}</p>
                    <p className="text-[11px] text-muted-foreground">{m.vendor}</p>
                  </td>
                  <td className="px-3 py-3 align-top text-xs font-semibold text-teal-800">
                    {m.role}
                  </td>
                  <td className="px-3 py-3 align-top leading-6">
                    <p>{m.when}</p>
                    <p className="mt-1 text-xs text-muted-foreground">{m.strengths}</p>
                  </td>
                  <td className="px-3 py-3 align-top text-xs leading-5 text-muted-foreground">
                    {m.limits}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div>
        <h3 className="text-sm font-semibold tracking-tight">How the knowledge base is built</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Two planes. Mixing them — embedding the lot into the same index as the
          SOP — is how identity hallucinations start.
        </p>
        <ul className="mt-3 grid gap-3 md:grid-cols-3">
          {KB_PLANES.map((p) => (
            <li key={p.plane} className="rounded-xl border border-border bg-card p-4">
              <p className="text-sm font-semibold">{p.plane}</p>
              <p className="mt-2 text-sm leading-6">{p.contents}</p>
              <p className="mt-2 text-xs leading-5 text-muted-foreground">{p.how}</p>
            </li>
          ))}
        </ul>
        <ol className="mt-4 space-y-3">
          {KB_BUILD_STEPS.map((s) => (
            <li key={s.n} className="rounded-xl border border-border bg-card p-4">
              <p className="font-mono text-[11px] font-semibold text-teal-800">{s.n}</p>
              <p className="mt-0.5 text-sm font-semibold">{s.title}</p>
              <p className="mt-1 text-sm leading-6">{s.detail}</p>
            </li>
          ))}
        </ol>
      </div>

      <div>
        <h3 className="text-sm font-semibold tracking-tight">Implementation steps</h3>
        <ol className="mt-3 space-y-3">
          {BUILD_STEPS.map((s) => (
            <li key={s.n} className="rounded-xl border border-border bg-card p-4 sm:flex sm:gap-4">
              <span className="font-mono text-sm font-semibold text-teal-800">
                {s.n.padStart(2, "0")}
              </span>
              <div>
                <p className="text-sm font-semibold">{s.title}</p>
                <p className="mt-1 text-sm leading-6">{s.detail}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
