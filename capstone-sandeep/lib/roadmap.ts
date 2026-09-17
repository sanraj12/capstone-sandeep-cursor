import type { RoadmapWave } from "./types";

export const ROADMAP: RoadmapWave[] = [
  {
    id: "W0",
    name: "Freeze & reframe",
    intent:
      "Stop the bleeding. Treat the inherited tree as a contaminated plant floor: freeze writes to identity and disposition, name owners, and re-charter the outcome as patient → released batch.",
    pattern: "Engagement reframe + write-freeze. No new features.",
    stageGates: [1, 5, 6],
    outcomes: [
      "Signed charter: accepted outcome, out-of-scope (infusion/follow-up), stop conditions.",
      "Freeze list: COI, batch disposition, courier booking, MES start — no agent writes.",
      "Risk ceiling: identity mismatch and unsupervised release are never-events.",
      "Inventory of orchestrators, adapters, secrets, and notebooks that can mutate state.",
    ],
  },
  {
    id: "W1",
    name: "Extract the spine (strangler fig)",
    intent:
      "Put a guarded domain model in front of the brownfield. New reads and all writes go through a state machine; old UI and adapters are facades until they die.",
    pattern: "Strangler fig around Patient–Collection–Slot–Batch. Hexagonal ports for LIMS/MES/slot/courier.",
    stageGates: [7, 8, 9, 11, 14],
    outcomes: [
      "Canonical entities and illegal-transition tests.",
      "One writer of batch status (retire the second conductor).",
      "Deterministic COI equality and slot exclusivity — models may not own these steps.",
      "Versioned adapter contracts with idempotency keys on slot hold and batch start.",
    ],
  },
  {
    id: "W2",
    name: "Make identity a control, HITL a job",
    intent:
      "Promote Chain of Identity from a column to a blocking control. Design the QA/planner review job so a human can refuse in time.",
    pattern: "Policy engine + dual-control disposition + evidence packet UI.",
    stageGates: [10, 12, 15],
    outcomes: [
      "Blocking mismatch on DIN / COI / lot at every handoff.",
      "Reviewer packet: identifiers, slot, QC flags, rule that fired, source system, timestamp.",
      "Exception paths: slot slip, temperature excursion, manufacturing failure — compensating actions, not cloned batch IDs.",
      "Eval cases: identity swap, stale slot, missing QC, excursion.",
    ],
  },
  {
    id: "W3",
    name: "Prove, then envelope a pilot",
    intent:
      "Build the harness that makes the system falsifiable. Only then allow named users onto historical or shadow lots.",
    pattern: "Eval harness in CI + shadow mode + feature flags. No plant writes.",
    stageGates: [13, 16, 17],
    outcomes: [
      "One vertical slice: enroll → collect → hold slot → open batch → QC attach → human disposition.",
      "Contract tests on adapters; identity scenario tests fail the build.",
      "Traces with correlation IDs; prompt/model/tool/policy versions recorded.",
      "Pilot protocol: users, dates, included tasks, fallback SOP, support owner.",
    ],
  },
  {
    id: "W4",
    name: "Harden, launch lot-aware, operate",
    intent:
      "Production is an operating commitment, not a deploy. Validate GxP-relevant functions, cut over without abandoning in-flight lots, and transfer ownership.",
    pattern: "GAMP-aligned CSV for COI/disposition; lot-aware cutover; productize COI/slot/packet, retire snowflakes.",
    stageGates: [18, 19, 20, 21],
    outcomes: [
      "Secrets out of git; real authN/Z; pinned dependencies; change control for prompts and ontologies.",
      "Runbooks that compensate (hold slot, notify site, open deviation) rather than ‘restart the pod’.",
      "Named QA, planning, and platform owners; hypercare on in-flight autologous lots.",
      "Productize COI service, slot broker, packet assembler. Expansion to infusion requires a new charter.",
    ],
  },
];

export const GOVERNANCE = [
  {
    title: "Stage-gates are real, not ceremonial",
    body: "No build work without a charter (Stage 6). No plant integration without evals and blocking COI (Stages 12, 15, 16). No ‘pilot’ that is actually unbounded production (Stage 17). A skipped gate is how this estate degraded the first time.",
  },
  {
    title: "Change control includes prompts, tools, and ontologies",
    body: "A model swap, retrieval change, or policy edit can invalidate prior evidence. Treat those as system changes with regression evals. Code-only CAB is insufficient.",
  },
  {
    title: "Separation of duties on disposition",
    body: "The digital teammate may draft. QA/QP disposes. The same engineer must not be the only person who can both change the COI rule and approve the lot.",
  },
  {
    title: "One spine, many adapters",
    body: "New workflow engines are guilty until proven otherwise. A second writer to batch status is an incident, not a feature. Architecture review asks: who owns the thread?",
  },
  {
    title: "PHI minimization and inspection readiness",
    body: "Logs carry correlation IDs, not full clinical payloads. A complete patient chain must be a query. If reconstruction takes an afternoon of email, the operate stage has already failed.",
  },
  {
    title: "Productization tax",
    body: "Every engagement ends with an explicit keep / generalize / retire decision. Customer-specific Streamlit and notebooks are not assets unless they die on a date.",
  },
];
