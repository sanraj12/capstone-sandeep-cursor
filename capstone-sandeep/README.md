# CGT Patient-to-Batch Orchestration — FDE Architectural Assessment

Interactive briefing for an inherited **cell and gene therapy (CGT) patient-to-batch orchestration** estate. It reverse-engineers the original operational problem, scores the brownfield against a **21-stage AI FDE operating model**, and lays out a strangler-fig remediation plan that a Senior FDE Architect can run.

This is an assessment workbench, not a manufacturing execution system. Do not point it at a plant network.

## What you get

- **Executive summary** of the original problem (one patient = one batch), intended users, and the gap from the named intent (`Patient_to_Batch`) to brownfield sprawl.
- **Strengths** worth protecting (outcome boundary, implied scope fence, strangler substrate).
- **Debt and risk** ranked by harm: Chain of Identity as a control, inverted AI-in-the-spine mechanism selection, missing evals, dual orchestrators, secrets.
- **Stage-by-stage map** of all 21 FDE stages with exit criteria, expected artifacts, and a CGT-specific lens.
- **Remediation waves** (freeze → extract spine → identity/HITL → prove/pilot → harden/operate) plus governance gates.
- **AI fit** — where rules, ML, RAG, GenAI, and agents belong, and which steps are forbidden as AI.
- **Build AI** — model comparison, vector DB decision, knowledge-base planes, and implementation steps.
- **Azure architecture** — system diagrams, three ADRs, and the selected Azure stack.
- **Presentation Q&A** — every Cohort-2 final-presentation question, answered from this workbench (not invented zip CSVs). Printable copy: [`docs/PRESENTATION_QA.md`](docs/PRESENTATION_QA.md).
- **Zip inspector** — drop `AI_FDE_CGT_Patient_to_Batch_Orchestration.zip` to replace inferred ratings with path- and content-level evidence.

The standing narrative also lives in [`docs/ASSESSMENT.md`](docs/ASSESSMENT.md).

## Download the complete repository

In the running workbench, click **Download complete repo** (top right). That packs this source tree into `capstone-sandeep.zip` (no `node_modules`, `.next`, or `.git`). Direct URL: `/api/download-repo`.

After unzip on Windows:

```bash
cd capstone-sandeep
npm install
npm run dev
```

Open [http://127.0.0.1:43217](http://127.0.0.1:43217).

To clone with git instead (WSL — Origin CLI is not available in PowerShell):

```bash
curl -fsSL https://downloads.cursor.com/origin/install.sh | sh
origin auth login
origin repo clone eygds-fde-naidu/capstone-sandeep
```

Repo page: [https://cursor.com/codebase/eygds-fde-naidu/capstone-sandeep](https://cursor.com/codebase/eygds-fde-naidu/capstone-sandeep) (private — change visibility in settings on that page).

## Run locally

Requires Node.js 20+.

```bash
npm install
npm run dev
```

Open [http://127.0.0.1:43217](http://127.0.0.1:43217).

Production-style:

```bash
npm run build
npm start
```

## Bind the source archive

The original Windows paths (`Downloads\21 Stage AI_FDE_Operating_Model.pdf` and `Downloads\Capstone-EY-Batch 2\AI_FDE_CGT_Patient_to_Batch_Orchestration.zip`) are not readable from this environment. Until you bind the zip:

- Stage ratings are **inferred** from artifact identity and CGT / FDE domain analysis.
- Critical stages (risk ceiling, blocking COI, production hardening) default to **Critical Failure** — the safe default for autologous identity workflows.

Drop the zip on the banner (or use **Bind zip**). The inspector reads the tree in the browser, detects stack/orchestrators/tests/secrets, and rewrites stage evidence. No upload to a server is required.

## 21-stage rubric (encoded here)

| Phase | Stages | Question the gate answers |
| --- | --- | --- |
| Discover & Frame | 1–6 | What is the work, the verifier, the risk ceiling, and the charter? |
| Design the Change | 7–12 | Data planes, smallest mechanism, domain model, HITL, contracts, evals |
| Build & Prove | 13–17 | Vertical slice, one spine, blocking COI, tests/traces, bounded pilot |
| Launch & Operate | 18–21 | Validation, lot-aware cutover, ownership, productize or retire |

The full definitions, exit criteria, and CGT lenses are in `lib/fde-stages.ts` and on the **FDE map** page.

## Safety note

Autologous CGT never-events: identity mismatch and unsupervised batch release. This workbench will not green-light plant integration until Stages 12, 15, 16, and 18 have bound evidence.
