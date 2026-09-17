export type Mechanism =
  | "Rules / software"
  | "Classical ML"
  | "RAG"
  | "GenAI"
  | "Agentic AI"
  | "Human";

export type AiVerdict = "Forbidden as AI" | "Not required" | "Optional value" | "Use after spine exists";

export type MechanismRow = {
  step: string;
  owner: string;
  mechanism: Mechanism;
  verdict: AiVerdict;
  purpose: string;
  whyNotAi?: string;
  humanGate: string;
};

export const MECHANISM_VERDICT = {
  headline: "No. The patient-to-batch spine does not need AI to be valid, safe, or inspectable.",
  body: "The original problem is coordination and identity, not prediction or language. Chain of Identity, slot exclusivity, spec-limit checks, illegal-transition refusal, and batch disposition are deterministic controls. Putting an LLM or agent in that spine makes the system unvalidatable. AI is justified only where the work is translation, drafting, retrieval, or ranking — and only after a software spine already refuses never-events.",
};

export const MECHANISM_GUIDE: {
  kind: Mechanism;
  useWhen: string;
  notFor: string;
}[] = [
  {
    kind: "Rules / software",
    useWhen:
      "The accepted outcome is true or false, the inputs are structured, and a regulator will ask who decided. Identity, calendar exclusivity, numeric limits, state machines, idempotent holds, audit writes.",
    notFor: "Narrative deviation write-ups, SOP Q&A, multi-system status prose.",
  },
  {
    kind: "Classical ML",
    useWhen:
      "You have labeled historical lots and a ranking problem: risk of slot slip, out-of-spec, courier delay. Output is a score that a planner uses, never a write to MES.",
    notFor: "COI matching, release, or any action that must be reconstructable as a rule.",
  },
  {
    kind: "RAG",
    useWhen:
      "An operator needs the right SOP, spec, prior deviation, or lot packet for this patient now. Retrieval with citations beats a chatbot that ‘knows CGT’.",
    notFor: "Inventing missing QC results or reconstructing COI from prose.",
  },
  {
    kind: "GenAI",
    useWhen:
      "The job is a first draft: QA packet narrative, deviation description, site notification, ‘why this lot is on hold’ in operator language. Ground it in RAG + structured events.",
    notFor: "Deciding disposition, mutating identifiers, sending unattended messages to sites or couriers.",
  },
  {
    kind: "Agentic AI",
    useWhen:
      "A bounded gather-check-draft-route loop across several read-only tools, with a human on every write. Example: assemble the blocker packet for a slipped slot.",
    notFor: "The orchestrator itself. Agents must not own batch status, slot holds, or MES start.",
  },
  {
    kind: "Human",
    useWhen:
      "Eligibility nuance, deviation judgment, QP/QA release, site communication, any irreversible action on a living starting material.",
    notFor: "Re-keying identifiers that software can match, or rebuilding the chain from email.",
  },
];

export const MECHANISM_ROWS: MechanismRow[] = [
  {
    step: "COI / COC match at every handoff (DIN, COI ID, lot, patient)",
    owner: "Identity control",
    mechanism: "Rules / software",
    verdict: "Forbidden as AI",
    purpose: "Refuse mismatch immediately. Dual identifiers. Illegal transition = stop, not ‘alert later’.",
    whyNotAi: "A probabilistic match on autologous identity is a patient-safety event, not a model quality issue.",
    humanGate: "QA investigates a refused handoff; the model does not ‘override similarity’.",
  },
  {
    step: "Manufacturing slot exclusivity and conflict",
    owner: "Slot broker",
    mechanism: "Rules / software",
    verdict: "Forbidden as AI",
    purpose: "One patient-specific bag owns one plant slot. Idempotent hold/release.",
    whyNotAi: "Calendar arithmetic and locks are software. An agent that ‘finds a slot’ must propose, not book.",
    humanGate: "Planner accepts a recovery proposal; software books the hold.",
  },
  {
    step: "Spec-limit / QC numeric gates",
    owner: "Quality rules",
    mechanism: "Rules / software",
    verdict: "Forbidden as AI",
    purpose: "Compare results to the versioned spec. Fail closed if a result is missing.",
    whyNotAi: "Limits are controlled documents. An LLM restating a spec is not the spec.",
    humanGate: "QA disposition when a gate fails; no silent pass.",
  },
  {
    step: "Patient–collection–slot–batch state machine",
    owner: "Orchestration spine",
    mechanism: "Rules / software",
    verdict: "Forbidden as AI",
    purpose: "Single writer of thread state. Compensating actions on failure (hold slot, open deviation).",
    whyNotAi: "LangGraph as the system of record cannot be CSV’d. The spine is software; agents are tools on the side.",
    humanGate: "Exception authority for compensating actions that affect the patient calendar.",
  },
  {
    step: "Batch disposition / QP release",
    owner: "QA / QP",
    mechanism: "Human",
    verdict: "Forbidden as AI",
    purpose: "Release or reject with a complete packet. Dual control.",
    whyNotAi: "GxP responsibility stays with the qualified person. A model may not dispose a lot.",
    humanGate: "The disposition click is the gate. AI never holds this button.",
  },
  {
    step: "MES start, courier booking, COI mutation",
    owner: "Plant / logistics writes",
    mechanism: "Rules / software",
    verdict: "Forbidden as AI",
    purpose: "Least-privilege, idempotent, reversible or compensating writes from the spine — not from an agent credential.",
    whyNotAi: "Unbounded tool-use against MES or TMS is how a demo becomes a recall.",
    humanGate: "Named role for any write class that cannot be compensated.",
  },
  {
    step: "QA / QP packet assembly (first draft)",
    owner: "Quality ops",
    mechanism: "RAG",
    verdict: "Optional value",
    purpose:
      "Retrieve the lot’s events, QC, COI chain, deviations, and spec; draft a packet with citations. Cuts hours of copy-paste. Does not decide release.",
    humanGate: "QA/QP reads, corrects, signs. Eval on citation faithfulness and missing-section rate.",
  },
  {
    step: "‘Why is this lot blocked?’ operator brief",
    owner: "Case manager / planner",
    mechanism: "GenAI",
    verdict: "Optional value",
    purpose:
      "Turn structured blockers (missing QC, slot conflict, excursion, identity hold) into a short brief with source system and timestamp. Ground in events, not model memory.",
    humanGate: "Operator acts on the brief; software still owns the hold.",
  },
  {
    step: "SOP / spec / playbook lookup at the point of work",
    owner: "MSAT / QA",
    mechanism: "RAG",
    verdict: "Optional value",
    purpose: "Retrieve the controlled, version-pinned SOP for this product and process step. Citations required.",
    humanGate: "The SOP remains the authority. Chat is not a controlled document.",
  },
  {
    step: "Deviation / excursion narrative draft",
    owner: "QA",
    mechanism: "GenAI",
    verdict: "Optional value",
    purpose: "Draft ALCOA-style narrative from time-aligned events (what, when, which identifier, which limit). Human files the deviation.",
    humanGate: "QA owns wording and classification. Model cannot open or close a QMS record unsupervised.",
  },
  {
    step: "Slot-slip and courier-delay risk score",
    owner: "Manufacturing planner",
    mechanism: "Classical ML",
    verdict: "Optional value",
    purpose:
      "Rank in-flight collections by probability the plant slot will be missed. Planner pulls the next recovery option earlier.",
    humanGate: "Score is advisory. Booking remains rules + planner.",
  },
  {
    step: "In-process anomaly / out-of-trend flag",
    owner: "MSAT",
    mechanism: "Classical ML",
    verdict: "Optional value",
    purpose: "Flag unusual trajectories vs historical lots of the same process version. Escalate to human; do not auto-abort.",
    humanGate: "MSAT/QA decide hold vs continue. Spec limits still fire as hard rules beside the model.",
  },
  {
    step: "Slot recovery option set",
    owner: "Planner",
    mechanism: "Agentic AI",
    verdict: "Use after spine exists",
    purpose:
      "Read-only gather of calendars, courier ETAs, and constraints; propose 2–3 recovery options with impact on vein-to-vein time. Software executes the chosen hold.",
    humanGate: "Planner selects. Agent has no TMS/MES write tools.",
  },
  {
    step: "Exception triage across systems (read-only)",
    owner: "Case manager",
    mechanism: "Agentic AI",
    verdict: "Use after spine exists",
    purpose:
      "Ingestor → checker → drafter → router: pull EHR/LIMS/MES/courier fragments, detect missing fields, draft a blocker packet, route to the right human. No autonomous external email.",
    humanGate: "Every route that leaves the org or changes a lot is approved.",
  },
];

export const FIRST_AI_SLICES = [
  {
    id: "A1",
    title: "Grounded packet drafter (RAG + GenAI)",
    why: "Highest value with lowest blast radius. QA already spends the hours. The verifier is the signed packet, not the model.",
    envelope:
      "Historical or shadow lots. Read-only adapters. No QMS write. Citation eval must pass before any pilot user.",
  },
  {
    id: "A2",
    title: "Blocker brief for case managers (GenAI on structured events)",
    why: "Decision latency, not creativity. If the brief disagrees with the state machine, the state machine wins.",
    envelope: "Display-only. Cannot clear a COI hold or release a slot.",
  },
  {
    id: "A3",
    title: "Slot-slip ranker (classical ML)",
    why: "Only if you have enough historical collections with labeled outcomes. Otherwise skip — a simple rule on courier ETA is smaller.",
    envelope: "Advisory score next to the planner board. No auto-reschedule.",
  },
];
