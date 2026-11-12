# P0 Baseline Report — 2026-11-12 (Updated)

## 1. Decision

**`P0_TECHNICAL_AUDIT_COMPLETE_REPOSITORY_CLOSURE_PENDING`**

This report does not declare P0 closed or accepted. The repository baseline audit is documented, but repository closure still requires the documentation commit, post-commit verification, independent review, and explicit acceptance by the authorized project owner. P1 remains blocked.

## 2. Repository identity and revision tracking

- Repository: `abac332211-droid/Mragaat`
- Branch: `review/direct-racefix2-native-fsa`
- Current branch HEAD observed before this documentation update: `c244624325209a2fa9730f46e3fb8bf9c7729a84`
- Current HEAD parent: `b12f6c39edf3c7aff111803af0dea36d5ffadba8`
- Current HEAD tree: `3eaa900878b3d2ca4b01a7243f91f2239672bc33`
- Current HEAD commit message: `Update EXECUTION-LOG.md`
- Baseline snapshot described by the existing manifest: `c4a4eabdebd3062df14fb5d88a0b8c1c2588139d`
- Baseline snapshot parent: `22e49049f9114b812a491e774099961b06a99425`
- Baseline snapshot tree: `ac1c80a11e6683174710848019dd77b0031a6a1e`

The baseline snapshot and the current branch HEAD are different revisions. Do not describe the baseline manifest as a manifest of the current HEAD.

The baseline manifest contains 60 file records totaling 5,129,851 bytes. The subsequent branch comparison reported five changed documentation files and a current branch inventory of 63 files totaling 5,155,252 bytes. These branch-wide counts must be recomputed from the exact post-update commit before acceptance; they are not a substitute for that verification.

## 3. Manifest scope and integrity

`docs/BASELINE-MANIFEST.json` describes the `c4a4eab...` baseline snapshot. It contains path, byte-size, Git Blob SHA-1, and SHA-256 fields for 60 files.

Important distinctions:

- Git Blob SHA-1 identifies the Git blob using Git's object format.
- SHA-256 is a content digest of the file bytes.
- These values are not interchangeable.
- A valid-looking SHA-256 string is not proof that the digest was recomputed from the actual file bytes.
- The existing manifest must not be silently relabeled as describing `c244624...` or the later documentation-update commit.

For the final P0 verification, the reviewer must either:
1. verify the existing manifest strictly against its declared baseline commit; or
2. require a separately generated manifest for the final HEAD if the project intends the manifest to represent that final tree.

Do not manually edit hashes or sizes to force reconciliation.

## 4. Archive and evidence inventory

`docs/ARCHIVE-INVENTORY.md` records six historical ZIP archives that are absent from the baseline HEAD and preserved in Git history.

The inventory records archive sizes, Git Blob SHA-1 values, SHA-256 values, source commits, selected contents, shared-name distinctions, and fixture groups.

Limitations remain explicit:
- Not every ZIP payload was decompressed.
- Not every extracted entry was independently rehashed.
- Therefore, the inventory does not establish full CRC or per-entry payload verification.
- The archives must not be restored to the working tree or deleted from history as part of P0 closure without a separate authorized decision.

## 5. Reconciliation findings

The baseline audit recorded six findings:

1. **`SHA256SUMS.txt` scope:** the current file described by the baseline report is a nine-file FOLDER-LOG package checksum list, not a repository-wide manifest. An older v1.1.8 note is stale for the audited snapshot.
2. **Fixture identity:** three fixture groups must remain distinct: DIRECT-RACE mock A949/B51; DIRECT-02 FINAL A1213/B174; and DIRECT-02 Runner v1.1.9 A1213/B51. Identify them by size and SHA-256, not filename alone.
3. **Runner v1.1.9:** one report records 7/8 forced PASS and is incomplete. The later report records 8/8 forced PASS but remains `NOT_AUTHORIZED`; `reference_run_status=NOT_EXECUTED`, `native_fsa_status=NOT_ATTESTED`, and `closure_authorized=false`.
4. **Archives:** six ZIPs are historical and absent from the audited HEAD, while preserved in Git history. Do not claim they were deleted from history.
5. **PR-2 candidate:** the cited design review is static. The execution report references candidate hash `c9494321...`, but the candidate file was absent from the audited HEAD. Treat the report as report-only until the exact source artifact is supplied and verified.
6. **CASRAI:** it appears as a cautionary term in the plan; it was not used operationally in this baseline audit, and no implementation is inferred.

These findings are audit observations, not independent acceptance decisions.

## 6. Test and implementation boundaries

- DIRECT-RACE pre-fix report: 12/12 race reproductions, 51/72 assertions, and 12 invariant failures; mock Chromium.
- RACEFIX report: 24/24 safe and 288/288 assertions across three Chromium runs; mocked FileSystem, not real Native FSA.
- DIRECT-02 FINAL reports: six forced PASS and two additional PASS results using the A1213/B174 fixture group.
- Runner v1.1.9 reports do not attest Native FSA and do not authorize closure.
- V3-v5 is static review only; the runner was not executed; V3 remains BLOCKED.
- A reported `PASS` is not independent reproduction, Native FSA attestation, `ACCEPTED`, or release approval.

## 7. Files in this documentation update

### Replace

1. `docs/STATUS.md`
2. `docs/EXECUTION-LOG.md` — use the supplied complete replacement, which preserves the earlier log entries and adds P0-005.
3. `docs/P0-BASELINE-REPORT-2026-11-12.md`

### Preserve unchanged

1. `docs/BASELINE-MANIFEST.json`
2. `docs/ARCHIVE-INVENTORY.md`
3. `docs/MASTER-DEVELOPMENT-PLAN.md`
4. `AGENTS.md`

The manifest and archive inventory are not being regenerated in this documentation-only update. Their declared scope and limitations must remain visible.

## 8. Acceptance checklist

- [ ] Replace the three files listed in Section 7 on `review/direct-racefix2-native-fsa`.
- [ ] Preserve all historical execution-log entries; append new entries rather than deleting prior evidence.
- [ ] Preserve `AGENTS.md` and `docs/MASTER-DEVELOPMENT-PLAN.md` unchanged.
- [ ] Commit the documentation update and record the resulting commit SHA.
- [ ] Independently inspect the exact final commit and tree.
- [ ] Recompute file counts and byte totals from that exact tree.
- [ ] Recompute SHA-256 from the actual bytes of each file being verified.
- [ ] Verify Git Blob SHA-1 values against the exact commit tree.
- [ ] Verify the existing manifest against its declared `c4a4eab...` baseline, or generate a distinct manifest for the final HEAD if required.
- [ ] Independently review archive source mapping, fixture identity, all six reconciliation findings, and the stated test boundaries.
- [ ] Record the independent reviewer's identity, reviewed commit SHA, evidence examined, findings, limitations, and decision in a review artifact.
- [ ] Obtain and record explicit `P0_ACCEPTED` approval from the authorized project owner, including date and review reference.

**P1 must not start until every required item is satisfied and P0 acceptance is explicitly recorded.**

## 9. Scope exclusions

This update does not modify application code, `main`, release artifacts, or historical ZIP contents. It does not merge branches, authorize Native FSA, attest real filesystem writes, or declare P0 accepted. The documentation files are prepared for manual replacement; no GitHub commit is created by this package.
