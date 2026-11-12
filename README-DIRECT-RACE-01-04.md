# DIRECT-RACE-01–04 — RC3-DEV race reproduction record

## Decision

**Race reproduced in Chromium with controlled in-memory file-handle fixtures.** All four asynchronous handle-swap windows reproduced the unsafe outcome in three separate Chromium processes (12/12 executions). The four scenarios are controlled operational definitions for this test campaign; they are not claims that an earlier formal test specification existed.

## Source identity and preservation

- Tested source: `raqee3-v8.0.0-rc3-dev.html`
- Size: `483593` bytes
- SHA-256 before: `ebdb9c9f34f09c094d394bda897555758efe7aad9f30e43b41f1bd5fb7b873ed`
- SHA-256 after: same
- Source file changed: `false`
- Repository changed: `false`
- RC2 changed: `false`

## Runtime and scope

- Browser: Chromium `144.0.7559.96`
- Three separate Chromium processes; each ran all four races.
- Actual RC3-DEV HTML, UI event handlers, state variables, and asynchronous save flow were executed.
- The file A/B handles were deterministic in-memory FileSystemFileHandle-like fixtures. The picker was routed through the application button; its returned handles were test fixtures.
- `showOpenFilePicker()` native OS dialog, native File System Access implementation, and physical disk writes were **NOT TESTED**.
- Production reachability remains **UNPROVEN**. The test proves the race behavior in the actual application code under controlled handle semantics, not that the native browser API exposes the exact same timing on a user device.

## Race windows

| ID | Controlled swap point | Observed consequence |
|---|---|---|
| DIRECT-RACE-01 | While A freshness-read `File.arrayBuffer()` is pending | B receives A-generated patched output; A remains unchanged; UI/evidence name B as target. |
| DIRECT-RACE-02 | While A rollback-backup `File.arrayBuffer()` is pending | B receives A-generated patched output; A remains unchanged; UI/evidence name B as target. |
| DIRECT-RACE-03 | While A `createWritable()` is pending | A is patched; verification then reads B; rollback writes A original backup into B, replacing B original bytes. |
| DIRECT-RACE-04 | While A post-write readback `File.arrayBuffer()` is pending | A is patched and B stays unchanged, but UI/evidence report B as the successfully saved target and readback hash/size are B baseline. |

## A/B byte ledger

All cases use the same deterministic fixtures. The hashes below repeat in all three Chromium process runs.

| File | Before size | Before SHA-256 |
|---|---:|---|
| A | 949 | `1e32bcc37093e4248951245d92354805ed105172c8a1c50811981cbf6b5ac87b` |
| B | 51 | `7402f922922028f2963ed0ed380a7fd65b82529d9b67a67413bd2403cf4800dd` |

Expected patched output generated from A: 1,156 bytes, SHA-256 `17b5deb059dbe0a73cc7828b106113242c91aeda4879a14305c63cfc9bacc83c`.

| Race | A after | B after |
|---|---|---|
| 01 | 949 bytes — A unchanged | 1,156 bytes — B replaced by A patched output |
| 02 | 949 bytes — A unchanged | 1,156 bytes — B replaced by A patched output |
| 03 | 1,156 bytes — A patched | 949 bytes — B replaced by A original bytes during rollback |
| 04 | 1,156 bytes — A patched | 51 bytes — B unchanged |

Per-run, per-case exact SHA-256 and byte sizes are recorded in `run-01.json`–`run-03.json` and `A-B-byte-ledger.csv`. Base64-encoded A/B byte snapshots are included in the JSON records to permit byte reconstruction.

## Repeatability and assertions

- Race reproductions: **12/12** (four windows × three separate Chromium processes).
- Behavioral repeatability across the three runs: `true` after excluding volatile evidence IDs/timestamps.
- Instrumented assertions: 51/72 passed; 21/72 failed. The failures are the intentionally asserted safety properties that the current implementation violates.
- Safety invariant failures: **12/12 case executions**.
- No uncaught page errors in the race cases.

## Evidence semantics

- RACE-01/02 evidence contains `targetName=B.txt`, `outputName=A-patched.txt`, and actual bytes/hash equal to A output, while B began as a distinct 51-byte fixture.
- RACE-03 evidence records `targetName=B.txt`, `saveStatus=direct-write-failed; _verifyLevel=rollback-verified`; byte ledger proves B ends equal to A original bytes, not B original bytes.
- RACE-04 evidence contains `targetName=B.txt`, `outputName=A-patched.txt`, `actualFileSize=51`, and `actualFileSha256` equal to B pre-operation hash, while A is the file whose bytes changed.

## Engineering conclusion

`DIRECT-RACE-01` through `DIRECT-RACE-04` establish a reproducible cross-target race in the current RC3-DEV direct-save flow under the controlled handle model. The core defect is use of mutable global `directFileHandle` across awaited operations without pinning the transaction to the handle captured at apply start or aborting when the selected-handle generation changes. The same issue affects post-write verification, rollback, and evidence attribution.

No source fix was applied in this campaign. RC3-DEV remains byte-identical to the tested source. RC2 remains untouched. No repository change or archive upload to `main` was performed.

## Recommended remediation direction (not applied)

1. Capture an immutable transaction context before the first await: `{ handle, name, loadToken, rawTargetToken, encoding, hasBOM, openedSnapshot }`.
2. Use that captured `handle` for freshness read, backup, primary writer, post-write readback, rollback writer/readback, and evidence bytes. Never re-read the mutable global handle inside the transaction.
3. Before any write and before committing success/evidence, verify the target/load generation still belongs to the transaction. If the user selected B meanwhile, either keep the transaction fully pinned to A and report A, or cancel before any write; never mix handles.
4. Disable the picker while `directWriteBusy` or explicitly invalidate/cancel the transaction when a new selection begins. This is an additional UX guard, not a substitute for handle pinning.
5. Add regression tests that require B to remain byte-identical in all four races and require all displayed/evidence target identities to match the handle actually written/read.

## Final statuses

- `DIRECT-RACE-01..04`: `RACE_REPRODUCED_IN_CHROMIUM_MOCK_FSA`
- Native File System Access: `NOT_TESTED`
- Real disk write: `NOT_TESTED`
- Production reachability: `UNPROVEN`
- Finding: remains `OPEN`
- RC3-DEV source modified: `false`
- RC2 modified: `false`
- Repository modified: `false`
