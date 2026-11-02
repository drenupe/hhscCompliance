# ENG-028 — Repository Build, Test, and Runtime Verification

**Program:** McCaskill Projects — Regulatory Intelligence Platform  
**Version:** 1.0 — Evidence-Based Draft  
**Proposed repository path:** `docs/engineering/28-repository-build-test-and-runtime-verification.md`  
**Assessment source:** User-supplied `hhscCompliance-develop.zip`  
**Assessment type:** Read-only extraction, configuration inspection, and bounded offline dependency installation attempt  
**Implementation authorization:** **NOT GRANTED**  
**Architecture approval (ENG-024):** **PENDING**  
**Overall executable readiness:** **BLOCKED / NOT ESTABLISHED**

## 1. Purpose
Establish reproducible evidence of which repository build, test, migration, API, frontend, and integration pathways actually work. A configuration's presence is not evidence that its task passes. This report distinguishes **Observed**, **Passed**, **Failed**, **Blocked**, and **Not Run**.

## 2. Scope and assessment boundaries
The uploaded ZIP was extracted to an isolated assessment directory. The original ZIP was not modified. No application source was changed, no database was connected, no credentials were used, no migration was applied, and no deployment was performed. This assessment is not a production readiness certification.

## 3. Evidence and reproducibility
- Source artifact: `hhscCompliance-develop.zip` (archive provided by user).
- Source root in ZIP: `hhscCompliance-develop/`.
- Local assessment: `/mnt/data/eng028_work/hhscCompliance-develop/` (ephemeral workspace, not a repository destination).
- Local Node: `v22.16.0`; npm: `10.9.2`.
- Repository CI configuration specifies Node **20** (`.github/workflows/ci.yml`). **Version mismatch: local assessment environment is not the CI reference environment.**
- Repository contains `package-lock.json` and no bundled `node_modules` directory.
- Dependency installation was attempted in offline mode only; see Section 7.
- Archive timestamp and contents establish a snapshot, not the state of any later live branch.

## 4. Status definitions
| Status | Meaning |
|---|---|
| PASS | Command executed and met documented assertion |
| FAIL | Command executed with a verified product/build/test failure |
| BLOCKED | Prerequisite absent; outcome cannot be attributed to product correctness |
| NOT RUN | Execution not attempted |
| OBSERVED | File/configuration/source exists; functionality not demonstrated |
| NEEDS REVIEW | Contract or architecture interpretation remains unresolved |

## 5. Repository-level observations
- Root `package.json` defines npm scripts for server/web build, server/web dev, lint, tests, E2E, and TypeORM migration operations.
- `server/project.json` declares `build`, `prune-lockfile`, `copy-workspace-modules`, `prune`, `serve`, `serve:debug`, `serve:watch`, and `test` targets.
- `web/project.json` declares `build`, `serve`, `preview`, `test`, and `lint` targets.
- `.github/workflows/ci.yml` defines `npm ci --legacy-peer-deps` followed by `npx nx affected -t lint test build`.
- `nx.json` declares `defaultBase: master`.
- The archive contains 34 `project.json` files by filesystem count; **this is not a verified count of valid Nx projects**, which requires Nx project graph execution.

## 6. Execution matrix — assessment results
| Verification | Status | Evidence / explanation |
|---|---|---|
| ZIP extraction | PASS | Archive extracted into isolated assessment workspace |
| Node executable | PASS | `node -v` returned `v22.16.0` |
| npm executable | PASS | `npm -v` returned `10.9.2` |
| npm lockfile present | OBSERVED | `package-lock.json` present |
| npm dependencies installed | BLOCKED | Offline npm cache missing a required package |
| CI-equivalent Node 20 | NOT RUN | Available local runtime was Node 22 |
| Nx project graph | BLOCKED | Dependencies unavailable |
| Server production build | BLOCKED | Dependencies unavailable |
| Web production build | BLOCKED | Dependencies unavailable |
| Root lint / affected lint | BLOCKED | Dependencies unavailable |
| Server unit tests | BLOCKED | Dependencies unavailable |
| Web unit tests | BLOCKED | Dependencies unavailable |
| Server E2E tests | BLOCKED | Dependencies and runtime prerequisites unavailable |
| Web E2E tests | BLOCKED | Dependencies and runtime prerequisites unavailable |
| Database connectivity | NOT RUN | No approved database connection or environment |
| Migration dry run / validation | NOT RUN | Database and approved safe environment absent |
| API startup and health check | BLOCKED | Dependencies and environment unavailable |
| Web startup and browser smoke test | BLOCKED | Dependencies unavailable |
| RKE/FKE knowledge certification tests | NOT RUN | Executable suite identification and prerequisites pending |
| End-to-end regulatory / financial workflows | NOT RUN | Integrated services and fixtures unavailable |
| Deployment | NOT RUN | Explicitly outside assessment authorization |

**Do not interpret BLOCKED as FAIL or PASS.**

## 7. Actual dependency-installation attempt
**Command executed** from extracted root:

```bash
npm ci --offline --legacy-peer-deps --ignore-scripts --no-audit --no-fund
```

**Observed result:** Exit code `1`, `npm error code ENOTCACHED`. The npm cache did not contain `zone.js-0.15.1.tgz`; npm reported that its registry request could not be satisfied in cache-only mode. The command therefore **did not establish dependency integrity, package compatibility, or build correctness**. The `--ignore-scripts` option also means that a hypothetical successful offline install would not have been a CI-equivalent installation. This was an intentionally bounded diagnostic, not an application test.

**Required remediation for verification:** Run `npm ci --legacy-peer-deps` in a controlled Node 20 environment with approved registry access, lockfile integrity checks, and an auditable log. Do not treat this as approval to upgrade or change dependencies.

## 8. Reference execution environment
Use Node 20 as defined by the checked-in CI workflow; pin an exact patch version for repeatability. Record OS image, CPU architecture, npm version, git commit SHA, archive checksum, environment-variable *names only*, database engine/version, and package registry configuration. Never embed tokens, passwords, or personal information in evidence logs.

## 9. Evidence capture convention
For each task retain: test ID, commit/archive SHA, timestamp, operator, command, environment fingerprint, exit code, elapsed time, stdout/stderr location, artifact checksums, defect ticket, and final disposition. A green command without traceable logs is insufficient for a release gate.

## 10. Nx graph verification
After dependencies are installed, execute:

```bash
npx nx show projects --json
npx nx graph --file=artifacts/nx-project-graph.json
npx nx report
```

Confirm all declared projects resolve, imports obey boundaries, circular dependencies are identified, and project tags align with the approved six-layer architecture. These commands are **proposed; not executed**.

## 11. Build verification
Execute in a controlled environment:

```bash
npx nx build server --configuration=production
npx nx build web
```

Record task-level results and build artifacts; inspect Angular budget warnings, NestJS bundling, source-map handling, environment injection, and generated server startup path. Check that root `start` script (`node dist/api/main.js`) matches the actual server build output. **Potential path mismatch is a validation question, not a confirmed defect.**

## 12. TypeScript verification
Discover the actual tsconfig graph before running targeted `tsc --noEmit`. Do not assume all libraries share a single tsconfig. Record errors by project, source file, error code, and architectural ownership. Preserve exact compiler versions from lockfile.

## 13. Lint and dependency constraints
Use Nx's actual target inventory rather than assuming every project implements `lint`. Verify `npx nx affected -t lint test build` against the CI base/head context and run a full project-level sweep for initial baselining. Separate missing targets from failing targets.

## 14. Unit tests
Run the declared `server:test` and `web:test` targets first, then discover and run library tests. Capture test counts, skipped tests, runtime, coverage if configured, and flaky rerun results. A file named `*.spec.ts` is not proof of test execution.

## 15. End-to-end tests
Identify whether `server-e2e` and `web-e2e` projects actually exist and resolve. Configure isolated database fixtures, deterministic tenant identities, and browser automation only after authorization. Verify cross-tenant denial and safe failure paths, not merely happy-path navigation.

## 16. Backend startup
Use approved nonproduction credentials and `npx nx serve server` or the production output command. Verify boot, dependency injection, database initialization policy, logging, `/api/v1` routing, health checks, shutdown, and unauthorized request behavior. Never run migrations implicitly against a shared environment.

## 17. Frontend startup
Use `npx nx serve web` in an isolated environment. Verify route loading, authentication redirects, NgRx hydration, provider-wide dashboard without required `locationId`, deep links, empty/error/loading states, and browser console errors. Check responsive behavior and keyboard accessibility.

## 18. Database and TypeORM migration safety
Inventory migrations and data-source configuration, then use a disposable database restored from an approved sanitized fixture. Compare schema state before and after migration, verify ordering, idempotence expectations, rollback policy, and drift. **No migration was run in this assessment.**

## 19. API contract verification
Discover controller routes and DTO validation; reconcile with ENG-009. Test auth, tenant scope, paging, filtering, errors, and contract compatibility. Check provider-wide vs location-scoped endpoints and explicit access checks on documents, findings, binders, and reports.

## 20. Regulatory Knowledge Engine verification
Test source provenance, effective dates, applicability, pack validation, certification approval, immutable published versions, and historical reproducibility. Source files alone do not establish certified regulatory behavior. Texas HCS Emergency Preparedness is the priority regulatory vertical slice.

## 21. Financial Knowledge Engine verification
First determine which financial modules actually exist. Do not infer a completed FKE from payroll or general financial records. Validate authority separation, decimal precision, classifications, allocations, rates, formulas, independent approval, versioning, and historical replay. Texas HCS Cost Reporting is the priority financial slice.

## 22. Shared Intelligence verification
Verify evidence storage and references, approval controls, event delivery/idempotence, audit immutability, historical execution context, and binder lifecycle. Shared services execute governed knowledge; they do not author regulatory or financial policy.

## 23. Applied Intelligence verification
Trace compliance evaluations through findings, correction, CAP, reassessment, and dashboard. Trace financial determinations through reconciliation, report generation, approval, and binder release. Verify every determination identifies the exact knowledge-pack version and input snapshot.

## 24. Operational Domain verification
Validate provider, location, person, workforce, residential, ISS, payroll, contracts, and financial transaction ownership. Confirm operational facts are not silently promoted into regulatory or financial authority.

## 25. Security and privacy tests
Run tenant-isolation, role-permission, least-privilege, object-level authorization, document ACL, binder access, external surveyor expiration/revocation, sensitive-field masking, audit integrity, and secret-scanning tests. Do not place real PHI, PII, SSNs, or production tokens into fixtures or logs.

## 26. Vertical-slice acceptance
- **Regulatory:** Texas HCS Emergency Preparedness — source → validated pack → certification → applicability → operational evidence → determination → remediation → historical replay.
- **Financial:** Texas HCS Cost Reporting — source → approved methodology → operational facts → calculations → reconciliation → report → binder → historical replay.
- **Operational/UX:** ISS — goals and activities → service records → evidence → authorized review; a conceptual six-hour program day is not automatically billable.

Each slice requires traceable tests and explicit approver signoff; all are **NOT RUN** here.

## 27. CI/CD parity
The checked-in CI runs on push to `master` and pull requests; it installs with `npm ci --legacy-peer-deps` and executes affected lint/test/build. Verify that required branch protections, full baseline checks, artifact retention, migration tests, security checks, and deployment gates exist before relying on CI for release decisions. CI configuration presence does not prove CI has ever passed.

## 28. Performance, reliability, and recovery
Define test datasets and SLOs before measuring dashboard query performance, evaluation throughput, binder assembly time, event retry behavior, database restore, and historical replay. No performance measurements were collected.

## 29. Defect and blocker register
| ID | Type | Finding | Action | Status |
|---|---|---|---|---|
| B-028-01 | Environment blocker | Offline npm cache lacks required `zone.js` package | Controlled online `npm ci` | OPEN |
| B-028-02 | Environment mismatch | Local Node 22 vs CI Node 20 | Re-run on Node 20 | OPEN |
| B-028-03 | Evidence gap | No executable build/test results | Run matrix after install | OPEN |
| B-028-04 | Access blocker | No approved disposable DB/environment | Provision sanitized test environment | OPEN |
| B-028-05 | Governance blocker | ENG-024 architecture approval pending | Complete reconciliation and approval | OPEN |
| Q-028-01 | Validation question | Confirm server output path vs root start script | Inspect actual build output | OPEN |

No code defect is asserted from the offline dependency-cache failure.

## 30. Repository inventory crosswalk
ENG-027 is the static inventory baseline. For each library/project append: actual target names, dependency install status, compile result, test result, test count, runtime result, architectural mapping, unresolved defects, owner, and evidence link. **Do not fill PASS from source-code inspection alone.**

## 31. Reuse / Modify / Replace / Build New decisions
Defer final decisions until both ENG-024 approval and executable evidence exist. For each component document functional coverage, contract alignment, security evidence, migration cost, technical debt, data compatibility, and recommendation rationale. Do not equate compilation with architectural suitability.

## 32. Verification sequence
1. Approve ENG-024 canonical contracts and architecture baseline.
2. Freeze source snapshot and capture hash/commit.
3. Provision Node 20 and approved registry access.
4. Install locked dependencies and record result.
5. Validate Nx graph, TypeScript, lint, server/web builds.
6. Run unit, integration, and E2E suites.
7. Provision disposable database; verify migrations.
8. Run API/frontend startup and security smoke tests.
9. Execute three vertical-slice acceptance suites.
10. Reconcile ENG-027 inventory and publish evidence-backed disposition decisions.

## 33. Gate criteria
**G1 Environment Ready:** exact toolchain, locked dependencies, isolated fixtures.  
**G2 Build Green:** graph, server/web compilation, relevant lint.  
**G3 Test Green:** approved unit/integration/E2E coverage and defect thresholds.  
**G4 Runtime Green:** startup, database, API, UI, security.  
**G5 Domain Green:** regulatory, financial, ISS slices and historical replay.  
**G6 Architecture Approved:** ENG-024 and repository gap disposition signed off.

**Current gate status: none certified as passed.**

## 34. Required approvals
Architecture owner, engineering lead, security/privacy reviewer, regulatory knowledge owner, financial knowledge owner, and release authority sign the applicable gates. Approval is a recorded decision, not an inference from test success.

## 35. Current conclusion
The uploaded repository contains build/test configuration and a CI workflow, but executable health is **not established**. The only attempted dependency installation was blocked by unavailable offline cache content; the build, test, migration, startup, and vertical-slice suites remain unexecuted. This is an **evidence-based assessment of verification readiness**, not a declaration that the code works or fails.

## 36. Next engineering deliverable
**ENG-029 — Architecture Reconciliation Decision Register and Remediation Roadmap** should consolidate ENG-024's unresolved design contracts, ENG-027's static inventory, and ENG-028's verified/blocking results into explicit decisions. It must not authorize implementation before governance signoff.
