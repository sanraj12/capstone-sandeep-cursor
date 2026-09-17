"use client";

import { useEffect, useId, useRef } from "react";

export function MermaidDiagram({ chart, title }: { chart: string; title: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const reactId = useId().replace(/:/g, "");

  useEffect(() => {
    let cancelled = false;
    const el = ref.current;
    if (!el) return;

    void (async () => {
      const mermaid = (await import("mermaid")).default;
      mermaid.initialize({
        startOnLoad: false,
        securityLevel: "strict",
        theme: "base",
        themeVariables: {
          fontFamily: "IBM Plex Sans, ui-sans-serif, sans-serif",
          fontSize: "13px",
          primaryColor: "#ecfdf8",
          primaryTextColor: "#134e4a",
          primaryBorderColor: "#5eead4",
          lineColor: "#0f766e",
          secondaryColor: "#fff7ed",
          tertiaryColor: "#f8fafc",
          clusterBkg: "#f8fafc",
          clusterBorder: "#d6d3d1",
        },
      });
      const id = `mmd-${reactId}-${Math.random().toString(36).slice(2, 7)}`;
      try {
        const { svg } = await mermaid.render(id, chart);
        if (!cancelled && ref.current) ref.current.innerHTML = svg;
      } catch (e) {
        if (!cancelled && ref.current) {
          ref.current.textContent =
            e instanceof Error ? e.message : "Diagram failed to render.";
        }
      }
    })();

    return () => {
      cancelled = true;
      if (el) el.innerHTML = "";
    };
  }, [chart, reactId]);

  return (
    <figure className="overflow-x-auto rounded-2xl border border-border bg-card p-3 sm:p-4">
      <figcaption className="mb-2 text-[11px] font-semibold tracking-wide text-muted-foreground uppercase">
        {title}
      </figcaption>
      <div ref={ref} className="flex min-h-40 justify-center text-xs text-muted-foreground" />
    </figure>
  );
}
