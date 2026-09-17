"use client";

import { useState } from "react";
import { Download, LoaderCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export function DownloadRepoButton() {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function download() {
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/download-repo");
      if (!res.ok) {
        const body = (await res.json().catch(() => null)) as { error?: string } | null;
        throw new Error(body?.error ?? `Download failed (${res.status})`);
      }
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "capstone-sandeep.zip";
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not download the repository.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex flex-col items-stretch gap-1 sm:items-end">
      <Button
        type="button"
        variant="outline"
        onClick={() => void download()}
        disabled={busy}
        className="w-full sm:w-auto"
      >
        {busy ? (
          <LoaderCircle data-icon="inline-start" className="animate-spin" />
        ) : (
          <Download data-icon="inline-start" />
        )}
        {busy ? "Packing zip…" : "Download complete repo"}
      </Button>
      <p className="max-w-[16rem] text-[11px] leading-4 text-muted-foreground sm:text-right">
        {error ? (
          <span className="text-destructive">{error}</span>
        ) : (
          "Source zip · no node_modules. Unzip, then npm install."
        )}
      </p>
    </div>
  );
}
