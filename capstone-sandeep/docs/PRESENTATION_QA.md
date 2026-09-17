# Cohort-2 Final Presentation Q&A

**Capstone:** Cell & Gene Therapy — Patient-to-Batch Orchestration  
**Role:** Forward Deployed Engineer  
**Grounding:** this assessment workbench (`lib/`, `docs/adr/`, `docs/ASSESSMENT.md`)  
**Not used as evidence:** the original zip CSVs (`patients.csv`, `events.jsonl`, `baseline_kpis.csv`, `status_rules.py`). Those files are not in this repository. Do not recite invented patient IDs or KPI numbers in Q&A.

Interactive copy: workbench section **9 Q&A**. Source of truth for answers: `lib/presentation-qa.ts`.

---

## Evidence rule

The prep worksheet assumed a delivered orchestration repo with a worked patient trace (P-00001), duplicate MRNs, and a ten-metric KPI table. **This codebase is the FDE assessment of that estate, not the estate itself.** Until the zip is bound on the banner:

- Maturity index stays **28/100** (inferred).
- Stages 5, 15, and 18 default to **Critical Failure**.
- Answers cite ADRs, the 21-stage map, mechanism rows, and the Azure landing zone.
- Charter remains **Patient-to-Batch**, not infusion.

---

## C. Five lines to have cold

### C1. In one sentence, what customer problem does your capstone solve?

It gives CGT operations one trustworthy, evidence-backed answer to what is actually true about a patient’s product right now — identity, slot, batch, and QC — instead of hiding contradictions across MES, LIMS, QMS, and email.

Cite: `docs/ASSESSMENT.md` §1.

### C2. What is the single most important decision your system supports?

Whether this patient-specific batch is actually QA-released and safe to send — manufacturing-complete is not release.

Cite: `lib/mechanism.ts` Batch disposition Human; ADR-0001.

### C3. What is the most dangerous failure mode?

Silent patient/material identity mis-linkage — the wrong evidence on the wrong lot — because it can become clinically irreversible before anyone notices.

Cite: `lib/fde-stages.ts` Stage 15; `docs/ASSESSMENT.md` §3.

### C4. Where is the human approval/override boundary?

The system may observe, correlate, and draft. A named human must authorize QA release, COI correction, consent-gated steps, and clinically impactful logistics — every time, on the audit trail. Azure OpenAI has no write path.

Cite: ADR-0001; ADR-0002.

### C5. What evidence proves that the system is ready for the next stage?

Blocking COI tests in CI, MES/QMS conflicts no longer mapping to “ready”, A1 citation evals green with zero identity inventions, sidecar write-deny proven, and a signed Stage 6 charter. This assessment repo is ready for that build; it is not itself production.

Cite: `lib/roadmap.ts` W0–W3; `lib/ai-implementation.ts` BUILD_STEPS 6–10.

---

## A. Cohort-specific challenge

### A1. Can you trace one patient from eligibility through collection, manufacturing, QC/release, logistics, and infusion?

The charter of this estate is Patient to Batch, not full vein-to-vein. The designed trace is enrollment → collection (DIN/COI) → exclusive manufacturing slot → batch/QC attach → human disposition. Infusion is explicitly out of scope until a new charter (Stage 6 / Wave W4). The walking skeleton is Stage 13: one patient through a simulated released batch with identity, slot conflict, and a disposition gate. This workbench does not host a live `/journey` API because the source zip was not bound; the Azure target assembles that timeline as a Lot Context Pack from PostgreSQL (ADR-0003), not as a manual join across seven tables.

Cite: `lib/fde-stages.ts` Stages 6, 13, 15; `docs/ASSESSMENT.md` §1; ADR-0003 Lot Context Pack.

### A2. What prevents material, patient, and batch identifiers from being incorrectly associated?

In the inherited brownfield, almost nothing — COI is treated as a field, which is why Stage 15 defaults to Critical Failure until blocking checks exist. The target control is deterministic: dual identifiers (DIN / COI ID / lot / patient) compared by rule, illegal transitions refused, mismatch stops the handoff immediately. AI must not score or “fix” identity. Low-confidence or conflicting identifiers open a human COI exception; corrections are new audit events, never silent merges.

Cite: `lib/seed-assessment.ts` Stage 15 Critical Failure; `lib/mechanism.ts` COI row — Forbidden as AI; ADR-0001.

### A3. What happens if one system reports a different patient/batch status from another system?

Today: nothing blocks. Dual spines and status-as-string let MES “complete” look like QA-released. Target: PostgreSQL is the only writer of lot status (ADR-0001). MES/QMS/scheduler disagreements are first-class conflicts on the reconciliation surface — both values, both sources, timestamps. QA-release is its own gated state that only a QMS/QP signal plus human dual-control can satisfy. The A2 blocker brief may narrate the conflict; it cannot clear it.

Cite: ADR-0001; `lib/mechanism.ts` state machine + A2 brief; `lib/fde-stages.ts` Stage 14.

### A4. Which steps require chain-of-identity and chain-of-custody evidence?

Every physical handoff of the patient’s material: collection and COI labeling, outbound courier, manufacturing intake, in-process handling, QC sampling, labeled release, return shipment. This charter stops at released batch; treatment-center receipt and infusion inherit the same COI obligation but are out of the first slice. Named never-events: identity mismatch and unsupervised release.

Cite: `lib/fde-stages.ts` Stage 15 CGT lens; `lib/mechanism.ts` Forbidden as AI; `docs/ASSESSMENT.md` §3.

### A5. What happens if manufacturing, QC, logistics, or infusion timelines slip?

Today: no proactive slip path in this workbench (Stage 19 Missing — you cannot roll back a collected bag). Target: compensating actions on the spine — hold slot, notify site, open deviation — not cloned batch IDs. Optional A3 classical ML ranks slot-slip risk only with labeled history; otherwise a courier-ETA vs slot-start rule is smaller. Agentic AI may propose 2–3 recovery options; the planner selects; software books the hold.

Cite: `lib/fde-stages.ts` Stage 19; `lib/mechanism.ts` slot recovery + A3; `lib/roadmap.ts` Wave W2.

### A6. Which decisions can be recommended by AI, and which must require regulated human approval?

AI may draft QA packets (A1 RAG+GenAI), write blocker briefs (A2), retrieve SOPs, draft deviation narratives, rank exceptions, and propose slot recoveries. Humans must authorize: QA/QP release, COI/COC correction, consent-gated progression, MES start, courier booking, and any clinically impactful slot change. Observe / correlate / recommend — never dispose a lot.

Cite: `lib/mechanism.ts` MECHANISM_ROWS + FIRST_AI_SLICES; ADR-0001; `lib/ai-implementation.ts` BUILD_STEPS 4 and 7.

---

## B. FDE direction check

### 1. Problem & customer

**What exact real-world problem are you solving?**  
A CGT operation cannot trust a single answer to “where is this patient’s product and is it safe to proceed?” because identity, slot, batch, and QC live in 6–10 systems that do not share a thread. The problem is make-to-order coordination and inspection-ready identity — not a chatbot.

Cite: `docs/ASSESSMENT.md` §1; `lib/seed-assessment.ts` coreProblem.

**Who is the primary user, and what decision or action are you helping them make?**  
Case managers and slot planners: what needs attention, in what order. QA/QP: whether this lot is actually releasable, with a complete packet. The system accelerates triage and packet assembly; it never clicks release.

Cite: `lib/seed-assessment.ts` users; `components/section-overview.tsx`.

**What is the current process without your solution, and where does it break down?**  
A person is the integration layer — email, spreadsheets, and conflicting MES/QMS strings. It breaks at every handoff: identity as a field, dual orchestrators, no evals, no compensating-action runbook. This repo’s unbound assessment scores that estate 28/100 and forbids plant connection.

Cite: `lib/seed-assessment.ts` overallScore 28; `docs/ASSESSMENT.md` §3.

**What is the cost or consequence of getting this problem wrong?**  
Wrong-patient product (irreversible). Lost living starting material and a wasted exclusive slot. Inspection reconstruction from email. Operational drag from shadow workarounds. Those are never-events and standing cost, not UX polish.

Cite: `lib/fde-stages.ts` Stage 5 risk ceiling; `lib/mechanism.ts` never-events.

### 2. End-to-end workflow

**Walk through one realistic scenario end to end.**  
Input: a lot approaching disposition with a temperature WARN and a missing purity assay. Spine loads the Lot Context Pack from PostgreSQL (identifiers, holds, events). A1 retrieves the effective SOP version from Azure AI Search (not a superseded spec). gpt-4.1 drafts a packet that cites `chunk_id`/`event_id` or says MISSING — it must not recommend release. QA sees pack, draft, and citations side-by-side and either files a deviation or proceeds to dual-control disposition on the spine. Six months later the audit row still has prompt, index, and model deployment names (ADR-0003).

Cite: `lib/architecture.ts` SEQUENCE_DIAGRAM; `lib/ai-implementation.ts` BUILD_STEPS; ADR-0003.

**What systems or data sources must participate in this workflow?**  
CRM/clinical (identity, consent), scheduler + MES (slot/batch), LIMS (QC), QMS (deviations, release), courier/TMS + telemetry, Blob SOP/spec library. Writes only through the spine adapters. Shadow email is a source to retire, not a system of record.

Cite: `lib/architecture.ts` CONTEXT_DIAGRAM; `lib/fde-stages.ts` Stage 3.

**Which steps must happen in real time, and which can be asynchronous?**  
Real-time / near-real-time: COI match at handoff, telemetry excursion that gates an imminent lot, consent check before an irreversible step, APIM deny of sidecar writes. Asynchronous: SOP reindex, KPI recompute, A3 slip ranking, packet draft for a lot not yet in the release window. Delay that could let an unsafe action proceed is real-time; everything else can wait.

Cite: ADR-0002 APIM policies; `lib/fde-stages.ts` Stage 15.

**What would success look like for the user at the end of the workflow?**  
QA makes a disposition from one evidence packet in minutes, not a multi-system hunt. The planner sees a hold with compensating actions, not an email override. An investigator reconstructs why from PostgreSQL + audit, not from a mailbox.

Cite: `lib/ai-implementation.ts` HITL UI; `lib/roadmap.ts` W2–W3.

### 3. Why AI / agentic?

**Why does this problem require AI or an agent? What could be solved with deterministic rules, SQL, or conventional software?**  
It does not require AI to be valid. COI, slot locks, spec limits, state machine, and QP release are software or human. AI earns a place only for translation: packet drafts, SOP retrieval, blocker briefs, optional slip ranking. Building those as “the orchestrator” would make them unvalidatable.

Cite: `lib/mechanism.ts` MECHANISM_VERDICT; `docs/ASSESSMENT.md` §6.

**Which parts of your system are deterministic, and which parts use AI/ML/LLMs?**  
Deterministic: COI guard, slot broker, spec gates, PostgreSQL state machine, Service Bus notify-only, APIM write-deny for the sidecar. LLM: A1 packet (RAG + gpt-4.1), A2 brief, SOP lookup. ML: A3 only with labels. Agentic: later read-only gather/propose, no write tools.

Cite: `lib/mechanism.ts` MECHANISM_ROWS; `lib/architecture.ts` AZURE_STACK.

**What should your AI/agent NOT be allowed to do?**  
Change consent, dispose QC/QA, release or hold a batch, mutate COI/COC, book a slot, start MES, send unattended site/courier messages, merge conflicting identities, or treat ingested free text as an instruction (e.g. “mark released”). Never embed the living lot in the vector index.

Cite: ADR-0001; `lib/ai-implementation.ts` VECTOR_VERDICT.

**What level of autonomy is appropriate, and why?**  
Bounded autonomy: observe, correlate, recommend. Consequential actions require a named human because autologous errors are irreversible and GxP responsibility stays with QA/QP. Value is reducing search burden, not removing the qualified person.

Cite: `lib/fde-stages.ts` Stage 10; ADR-0001.

### 4. Data & evidence

**What data is required to make one important decision? (example: QA release)**  
Non-conflicting identity + COI/COC trail, complete QC vs the versioned spec, open deviations, MES/QMS states as separate fields, shipment/telemetry history, Lot Context Pack snapshot, effective SOP version, and the human dual-control record. The model may draft; it is not an input that satisfies a gate.

Cite: `lib/ai-implementation.ts` KB_PLANES; `lib/mechanism.ts` spec-limit + disposition rows.

**Where does that data come from, and how fresh must it be?**  
LIMS, QMS, MES, courier/telemetry, Blob SOP library — via spine adapters. Release decisions use occurred-at vs recorded-at and fail closed if a required assay is missing or stale versus the source cadence. Search is filtered to the spec version that applied to that lot.

Cite: ADR-0003; `lib/ai-implementation.ts` K2 pin versions.

**What happens when data is missing, stale, contradictory, or corrupted?**  
Surface an open exception. Never default to ready. A1 must say MISSING rather than invent QC. Conflicts show both sources. Eval traps (wrong spec version, identity-swap) fail the build. Sidecar recommendations inherit a visible caveat in degraded mode.

Cite: `lib/ai-implementation.ts` BUILD_STEPS 4 and 6; `lib/fde-stages.ts` Stage 12.

**What evidence should be captured so a decision can be explained later?**  
Input snapshot (records, sources, timestamps), SOP/rule version, model and embedding deployment names, index checksum, recommendation + citations, human identity/role, override rationale, resulting state transition — one case ID. Prompt+index+model on every draft audit row.

Cite: ADR-0003 follow-up; `lib/architecture.ts` AZURE_STACK observability.

### 5. Failure modes & resilience

**What are the five most dangerous ways your system could fail?**

1. Silent identity mis-linkage.
2. False ready (manufacturing-complete treated as QA-released).
3. Action on withdrawn/stale consent.
4. Outage with an unsafe default (auto-release or silent pass).
5. Adversarial free text treated as a command.

Dual-spine status divergence is the brownfield version of (2).

Cite: `docs/ASSESSMENT.md` §3; `lib/seed-assessment.ts` Critical Failure stages 5, 15, 18.

**For each failure, how will you detect it, prevent it, and recover?**  
Identity: blocking dual-ID rules; continuous conflict scan; append-only correction events. False-ready: gated QA state; MES/QMS conflict alert; block downstream until QP. Consent: live check on consequential actions; hold + clinical notify. Outage: last-known evidence labeled stale; no auto-release; idempotent replay on Service Bus. Adversarial: AI never executes; provenance-tag untrusted text; eval “mark released” traps.

Cite: `lib/roadmap.ts` W1–W2; ADR-0001.

**What happens when the AI gives a wrong recommendation?**  
Nothing executes. QA rejects or edits; override + rationale land on the audit row; override spikes are a model/policy review signal. Blast radius is extra review minutes, not a released lot.

Cite: `lib/ai-implementation.ts` BUILD_STEPS 7–8; ADR-0001.

**What happens if a critical service, data source, network, or downstream system becomes unavailable?**  
Degrade to last-known, timestamped, labeled stale. Sidecar drafts are flagged degraded-mode. Disposition still requires QP when QMS returns. Container Apps + APIM + private endpoints; compensations hold slot / open deviation rather than restart-the-pod (Stage 19).

Cite: ADR-0002; `lib/fde-stages.ts` Stage 19.

### 6. Human-in-the-loop

**Where exactly does a human enter the workflow?**  
QA/QP disposition, COI correction, consent-gated steps, clinically impactful slot/logistics changes, and any action sourced from untrusted text. Upstream, the sidecar only assembles evidence.

Cite: `lib/fde-stages.ts` Stage 10; `lib/mechanism.ts` Human rows.

**What information/evidence does the human see before approving or rejecting an AI recommendation?**  
Lot Context Pack, cited SOP chunks with version, holds/conflicts, recommendation with `chunk_id`/`event_id`, and prior decisions on that lot. Never a bare Approve button.

Cite: `lib/architecture.ts` SEQUENCE_DIAGRAM; `lib/ai-implementation.ts` HITL.

**Can the human override the system? If yes, how is the override recorded?**  
Yes. The human is the authority. Overrides append original recommendation, decision, identity/role, timestamp, rationale — part of the case, not a side channel.

Cite: ADR-0001; `lib/fde-stages.ts` Stage 10 exit criteria.

**What decisions must always require human authorization?**  
QA/QC disposition, COI/COC correction, withdrawn/ambiguous consent actions, consequential manufacturing/logistics changes, and any degraded-mode decision that would have required a system-of-record gate.

Cite: `lib/mechanism.ts` Forbidden as AI; `docs/ASSESSMENT.md` §6.

### 7. Auditability & traceability

**If an investigator asks six months later, “Why did the system make this decision?”, can you reconstruct the answer?**  
Target: yes — PostgreSQL case history + Blob checksums + Search index version + Azure OpenAI deployment names + Entra identity. Today in this workbench: we specified that audit; we did not implement a live ledger (Stage 12/16 Missing until the spine is built). Reconstruction is an ADR requirement, not a log grep.

Cite: ADR-0003; `lib/fde-stages.ts` Stages 12 and 16.

**Can you identify the data, model/version, rules, prompts, tools, approvals, and actions involved?**  
Yes in the target design: pack snapshot, SOP version, embedding+chat deployments, prompt hash, APIM/app revision, approver, resulting transition — linked by case ID. Changing embeddings is a reindex + system change.

Cite: `lib/ai-implementation.ts` BUILD_STEPS 5 and 10; `lib/architecture.ts` AZURE_STACK.

**What is the difference between simply logging an event and creating an evidence-rich case history?**  
A log says something happened. A case history says why, on which evidence, against which conflict, under which SOP version, and who is accountable. Service Bus notifies; PostgreSQL holds the case.

Cite: ADR-0003; `lib/fde-stages.ts` Stage 12 CGT lens.

**How would you prove the case history is complete and has not silently lost evidence?**  
Append-only events, no in-place delete of raw records, checksum on SOP blobs and index, periodic join that every case still points at source rows. Corrections are new attributed events.

Cite: `lib/ai-implementation.ts` K2 checksum; ADR-0003.

### 8. Evaluation & business outcome

**What is your baseline or current process against which you will compare your solution?**  
FDE stage scores in this workbench (28/100 unbound) plus operational KPIs once the zip is bound or production data exists: vein-to-vein time, identity-mismatch rate, discarded lots, QA packet time, inspection reconstruction time, override rate on A1 drafts. Do not invent CSV KPI numbers this repo does not contain.

Cite: `lib/seed-assessment.ts` scoreFromStages; `lib/fde-stages.ts` Stage 4.

**What metrics prove that the system is working?**  
Movement on those KPIs; identity-swap and missing-QC evals staying red-to-green in CI; MES/QMS conflict count shrinking; A1 citation faithfulness; sidecar never obtaining write tokens (APIM deny). Shadow workarounds shrinking is the trust proxy.

Cite: `lib/ai-implementation.ts` BUILD_STEPS 6; `lib/fde-stages.ts` Stage 16.

**Which errors matter most, and why?**  
False negatives on identity, withdrawn consent, and COC breaks — silent pass is worse than extra review. Latency matters when it gates an imminent irreversible step. Missed ingestion silently poisons every downstream signal.

Cite: `lib/fde-stages.ts` Stage 5; `lib/mechanism.ts` never-events.

**What result would convince you the system is NOT working?**  
Stage 15 still not blocking; A1 inventing QC in eval; APIM allowing sidecar writes; conflict counts not falling; operators still living in email. KPI theater without identity evals is a fail.

Cite: `lib/seed-assessment.ts` Critical Failure default; ADR-0001.

### 9. Production readiness

**If this went into production tomorrow, what are the five biggest gaps remaining?**

1. Source brownfield zip not bound — no live journey data in this repo.
2. No implemented state machine/API yet — architecture and ADRs only.
3. No Entra/APIM/audit running.
4. No eval harness in CI.
5. No on-call / compensating-action runbooks exercised.

This workbench is the charter and landing-zone design, not the plant system.

Cite: `README.md`; `lib/fde-stages.ts` Stages 16–20 Missing; `components/archive-binder.tsx`.

**How will you monitor system health, data quality, AI behavior, and business outcomes?**  
Azure Monitor / App Insights heartbeats per adapter. Conflict counts as data-quality alerts. A1 override rate and citation fail rate for AI. Stage-gated KPI cadence. Correlation IDs `lot_id`/`coi_id`, PHI minimized.

Cite: `lib/architecture.ts` AZURE_STACK observability; ADR-0002.

**What alert would require someone to act immediately?**  
New COI conflict at or past an irreversible step; MES/QMS release disagreement inside the return-logistics window; any attempt to act on withdrawn consent; sidecar presenting a write token.

Cite: `lib/fde-stages.ts` Stage 5; ADR-0002 APIM deny.

**Who operates and troubleshoots the system when it fails outside business hours?**  
Clinical-risk alerts (COI, consent, release conflict) → customer Quality/clinical on-call. Availability (adapter down, ACA revision) → platform on-call. Named owners are a Stage 20 exit criterion; they are not implied by this repo.

Cite: `lib/fde-stages.ts` Stage 20; `lib/roadmap.ts` W4.

### 10. FDE judgment

**What assumption in your current design is most likely to be wrong?**  
That the unbound brownfield looks like a typical capstone (dual spine, COI-as-field). Binding the zip may show a better COI guard — or a worse multi-orchestrator mess. Second: that Azure OpenAI will be allowed for lot-context packs; Legal may force Llama-in-VNet and ADR-0003 gets revisited.

Cite: `components/archive-binder.tsx`; ADR-0003 follow-up.

**What would you investigate first if you had production access for 24 hours?**  
Real identity-mismatch and MES/QMS conflict rates, and whether anyone other than email owns compensating actions on slipped slots. The architecture stands or falls on those two facts.

Cite: `lib/fde-stages.ts` Stages 4 and 15; `docs/ASSESSMENT.md` §5 W0 freeze.

**What would you change if the customer said the system is technically correct but operationally unusable?**  
Treat it as HITL fit: packet order, queue in the tools they already use, time-to-decide. Do not add more models. Stage 10 says a reviewer who only clicks Approve is not a control.

Cite: `lib/fde-stages.ts` Stage 10; `lib/seed-assessment.ts` HITL is a button.

**What is the smallest production-ready version you could deploy to prove value safely?**  
Read-only Operational Truth: identity conflicts + canonical states + MES/QMS surface, zero writes, one product line. Then A1 packet drafter in shadow. That is W0–W3 without plant writes — safe because it cannot act.

Cite: `lib/roadmap.ts` W0–W3; `lib/mechanism.ts` FIRST_AI_SLICES A1.

---

## How to use this in the room

1. Open with C1–C5. Do not open with a model name.
2. If asked for a patient trace, say the charter is Patient-to-Batch and the walking skeleton is Stage 13 — do not invent P-00001.
3. If asked “why AI?”, answer Stage 8: the spine is rules; A1/A2 are translation.
4. If asked “is this production?”, answer B9a: five gaps, workbench not plant.
5. Bind the zip before claiming CSV evidence.
