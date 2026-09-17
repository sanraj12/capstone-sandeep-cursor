export type ModelPick = {
  name: string;
  vendor: string;
  role: "Draft (A1/A2)" | "Embeddings" | "Local / air-gap" | "Not for this job";
  strengths: string;
  limits: string;
  when: string;
};

export const VECTOR_VERDICT = {
  headline: "A vector database is required only for controlled documents — not for the lot itself.",
  body: "Patient, COI, slot, QC results, and batch state are structured records. Fetch them by lot ID / COI ID from the operational store. Do not embed a living lot into a vector index and hope semantic search reconstructs identity. Vectors are for SOPs, product specs, playbooks, and (optionally) de-identified historical packet examples. A2 (blocker brief) can ship with zero vector DB if the state machine already emits structured blockers.",
};

export const VECTOR_OPTIONS = [
  {
    name: "Chroma (embedded)",
    effort: "Easiest to start",
    when: "FDE laptop / capstone / exploration. pip install chromadb. No server, no cloud, data stays in a folder.",
    notWhen: "Multi-user GxP production, HA, or a shared plant network.",
  },
  {
    name: "pgvector on Postgres",
    effort: "Easiest if you already have Postgres",
    when: "One database for lot records AND document chunks. Backup, IAM, and audit stay in the estate you already operate.",
    notWhen: "You have no Postgres yet and only need a two-week demo — then Chroma is smaller.",
  },
  {
    name: "Qdrant (Docker one-liner)",
    effort: "Easiest dedicated vector service",
    when: "You want a real vector API, filters on product/version, and a path to production without a SaaS contract.",
    notWhen: "PHI must not leave a locked-down DB and you already run Postgres — prefer pgvector.",
  },
];

export const MODELS: ModelPick[] = [
  {
    name: "Claude Sonnet 4",
    vendor: "Anthropic",
    role: "Draft (A1/A2)",
    strengths:
      "Strong instruction-following and long, structured drafts. Good at refusing to invent missing QC when the prompt forbids it. Best default for packet prose.",
    limits: "API = BAA/DPA and no PHI unless contracted. Cost higher than Flash-class models.",
    when: "Primary drafter for A1 packet and A2 brief in a private-cloud / BAA setup.",
  },
  {
    name: "GPT-4.1",
    vendor: "OpenAI",
    role: "Draft (A1/A2)",
    strengths:
      "Broad tool-calling if you later add a read-only agent. Familiar ops stack (Azure OpenAI for many life-science estates).",
    limits: "Same PHI/BAA constraint. Weaker than Sonnet at ‘only cite the pack’ unless the eval harness is strict.",
    when: "Use if Azure OpenAI is already the approved enterprise path. Prefer the Azure-hosted model over public api.openai.com.",
  },
  {
    name: "Gemini 2.5 Flash",
    vendor: "Google",
    role: "Draft (A1/A2)",
    strengths:
      "Long context and low latency/cost. Useful to stuff the whole lot context pack + retrieved SOP sections in one call.",
    limits: "Must still retrieve the right spec version — long context is not a substitute for version pinning. Grounding eval required.",
    when: "Cheap second model for eval (draft with Sonnet, critic with Flash) or high-volume blocker briefs.",
  },
  {
    name: "Llama 3.3 70B (or Qwen 2.5 72B) via vLLM / Ollama",
    vendor: "Open weights",
    role: "Local / air-gap",
    strengths:
      "Lot context never leaves the plant network. Required pattern if Legal will not allow PHI in a foundation-model API.",
    limits: "You operate GPUs, quantization, and eval. Citation discipline is weaker until you prompt+eval hard.",
    when: "Air-gapped manufacturing / clinical network. Start Ollama on a workstation for exploration; vLLM for a shared service.",
  },
  {
    name: "text-embedding-3-small  ·  or bge-m3 / nomic-embed-text",
    vendor: "OpenAI or local",
    role: "Embeddings",
    strengths:
      "Small OpenAI embed is the fastest cloud start. bge-m3 / nomic-embed-text run locally next to Chroma so documents never leave the box.",
    limits: "Do not embed PHI-rich lot JSON. Embed SOPs/specs only. Keep one embedding model forever or reindex on change.",
    when: "Cloud docs: text-embedding-3-small. Local/GxP docs: nomic-embed-text or bge-m3.",
  },
];

export const KB_PLANES = [
  {
    plane: "Operational plane (no vectors)",
    contents:
      "Patient, enrollment, collection/DIN, COI ID, slot, batch/lot, QC results, holds, deviations as events.",
    how: "Source of truth = state machine + adapters. Build a Lot Context Pack JSON keyed by lot_id / coi_id at draft time. This is a query, not a search.",
  },
  {
    plane: "Controlled-document plane (vectors)",
    contents:
      "SOPs, product specs, process versions, exception playbooks, packet templates, redacted historical packets.",
    how: "Ingest only effective, version-pinned PDFs/Docx. Chunk by heading. Store metadata: doc_id, version, effective_date, product, process_step, checksum. Embed chunks. Retrieve with metadata filters (this product, this version).",
  },
  {
    plane: "Eval plane (not production RAG)",
    contents:
      "Gold packets, identity-swap negatives, missing-QC cases, wrong-spec-version traps.",
    how: "A labeled set the drafter must pass. Never mix gold answers into the production index in a way that leaks the test.",
  },
];

export const KB_BUILD_STEPS = [
  {
    n: "K1",
    title: "Inventory and classify",
    detail:
      "List every document QA actually opens to release a lot. Tag each as operational record vs controlled document vs informal (email). Informal stays out of the index.",
  },
  {
    n: "K2",
    title: "Pin versions",
    detail:
      "Only the effective spec/SOP version for that product/process is eligible. Store checksum + effective_from. A superseded SOP must not be retrievable unless the lot was made under that version.",
  },
  {
    n: "K3",
    title: "Parse and chunk",
    detail:
      "PDF/Docx → text with heading path. Chunk 400–800 tokens, 15% overlap, keep the heading in every chunk. Reject scans that OCR below a quality bar.",
  },
  {
    n: "K4",
    title: "Metadata before embeddings",
    detail:
      "product_code, process_version, doc_type (SOP|spec|playbook|template), section, page, checksum. Filters beat a bigger embedding model.",
  },
  {
    n: "K5",
    title: "Embed and index",
    detail:
      "One embedding model. Upsert into Chroma (dev) or pgvector/Qdrant (shared). Idempotent on checksum so re-ingest is safe.",
  },
  {
    n: "K6",
    title: "Hybrid retrieve at draft time",
    detail:
      "1) Load Lot Context Pack by ID. 2) Filter docs to this product/version. 3) Vector search for the packet section being drafted. 4) Optional BM25 on section titles. Merge, cap tokens, cite chunk_ids.",
  },
  {
    n: "K7",
    title: "Access, retention, PHI",
    detail:
      "Index is GxP-relevant. RBAC same as SOP library. No raw identifiers in document chunks. Lot pack is assembled in-memory, logged with correlation ID, not dumped into the vector store.",
  },
];

export const BUILD_STEPS = [
  {
    n: "0",
    title: "Freeze the spine first",
    detail:
      "Do not start RAG until COI is a blocking rule and batch status has one writer. Otherwise the drafter will narrate a lie.",
  },
  {
    n: "1",
    title: "Define the Lot Context Pack contract",
    detail:
      "JSON schema: identifiers (patient_ref, din, coi_id, lot), state, QC table, holds, events with timestamps and source system. This pack is the only lot truth the model may see.",
  },
  {
    n: "2",
    title: "Stand up the document index (only if A1 or SOP lookup)",
    detail:
      "Dev: Chroma + nomic-embed-text (or text-embedding-3-small). Shared: pgvector on existing Postgres, else Qdrant via Docker. Skip this step entirely for A2-only.",
  },
  {
    n: "3",
    title: "Build the knowledge base (K1–K7)",
    detail:
      "Ingest version-pinned SOPs/specs. Do not ingest MES dumps or EHR notes into the vector index.",
  },
  {
    n: "4",
    title: "Draft prompt: pack + retrieved chunks + hard refusals",
    detail:
      "System rules: cite chunk_id or event_id for every factual clause; if QC is missing say MISSING; never invent a COI; never recommend release.",
  },
  {
    n: "5",
    title: "Pick models and an eval pair",
    detail:
      "Drafter: Claude Sonnet 4 (or Azure GPT-4.1 if that is the approved path). Optional critic: Gemini 2.5 Flash. Air-gap: Llama 3.3 70B. Embeddings: one model, frozen.",
  },
  {
    n: "6",
    title: "Eval harness before any user",
    detail:
      "Cases: happy packet, missing QC, wrong spec version retrieved, identity-swap trap (model must not ‘fix’ IDs), citation hallucination. Fail the build on identity or invented results.",
  },
  {
    n: "7",
    title: "Reviewer UI (HITL)",
    detail:
      "Show draft, citations, Lot Context Pack side-by-side. Approve / edit / reject. Edits become feedback; they do not auto-write QMS.",
  },
  {
    n: "8",
    title: "A2 blocker brief (no extra vector DB)",
    detail:
      "Template the brief from structured holds. LLM only turns the hold list into sentences. If the hold list is empty, the brief is empty — no storytelling.",
  },
  {
    n: "9",
    title: "A3 only with labels",
    detail:
      "If < ~200 labeled slot-slip outcomes, skip ML. Use courier-ETA vs slot-start as a rule. Vectors are irrelevant here.",
  },
  {
    n: "10",
    title: "Pilot envelope",
    detail:
      "Shadow lots, named QA users, read-only tools, cost/latency caps, prompt+index version in the audit row. Promotion needs citation faithfulness and zero identity inventions on the eval set.",
  },
];
