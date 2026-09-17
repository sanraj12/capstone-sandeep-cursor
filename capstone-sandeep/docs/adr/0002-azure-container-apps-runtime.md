# ADR-0002: Azure Container Apps on a private VNet as the runtime

- **Status:** Accepted
- **Date:** 2026-09-17
- **Deciders:** Senior FDE Architect
- **Azure services affected:** Container Apps, VNet + private endpoints, API Management, Entra ID, Key Vault, Monitor

## Context

The FDE slice must run on **Azure** (enterprise landing zone, Entra ID, private networking, Key Vault). We need:

- An API for the state machine and adapters
- A reviewer UI
- A scale-to-near-zero AI sidecar
- No public inbound to plant-facing APIs
- Less operational load than a full Kubernetes estate for the first production envelope

## Decision

**Run the spine, UI, and AI sidecar as Azure Container Apps** in a dedicated environment, **VNet-injected**, with:

- **Microsoft Entra ID** for users (QA, planner, case manager) and **managed identities** for app-to-Azure calls
- **Azure API Management** (internal / VNet) as the only front door
- **Azure Key Vault** for secrets; no connection strings in app settings in clear text
- **Private endpoints** to PostgreSQL, AI Search, OpenAI, Storage, Service Bus, Key Vault
- **Azure Monitor + Application Insights** with correlation IDs (`lot_id`, `coi_id`) and PHI-minimized logs

AKS is the later scale path if we outgrow Container Apps (HPA, mesh, many adapters). It is not the first cutover target.

## Options considered

| Option | Pros | Cons |
| --- | --- | --- |
| **A. Container Apps + APIM + private endpoints (selected)** | Fast to operate; revisions; sidecar scale; Azure-native identity | Less knobs than AKS; regional SKU limits |
| B. Azure Kubernetes Service | Fine-grained scheduling; eventual standard for many plants | Cluster ops tax too high for one workflow slice |
| C. App Service (Windows/Linux) | Simple web apps | Weaker multi-container sidecar story; colder AI worker pattern |
| D. Functions-only | Cheap events | Poor fit for a long-lived state machine and HITL UI |

## Consequences

- Images from Azure Container Registry; signed/locked for a GxP-relevant promotion.
- Internal APIM policies: JWT from Entra, rate limits on `/ai/*`, deny write verbs from the sidecar client-id.
- Non-prod can use Consumption-ish profiles; prod uses zone-redundant Container Apps environment where the region allows.
- Promotion path: Container Apps → AKS only with a written capacity/SLA trigger, not as fashion.
