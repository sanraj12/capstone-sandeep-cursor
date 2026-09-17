"use client";

import { useCallback, useState } from "react";
import { FileArchive, LoaderCircle, Unplug, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { analyzeArchive } from "@/lib/analyze-archive";
import type { Assessment } from "@/lib/types";
import { cn } from "@/lib/utils";

export function ArchiveBinder({
  assessment,
  onBound,
  onReset,
}: {
  assessment: Assessment;
  onBound: (a: Assessment) => void;
  onReset: () => void;
}) {
  const [dragging, setDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const handleFile = useCallback(
    async (file: File | undefined) => {
      if (!file) return;
      if (!file.name.toLowerCase().endsWith(".zip")) {
        setError("Drop the .zip archive (directory trees inside folders are not read).");
        return;
      }
      setBusy(true);
      setError(null);
      try {
        const result = await analyzeArchive(file);
        onBound(result);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Could not read that zip.");
      } finally {
        setBusy(false);
      }
    },
    [onBound]
  );

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        setDragging(true);
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={(e) => {
        e.preventDefault();
        setDragging(false);
        void handleFile(e.dataTransfer.files[0]);
      }}
      className={cn(
        "rounded-xl border border-dashed p-3 transition-colors",
        dragging ? "border-teal-600 bg-teal-50" : "border-border bg-card/60"
      )}
    >
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-2.5">
          {assessment.source === "archive" ? (
            <FileArchive className="mt-0.5 size-4 shrink-0 text-teal-700" />
          ) : (
            <Unplug className="mt-0.5 size-4 shrink-0 text-amber-700" />
          )}
          <div className="min-w-0">
            <p className="text-xs font-medium text-foreground">
              {assessment.source === "archive"
                ? `Bound · ${assessment.archiveName}`
                : "Archive not bound"}
            </p>
            <p className="text-[11px] leading-relaxed text-muted-foreground">
              {assessment.source === "archive"
                ? `${assessment.fileCount} files · ${assessment.stack.join(" · ")}`
                : "Windows paths did not mount in this environment. Drop AI_FDE_CGT_Patient_to_Batch_Orchestration.zip to replace inferred ratings with file evidence."}
            </p>
            {error ? (
              <p className="mt-1 text-[11px] text-destructive">{error}</p>
            ) : null}
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          {assessment.source === "archive" ? (
            <Button
              type="button"
              size="xs"
              variant="ghost"
              onClick={() => {
                onReset();
                setError(null);
              }}
            >
              <X data-icon="inline-start" />
              Unbind
            </Button>
          ) : null}
          <label
            className={cn(
              "inline-flex h-6 cursor-pointer items-center gap-1 rounded-[min(var(--radius-md),10px)] border border-border bg-background px-2 text-xs font-medium hover:bg-muted",
              busy && "pointer-events-none opacity-50"
            )}
          >
            {busy ? (
              <LoaderCircle className="size-3 animate-spin" />
            ) : (
              <FileArchive className="size-3" />
            )}
            {busy ? "Reading…" : "Bind zip"}
            <input
              type="file"
              accept=".zip,application/zip"
              className="sr-only"
              onChange={(e) => {
                void handleFile(e.target.files?.[0]);
                e.target.value = "";
              }}
            />
          </label>
        </div>
      </div>
    </div>
  );
}
