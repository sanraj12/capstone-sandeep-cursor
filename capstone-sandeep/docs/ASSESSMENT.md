# Architectural Assessment: CGT Patient-to-Batch Orchestration

**Estate:** `AI_FDE_CGT_Patient_to_Batch_Orchestration` (EY Batch 2 capstone, inherited brownfield)  
**Rubric:** 21-stage AI FDE operating model  
**Evidence mode:** Inferred until the source zip is bound in the workbench. Critical identity and GxP stages default to *Critical Failure*.

---

## 1. Executive Summary & Original Problem Statement

### Core problem statement

Autologous cell and gene therapy is make-to-order: **one patient is one batch**. The original business and technical problem this estate was built to solve is not “add AI to manufacturing.” It is to keep a **single identity thread** intact from the enrolled patient through collection and a manufacturing slot until a batch is QC’d and **human-released** — so the right product is made for the right patient in a calendar that cannot slip without destroying living starting material.

Traditional ERP / MES / LIMS stacks assume make-to-stock lots. They do not natively:

- refuse a mismatched Chain of Identity (COI) at a handoff,
- hold an exclusive manufacturing slot across site and plant when a courier is late,
- or assemble an inspection-ready chain when six to ten systems each hold a fragment of the same patient.

That coordination gap is the job. Everything else (chat UIs, generic copilots, extra notebooks) is sprawl around it.

### Target audience / users

This is an **operations spine**, not a patient-facing app.

| User | Job to be done |
| --- | --- |
| Case manager / patient operations | Enroll, keep the calendar honest, surface blockers before a collection day is wasted |
| Manufacturing planner / slot owner | Hold, sequence, and recover plant slots when collection or courier reality changes |
| Manufacturing / MSAT | Start the patient-specific batch with the correct starting material and process version |
| QA / QP | Release or reject with a complete COI/COC and QC packet — never from a model summary |
| Logistics coordinator | Move collected material and finished product inside time and temperature windows |
| Forward deployed engineer / platform | Keep the orchestration spine truthful, observable, and change-controlled |

### Initial scope vs current state

**Initial intent (encoded in the artifact name):** *Patient to Batch* — the high-value, high-risk spine of identity, slot, lot, and disposition. Not infusion, not long-term follow-up, not a commercial CGT platform.

**Current brownfield (working hypothesis until bind):** the estate has sprawled the way FDE capstones sprawl: extra UIs, notebooks, duplicate conductors, mock adapters that leaked into “the real path,” and an AI/agent layer bolted onto a workflow that still lacks a guarded domain model. The name is still the best charter you have. Protect that fence; do not expand it.

---

## 2. What is Working Well (System Strengths)

### Stable core / outcome boundary

The problem is operationally real. The accepted outcome is unambiguous: a living starting material becomes a released, identity-bound lot. That is stronger product sense than a generic “CGT copilot.”

### Successful patterns

- **Implied scope fence.** Stopping at batch is the correct first vertical slice. Programs that try to digitize the entire vein-to-vein network on day one drown.
- **Orchestration-shaped, not MES-shaped.** A spine plus adapters is the right substrate for a strangler fig. You can freeze writes to COI, extract a state machine, and replace one adapter at a time.
- **A 21-stage rubric exists.** Stage-gates beat vibes. Use them as refusal criteria for future work.

### Business value already implied

If any walking path exists that binds a patient to a collection, a slot, and a batch record, that path is the value. Keep it. Do not rewrite it into a platform. Instrument it, guard its transitions, and make identity a control.

---

## 3. Existing Problems & Technical Debt

### Architectural flaws

1. **Identity is probably a field, not a control.** `patient_id`, DIN, lot, and `coi_id` copied across JSON with string equality in a UI is not Chain of Identity. COI is a blocking control at every handoff, with dual identifiers, illegal-transition refusal, and an audit event.
2. **Mechanism selection is likely inverted.** The `AI_FDE` prefix predicts an agent/LLM in the coordination spine. Identity matching, slot exclusivity, and spec limits must be deterministic. Models may draft packets and propose recoveries. If the model is the orchestrator, the system cannot be validated.
3. **Dual orchestration spines.** The usual brownfield failure: workflow engine + agent graph + notebook all write batch status. Manual retry of a child QC job does not resurrect the parent. One writer of the patient–batch thread is non-negotiable.

### Code quality & maintainability

Until the zip is bound, assume status-as-string, copy-pasted adapters, and demo fixtures that quietly became the operational data plane. The strangler target is a guarded domain module that adapters cannot bypass — not a prettier folder layout.

### Security & performance risks

Default posture: **unsafe to connect to a real MES / LIMS / courier API**. Capstone trees commonly contain `.env` keys, open endpoints, `eval` / `pickle`, and no RBAC. Even with no secret hits after bind, COI functions are high process risk and need scripted tests (GAMP-aligned), not a demo script.

Performance is secondary to correctness on autologous lots. The bottleneck that matters is **decision latency at handoffs** (slot recovery, excursion, identity check) — not tokens per second.

### Testing & observability gaps

No gold lots, no identity-swap cases, no tamper-evident audit thread, no correlation IDs on material actions: the estate is unfalsifiable. QA cannot be asked to “trust the copilot.” Stage 16 is the cheapest gate that prevents a second decade of untestable orchestration.

---

## 4. Detailed Analysis Mapped to the 21-Stage FDE Model

Statuses below are the **unbound defaults**. Bind the zip in the workbench to replace inference with file evidence.

### Discover & Frame (1–6)

| # | Stage | Status | Evidence / rationale |
| --- | --- | --- | --- |
| 1 | Inherit & Reconcile | Needs Improvement | Named inherited capstone; no freeze list or owner map bound |
| 2 | Observe the Work | Needs Improvement | Journey reconstructable from CGT domain; no operator observation log |
| 3 | Map Actors, Systems & Exceptions | Needs Improvement | Adapters implied; overlap/mocks unconfirmed until bind |
| 4 | Establish Baseline & Verifier | Missing | No cycle-time / mismatch / packet-time baseline; demo ≠ verifier |
| 5 | Value, Risk Ceiling & Guardrails | **Critical Failure** | Identity mismatch and unsupervised release are never-events; no explicit write-forbid list |
| 6 | Charter the Workflow | Needs Improvement | Zip name is a de-facto charter; not signed, no stop conditions |

### Design the Change (7–12)

| # | Stage | Status | Evidence / rationale |
| --- | --- | --- | --- |
| 7 | Four Data Planes | Needs Improvement | Synthetic fixtures likely; not operational/eval/feedback planes |
| 8 | Smallest Sufficient Mechanism | Needs Improvement | AI prefix suggests model-in-spine; COI/slot must stay software |
| 9 | Domain & State Model | Needs Improvement | Records likely exist; guarded illegal transitions usually do not |
| 10 | Human–Agent Operating Model | Missing | Chat/approve button is not a designed reviewer job |
| 11 | Integration Contracts | Needs Improvement | Expect implicit JSON blobs vs versioned, idempotent ports |
| 12 | Eval, Safety & Audit | Missing | No identity-swap evals; inspection chain not queryable |

### Build & Prove (13–17)

| # | Stage | Status | Evidence / rationale |
| --- | --- | --- | --- |
| 13 | Vertical Slice | Needs Improvement | Named orchestrator implies a path; may be happy-path only |
| 14 | Orchestrate Tools & Workflow | Needs Improvement | Dual-spine working hypothesis |
| 15 | HITL, Identity & Exceptions | **Critical Failure** | No bound blocking COI; identity-as-field is a safety defect |
| 16 | Evals, Tests & Observability | Missing | No harness assumed until tests appear in the tree |
| 17 | Bounded Pilot | Missing | A local demo is not a pilot envelope |

### Launch & Operate (18–21)

| # | Stage | Status | Evidence / rationale |
| --- | --- | --- | --- |
| 18 | Harden & Validate | **Critical Failure** | GxP-relevant functions without validation/secrets/auth story |
| 19 | Launch, Cut Over & Recover | Missing | Collected bags do not roll back; no compensating-action runbook |
| 20 | Transfer Ownership & Hypercare | Missing | Bus factor remains the inheriting FDE |
| 21 | Operate, Productize, Expand or Retire | Missing | No SLO, no retirement of shadow tools; infusion would be scope creep |

**Maturity index (unbound):** 28 / 100 — *Pre-charter brownfield — unsafe to connect to GxP systems.*

---

## 5. Strategic Next Steps & Remediation Plan

### Long-term vision

Transition this brownfield into an FDE-aligned service with a **strangler fig**, not a rewrite:

1. **Freeze** writes to identity and disposition. Re-charter the accepted outcome.
2. **Extract the spine:** Patient → Collection → Slot → Batch as a guarded state machine. Hexagonal ports for LIMS / MES / slot / courier. One writer of batch status.
3. **Make identity a control and HITL a job:** blocking mismatch, dual-control disposition, evidence packets a QP can actually use.
4. **Prove, then envelope a pilot** on historical or shadow lots. Identity-swap cases fail the build. No plant writes.
5. **Harden lot-aware.** GAMP-aligned scripted tests for COI/disposition. Change control for prompts, tools, and ontologies. Productize the COI service, slot broker, and packet assembler. Retire notebooks. Expansion to infusion requires a **new charter**.

### Governance & process changes

- Stage-gates are real: no build without Stage 6; no plant integration without Stages 12, 15, 16; no unbounded “pilot.”
- Change control includes prompts, retrieval, tools, and ontologies.
- Separation of duties on disposition: the digital teammate drafts; QA/QP disposes.
- A second writer to batch status is an incident.
- PHI-minimized logs with correlation IDs; a complete patient chain is a query, not an afternoon of email.
- Every engagement ends with keep / generalize / retire. Customer-specific Streamlit is not an asset unless it dies on a date.

---

## 6. Do we need AI? Mechanism selection

**Verdict: No. The patient-to-batch spine does not need AI to be valid, safe, or inspectable.** The original problem is coordination and identity, not prediction or language. COI, slot exclusivity, spec limits, state transitions, and QP release are deterministic (or human). An LLM or agent as orchestrator cannot be validated.

Use AI only beside the spine, for translation / retrieval / drafting / ranking, after software already refuses never-events.

### Forbidden as AI

| Step | Mechanism | Why not AI |
| --- | --- | --- |
| COI/COC match at every handoff | Rules | Probabilistic identity match is a patient-safety event |
| Slot exclusivity | Rules | Calendar locks are software; agents may propose, not book |
| Spec-limit / QC gates | Rules | The spec is a controlled document |
| Patient–batch state machine | Rules | One writer of thread state; not a graph of prompts |
| Batch disposition / QP release | Human | GxP responsibility stays with the qualified person |
| MES start, courier booking, COI mutation | Rules + human | No agent credentials on irreversible writes |

### Justified use cases (after the spine exists)

| Step | Mechanism | Purpose | Human gate |
| --- | --- | --- | --- |
| QA/QP packet first draft | **RAG + GenAI** | Retrieve lot events, QC, COI chain, spec; draft with citations | QA/QP signs; model does not release |
| “Why is this lot blocked?” | **GenAI** on structured events | Short operator brief with source + timestamp | State machine still owns the hold |
| SOP / spec lookup | **RAG** | Version-pinned retrieval with citations | SOP remains the authority |
| Deviation narrative draft | **GenAI** | ALCOA-style draft from time-aligned events | QA files the QMS record |
| Slot-slip / courier-delay risk | **Classical ML** | Rank in-flight collections; skip if no labeled history | Advisory only; no auto-reschedule |
| In-process out-of-trend flag | **Classical ML** | Escalate unusual trajectories vs same process version | Spec limits still fire as hard rules |
| Slot recovery option set | **Agentic AI** (read-only) | Gather calendars/ETAs; propose 2–3 options | Planner selects; software books |
| Exception triage | **Agentic AI** (read-only) | Ingest → check → draft → route a blocker packet | Every external/lot-changing act is approved |

### First AI slices, in order

1. **A1 Grounded packet drafter (RAG + GenAI)** — highest value, lowest blast radius. Read-only. Citation eval before any pilot.
2. **A2 Blocker brief** — display-only; cannot clear a COI hold.
3. **A3 Slot-slip ranker (ML)** — only with labeled historical outcomes; otherwise a courier-ETA rule is smaller.

**RAG is required for A1/A2/SOP lookup** so answers are grounded in this lot’s records and controlled documents, not in model memory. **Agentic AI is not required** to ship the orchestrator; it is a later gather-and-draft loop with no write tools. **GenAI without RAG** is not an acceptable packet or SOP assistant.

---

## 7. Implement the AI slice: models, vector DB, knowledge base

**Requirement recap.** Only A1 (grounded packet drafter) and SOP lookup need retrieval. A2 (blocker brief) is GenAI over a structured hold list. A3 is classical ML, not RAG. The orchestration spine stays rules.

### Is a vector database required?

**Only for controlled documents.** Do **not** vectorize the living lot (patient, COI, QC, slot). Fetch that by `lot_id` / `coi_id` into a **Lot Context Pack** JSON. Semantic search is the wrong API for identity.

| Slice | Vector DB? |
| --- | --- |
| A1 packet drafter | **Yes** — SOPs, specs, templates (filtered by product + version) |
| A2 blocker brief | **No** — structured events from the state machine |
| A3 slot-slip ranker | **No** — tabular features, not embeddings |
| COI / slot / release | **No** — never |

**Easy vector stores (pick one):**

1. **Chroma (embedded)** — easiest start. `pip install chromadb`. Folder on disk. Capstone / laptop / exploration.
2. **pgvector on Postgres** — easiest if Postgres already exists. Lot records and chunks in one backup/IAM boundary. Prefer this for a shared service.
3. **Qdrant via Docker** — easiest dedicated vector API (`docker run qdrant/qdrant`). Use when you want filters and a real service without a SaaS contract.

Do not start with Pinecone/Weaviate cloud for autologous lots unless Legal has already approved PHI residency.

**Embeddings:** `text-embedding-3-small` for a cloud start; **nomic-embed-text** or **bge-m3** if documents must stay local. Freeze one embedding model; changing it means reindex.

### Model comparison (drafter)

| Model | Role | Pick when | Limit |
| --- | --- | --- | --- |
| **Claude Sonnet 4** | Primary drafter A1/A2 | Best default for structured packets and “do not invent QC” | Needs BAA; not air-gapped |
| **GPT-4.1** (prefer **Azure OpenAI**) | Drafter if Azure is the approved path | Enterprise already contracted | Same PHI rules; keep eval strict on citations |
| **Gemini 2.5 Flash** | Cheap critic / high-volume briefs | Long context, low cost | Long context ≠ correct spec version |
| **Llama 3.3 70B** or **Qwen 2.5 72B** (vLLM/Ollama) | Air-gap drafter | Lot pack must not leave the plant | You run GPUs; eval harder |

**Default:** Sonnet 4 + Chroma/nomic for exploration; Azure GPT-4.1 + pgvector if that is the firm standard; Llama 3.3 70B if PHI cannot leave the network.

### How the knowledge base is built

Three planes:

1. **Operational (no vectors)** — assemble Lot Context Pack at draft time from the state machine.
2. **Controlled documents (vectors)** — effective, version-pinned SOPs/specs only. Chunk by heading (400–800 tokens). Metadata: `doc_id`, version, product, process_step, checksum.
3. **Eval** — gold packets and trap cases. Do not contaminate the production index.

Ingest path: inventory → pin effective versions → parse/chunk → metadata → embed → hybrid retrieve (ID pack + filtered vector + optional BM25) → cite `chunk_id` / `event_id`. Never put EHR notes or MES dumps in the document index.

### Build sequence

0. Freeze COI as a blocking rule; one writer of batch status.  
1. Lot Context Pack JSON schema.  
2. Document index only if A1 (Chroma → pgvector/Qdrant). Skip for A2-only.  
3. KB ingest K1–K7.  
4. Prompt: cite or say MISSING; never invent COI; never recommend release.  
5. Drafter + frozen embeddings; optional Flash critic.  
6. Eval: missing QC, wrong spec version, identity-swap trap. Fail the build on invented results.  
7. HITL UI: draft + citations + pack side-by-side.  
8. A2: LLM only sentences the hold list. Empty holds → empty brief.  
9. A3 only with ~200+ labels; else courier-ETA rule.  
10. Shadow-lot pilot; prompt+index version on the audit row.

---

## 8. Azure target architecture and ADRs

**Selected stack (Azure landing zone, private).** Entra ID + internal APIM; **Azure Container Apps** for spine, UI, and read-only AI sidecar; **PostgreSQL Flexible Server** as lot/COI/slot/batch system of record; **Service Bus** as notification bus only; **Blob + Document Intelligence** for SOP/spec binaries; **Azure AI Search** (hybrid) for document chunks with product/version filters; **Azure OpenAI** `gpt-4.1` + `text-embedding-3-small`; Key Vault + Monitor.

Rejected for first cutover: AKS, Cosmos as SoR, embedding the living lot, public OpenAI, LangGraph as the orchestrator.

### ADRs (accepted)

| ID | Decision |
| --- | --- |
| [ADR-0001](adr/0001-deterministic-spine-ai-sidecar.md) | Deterministic spine; AI is a read-only sidecar |
| [ADR-0002](adr/0002-azure-container-apps-runtime.md) | Container Apps + VNet + internal APIM; AKS later |
| [ADR-0003](adr/0003-split-planes-azure-openai-search.md) | PostgreSQL for lots; AI Search + Azure OpenAI for documents |

Diagrams: workbench section **8 Azure**.

---

## 9. Final presentation Q&A

Cohort-2 worksheet answers live in [`PRESENTATION_QA.md`](PRESENTATION_QA.md) and in workbench section **9 Q&A**. They cite this repo (stages, ADRs, mechanism rows). They do **not** invent zip CSV counts — `patients.csv` / `events.jsonl` / `baseline_kpis.csv` are not in this codebase until the source archive is bound.

---

*This document is the standing narrative. File-level evidence is produced in the workbench when the source zip is bound.*
