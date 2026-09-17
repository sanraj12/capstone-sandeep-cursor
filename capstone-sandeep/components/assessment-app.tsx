"use client";

import { useMemo, useState } from "react";
import { ArchiveBinder } from "@/components/archive-binder";
import { DownloadRepoButton } from "@/components/download-repo";
import { SectionAiBuild } from "@/components/section-ai-build";
import { SectionArchitecture } from "@/components/section-architecture";
import { SectionDebt } from "@/components/section-debt";
import { SectionFde } from "@/components/section-fde";
import { SectionMechanism } from "@/components/section-mechanism";
import { SectionOverview } from "@/components/section-overview";
import { SectionQa } from "@/components/section-qa";
import { SectionRoadmap } from "@/components/section-roadmap";
import { SectionStrengths } from "@/components/section-strengths";
import { StatusBadge } from "@/components/status-badge";
import { FDE_STAGES } from "@/lib/fde-stages";
import { SEED_ASSESSMENT } from "@/lib/seed-assessment";
import type { Assessment } from "@/lib/types";
import { cn } from "@/lib/utils";

const NAV = [
  { id: "overview", label: "1 Summary" },
  { id: "strengths", label: "2 Strengths" },
  { id: "debt", label: "3 Debt" },
  { id: "fde", label: "4 FDE map" },
  { id: "roadmap", label: "5 Roadmap" },
  { id: "mechanism", label: "6 AI fit" },
  { id: "ai-build", label: "7 Build AI" },
  { id: "architecture", label: "8 Azure" },
  { id: "qa", label: "9 Q&A" },
  { id: "inspect", label: "Tree" },
];

export function AssessmentApp() {
  const [assessment, setAssessment] = useState<Assessment>(SEED_ASSESSMENT);
  const [active, setActive] = useState("overview");

  const critical = useMemo(
    () =>
      FDE_STAGES.filter((s) => assessment.stages[s.id]?.status === "Critical Failure"),
    [assessment]
  );

  return (
    <div className="min-h-full bg-background">
      <header className="border-b border-border bg-[color:var(--paper-band)]">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-5 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="text-[11px] font-semibold tracking-[0.18em] text-teal-800 uppercase">
                FDE architectural assessment
              </p>
              <h1 className="font-heading mt-1 max-w-2xl text-2xl leading-snug text-pretty break-words text-foreground sm:text-3xl">
                CGT patient-to-batch orchestration
              </h1>
              <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
                Brownfield reverse-engineering against the 21-stage AI FDE
                operating model. Inherited estate: EY Batch 2 capstone.
              </p>
            </div>
            <div className="flex flex-col items-stretch gap-3 sm:items-end">
              <div className="rounded-xl border border-border bg-card px-3 py-2 text-right">
                <p className="text-[11px] tracking-wide text-muted-foreground uppercase">
                  Maturity index
                </p>
                <p className="font-heading text-3xl tabular-nums">{assessment.overallScore}</p>
                <p className="max-w-[14rem] text-[11px] leading-4 text-muted-foreground">
                  {assessment.overallLabel}
                </p>
              </div>
              <DownloadRepoButton />
            </div>
          </div>
          <ArchiveBinder
            assessment={assessment}
            onBound={setAssessment}
            onReset={() => setAssessment(SEED_ASSESSMENT)}
          />
        </div>
      </header>

      <div className="sticky top-0 z-20 border-b border-border bg-background/90 backdrop-blur">
        <nav className="mx-auto flex max-w-6xl gap-1 overflow-x-auto px-4 py-2 sm:px-6 lg:px-8">
          {NAV.map((n) => (
            <a
              key={n.id}
              href={`#${n.id}`}
              onClick={() => setActive(n.id)}
              className={cn(
                "shrink-0 rounded-full px-3 py-1 text-xs font-medium",
                active === n.id
                  ? "bg-foreground text-background"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              {n.label}
            </a>
          ))}
        </nav>
      </div>

      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-8 sm:px-6 lg:grid-cols-[220px_minmax(0,1fr)] lg:px-8 lg:py-10">
        <aside className="hidden lg:block">
          <div className="sticky top-16 space-y-4">
            <p className="text-[11px] font-semibold tracking-wide text-muted-foreground uppercase">
              Critical stages
            </p>
            {critical.length ? (
              <ul className="space-y-2">
                {critical.map((s) => (
                  <li key={s.id}>
                    <a
                      href={`#stage-${s.id}`}
                      className="block rounded-lg border border-red-200 bg-red-50/80 p-2 hover:bg-red-50"
                    >
                      <span className="font-mono text-[10px] text-red-800">
                        S{String(s.id).padStart(2, "0")}
                      </span>
                      <span className="mt-0.5 block text-xs font-medium leading-4 text-red-950">
                        {s.name}
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-xs text-muted-foreground">No critical-failure stages.</p>
            )}
            <div className="space-y-2 pt-2">
              {(["Mature", "Needs Improvement", "Missing", "Critical Failure"] as const).map(
                (st) => (
                  <div key={st} className="flex items-center justify-between gap-2">
                    <StatusBadge status={st} />
                    <span className="font-mono text-[11px] text-muted-foreground">
                      {
                        Object.values(assessment.stages).filter((x) => x.status === st)
                          .length
                      }
                    </span>
                  </div>
                )
              )}
            </div>
          </div>
        </aside>

        <main className="space-y-16 pb-20">
          <SectionOverview assessment={assessment} />
          <SectionStrengths assessment={assessment} />
          <SectionDebt assessment={assessment} />
          <SectionFde assessment={assessment} />
          <SectionRoadmap />
          <SectionMechanism />
          <SectionAiBuild />
          <SectionArchitecture />
          <SectionQa />
          <section id="inspect" className="scroll-mt-24 space-y-4">
            <header className="space-y-2">
              <p className="text-[11px] font-semibold tracking-[0.16em] text-teal-800 uppercase">
                Bound tree
              </p>
              <h2 className="font-heading text-2xl">Directory signals</h2>
            </header>
            <pre className="max-h-[420px] overflow-auto rounded-2xl border border-border bg-card p-4 font-mono text-[11px] leading-5 text-foreground/80">
              {assessment.treePreview.join("\n") || "(empty)"}
            </pre>
            <p className="text-xs text-muted-foreground">
              Bind the zip to populate this tree from the archive. Paths listed
              are the densest three-level prefixes, not a full listing.
            </p>
          </section>
        </main>
      </div>
    </div>
  );
}
