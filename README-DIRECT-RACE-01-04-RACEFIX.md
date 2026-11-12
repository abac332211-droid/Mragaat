# DIRECT-RACE-01..04 — RC3-DEV race-fix acceptance record

## Decision

**PASS at Chromium controlled-mock level after the race fix.** The four race windows were tested in two modes across three separate Chromium processes: UI event attempts to switch to B, and forced replacement of mutable global target state while A was suspended. All **24/24 executions** resolved safely; **288/288 assertions passed**. B remained byte-identical in every execution, and transaction evidence continued to identify A.

This is not a native File System Access API or physical-disk test. Production reachability remains **UNPROVEN**.

## Source identity and preservation

- Baseline: `raqee3-v8.0.0-rc3-dev.html`
- Baseline size: `483,593` bytes
- Baseline SHA-256: `ebdb9c9f34f09c094d394bda897555758efe7aad9f30e43b41f1bd5fb7b873ed`
- Baseline Git Blob SHA-1: `0ec3926eb43315be86085e0cc275c525ea5ac845`
- Fixed work copy: `raqee3-v8.0.0-rc3-dev-racefix.html`
- Fixed copy size: `492,397` bytes
- Fixed copy SHA-256: `29f454fbf77a3e78336a8ca82ec01843ed8e2dff42a27cd911b5879e85573632`
- Fixed copy Git Blob SHA-1: `48d8379c8fad38cb7d839b3a8369f252b56a4eeb`
- RC2 reference SHA-256: `8b7357295f333a44b861d03d555b86b475df53bc1227b9cb5f195026bd4fda9c` (unchanged)
- The baseline RC3-DEV and RC2 files were not modified. No repository write or archive upload was performed in this build operation.

## Remediation applied in the separate work copy

1. Capture a transaction context before the first asynchronous file operation: immutable file handle, file name, selected target name, load/raw tokens, raw-file metadata/hash promise, encoding, BOM state, opened snapshot, source text, and patch snapshots.
2. Route freshness reads, backup reads, primary writes, post-write verification, rollback writes/reads, and final evidence-byte reads through the captured handle — never the mutable global handle.
3. Lock target-changing controls while a direct-write transaction is active: direct picker, file input, clear, clean, and target undo. Add explicit event-handler guards so a programmatically dispatched event cannot bypass the visual disabled state.
4. Validate transaction identity and input snapshots after asynchronous reads and immediately before the first write. If the identity changed before any byte is written, cancel explicitly with `direct-write-cancelled`.
5. If the selected UI target changes after a write has begun, keep verification/rollback/evidence pinned to the original handle. Do not overwrite the newly selected target's in-memory state or evidence identity.
6. Do not initiate rollback when the primary write has not begun. A writer created but not yet used is aborted; no redundant backup write is performed.
7. Bind evidence serialization and deferred target-hash completion to the captured transaction identity, rather than whichever target is globally selected later.

The exact unified diff is included as `RC3-DEV-to-RACEFIX.patch`. It was applied to a fresh copy of the baseline and the resulting bytes matched the fixed HTML **byte-for-byte**.

## Acceptance matrix

- Race windows: 01 freshness-read, 02 backup-byte-read, 03 createWritable pending, 04 post-write readback pending.
- Swap modes:
  - **UI:** dispatch a direct picker event during the suspended transaction. The implementation rejects the switch while busy.
  - **FORCED:** bypass UI listeners and replace the mutable global handle/name/target state with B while A is suspended. This tests the pinned-context guard independently of the disabled controls.
- Three separate Chromium processes ran all eight cases each.

| Mode / window | Result |
|---|---|
| UI RACE-01..04 | A is patched and byte-verified; B remains unchanged; evidence/UI identify A. |
| FORCED RACE-01 | Transaction cancelled before first write; A and B remain unchanged; evidence identifies A. |
| FORCED RACE-02 | Transaction cancelled during backup preparation before first write; A and B remain unchanged; evidence identifies A. |
| FORCED RACE-03 | Writer is aborted after identity check fails and before `write()`; A and B remain unchanged; evidence identifies A. |
| FORCED RACE-04 | A was already written when identity changes; verification and evidence stay pinned to A; B remains unchanged and the UI does not relabel the A save as a B save. |

## Byte-level invariants

| Item | Size | SHA-256 |
|---|---:|---|
| A before | 949 | `1e32bcc37093e4248951245d92354805ed105172c8a1c50811981cbf6b5ac87b` |
| B before | 51 | `7402f922922028f2963ed0ed380a7fd65b82529d9b67a67413bd2403cf4800dd` |
| A patched output | 1,156 | `17b5deb059dbe0a73cc7828b106113242c91aeda4879a14305c63cfc9bacc83c` |

The exact before/after hashes, sizes, evidence identities, and write/abort counters for all 24 executions are in `A-B-byte-ledger.csv` and the JSON run records. The full JSON also retains base64 byte snapshots for reconstruction.

## Repeatability and static checks

- Executions: **24/24 safe** (8 test cases × 3 separate Chromium processes).
- Assertions: **288/288 passed**.
- B byte preservation: **24/24**.
- Transaction identity consistency: **24/24**.
- Behavioral repeatability across Chromium processes: `true`.
- Inline JavaScript: 2 script blocks; both passed `node --check`.
- Python harness: passed `py_compile`.
- Patch application: PASS; output was byte-for-byte identical to the fixed HTML.
- Fixed HTML was byte-identical before and after its test run.

## Limits and non-claims

- The browser executed the actual HTML and its real DOM/event handlers in Chromium `144.0.7559.96`.
- A and B were deterministic in-memory `FileSystemFileHandle`-like fixtures.
- Native `showOpenFilePicker()`, native File System Access implementation, permission persistence, OS-level file handles, and physical disk writes were **NOT TESTED**.
- Production reachability remains **UNPROVEN**.
- This artifact does not close `DIRECT-02`; native FSA integration and production reachability remain outstanding.
- The separate DIRECT-02 warning-display issue identified previously was not part of this patch's scope and is not claimed fixed here.

## Current engineering status for this work item

- `DIRECT-RACE-01..04`: `VERIFIED_AT_CHROMIUM_MOCK_LEVEL_AFTER_FIX`
- `DIRECT-02`: `OPEN` — native FSA and production reachability pending
- `RC3-DEV-RACEFIX`: `MOCK-VALIDATED`, not release accepted
- `RC3-DEV` baseline: unchanged
- `RC2`: unchanged and remains `BLOCKED`
- Repository: no source change, archive upload, commit, or deletion performed by this operation
