export const AZURE_STACK = [
  {
    layer: "Identity & front door",
    selected: "Microsoft Entra ID, managed identities, Azure API Management (internal / VNet)",
    rejected: "App-level API keys, public APIM, public OpenAI API keys in the client",
    why: "Users are QA/planners, not patients. Plant APIs must not be on the public internet. The sidecar client-id is denied write routes in APIM.",
  },
  {
    layer: "Runtime",
    selected: "Azure Container Apps (spine API, reviewer UI, AI sidecar) + Azure Container Registry",
    rejected: "AKS first, App Service only, Functions-only",
    why: "Revisions and sidecars without cluster ops. Promote to AKS only with a capacity trigger (ADR-0002).",
  },
  {
    layer: "Lot system of record",
    selected: "Azure Database for PostgreSQL Flexible Server",
    rejected: "Cosmos DB, Azure SQL as SoR, vectors as SoR",
    why: "Guarded state machine, transactions, SQL inspection packs. Identity is a query by COI/lot ID.",
  },
  {
    layer: "Events",
    selected: "Azure Service Bus (topics) as notification bus",
    rejected: "Event Hubs (overkill), Service Bus as lot status owner, extra Celery/Airflow spine",
    why: "Handoffs notify subscribers. PostgreSQL is the only writer of batch status (ADR-0001).",
  },
  {
    layer: "Documents",
    selected: "Azure Blob Storage (versioning) + Azure AI Document Intelligence",
    rejected: "Git for controlled SOPs, ad-hoc file shares as the index",
    why: "Effective spec/SOP binaries with checksums. Parse to heading-aware chunks before indexing.",
  },
  {
    layer: "Document retrieval",
    selected: "Azure AI Search (hybrid keyword + vector, metadata filters)",
    rejected: "Chroma in production, Pinecone, embedding the living lot",
    why: "Azure-native hybrid search with product/version filters. Lots never go in the index (ADR-0003).",
  },
  {
    layer: "Models",
    selected: "Azure OpenAI: gpt-4.1 (drafter), text-embedding-3-small, optional gpt-4.1-mini critic",
    rejected: "Public api.openai.com, Anthropic as primary on this landing zone, LLM as orchestrator",
    why: "Private link, Entra, regional data path. Model quality is gated by eval, not by a second cloud.",
  },
  {
    layer: "Secrets & observability",
    selected: "Azure Key Vault, Azure Monitor, Application Insights, Log Analytics",
    rejected: ".env in git, unstructured PHI in logs",
    why: "Correlation IDs on lot/COI. Prompt, index, and model deployment names on every draft audit row.",
  },
];

export const ADRS = [
  {
    id: "ADR-0001",
    title: "Deterministic spine; AI as read-only sidecar",
    status: "Accepted",
    decision:
      "State machine owns patient→batch. Azure OpenAI drafts packets/briefs only. No agent write credentials.",
    href: "/docs/adr/0001-deterministic-spine-ai-sidecar.md",
  },
  {
    id: "ADR-0002",
    title: "Azure Container Apps on a private VNet",
    status: "Accepted",
    decision:
      "Container Apps + internal APIM + private endpoints. AKS is a later scale path, not the first cutover.",
    href: "/docs/adr/0002-azure-container-apps-runtime.md",
  },
  {
    id: "ADR-0003",
    title: "PostgreSQL for lots; AI Search + OpenAI for documents",
    status: "Accepted",
    decision:
      "Split planes. Hybrid Azure AI Search for SOP/spec chunks. gpt-4.1 + text-embedding-3-small via Azure OpenAI.",
    href: "/docs/adr/0003-split-planes-azure-openai-search.md",
  },
];

export const CONTEXT_DIAGRAM = `flowchart TB
  subgraph users["People"]
    CM["Case manager"]
    PL["Slot planner / MSAT"]
    QA["QA / QP"]
    FDE["FDE / platform"]
  end

  Entra["Microsoft Entra ID"]
  APIM["Azure API Management<br/>internal / VNet"]

  subgraph aca["Azure Container Apps"]
    UI["Reviewer UI"]
    Spine["Spine API<br/>state machine · COI guard · slot broker"]
    Sidecar["AI sidecar<br/>A1 packet drafter · A2 blocker brief<br/>read-only"]
  end

  PG[("Azure Database for PostgreSQL<br/>lot · COI · slot · batch · audit")]
  SB["Azure Service Bus<br/>handoff notifications"]
  Blob["Azure Blob Storage<br/>versioned SOP / spec PDFs"]
  DI["Azure AI Document Intelligence"]
  Search["Azure AI Search<br/>hybrid index · product + version filters"]
  AOAI["Azure OpenAI<br/>gpt-4.1 · text-embedding-3-small"]
  KV["Azure Key Vault"]
  Mon["Azure Monitor · App Insights"]

  subgraph adapters["Adapters — writes only via spine"]
    LIMS["LIMS"]
    MES["MES"]
    TMS["Courier / TMS"]
  end

  CM --> Entra
  PL --> Entra
  QA --> Entra
  FDE --> Entra
  Entra --> APIM
  APIM --> UI
  APIM --> Spine
  UI --> Spine
  UI --> Sidecar
  Sidecar -.->|"Lot Context Pack + citations"| Spine
  Sidecar --> Search
  Sidecar --> AOAI
  Spine --> PG
  Spine --> SB
  Spine --> LIMS
  Spine --> MES
  Spine --> TMS
  DI --> Blob
  DI --> Search
  AOAI --> Search
  Spine --> KV
  Sidecar --> KV
  Spine --> Mon
  Sidecar --> Mon
  SB -.->|"notify, do not own status"| Spine
`;

export const PLANES_DIAGRAM = `flowchart LR
  subgraph op["Operational plane — no vectors"]
    Q["Query by lot_id / coi_id"]
    Pack["Lot Context Pack JSON<br/>identifiers, QC, holds, events"]
    Q --> Pack
  end

  subgraph doc["Controlled-document plane — Azure AI Search"]
    Blob["Blob: effective SOP/spec"]
    Chunks["Chunks + metadata<br/>version · product · checksum"]
    Hybrid["Hybrid retrieve<br/>keyword + vector + filters"]
    Blob --> Chunks --> Hybrid
  end

  subgraph evalp["Eval plane"]
    Gold["Gold packets · trap cases<br/>missing QC · wrong version · identity swap"]
  end

  Pack --> Draft["Azure OpenAI gpt-4.1 draft"]
  Hybrid --> Draft
  Gold -.->|"fail the build"| Draft
  Draft --> HITL["QA / planner HITL"]
`;

export const SEQUENCE_DIAGRAM = `sequenceDiagram
  actor QA as QA / QP
  participant UI as Reviewer UI
  participant Spine as Spine API
  participant PG as PostgreSQL
  participant Search as Azure AI Search
  participant AOAI as Azure OpenAI

  QA->>UI: Request packet draft for lot
  UI->>Spine: GET lot context pack
  Spine->>PG: Select lot, COI, QC, holds, events
  PG-->>Spine: Structured records
  Spine-->>UI: Lot Context Pack
  UI->>Search: Hybrid query filtered by product + spec version
  Search-->>UI: Cited chunks
  UI->>AOAI: Draft prompt pack + chunks + refusals
  Note over AOAI: Cite chunk_id/event_id or say MISSING<br/>Never invent COI or recommend release
  AOAI-->>UI: Draft + citations
  UI-->>QA: Side-by-side pack / draft / cites
  QA->>UI: Edit / approve draft only
  Note over Spine: Disposition remains a separate dual-control action on the spine
`;
