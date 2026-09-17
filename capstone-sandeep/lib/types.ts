export type StageStatus =
  | "Mature"
  | "Needs Improvement"
  | "Missing"
  | "Critical Failure";

export type PhaseId = "discover" | "design" | "prove" | "operate";

export type EvidenceSource = "unbound" | "archive";

export type FindingSeverity = "high" | "medium" | "low" | "info";

export type Finding = {
  id: string;
  title: string;
  detail: string;
  severity: FindingSeverity;
  evidence: string[];
  stageIds: number[];
};

export type StageEvidence = {
  status: StageStatus;
  summary: string;
  evidence: string[];
  inferred: boolean;
};

export type FdeStage = {
  id: number;
  name: string;
  phase: PhaseId;
  question: string;
  exitCriteria: string[];
  expectedArtifacts: string[];
  cgtLens: string;
  probes: {
    pathHints: string[];
    contentHints: string[];
  };
};

export type Strength = {
  title: string;
  body: string;
  evidence: string[];
};

export type Problem = {
  title: string;
  body: string;
  evidence: string[];
  severity: FindingSeverity;
};

export type RoadmapWave = {
  id: string;
  name: string;
  intent: string;
  outcomes: string[];
  stageGates: number[];
  pattern: string;
};

export type Assessment = {
  source: EvidenceSource;
  archiveName: string | null;
  analyzedAt: string | null;
  fileCount: number;
  stack: string[];
  coreProblem: string;
  users: { role: string; job: string }[];
  initialVsCurrent: { initial: string; current: string };
  strengths: Strength[];
  problems: Problem[];
  stages: Record<number, StageEvidence>;
  findings: Finding[];
  treePreview: string[];
  securityHits: string[];
  testFiles: string[];
  readmeExcerpt: string | null;
  overallScore: number;
  overallLabel: string;
};
