import { MermaidDiagram } from "@/components/mermaid-diagram";
import {
  ADRS,
  AZURE_STACK,
  CONTEXT_DIAGRAM,
  PLANES_DIAGRAM,
  SEQUENCE_DIAGRAM,
} from "@/lib/architecture";

export function SectionArchitecture() {
  return (
    <section id="architecture" className="scroll-mt-24 space-y-8">
      <header className="space-y-2">
        <p className="text-[11px] font-semibold tracking-[0.16em] text-teal-800 uppercase">
          8 · Azure architecture
        </p>
        <h2 className="font-heading text-2xl leading-snug text-pretty break-words sm:text-3xl">
          Target architecture, ADRs, and the selected Azure stack
        </h2>
        <p className="max-w-3xl text-sm leading-relaxed text-muted-foreground">
          Private Azure landing zone. Deterministic spine. AI sidecar is
          read-only. Lots live in PostgreSQL; SOP/spec chunks live in Azure AI
          Search.
        </p>
      </header>

      <MermaidDiagram
        title="System architecture — Azure Container Apps landing zone"
        chart={CONTEXT_DIAGRAM}
      />
      <MermaidDiagram
        title="Knowledge planes — do not embed the living lot"
        chart={PLANES_DIAGRAM}
      />
      <MermaidDiagram
        title="A1 packet draft sequence — HITL, no disposition"
        chart={SEQUENCE_DIAGRAM}
      />

      <div>
        <h3 className="text-sm font-semibold tracking-tight">
          Selected Azure technology (best fit)
        </h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Chosen for private link, Entra, GxP-relevant audit, and FDE operating
          cost. Laptop Chroma stays an exploration tool, not the target.
        </p>
        <div className="mt-3 overflow-x-auto rounded-2xl border border-border bg-card">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead className="border-b border-border bg-muted/40 text-[11px] tracking-wide text-muted-foreground uppercase">
              <tr>
                <th className="px-3 py-2 font-semibold">Layer</th>
                <th className="px-3 py-2 font-semibold">Selected</th>
                <th className="px-3 py-2 font-semibold">Rejected</th>
                <th className="px-3 py-2 font-semibold">Why</th>
              </tr>
            </thead>
            <tbody>
              {AZURE_STACK.map((r) => (
                <tr key={r.layer} className="border-b border-border last:border-0">
                  <td className="px-3 py-3 align-top font-medium">{r.layer}</td>
                  <td className="px-3 py-3 align-top leading-6 text-teal-900">{r.selected}</td>
                  <td className="px-3 py-3 align-top text-xs leading-5 text-muted-foreground">
                    {r.rejected}
                  </td>
                  <td className="px-3 py-3 align-top text-xs leading-5">{r.why}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div>
        <h3 className="text-sm font-semibold tracking-tight">Architecture decision records</h3>
        <ul className="mt-3 space-y-3">
          {ADRS.map((a) => (
            <li key={a.id} className="rounded-xl border border-border bg-card p-4">
              <div className="flex flex-wrap items-baseline gap-2">
                <span className="font-mono text-xs font-semibold text-teal-800">{a.id}</span>
                <span className="rounded-full bg-teal-50 px-2 py-0.5 text-[11px] font-medium text-teal-800">
                  {a.status}
                </span>
                <h4 className="text-sm font-semibold">{a.title}</h4>
              </div>
              <p className="mt-2 text-sm leading-6">{a.decision}</p>
              <p className="mt-2 font-mono text-[11px] text-muted-foreground">{a.href}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
