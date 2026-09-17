import { StatusBadge } from "@/components/status-badge";
import { countByStatus } from "@/lib/status-styles";
import type { Assessment } from "@/lib/types";
import { FDE_STAGES } from "@/lib/fde-stages";

export function SectionOverview({ assessment }: { assessment: Assessment }) {
  const counts = countByStatus(Object.values(assessment.stages).map((s) => s.status));
  const criticalStages = FDE_STAGES.filter(
    (s) => assessment.stages[s.id]?.status === "Critical Failure"
  );

  return (
    <section id="overview" className="scroll-mt-24 space-y-8">
      <header className="space-y-2">
        <p className="text-[11px] font-semibold tracking-[0.16em] text-teal-800 uppercase">
          1 · Executive summary
        </p>
        <h2 className="font-heading text-2xl leading-snug text-pretty break-words text-foreground sm:text-3xl">
          Original problem, users, and the gap from intent to brownfield
        </h2>
        <p className="max-w-3xl text-sm leading-relaxed text-muted-foreground">
          An inherited CGT orchestration estate, judged as a Senior FDE would
          judge it: by the operational outcome it was built to hold, not by how
          many agents it contains.
        </p>
      </header>

      <div className="grid gap-3 sm:grid-cols-4">
        <Stat
          label="FDE maturity"
          value={`${assessment.overallScore}`}
          hint={assessment.overallLabel}
        />
        <Stat label="Mature stages" value={String(counts.mature)} hint="of 21" />
        <Stat
          label="Critical gaps"
          value={String(counts.critical)}
          hint={criticalStages.map((s) => `S${s.id}`).join(" · ") || "none"}
        />
        <Stat
          label="Evidence"
          value={assessment.source === "archive" ? "Bound" : "Inferred"}
          hint={
            assessment.source === "archive"
              ? `${assessment.fileCount} files`
              : "bind the zip to cite paths"
          }
        />
      </div>

      <article className="rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-7">
        <h3 className="text-sm font-semibold tracking-tight">Core problem statement</h3>
        <p className="mt-3 text-[15px] leading-7 text-foreground/90">
          {assessment.coreProblem}
        </p>
        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          <div>
            <h4 className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
              Initial scope
            </h4>
            <p className="mt-2 text-sm leading-6">{assessment.initialVsCurrent.initial}</p>
          </div>
          <div>
            <h4 className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
              Current state
            </h4>
            <p className="mt-2 text-sm leading-6">{assessment.initialVsCurrent.current}</p>
          </div>
        </div>
      </article>

      <a
        href="#mechanism"
        className="block rounded-2xl border border-teal-200 bg-teal-50/60 p-5 hover:bg-teal-50"
      >
        <p className="text-[11px] font-semibold tracking-wide text-teal-800 uppercase">
          Mechanism selection · Stage 8
        </p>
        <p className="mt-1 text-sm font-semibold">
          Do we need AI? No — not in the spine.
        </p>
        <p className="mt-1 text-sm leading-6 text-muted-foreground">
          COI, slots, spec limits, and QP release stay software or human. RAG
          and GenAI earn a place later as packet drafters and blocker briefs.
          Open the AI fit section.
        </p>
      </a>

      <div>
        <h3 className="text-sm font-semibold tracking-tight">Target users</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          The system is an operations spine, not a patient app. Consumers are
          the people who can lose a slot, a bag, or a lot.
        </p>
        <ul className="mt-4 grid gap-3 md:grid-cols-2">
          {assessment.users.map((u) => (
            <li
              key={u.role}
              className="rounded-xl border border-border bg-card p-4"
            >
              <p className="text-sm font-medium">{u.role}</p>
              <p className="mt-1 text-sm leading-6 text-muted-foreground">{u.job}</p>
            </li>
          ))}
        </ul>
      </div>

      {assessment.readmeExcerpt ? (
        <figure className="rounded-xl border border-border bg-muted/40 p-4">
          <figcaption className="text-[11px] font-semibold tracking-wide text-muted-foreground uppercase">
            README excerpt from bound archive
          </figcaption>
          <pre className="mt-2 max-h-48 overflow-auto font-mono text-[11px] leading-5 whitespace-pre-wrap text-foreground/80">
            {assessment.readmeExcerpt}
          </pre>
        </figure>
      ) : null}

      <div className="flex flex-wrap gap-2">
        <StatusBadge status="Mature" />
        <StatusBadge status="Needs Improvement" />
        <StatusBadge status="Missing" />
        <StatusBadge status="Critical Failure" />
        <span className="text-[11px] leading-6 text-muted-foreground">
          {counts.improve} need improvement · {counts.missing} missing
        </span>
      </div>
    </section>
  );
}

function Stat({
  label,
  value,
  hint,
}: {
  label: string;
  value: string;
  hint: string;
}) {
  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <p className="text-[11px] font-semibold tracking-wide text-muted-foreground uppercase">
        {label}
      </p>
      <p className="mt-1 font-heading text-2xl text-foreground">{value}</p>
      <p className="mt-1 text-[11px] leading-4 text-muted-foreground">{hint}</p>
    </div>
  );
}
