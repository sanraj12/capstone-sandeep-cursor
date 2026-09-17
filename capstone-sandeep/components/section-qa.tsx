"use client";

import { useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import {
  COLD_LINES,
  groupQaItems,
  QA_ITEMS,
  QA_SECTION_COPY,
  type QaItem,
} from "@/lib/presentation-qa";
import { cn } from "@/lib/utils";

const FILTERS: { id: "all" | QaItem["section"]; label: string }[] = [
  { id: "all", label: "All" },
  { id: "A", label: "A · Cohort" },
  { id: "B", label: "B · FDE check" },
  { id: "C", label: "C · Cold lines" },
];

export function SectionQa() {
  const [filter, setFilter] = useState<(typeof FILTERS)[number]["id"]>("all");
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(COLD_LINES.map((i) => [i.id, true]))
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return QA_ITEMS.filter((item) => {
      if (filter !== "all" && item.section !== filter) return false;
      if (!q) return true;
      const hay = [item.id, item.group, item.q, item.a, ...item.evidence]
        .join(" ")
        .toLowerCase();
      return hay.includes(q);
    });
  }, [filter, query]);

  const groups = useMemo(() => groupQaItems(filtered), [filtered]);
  const allOpen = filtered.length > 0 && filtered.every((i) => open[i.id]);

  function toggle(id: string) {
    setOpen((prev) => ({ ...prev, [id]: !prev[id] }));
  }

  function setAll(value: boolean) {
    setOpen((prev) => {
      const next = { ...prev };
      for (const item of filtered) next[item.id] = value;
      return next;
    });
  }

  return (
    <section id="qa" className="scroll-mt-24 space-y-8">
      <header className="space-y-2">
        <p className="text-[11px] font-semibold tracking-[0.16em] text-teal-800 uppercase">
          9 · Presentation Q&amp;A
        </p>
        <h2 className="font-heading text-2xl leading-snug text-pretty break-words sm:text-3xl">
          Cohort-2 Patient-to-Batch — answers grounded in this repo
        </h2>
        <p className="max-w-3xl text-sm leading-relaxed text-muted-foreground">
          Every worksheet question from the final presentation prep, answered
          from this assessment workbench (FDE map, mechanism, ADRs, Azure
          stack). The original zip CSVs were never bound here — do not invent
          patient counts or KPI tables.
        </p>
      </header>

      <article className="rounded-2xl border border-amber-200 bg-amber-50/70 p-5 sm:p-6">
        <p className="text-[11px] font-semibold tracking-wide text-amber-900 uppercase">
          Evidence rule
        </p>
        <h3 className="mt-1 font-heading text-xl leading-snug">
          Cite this workbench. Do not recite the unbound zip.
        </h3>
        <p className="mt-3 text-sm leading-7 text-foreground/90">
          The prep worksheet assumed a delivered orchestration repo with{" "}
          <span className="font-mono text-xs">patients.csv</span>,{" "}
          <span className="font-mono text-xs">events.jsonl</span>, and live KPI
          numbers. Those files are not in this codebase. Answers below name
          stages, ADRs, and mechanism rows that actually exist here. Unbound
          score remains 28/100 until the source archive is dropped on the
          banner.
        </p>
      </article>

      <div>
        <h3 className="text-sm font-semibold tracking-tight">
          Five lines to have cold
        </h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Section C — if the room only hears these, the charter still holds.
        </p>
        <ol className="mt-3 space-y-3">
          {COLD_LINES.map((item, i) => (
            <li
              key={item.id}
              className="rounded-xl border border-teal-200 bg-teal-50/50 p-4"
            >
              <p className="text-[11px] font-semibold tracking-wide text-teal-800 uppercase">
                C{i + 1} · {item.q}
              </p>
              <p className="mt-2 text-sm leading-6">{item.a}</p>
            </li>
          ))}
        </ol>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-1">
          {FILTERS.map((f) => (
            <button
              key={f.id}
              type="button"
              onClick={() => setFilter(f.id)}
              className={cn(
                "rounded-full px-3 py-1 text-xs font-medium",
                filter === f.id
                  ? "bg-foreground text-background"
                  : "bg-muted text-muted-foreground hover:text-foreground"
              )}
            >
              {f.label}
            </button>
          ))}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search questions, answers, evidence…"
            className="h-8 w-full min-w-[12rem] sm:w-72"
            aria-label="Search presentation questions"
          />
          <button
            type="button"
            onClick={() => setAll(!allOpen)}
            className="shrink-0 rounded-full border border-border px-3 py-1 text-xs font-medium text-muted-foreground hover:bg-muted hover:text-foreground"
          >
            {allOpen ? "Collapse" : "Expand all"}
          </button>
        </div>
      </div>

      {groups.length === 0 ? (
        <p className="rounded-xl border border-dashed border-border bg-card p-6 text-sm text-muted-foreground">
          No questions match “{query}”. Clear the search or switch section.
        </p>
      ) : (
        groups.map((g) => (
          <div key={`${g.section}-${g.group}`} className="space-y-3">
            <div>
              <p className="text-[11px] font-semibold tracking-[0.14em] text-teal-800 uppercase">
                {g.section} · {QA_SECTION_COPY[g.section].title}
              </p>
              <h3 className="mt-1 text-sm font-semibold tracking-tight">{g.group}</h3>
            </div>
            <ul className="space-y-3">
              {g.items.map((item) => {
                const isOpen = Boolean(open[item.id]);
                return (
                  <li
                    key={item.id}
                    className="rounded-xl border border-border bg-card"
                  >
                    <button
                      type="button"
                      onClick={() => toggle(item.id)}
                      aria-expanded={isOpen}
                      className="flex w-full items-start gap-3 p-4 text-left"
                    >
                      <span className="mt-0.5 shrink-0 rounded-md bg-muted px-1.5 py-0.5 font-mono text-[10px] font-semibold text-teal-800">
                        {item.id}
                      </span>
                      <span className="flex-1 text-sm font-medium leading-6">
                        {item.q}
                      </span>
                      <span className="mt-1 shrink-0 text-[11px] text-muted-foreground">
                        {isOpen ? "Hide" : "Answer"}
                      </span>
                    </button>
                    {isOpen ? (
                      <div className="space-y-3 border-t border-border px-4 py-4">
                        <p className="text-sm leading-7">{item.a}</p>
                        <div>
                          <p className="text-[11px] font-semibold tracking-wide text-muted-foreground uppercase">
                            Cite from this repo
                          </p>
                          <ul className="mt-1 space-y-1">
                            {item.evidence.map((e) => (
                              <li
                                key={e}
                                className="font-mono text-[11px] leading-5 text-teal-900"
                              >
                                {e}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    ) : null}
                  </li>
                );
              })}
            </ul>
          </div>
        ))
      )}
    </section>
  );
}
