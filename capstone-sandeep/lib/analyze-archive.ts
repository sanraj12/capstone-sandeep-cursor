import JSZip from "jszip";
import { FDE_STAGES } from "./fde-stages";
import { scoreFromStages } from "./seed-assessment";
import type {
  Assessment,
  Finding,
  Problem,
  StageEvidence,
  StageStatus,
  Strength,
} from "./types";

const TEXT_EXT =
  /\.(md|txt|py|ts|tsx|js|jsx|json|ya?ml|toml|ini|cfg|xml|html|css|sql|java|kt|go|rs|rb|php|cs|tf|env|sh|ps1|csv|ipynb|dockerfile|gradle|properties|proto|graphql|r|scala)$/i;

const SKIP_DIR =
  /(^|\/)(node_modules|\.git|dist|build|\.next|__pycache__|\.venv|venv|target|\.idea|\.vscode)(\/|$)/i;

function normalize(path: string): string {
  return path.replace(/\\/g, "/").replace(/^\.\//, "");
}

function isTextPath(path: string): boolean {
  const base = path.split("/").pop() ?? path;
  if (/^dockerfile/i.test(base)) return true;
  if (/^makefile$/i.test(base)) return true;
  if (base.startsWith(".env")) return true;
  return TEXT_EXT.test(base);
}

function lower(s: string): string {
  return s.toLowerCase();
}

function includesAny(hay: string, needles: string[]): boolean {
  const h = lower(hay);
  return needles.some((n) => h.includes(lower(n)));
}

function bump(
  current: StageStatus,
  next: StageStatus
): StageStatus {
  if (current === "Critical Failure") return current;
  const order: StageStatus[] = ["Missing", "Needs Improvement", "Mature"];
  return order.indexOf(next) > order.indexOf(current) ? next : current;
}

function fail(): StageStatus {
  return "Critical Failure";
}

type FileHit = { path: string; content: string; size: number };

function stackFromFiles(paths: string[], contents: FileHit[]): string[] {
  const stack = new Set<string>();
  const joined = paths.join("\n").toLowerCase();
  const blob = contents.map((c) => c.content.slice(0, 4000)).join("\n").toLowerCase();
  if (paths.some((p) => p.endsWith("package.json"))) stack.add("Node.js / TypeScript");
  if (paths.some((p) => /pyproject\.toml|requirements\.txt|setup\.py$/.test(p)))
    stack.add("Python");
  if (includesAny(joined, ["langgraph", "langchain"])) stack.add("LangChain / LangGraph");
  if (includesAny(joined, ["airflow"])) stack.add("Apache Airflow");
  if (includesAny(joined, ["temporal"])) stack.add("Temporal");
  if (includesAny(joined, ["celery"])) stack.add("Celery");
  if (includesAny(joined, ["prefect"])) stack.add("Prefect");
  if (includesAny(joined, ["fastapi"])) stack.add("FastAPI");
  if (includesAny(joined, ["flask"])) stack.add("Flask");
  if (includesAny(joined, ["django"])) stack.add("Django");
  if (includesAny(joined, ["streamlit"])) stack.add("Streamlit");
  if (includesAny(joined, ["next.config", "app/page"])) stack.add("Next.js");
  if (includesAny(joined, ["docker-compose", "dockerfile"])) stack.add("Docker");
  if (includesAny(joined, [".github/workflows"])) stack.add("GitHub Actions");
  if (includesAny(blob, ["openai", "azure openai", "anthropic", "gemini"]))
    stack.add("Foundation-model API");
  if (includesAny(joined, ["terraform"])) stack.add("Terraform");
  if (includesAny(joined, ["kubernetes", "k8s", "helm"])) stack.add("Kubernetes");
  return [...stack];
}

function treePreview(paths: string[]): string[] {
  const top = new Map<string, number>();
  for (const p of paths) {
    const parts = p.split("/").filter(Boolean);
    const key = parts.slice(0, Math.min(3, parts.length)).join("/");
    top.set(key, (top.get(key) ?? 0) + 1);
  }
  return [...top.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 40)
    .map(([k, n]) => `${k}${n > 1 ? `  (${n})` : ""}`);
}

function readmeExcerpt(files: FileHit[]): string | null {
  const readme = files.find((f) => /readme/i.test(f.path));
  if (!readme) return null;
  return readme.content.replace(/\r/g, "").trim().slice(0, 900);
}

const SECRET_PATTERNS: { name: string; re: RegExp }[] = [
  { name: "AWS key", re: /AKIA[0-9A-Z]{16}/ },
  { name: "PEM private key", re: /-----BEGIN (RSA |EC |OPENSSH )?PRIVATE KEY-----/ },
  { name: "Generic API key assignment", re: /(api[_-]?key|secret[_-]?key|openai_api_key)\s*[:=]\s*['\"][^'\"]{8,}/i },
  { name: "Password assignment", re: /password\s*[:=]\s*['\"][^'\"]{4,}/i },
  { name: "Bearer token", re: /bearer\s+[A-Za-z0-9\-._~+/]+=*/i },
];

function securityHits(files: FileHit[]): string[] {
  const hits: string[] = [];
  for (const f of files) {
    if (/\.(md|txt|csv)$/i.test(f.path) && !f.path.includes(".env")) continue;
    for (const p of SECRET_PATTERNS) {
      if (p.re.test(f.content) && !/your[_-]?key|changeme|placeholder|xxx/i.test(f.content)) {
        hits.push(`${p.name} · ${f.path}`);
      }
    }
    if (/\beval\s*\(/.test(f.content) && /\.(py|js|ts)$/.test(f.path)) {
      hits.push(`Dynamic eval() · ${f.path}`);
    }
    if (/pickle\.loads|yaml\.load\s*\((?!.*Loader)/.test(f.content)) {
      hits.push(`Unsafe deserialize · ${f.path}`);
    }
    if (/execute\s*\(\s*[f\"'].*\+|f[\"'].*SELECT|\"SELECT .*\"\s*\+/.test(f.content)) {
      hits.push(`Possible SQL concat · ${f.path}`);
    }
  }
  return [...new Set(hits)].slice(0, 40);
}

function testFiles(paths: string[]): string[] {
  return paths
    .filter((p) =>
      /(^|\/)(tests?|__tests__|spec)(\/|$)|(\.|_)(test|spec)\.(py|ts|tsx|js|jsx)$/i.test(
        p
      )
    )
    .slice(0, 50);
}

function pathMatches(path: string, hints: string[]): boolean {
  return includesAny(path, hints);
}

function contentMatches(files: FileHit[], hints: string[]): FileHit[] {
  return files.filter((f) => includesAny(f.content, hints) || includesAny(f.path, hints));
}

export async function analyzeArchive(file: File): Promise<Assessment> {
  const zip = await JSZip.loadAsync(file);
  const paths: string[] = [];
  const files: FileHit[] = [];

  const entries = Object.values(zip.files);
  for (const entry of entries) {
    if (entry.dir) continue;
    const path = normalize(entry.name);
    if (SKIP_DIR.test(path)) continue;
    if (path.endsWith(".ds_store") || path.endsWith("thumbs.db")) continue;
    paths.push(path);
    if (!isTextPath(path)) continue;
    try {
      const content = await entry.async("string");
      if (content.length > 400_000) {
        files.push({ path, content: content.slice(0, 80_000), size: content.length });
      } else {
        files.push({ path, content, size: content.length });
      }
    } catch {
      // binary disguised as text
    }
  }

  const stack = stackFromFiles(paths, files);
  const tests = testFiles(paths);
  const secrets = securityHits(files);
  const blob = files.map((f) => `${f.path}\n${f.content}`).join("\n").toLowerCase();
  const pathBlob = paths.join("\n").toLowerCase();

  const stages: Record<number, StageEvidence> = {};

  for (const stage of FDE_STAGES) {
    const pathHits = paths.filter((p) => pathMatches(p, stage.probes.pathHints));
    const contentHits = contentMatches(files, stage.probes.contentHints).slice(0, 8);
    const evidence = [
      ...pathHits.slice(0, 6).map((p) => `path · ${p}`),
      ...contentHits.slice(0, 6).map((f) => {
        const hint = stage.probes.contentHints.find((h) =>
          lower(f.content).includes(lower(h))
        );
        return `content · ${f.path}${hint ? ` (“${hint}”)` : ""}`;
      }),
    ];
    const unique = [...new Set(evidence)];
    let status: StageStatus = unique.length === 0 ? "Missing" : "Needs Improvement";
    if (unique.length >= 4) status = "Needs Improvement";
    if (unique.length >= 3 && contentHits.length >= 2) status = "Needs Improvement";

    stages[stage.id] = {
      status,
      summary:
        unique.length === 0
          ? `No files or content matched the probes for “${stage.name}”.`
          : `Matched ${unique.length} artifact signal(s) for “${stage.name}”. Quality still requires a human read of the cited files.`,
      evidence: unique.length ? unique : ["No matching paths or content."],
      inferred: false,
    };
  }

  const hasReadme = paths.some((p) => /readme/i.test(p));
  const hasCharter = includesAny(pathBlob + blob, ["charter", "accepted outcome", "out of scope"]);
  const hasAdr = paths.some((p) => /adr|decision.record/i.test(p));
  const hasDomain =
    includesAny(blob, ["state machine", "transition"]) &&
    includesAny(blob, ["patient", "batch"]);
  const hasCoi = includesAny(blob, [
    "chain of identity",
    "chain_of_identity",
    "coi_id",
    "isbt",
  ]);
  const hasBlockingCoi =
    hasCoi && includesAny(blob, ["mismatch", "reject", "abort", "illegal transition"]);
  const hasHitl = includesAny(blob, ["human in the loop", "approval", "override"]);
  const hasEval = paths.some((p) => /eval|golden/i.test(p)) || includesAny(blob, ["eval case"]);
  const hasOtel = includesAny(blob, ["opentelemetry", "structlog", "prometheus", "correlation"]);
  const hasDocker = paths.some((p) => /dockerfile|compose/i.test(p));
  const hasAuth = includesAny(blob, ["oauth", "rbac", "jwt", "openid"]);
  const hasRunbook = includesAny(pathBlob, ["runbook", "rollback", "playbook"]);
  const orchestrators = [
    "airflow",
    "temporal",
    "prefect",
    "celery",
    "langgraph",
    "langchain",
    "crewai",
  ].filter((k) => pathBlob.includes(k) || blob.includes(k));
  const llmSpine =
    includesAny(blob, ["langgraph", "langchain", "crewai", "autogen"]) &&
    !includesAny(blob, ["deterministic", "state machine"]);
  const hasTests = tests.length > 0;
  const hasPilot = includesAny(blob, ["pilot", "shadow mode", "feature flag"]);
  const hasSlo = includesAny(blob, ["slo", "service review", "on-call", "oncall"]);

  const set = (id: number, status: StageStatus, summary: string, extra: string[] = []) => {
    const prev = stages[id];
    stages[id] = {
      status,
      summary,
      evidence: [...new Set([...extra, ...prev.evidence])].slice(0, 10),
      inferred: false,
    };
  };

  if (hasReadme) {
    set(
      1,
      bump(stages[1].status, "Needs Improvement"),
      "README / docs present — inherit is started, but confirm owners, freeze list, and what was actually sold vs built.",
      paths.filter((p) => /readme/i.test(p)).map((p) => `path · ${p}`)
    );
  }
  if (hasCharter || hasAdr) {
    set(6, bump(stages[6].status, "Needs Improvement"), "Charter or ADR language found. Check whether it names accepted outcome and stop conditions.");
  } else {
    set(6, "Missing", "No charter, ADR, or explicit in/out-of-scope language found. The zip name is not a substitute.");
  }
  if (hasDomain) {
    set(9, bump(stages[9].status, "Needs Improvement"), "Patient/batch plus transition language exists. Confirm illegal transitions are actually refused in code, not only described.");
  }
  if (llmSpine) {
    set(
      8,
      fail(),
      "Agent/graph framework appears without a documented deterministic spine. For CGT identity and slot exclusivity this is the wrong mechanism default.",
      orchestrators.map((o) => `framework · ${o}`)
    );
  } else if (orchestrators.length) {
    set(
      8,
      bump(stages[8].status, "Needs Improvement"),
      `Orchestration frameworks detected (${orchestrators.join(", ")}). Confirm COI/slot/disposition remain deterministic.`
    );
  }
  if (orchestrators.length >= 2) {
    set(
      14,
      fail(),
      `Multiple orchestration frameworks detected (${orchestrators.join(", ")}). Dual spines that both write batch status are a structural defect.`,
      orchestrators.map((o) => `framework · ${o}`)
    );
  } else if (orchestrators.length === 1) {
    set(14, bump(stages[14].status, "Needs Improvement"), "A single orchestration family is present. Confirm it is the sole writer of patient–batch state.");
  }
  if (hasCoi && hasBlockingCoi) {
    set(15, bump(stages[15].status, "Needs Improvement"), "COI language and mismatch/reject behavior found. This is necessary but not sufficient — verify every handoff is blocked, not logged.");
  } else if (hasCoi) {
    set(
      15,
      fail(),
      "COI appears as data, not as a blocking control (no mismatch/reject/illegal-transition signals). Identity-as-a-field is a patient-safety defect."
    );
  } else {
    set(
      15,
      fail(),
      "No Chain of Identity / ISBT language found. For autologous patient-to-batch orchestration this is a critical control gap."
    );
  }
  if (hasHitl) {
    set(10, bump(stages[10].status, "Needs Improvement"), "Approval/override language exists. Confirm the reviewer is shown identifiers and the rule that fired.");
  } else {
    set(10, "Missing", "No human-approval / override design found. A UI is not HITL.");
  }
  if (hasEval) {
    set(12, bump(stages[12].status, "Needs Improvement"), "Eval/golden artifacts exist. Require identity-swap and slot-collision cases before calling this mature.");
  } else {
    set(12, "Missing", "No eval plan, golden set, or safety-case artifacts found.");
  }
  if (hasTests && hasOtel) {
    set(16, bump(stages[16].status, "Needs Improvement"), `Tests (${tests.length}) and some observability signals exist. Still need identity scenario tests and correlation IDs on every material action.`);
  } else if (hasTests) {
    set(16, bump(stages[16].status, "Needs Improvement"), `${tests.length} test file(s) found. Observability/eval harness still weak.`);
  } else {
    set(16, "Missing", "No unit/integration test files found. Cannot prove identity or disposition behavior.");
  }
  if (hasPilot) {
    set(17, bump(stages[17].status, "Needs Improvement"), "Pilot / shadow / flag language found. Confirm named users, envelope, and fallback.");
  } else {
    set(17, "Missing", "No bounded-pilot protocol, shadow mode, or feature flag found.");
  }
  if (secrets.length) {
    set(
      18,
      fail(),
      `Secret or unsafe-execution patterns found (${secrets.length}). Do not deploy or connect to plant systems.`,
      secrets.slice(0, 5)
    );
  } else if (hasDocker && hasAuth) {
    set(18, bump(stages[18].status, "Needs Improvement"), "Containerization and auth signals exist. Still need validation strategy for COI/disposition and secret management.");
  } else if (hasDocker) {
    set(18, "Needs Improvement", "Runtime packaging exists without a clear auth/validation story. Not production-hardened.");
  } else {
    set(18, "Missing", "No container/IaC/auth/validation packaging found.");
  }
  if (hasRunbook) {
    set(19, bump(stages[19].status, "Needs Improvement"), "Runbook/rollback artifacts found. Confirm they are lot-aware compensating actions, not just process restart.");
  } else {
    set(19, "Missing", "No runbook, rollback, or cutover record found.");
  }
  if (hasSlo) {
    set(20, bump(stages[20].status, "Needs Improvement"), "Ownership/ops language found. Confirm named receiving owners and hypercare for in-flight lots.");
    set(21, bump(stages[21].status, "Needs Improvement"), "Operate-stage language found. Productization vs retirement of shadow tools still needs an explicit decision.");
  } else {
    set(20, "Missing", "No handoff, on-call, or operations pack found.");
    set(21, "Missing", "No SLO, service review, or retirement criteria found.");
  }

  const identitySwap = includesAny(blob, ["identity swap", "wrong patient", "mismatch test"]);
  if (!identitySwap) {
    stages[4] = {
      ...stages[4],
      status: stages[4].status === "Mature" ? "Needs Improvement" : stages[4].status === "Missing" ? "Missing" : "Needs Improvement",
      summary:
        stages[4].evidence[0] === "No matching paths or content."
          ? "No baseline/verifier artifacts. A demo path is not a measured baseline; QA/QP plus the COI packet must remain the verifier."
          : stages[4].summary,
    };
  }

  const findings: Finding[] = [];
  let i = 0;
  for (const [idStr, ev] of Object.entries(stages)) {
    const id = Number(idStr);
    if (ev.status === "Critical Failure") {
      findings.push({
        id: `cf-${id}-${i++}`,
        title: `Stage ${id} · ${FDE_STAGES[id - 1].name}`,
        detail: ev.summary,
        severity: "high",
        evidence: ev.evidence.slice(0, 4),
        stageIds: [id],
      });
    }
  }
  if (secrets.length) {
    findings.push({
      id: "secrets",
      title: "Credentials or unsafe execution in tree",
      detail: "Secret-like assignments, eval, or unsafe deserialize patterns were detected. Rotate anything real and keep this estate off plant networks.",
      severity: "high",
      evidence: secrets.slice(0, 6),
      stageIds: [18],
    });
  }
  if (!hasTests) {
    findings.push({
      id: "no-tests",
      title: "No automated tests",
      detail: "Identity and disposition behavior cannot regress-safely without tests. This blocks Stage 16 and Stage 18.",
      severity: "high",
      evidence: ["No files matched tests/, *_test.py, *.spec.ts"],
      stageIds: [16, 18],
    });
  }

  const strengths: Strength[] = [];
  if (hasReadme) {
    strengths.push({
      title: "Written entry point exists",
      body: "A README (or equivalent) gives inheriting FDEs a place to start. Tighten it into an engagement reframe: outcome, freeze list, owners.",
      evidence: paths.filter((p) => /readme/i.test(p)).slice(0, 3),
    });
  }
  if (hasDomain) {
    strengths.push({
      title: "Domain language is present",
      body: "Patient/batch and transition language is the right nucleus. Promote it to a guarded state machine that adapters cannot bypass.",
      evidence: stages[9].evidence.slice(0, 3),
    });
  }
  if (hasCoi) {
    strengths.push({
      title: "COI is at least named",
      body: "The estate knows Chain of Identity exists. The remediation is to make it a blocking control with dual identifiers, not more documentation.",
      evidence: stages[15].evidence.slice(0, 3),
    });
  }
  if (hasTests) {
    strengths.push({
      title: "A test tree exists to extend",
      body: "Do not rewrite tests from zero. Add identity-swap, slot-collision, and illegal-transition cases to whatever runner is already here.",
      evidence: tests.slice(0, 5),
    });
  }
  if (hasDocker) {
    strengths.push({
      title: "Runtime packaging started",
      body: "Docker/compose is a foothold for a reproducible slice. Pair it with pinned deps, no secrets in the image, and a non-root user.",
      evidence: paths.filter((p) => /docker/i.test(p)).slice(0, 4),
    });
  }
  if (strengths.length === 0) {
    strengths.push({
      title: "The outcome boundary is still the asset",
      body: "Even a messy tree named patient-to-batch is a better inheritance than a generic AI platform. Keep that fence while the strangler proceeds.",
      evidence: [file.name],
    });
  }

  const problems: Problem[] = findings
    .filter((f) => f.severity === "high")
    .slice(0, 8)
    .map((f) => ({
      title: f.title,
      body: f.detail,
      evidence: f.evidence,
      severity: f.severity,
    }));

  if (!hasBlockingCoi) {
    problems.unshift({
      title: "Chain of Identity is not a blocking control",
      body: "Autologous CGT cannot tolerate identity-as-a-field. Every handoff must refuse mismatch. This is the first strangler target.",
      evidence: stages[15].evidence.slice(0, 4),
      severity: "high",
    });
  }

  const { overallScore, overallLabel } = scoreFromStages(stages);

  return {
    source: "archive",
    archiveName: file.name,
    analyzedAt: new Date().toISOString(),
    fileCount: paths.length,
    stack: stack.length ? stack : ["Unidentified — see tree"],
    coreProblem:
      "Autologous cell and gene therapy is make-to-order: one patient is one batch. This archive is an orchestration estate whose original job is to keep a single identity thread intact from the enrolled patient through collection and a manufacturing slot until a batch is QC’d and human-released. The bound tree below is the evidence for how far that job was actually implemented versus how far it sprawled.",
    users: [
      {
        role: "Case manager / patient operations",
        job: "Enroll, keep the calendar honest, and see blockers before a collection day is wasted.",
      },
      {
        role: "Manufacturing planner / slot owner",
        job: "Hold, sequence, and recover plant slots when collection or courier reality changes.",
      },
      {
        role: "QA / QP",
        job: "Release or reject with a complete COI/COC and QC packet; never from a model summary alone.",
      },
      {
        role: "Manufacturing / MSAT",
        job: "Start the patient-specific batch with the correct starting material and process version.",
      },
      {
        role: "Forward deployed engineer",
        job: "Keep the spine truthful, observable, and change-controlled; stop dual writers to batch state.",
      },
    ],
    initialVsCurrent: {
      initial:
        "Named intent: Patient to Batch — bind identity, slot, manufacturing lot, and human disposition. Not a full vein-to-vein commercial platform.",
      current: `Bound tree contains ${paths.length} files. Stack: ${
        stack.join(", ") || "unidentified"
      }. Tests: ${tests.length}. Secret/unsafe hits: ${secrets.length}. Orchestrators: ${
        orchestrators.join(", ") || "none detected"
      }. Read the stage map for where the sprawl actually sits.`,
    },
    strengths,
    problems: problems.slice(0, 8),
    stages,
    findings,
    treePreview: treePreview(paths),
    securityHits: secrets,
    testFiles: tests,
    readmeExcerpt: readmeExcerpt(files),
    overallScore,
    overallLabel,
  };
}
