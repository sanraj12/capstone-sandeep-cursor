import type { StageStatus } from "./types";

export const STATUS_STYLES: Record<
  StageStatus,
  { label: string; className: string; dot: string }
> = {
  Mature: {
    label: "Mature",
    className: "bg-teal-50 text-teal-800 border-teal-200",
    dot: "bg-teal-600",
  },
  "Needs Improvement": {
    label: "Needs Improvement",
    className: "bg-amber-50 text-amber-900 border-amber-200",
    dot: "bg-amber-500",
  },
  Missing: {
    label: "Missing",
    className: "bg-slate-100 text-slate-700 border-slate-200",
    dot: "bg-slate-400",
  },
  "Critical Failure": {
    label: "Critical Failure",
    className: "bg-red-50 text-red-800 border-red-200",
    dot: "bg-red-600",
  },
};

export function countByStatus(statuses: StageStatus[]) {
  return {
    mature: statuses.filter((s) => s === "Mature").length,
    improve: statuses.filter((s) => s === "Needs Improvement").length,
    missing: statuses.filter((s) => s === "Missing").length,
    critical: statuses.filter((s) => s === "Critical Failure").length,
  };
}
