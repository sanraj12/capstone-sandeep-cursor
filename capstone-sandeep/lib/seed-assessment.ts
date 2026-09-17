import { FDE_STAGES } from "./fde-stages";
import type { Assessment, StageEvidence, StageStatus } from "./types";

const UNBOUND_NOTE =
  "Source archive was referenced but not bound in this workspace. Status is inferred from artifact identity (AI_FDE_CGT_Patient_to_Batch_Orchestration) and CGT / FDE operating-model analysis. Drop the zip to replace inference with file-level evidence.";

function inferred(status: StageStatus, summary: string): StageEvidence {
  return {
    status,
    summary: `${summary} ${UNBOUND_NOTE}`,
    evidence: [
      "Artifact: Capstone-EY-Batch 2 / AI_FDE_CGT_Patient_to_Batch_Orchestration.zip",
      "Artifact: 21 Stage AI_FDE_Operating_Model.pdf (operating-model rubric applied in this workbench)",
    ],
    inferred: true,
  };
}

const stages: Record<number, StageEvidence> = {
  1: inferred(
    "Needs Improvement",
    "The estate is clearly an inherited CGT orchestration capstone, not a greenfield product. The name encodes the original outcome (patient → batch) but there is no engagement reframe, freeze list, or owner map in the unbound workspace."
  ),
  2: inferred(
    "Needs Improvement",
    "The intended journey is reconstructable from the CGT domain (enrollment, collection, slot, batch, QC) but there is no operator observation log or exception catalog bound to source. Brownfield CGT systems almost always hide the real work in email and spreadsheets around the code."
  ),
  3: inferred(
    "Needs Improvement",
    "A patient-to-batch orchestrator implies adapters to case, collection, slot, and manufacturing systems. Until the zip is bound we cannot see whether those are real ports or copy-pasted stubs. Expect overlapping conductors and mock clients — the usual brownfield signature."
  ),
  4: inferred(
    "Missing",
    "No baseline packet (cycle time, discarded lots, identity-mismatch rate, QA packet time) is visible without source. There is no independent verifier definition. A demo script is not a baseline."
  ),
  5: inferred(
    "Critical Failure",
    "For autologous CGT, identity mismatch and unsupervised batch release are never-events. An AI FDE capstone named for patient-to-batch orchestration that does not present an explicit risk ceiling and write-forbid list is operating above a safe envelope even as a prototype."
  ),
  6: inferred(
    "Needs Improvement",
    "The zip name is a de-facto charter: bind a patient to a manufacturing batch. That is tighter and healthier than ‘platform for CGT’. It is still not a signed charter with stop conditions, out-of-scope (infusion/follow-up), and an accepted outcome."
  ),
  7: inferred(
    "Needs Improvement",
    "Capstone orchestrators typically ship synthetic patients and happy-path fixtures. That is a valid exploration data plane. It is not operational, evaluation, or feedback data. PHI handling and retention are unknown until files are bound."
  ),
  8: inferred(
    "Needs Improvement",
    "The ‘AI_FDE’ prefix strongly suggests model/agent involvement in a workflow that should be majority deterministic (COI, slot exclusivity, spec limits). Mechanism selection is likely inverted: LLM in the spine, rules at the edge. That is the wrong default for GxP identity."
  ),
  9: inferred(
    "Needs Improvement",
    "Patient, batch, and slot almost certainly exist as records. A guarded state machine with illegal-transition refusal is what is usually missing in brownfield CGT tools, which store status as strings and let every adapter write them."
  ),
  10: inferred(
    "Missing",
    "No evidence of a designed reviewer job (evidence packet, time, authority, override). AI FDE systems in this class often add a chat UI and call it HITL."
  ),
  11: inferred(
    "Needs Improvement",
    "Expect mock HTTP clients and implicit JSON blobs rather than versioned contracts, idempotent slot holds, and least-privilege tools. Confirm on bind."
  ),
  12: inferred(
    "Missing",
    "No eval plan, identity-swap cases, or tamper-evident audit schema is visible. Inspection readiness cannot be inferred from a capstone name."
  ),
  13: inferred(
    "Needs Improvement",
    "The artifact exists as a named patient-to-batch orchestrator, so some walking path was built. Whether that path exercises identity, slot conflict, and a human disposition gate — versus a scripted happy path — is the question to answer on bind."
  ),
  14: inferred(
    "Needs Improvement",
    "Brownfield orchestration estates in this class commonly accumulate a second conductor (notebook, cron, agent graph, Celery) that also mutates batch status. Until bind, treat dual-spine as the working hypothesis."
  ),
  15: inferred(
    "Critical Failure",
    "Chain of Identity is the load-bearing control of autologous CGT. Without bound evidence of blocking, deterministic COI checks and dual-control disposition, this stage is a critical failure by default — not a documentation gap."
  ),
  16: inferred(
    "Missing",
    "Capstone brownfield trees in this program family rarely include an eval harness, contract tests, or structured traces with correlation IDs. Assume absent until the archive proves otherwise."
  ),
  17: inferred(
    "Missing",
    "No pilot protocol, named users, or shadow-mode flag is visible. A local demo is not a pilot."
  ),
  18: inferred(
    "Critical Failure",
    "GxP-relevant functions (identity, disposition) plus typical capstone patterns (secrets in env files, no auth, unpinned ‘latest’ models) put production-hardening in critical failure until disproven. Do not connect this estate to a real MES."
  ),
  19: inferred(
    "Missing",
    "No runbook or lot-aware rollback/compensating action is visible. You cannot roll back a collected bag; the absence of compensating-action design is a launch blocker."
  ),
  20: inferred(
    "Missing",
    "No receiving owner, on-call, or training record. The FDE who inherited this is still the bus factor of one."
  ),
  21: inferred(
    "Missing",
    "No service review, SLO, productization path, or retirement of shadow tools. Expansion beyond patient-to-batch would be scope creep, not operate-stage maturity."
  ),
};

export const SEED_ASSESSMENT: Assessment = {
  source: "unbound",
  archiveName: null,
  analyzedAt: null,
  fileCount: 0,
  stack: [
    "Unknown until archive bind",
    "Expected: workflow/orchestrator + adapters + operator UI",
  ],
  coreProblem:
    "Autologous cell and gene therapy is make-to-order: one patient is one batch. The original problem this estate was built to solve is not ‘add AI to manufacturing’. It is to keep a single identity thread intact from the enrolled patient through collection and a manufacturing slot until a batch is QC’d and human-released — so the right product is made for the right patient in a calendar that cannot slip without destroying a living starting material. Traditional ERP/MES/LIMS stacks assume make-to-stock lots. They do not natively refuse a mismatched identity, hold an exclusive slot across site and plant, or assemble an inspection-ready chain when six to ten systems each hold a fragment of the same patient.",
  users: [
    {
      role: "Case manager / patient operations",
      job: "Enroll, keep the calendar honest, and see blockers before a collection day is wasted.",
    },
    {
      role: "Manufacturing planner / slot owner",
      job: "Hold, sequence, and recover plant slots when collection or courier reality changes.",
    },
    {
      role: "Manufacturing / MSAT",
      job: "Start and run the patient-specific batch with the correct starting material and process version.",
    },
    {
      role: "QA / QP",
      job: "Release or reject with a complete COI/COC and QC packet; never from a chat summary alone.",
    },
    {
      role: "Logistics coordinator",
      job: "Move collected material and finished product inside time and temperature windows.",
    },
    {
      role: "Forward deployed engineer / platform",
      job: "Keep the orchestration spine truthful, observable, and change-controlled.",
    },
  ],
  initialVsCurrent: {
    initial:
      "The artifact name is a tight charter: Patient to Batch. That is the high-value, high-risk spine — identity, slot, batch, disposition — not a full commercial CGT platform.",
    current:
      "As an inherited brownfield capstone, the estate is expected to have sprawled: extra UIs, notebooks, duplicate orchestrators, mock adapters that leaked into ‘the real path’, and AI/agent layers bolted onto a workflow that still lacks a guarded domain model. The workbench treats that sprawl as the default hypothesis until the zip is bound and the tree says otherwise.",
  },
  strengths: [
    {
      title: "The problem is operationally real, not a demo in search of a user",
      body: "Patient-to-batch orchestration is one of the few AI FDE problems where the accepted outcome is unambiguous: a living starting material becomes a released, identity-bound lot. That is stronger product sense than a generic ‘CGT copilot’.",
      evidence: [
        "Artifact name encodes the outcome boundary (patient → batch).",
        "CGT operating reality: one patient, one batch, non-substitutable lots.",
      ],
    },
    {
      title: "Scope fence is already implied",
      body: "Stopping at batch (not infusion, REMS, or long-term follow-up) is the correct first vertical slice. Many failed CGT programs drown by trying to digitize the entire vein-to-vein network on day one.",
      evidence: [
        "Zip title: AI_FDE_CGT_Patient_to_Batch_Orchestration",
        "Industry split: orchestration hub vs treatment-center administration record.",
      ],
    },
    {
      title: "A 21-stage FDE rubric exists to judge the estate",
      body: "The accompanying operating-model PDF is itself a strength of the engagement: it gives stage-gates, not vibes. This workbench encodes that model so future changes can be refused when they skip Discover or Prove.",
      evidence: [
        "21 Stage AI_FDE_Operating_Model.pdf referenced as the mapping rubric.",
      ],
    },
    {
      title: "Capstone shape enables a strangler, not a rewrite-first panic",
      body: "An inherited orchestrator with adapters is the right substrate for a strangler fig: freeze writes to COI, extract a state machine, replace one adapter at a time. That is cheaper and safer than a greenfield ‘platform’.",
      evidence: [
        "Named as orchestration (spine + participants), not as a single MES replacement.",
      ],
    },
  ],
  problems: [
    {
      title: "Identity is probably a field, not a control",
      body: "In brownfield CGT code, patient_id, din, lot, and coi_id are routinely copied across JSON payloads with string equality in the UI. That is not Chain of Identity. COI is a blocking control at every handoff, with dual identifiers, illegal-transition refusal, and an audit event.",
      evidence: [
        "No bound COI guard module.",
        "Stage 15 defaulted to Critical Failure until file evidence exists.",
      ],
      severity: "high",
    },
    {
      title: "Mechanism selection is likely inverted",
      body: "Prefixing the estate with AI_FDE predicts an agent/LLM in the coordination spine. Identity matching, slot exclusivity, and spec limits must be deterministic. Models may draft packets and propose recoveries. If the model is the orchestrator, the system cannot be validated.",
      evidence: [
        "Artifact naming: AI_FDE + Orchestration.",
        "FDE Stage 8 (smallest sufficient mechanism) is the design defect to confirm on bind.",
      ],
      severity: "high",
    },
    {
      title: "No verifier, no evals, no inspection-ready chain",
      body: "Without gold lots, identity-swap cases, and a queryable audit thread, this cannot enter a GxP-relevant pilot. QA cannot be asked to ‘trust the copilot’.",
      evidence: ["Stages 4, 12, 16 scored Missing in the unbound assessment."],
      severity: "high",
    },
    {
      title: "Production-hardening and secrets posture unknown — treat as unsafe",
      body: "Capstone trees commonly contain .env keys, open endpoints, pickle/eval, and no RBAC. Until the inspector says otherwise, do not point this at a real plant system.",
      evidence: ["Stage 18 Critical Failure by default."],
      severity: "high",
    },
    {
      title: "Dual orchestration spines and status spaghetti",
      body: "The most common brownfield failure in this class is two writers to batch status (workflow engine + agent + notebook). The parent then diverges from children. Manual retry of QC does not resurrect the parent.",
      evidence: ["Stage 14 working hypothesis: overlapping conductors."],
      severity: "medium",
    },
    {
      title: "HITL is probably a button, not a job",
      body: "A reviewer who cannot see DIN, COI, slot, QC flags, and the rule that fired cannot override safely. Automation bias on a patient-specific lot is a safety event.",
      evidence: ["Stage 10 Missing."],
      severity: "medium",
    },
  ],
  stages,
  findings: FDE_STAGES.filter((s) => stages[s.id].status === "Critical Failure").map(
    (s) => ({
      id: `unbound-s${s.id}`,
      title: `Stage ${s.id} ${s.name} is a critical gap`,
      detail: stages[s.id].summary,
      severity: "high" as const,
      evidence: stages[s.id].evidence,
      stageIds: [s.id],
    })
  ),
  treePreview: [
    "(archive not bound)",
    "Expected top-level: README, src|app|services, adapters|integrations, ui|frontend, tests, docs, docker|compose, notebooks",
  ],
  securityHits: [],
  testFiles: [],
  readmeExcerpt: null,
  overallScore: 28,
  overallLabel: "Pre-charter brownfield — unsafe to connect to GxP systems",
};

export function scoreFromStages(stagesMap: Record<number, StageEvidence>): {
  overallScore: number;
  overallLabel: string;
} {
  const rank: Record<StageStatus, number> = {
    Mature: 100,
    "Needs Improvement": 45,
    Missing: 15,
    "Critical Failure": 0,
  };
  const values = Object.values(stagesMap).map((s) => rank[s.status]);
  const overallScore = Math.round(values.reduce((a, b) => a + b, 0) / values.length);
  let overallLabel = "Not ready";
  if (overallScore >= 80) overallLabel = "Production-capable with residual risk";
  else if (overallScore >= 60) overallLabel = "Pilot-eligible with a tight envelope";
  else if (overallScore >= 40) overallLabel = "Exploration only — charter and freeze writes";
  else overallLabel = "Pre-charter brownfield — unsafe to connect to GxP systems";
  return { overallScore, overallLabel };
}
