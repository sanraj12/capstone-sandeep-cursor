import type { FdeStage, PhaseId } from "./types";

export const PHASES: { id: PhaseId; label: string; range: string }[] = [
  { id: "discover", label: "Discover & Frame", range: "1–6" },
  { id: "design", label: "Design the Change", range: "7–12" },
  { id: "prove", label: "Build & Prove", range: "13–17" },
  { id: "operate", label: "Launch & Operate", range: "18–21" },
];

export const FDE_STAGES: FdeStage[] = [
  {
    id: 1,
    name: "Inherit & Reconcile",
    phase: "discover",
    question:
      "What was sold or inherited, what actually exists, who owns the boundary, and what must not be changed yet?",
    exitCriteria: [
      "Engagement reframe names the operational outcome, not the technology.",
      "Known source artifacts, owners, and access constraints are inventoried.",
      "A freeze list exists for identity, release, and safety-critical paths.",
    ],
    expectedArtifacts: [
      "README / problem statement",
      "engagement brief",
      "source inventory",
    ],
    cgtLens:
      "Confirm whether the estate is patient-to-batch only, or has sprawled into full vein-to-vein (infusion, follow-up, commercial slot market). Freeze Chain of Identity writes until the model is proven.",
    probes: {
      pathHints: ["readme", "docs/", "problem", "brief", "inherit"],
      contentHints: ["problem statement", "inherited", "brownfield", "capstone"],
    },
  },
  {
    id: 2,
    name: "Observe the Work",
    phase: "discover",
    question:
      "How does the work actually happen, including the exceptions, workarounds, and tribal knowledge that never made the SOP?",
    exitCriteria: [
      "A current-state journey is evidenced from operators, not from a slide.",
      "Happy-path and at least the top exception classes are named.",
    ],
    expectedArtifacts: [
      "process map / BPMN",
      "observation notes",
      "exception catalog",
    ],
    cgtLens:
      "Walk enrollment → eligibility → apheresis booking → collection → courier handoff → manufacturing slot → batch start → in-process QC → disposition → shipment. Capture what happens when a slot slips or a bag is delayed.",
    probes: {
      pathHints: ["process", "workflow", "bpmn", "journey", "sop"],
      contentHints: ["apheresis", "vein-to-vein", "exception", "workaround"],
    },
  },
  {
    id: 3,
    name: "Map Actors, Systems & Exceptions",
    phase: "discover",
    question:
      "Who acts, which systems of record they touch, and where identity, custody, and schedule diverge?",
    exitCriteria: [
      "Actor × system × record map exists for patient, collection, slot, batch, and shipment.",
      "Exception set is classified by detectability and blast radius.",
    ],
    expectedArtifacts: [
      "system landscape",
      "adapter inventory",
      "RACI / actor map",
    ],
    cgtLens:
      "Expect 6–10 systems: EHR/ordering, case management, LIMS, MES, ERP/slot, courier TMS, quality/QMS, and a treatment-center scheduler. The orchestration layer is not a twelfth SOP spreadsheet.",
    probes: {
      pathHints: ["adapter", "integration", "client", "connector", "systems"],
      contentHints: ["lims", "mes", "ehr", "courier", "qms", "fhir"],
    },
  },
  {
    id: 4,
    name: "Establish Baseline & Verifier",
    phase: "discover",
    question:
      "What is the current performance of the work, and who/what can independently say the outcome is true?",
    exitCriteria: [
      "Baseline metrics are measured or explicitly unmeasured with a plan.",
      "A verifier is named that does not depend on the system under change.",
    ],
    expectedArtifacts: ["KPI baseline", "verifier definition", "gold cases"],
    cgtLens:
      "Baselines that matter: vein-to-vein cycle time, slot utilization, identity-mismatch rate, discarded batches, QA cycle time, inspection reconstruction time. The verifier for a released batch is QA/QP plus the COI/COC packet — not the model’s confidence score.",
    probes: {
      pathHints: ["metrics", "kpi", "baseline", "gold", "eval"],
      contentHints: ["cycle time", "slot utilization", "baseline", "verifier"],
    },
  },
  {
    id: 5,
    name: "Frame Value, Risk Ceiling & Guardrails",
    phase: "discover",
    question:
      "What value is attributable, what failure is intolerable, and which actions are forbidden without a human?",
    exitCriteria: [
      "Value hypothesis is falsifiable and owned.",
      "Risk ceiling names identity mismatch, wrong-patient infusion, and unsupervised batch release as never-events.",
    ],
    expectedArtifacts: [
      "value case",
      "risk register",
      "guardrail list",
    ],
    cgtLens:
      "Value is fewer lost slots, fewer discarded patient lots, faster QA packet assembly, and inspection-ready chains. Guardrails: no autonomous COI mutation, no autonomous batch disposition, no unsupervised external communication to sites or couriers.",
    probes: {
      pathHints: ["risk", "threat", "guardrail", "value", "roi"],
      contentHints: ["never event", "phi", "gxp", "hipaa", "21 cfr", "guardrail"],
    },
  },
  {
    id: 6,
    name: "Charter the Workflow",
    phase: "discover",
    question:
      "Is this workflow worth changing now, and what is the accepted outcome that proves it?",
    exitCriteria: [
      "Charter names user, interface, decision, inputs, action, outcome, and stop conditions.",
      "Out-of-scope is explicit (typically infusion and long-term follow-up if the name is patient-to-batch).",
    ],
    expectedArtifacts: ["workflow charter", "ADR-0001", "scope fence"],
    cgtLens:
      "Charter the accepted outcome as: a patient identity is bound to a manufacturing batch with an intact COI/COC chain and a human-released disposition. Do not charter ‘an AI platform for CGT’.",
    probes: {
      pathHints: ["charter", "adr", "scope", "decision-record"],
      contentHints: ["in scope", "out of scope", "accepted outcome", "charter"],
    },
  },
  {
    id: 7,
    name: "Prepare the Four Data Planes",
    phase: "design",
    question:
      "Are operational, context, evaluation, and feedback sources fit for this decision and affordable to operate?",
    exitCriteria: [
      "Each plane has a source of authority, quality threshold, and failure behavior.",
      "PHI/PII handling and retention are explicit.",
    ],
    expectedArtifacts: [
      "data-readiness note",
      "schemas / fixtures",
      "lineage note",
    ],
    cgtLens:
      "Operational: patient, collection, slot, batch, QC results. Context: SOPs, product specs, slot calendars. Evaluation: historical lots with known dispositions. Feedback: QA overrides, deviations, temperature excursions. Synthetic fixtures are acceptable in exploration; they are not a production data plane.",
    probes: {
      pathHints: ["schema", "fixture", "seed", "data/", "models/", "prisma"],
      contentHints: ["patient_id", "batch_id", "coi", "phi", "pydantic", "zod"],
    },
  },
  {
    id: 8,
    name: "Select the Smallest Sufficient Mechanism",
    phase: "design",
    question:
      "Which steps belong in deterministic software, which in retrieval or a model, and which must stay human?",
    exitCriteria: [
      "A mechanism record exists per workflow step.",
      "Identity matching, slot conflict, and disposition gates are deterministic unless a documented exception exists.",
    ],
    expectedArtifacts: [
      "intelligence-selection record",
      "rules vs model matrix",
    ],
    cgtLens:
      "COI equality, ISBT-128 parse, slot exclusivity, temperature-excursion thresholds, and spec-limit checks are software. Narrative deviation summaries, packet drafting, and schedule-recovery options may be model-assisted. Batch release remains human.",
    probes: {
      pathHints: ["agent", "langchain", "langgraph", "crewai", "rules", "policy"],
      contentHints: ["llm", "prompt", "deterministic", "state machine", "rules engine"],
    },
  },
  {
    id: 9,
    name: "Design the Domain & State Model",
    phase: "design",
    question:
      "What are the canonical entities and legal state transitions for patient, collection, slot, and batch?",
    exitCriteria: [
      "Entities, identifiers, and transitions are explicit and guarded.",
      "Illegal transitions cannot be performed by an adapter, UI, or agent.",
    ],
    expectedArtifacts: [
      "domain model",
      "state machine",
      "identifier policy",
    ],
    cgtLens:
      "Canonical thread: Patient → Enrollment → Collection (DIN) → COI identifier → Manufacturing order → Batch/lot → QC suite → Disposition → Qualified shipment. One patient-specific batch cannot be reassigned. State transitions are the product.",
    probes: {
      pathHints: ["domain", "state", "machine", "entities", "models"],
      contentHints: [
        "state machine",
        "transition",
        "chain of identity",
        "enrollment",
        "disposition",
      ],
    },
  },
  {
    id: 10,
    name: "Design the Human–Agent Operating Model",
    phase: "design",
    question:
      "Who prepares, who checks, who decides, and how does a reviewer actually intervene in time?",
    exitCriteria: [
      "Agent roles and human roles are separated with evidence presented to the reviewer.",
      "Reviewer time, authority, and override path are designed, not implied.",
    ],
    expectedArtifacts: [
      "RACI for digital teammates",
      "approval UX",
      "escalation matrix",
    ],
    cgtLens:
      "Agents: ingest, normalize, check completeness, draft packets, propose slot recovery. Humans: eligibility nuance, deviation judgment, QP/QA release, site communication. A reviewer who only clicks ‘approve’ on a wall of text is not a control.",
    probes: {
      pathHints: ["approval", "review", "hitl", "human", "inbox"],
      contentHints: ["human in the loop", "approve", "override", "escalat"],
    },
  },
  {
    id: 11,
    name: "Design Integration Contracts & Tool Permissions",
    phase: "design",
    question:
      "What is the contract at each system boundary, and what power does each tool actually have?",
    exitCriteria: [
      "Adapters are ports with explicit allowlists, idempotency, and timeouts.",
      "Write tools are least-privilege and reversible or compensating.",
    ],
    expectedArtifacts: [
      "OpenAPI / events",
      "adapter ports",
      "permission matrix",
    ],
    cgtLens:
      "Prefer events for state changes (collection completed, slot held, batch in-process, excursion detected) over nightly files. Idempotency keys on slot holds and batch start. Never grant an agent unbounded MES or courier credentials.",
    probes: {
      pathHints: ["openapi", "asyncapi", "proto", "contract", "ports"],
      contentHints: ["idempotency", "timeout", "retry", "allowlist", "webhook"],
    },
  },
  {
    id: 12,
    name: "Design Evaluation, Safety & Audit",
    phase: "design",
    question:
      "How will we know the workflow is right, safe, and reconstructable under inspection?",
    exitCriteria: [
      "Eval cases cover identity mismatch, slot collision, missing QC, and excursion.",
      "Audit design is tamper-evident and time-aligned across systems.",
    ],
    expectedArtifacts: [
      "eval plan",
      "failure taxonomy",
      "audit schema",
    ],
    cgtLens:
      "Inspection readiness is an integration property. A complete patient chain must be queryable, not reconstructed from email. Safety evals must include near-miss identity swaps and stale slot data.",
    probes: {
      pathHints: ["eval", "golden", "audit", "safety", "redteam"],
      contentHints: ["audit trail", "alcoa", "eval case", "failure taxonomy"],
    },
  },
  {
    id: 13,
    name: "Build the Vertical Slice",
    phase: "prove",
    question:
      "Does one end-to-end slice exercise the real boundaries: identity, slot, batch, human release?",
    exitCriteria: [
      "A single patient can be taken from enrollment to a (simulated) released batch.",
      "The slice uses the real domain model, not a demo-only happy path.",
    ],
    expectedArtifacts: [
      "walking skeleton",
      "end-to-end script / demo path",
    ],
    cgtLens:
      "The slice is not a chatbot that explains CGT. It is a case that binds a patient to a collection, holds a slot, opens a batch, attaches QC, and stops at a human disposition gate.",
    probes: {
      pathHints: ["main", "app", "orchestrat", "demo", "e2e"],
      contentHints: ["end-to-end", "vertical slice", "patient to batch"],
    },
  },
  {
    id: 14,
    name: "Orchestrate Tools, Systems & Workflow",
    phase: "prove",
    question:
      "Is there one orchestration spine, or several overlapping conductors fighting over state?",
    exitCriteria: [
      "A single state owner exists for the patient–batch thread.",
      "Child work (QC, courier, slot) is monitored continuously, not fire-and-forget.",
    ],
    expectedArtifacts: [
      "orchestrator",
      "workflow definitions",
      "correlation IDs",
    ],
    cgtLens:
      "Airflow, Celery, LangGraph, custom loops, and cron must not all believe they own the batch. The spine should re-sync child status (manual retry of a QC job should not leave the parent failed forever).",
    probes: {
      pathHints: ["airflow", "temporal", "prefect", "celery", "langgraph", "dag"],
      contentHints: ["orchestrat", "workflow", "correlation", "saga", "state"],
    },
  },
  {
    id: 15,
    name: "Enforce HITL, Identity & Exception Paths",
    phase: "prove",
    question:
      "Can the system refuse an identity mismatch, and can a human recover a real exception without breaking the chain?",
    exitCriteria: [
      "COI checks are deterministic and blocking.",
      "Exception paths (slot slip, excursion, manufacturing failure) have compensating actions.",
    ],
    expectedArtifacts: [
      "COI guard",
      "exception handlers",
      "approval records",
    ],
    cgtLens:
      "A mismatched DIN / COI / lot must stop the process immediately, not alert later. Manufacturing failure on a patient-specific lot restarts from collection, not from a cloned batch ID. Dual control on disposition.",
    probes: {
      pathHints: ["coi", "identity", "custody", "exception", "deviation"],
      contentHints: [
        "chain of identity",
        "chain of custody",
        "isbt",
        "mismatch",
        "deviation",
      ],
    },
  },
  {
    id: 16,
    name: "Instrument Evals, Tests & Observability",
    phase: "prove",
    question:
      "Can we replay a case, see why a decision was made, and catch regressions before a patient lot is touched?",
    exitCriteria: [
      "Unit, contract, and scenario tests exist for identity and disposition.",
      "Traces, structured logs, and eval scores are first-class.",
    ],
    expectedArtifacts: [
      "tests/",
      "eval harness",
      "logging / tracing",
    ],
    cgtLens:
      "Every material action carries patient/batch correlation IDs with PHI minimized. Prompt, model, tool, and policy versions are recorded. An eval suite fails the build on identity-swap cases.",
    probes: {
      pathHints: ["test", "spec", "pytest", "otel", "logging", "eval"],
      contentHints: ["opentelemetry", "structlog", "prometheus", "assert", "unittest"],
    },
  },
  {
    id: 17,
    name: "Run a Bounded Pilot",
    phase: "prove",
    question:
      "Can named users get repeatable value under a documented envelope without unsupervised writes to MES or release?",
    exitCriteria: [
      "Pilot users, dates, included tasks, and stop conditions are written down.",
      "Support ownership and fallback to the as-is process exist.",
    ],
    expectedArtifacts: [
      "pilot protocol",
      "feature flags",
      "feedback channel",
    ],
    cgtLens:
      "Pilot on historical or shadow lots first, then a named set of non-pivotal cases. The envelope excludes autonomous courier booking and autonomous disposition. Measure override rate and packet assembly time.",
    probes: {
      pathHints: ["pilot", "flag", "shadow", "staging"],
      contentHints: ["pilot", "feature flag", "shadow mode", "dry-run"],
    },
  },
  {
    id: 18,
    name: "Harden for Production & Validation",
    phase: "operate",
    question:
      "Can this run in a GxP-relevant environment with identity, secrets, change control, and a validation story?",
    exitCriteria: [
      "Secrets are not in source. AuthN/Z is real. Dependencies are pinned.",
      "CSV/validation strategy exists for GxP-relevant functions (COI, disposition).",
    ],
    expectedArtifacts: [
      "Docker / IaC",
      "secret management",
      "validation / GAMP note",
    ],
    cgtLens:
      "COI functions are high process risk and need scripted tests. AI-drafted packets remain under the regulated company’s responsibility. Change control covers prompts, tools, and ontologies — not only application code.",
    probes: {
      pathHints: ["dockerfile", "k8s", "terraform", "auth", "vault", "validation"],
      contentHints: ["gamp", "21 cfr part 11", "oauth", "rbac", "secret"],
    },
  },
  {
    id: 19,
    name: "Launch, Cut Over & Recover",
    phase: "operate",
    question:
      "Can the exact release be contained, rolled back, and recovered without losing the identity chain?",
    exitCriteria: [
      "Runbook, rollback, and compensating actions have been exercised.",
      "Cutover preserves in-flight lots.",
    ],
    expectedArtifacts: ["runbook", "rollback plan", "release record"],
    cgtLens:
      "You cannot ‘roll back’ a collected bag. Recovery is compensating action: hold slot, notify site, open deviation. Launch must be lot-aware, not just traffic-aware.",
    probes: {
      pathHints: ["runbook", "rollback", "release", "cutover", "playbook"],
      contentHints: ["rollback", "runbook", "cutover", "incident"],
    },
  },
  {
    id: 20,
    name: "Transfer Ownership & Hypercare",
    phase: "operate",
    question:
      "Can a receiving team operate, change, and support this without the original FDE on the critical path?",
    exitCriteria: [
      "Named business and technical owners exist.",
      "Support hours, escalation, and a trained backup are real.",
    ],
    expectedArtifacts: [
      "handoff pack",
      "on-call",
      "training record",
    ],
    cgtLens:
      "Owners are QA, manufacturing planning, and a platform engineer — not ‘the intern who ran the notebook’. Hypercare watches in-flight autologous lots, not just HTTP error rates.",
    probes: {
      pathHints: ["handoff", "oncall", "operations", "support", "training"],
      contentHints: ["owner", "on-call", "hypercare", "raci"],
    },
  },
  {
    id: 21,
    name: "Operate, Productize, Expand or Retire",
    phase: "operate",
    question:
      "Should this service continue, generalize, expand beyond patient-to-batch, or be retired?",
    exitCriteria: [
      "Service review covers value, adoption, safety, cost, and residual risk.",
      "Productization path (reusable adapters, shared COI service) is explicit or declined.",
    ],
    expectedArtifacts: [
      "service review",
      "SLO / cost",
      "retirement criteria",
    ],
    cgtLens:
      "Productize the COI service, slot broker, and packet assembler — not a customer-specific Streamlit. Expansion into infusion and follow-up is a new charter, not a silent scope creep. Retire shadow orchestrators.",
    probes: {
      pathHints: ["slo", "dashboard", "cost", "retire", "roadmap"],
      contentHints: ["slo", "productiz", "retire", "service review"],
    },
  },
];

export function phaseLabel(phase: PhaseId): string {
  return PHASES.find((p) => p.id === phase)?.label ?? phase;
}
