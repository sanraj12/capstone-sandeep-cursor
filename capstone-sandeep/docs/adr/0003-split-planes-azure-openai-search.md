# ADR-0003: Split data planes — PostgreSQL for lots, Azure AI Search + OpenAI for documents

- **Status:** Accepted
- **Date:** 2026-09-17
- **Deciders:** Senior FDE Architect
- **Azure services affected:** Azure Database for PostgreSQL Flexible Server, Azure AI Search, Azure OpenAI, Blob Storage, Document Intelligence, Service Bus

## Context

A1 (packet drafter) needs grounded retrieval of **controlled documents**. A2 needs **structured holds**, not search. Embedding the living lot (patient, COI, QC) into a vector index makes identity a similarity query — which we rejected as a never-event risk.

Azure offers several retrieval stacks: Azure AI Search, pgvector on PostgreSQL, Cosmos DB + vectors, third-party Qdrant/Pinecone. Models may be Azure OpenAI, public OpenAI, Anthropic, or open weights on GPU VMs.

## Decision

**Three planes, three stores:**

1. **Operational system of record:** Azure Database for PostgreSQL Flexible Server — patient/collection/slot/batch/COI events, Lot Context Pack assembled by query, not by KNN.
2. **Document binaries:** Azure Blob Storage (versioning on) for effective SOP/spec PDFs; ingest with **Azure AI Document Intelligence**.
3. **Document index:** **Azure AI Search** with hybrid (keyword + vector) and **mandatory filters** on `product_code` and `doc_version`. Vectors are SOP/spec chunks only.

**Models:** **Azure OpenAI**

- Chat: `gpt-4.1` (drafter for A1/A2)
- Embeddings: `text-embedding-3-small` (index + query; freeze the deployment)
- Optional critic: `gpt-4.1-mini` on a second deployment (eval only)

**Events:** **Azure Service Bus** topics for handoffs (`collection.completed`, `slot.held`, `qc.attached`). Service Bus is a notification bus. **PostgreSQL remains the only writer of lot status.**

Private endpoints for OpenAI, Search, PostgreSQL, Storage, Service Bus. No public `api.openai.com`.

## Options considered

| Option | Pros | Cons |
| --- | --- | --- |
| **A. PostgreSQL + Blob + Azure AI Search + Azure OpenAI (selected)** | Azure-native hybrid search; lot truth stays relational; Entra + private link | Two data services to operate |
| B. PostgreSQL + pgvector only | One database | Weaker hybrid search/filters than AI Search; mixes lot rows and chunks operationally |
| C. Cosmos DB as SoR | Global distribution | Awkward for guarded state-machine transactions and SQL reporting |
| D. Azure SQL Database | Familiar to some plants | Weaker FDE/open-source adapter story; AI Search still needed |
| E. Chroma / Qdrant on a VM | Fast laptop demo | Not the Azure landing-zone standard; extra identity/backup story |
| F. Public OpenAI or Anthropic | Model quality | Wrong identity boundary; dual vendors; harder private link |

## Consequences

- Lot Context Pack is built with SQL (and adapter reads), then passed to Azure OpenAI. Search is not asked “which patient is this.”
- Index schema includes `chunk_id`, `doc_id`, `version`, `product_code`, `process_step`, `checksum`. Wrong-version retrieval is an eval failure.
- Changing the embedding deployment requires a full reindex; treat as a system change (ADR-0001 sidecar change control).
- A2 **does not call AI Search**. Empty hold list ⇒ empty brief.
- If Legal later forbids even Azure OpenAI for PHI, this ADR is revisited toward **Azure GPU + Llama 3.3 70B** in the same VNet; Search and PostgreSQL stay.

## Follow-up

- Index access RBAC aligned to the SOP library.
- Prompt + index + model **deployment names** stored on every draft audit row.
