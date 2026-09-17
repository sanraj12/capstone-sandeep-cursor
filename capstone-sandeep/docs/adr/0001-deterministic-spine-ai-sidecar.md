# ADR-0001: Deterministic orchestration spine; AI only as a read-only sidecar

- **Status:** Accepted
- **Date:** 2026-09-17
- **Deciders:** Senior FDE Architect (inherited CGT patient-to-batch estate)
- **Azure services affected:** Container Apps (spine vs sidecar processes), API Management policies, no agent write credentials

## Context

The inherited estate is named `AI_FDE_CGT_Patient_to_Batch_Orchestration`. Autologous CGT is one patient = one batch. Never-events are identity mismatch and unsupervised batch release. A common brownfield pattern is to put LangGraph / an LLM in the coordination spine so the model “runs the workflow.”

That choice collides with GxP: a prompt is not a state machine, a model cannot be the verifier for COI, and an agent with MES/courier tools has an unbounded blast radius.

## Decision

**The system of record for patient → collection → slot → batch is a deterministic state machine** with blocking COI checks, exclusive slot holds, spec-limit gates, and dual-control human disposition.

**Generative AI is a sidecar**, not the orchestrator:

- A1 packet drafter and A2 blocker brief are read-only.
- They consume a Lot Context Pack assembled by the spine plus (for A1) retrieved SOP/spec chunks.
- They must not mutate COI, book slots, start MES, or dispose a lot.

## Options considered

| Option | Pros | Cons |
| --- | --- | --- |
| **A. Software spine + HITL + AI sidecar (selected)** | Validatable; inspection-ready; AI still delivers packet/brief value | Two deployables to operate |
| B. Agent/graph as orchestrator | Fast demo; one “smart” loop | Unvalidatable; dual writers of status; never-event risk |
| C. No AI at all | Smallest attack surface | QA packet assembly and blocker briefs stay manual |

## Consequences

- Adapter writes go only through the spine (idempotent, audited).
- Azure OpenAI identities get **Cognitive Services OpenAI User** plus Key Vault secrets — never Service Bus send on the lot topic, never PostgreSQL write.
- Eval harness fails the build on invented QC or identity “fixes.”
- Productization path is COI service + slot broker + packet sidecar, not a customer-specific agent.

## Compliance note

COI and disposition remain high process risk (scripted tests). The sidecar is GxP-relevant for *drafting* but the **qualified person** remains the disposition authority.
