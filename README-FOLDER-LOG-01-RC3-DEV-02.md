# FOLDER-LOG-01 — RC3-DEV patch and A–E mock regression record

## Decision

- Development copy: `raqee3-v8.0.0-rc3-dev.html`
- RC2 source file unchanged; Git Blob SHA-1 and SHA-256 match recorded baseline.
- The audit archive was briefly uploaded to `main` and then deleted:
  - add commit: `58ff0172bad87669002c95dc28fd019e8e7b3534`
  - delete commit: `04d9814c08b5cabc14f2ee48ed88ea02a55701f2`
  - current `main` state: does not contain the archive (404)
  - repository history: preserves both commits intentionally as audit trail
- `rc3_dev` HTML file was not committed standalone to the repository; it exists only inside the uploaded archive and in the local session copy.
- `FOLDER-LOG-01` remains **OPEN** pending browser/production reachability evidence.

## Repository state timeline

| Timestamp (UTC) | Event | main state |
|---|---|---|
| 2026-11-06 (build time) | RC3-DEV built locally | unchanged |
| 2026-11-06 12:53:14 | archive pushed as commit `58ff0172…` | contains archive |
| 2026-11-06 13:25:23 | archive removed via commit `04d9814c…` | archive absent (404) |
| now | — | archive absent; both commits visible in history |

## Baseline identity

The candidate was forked from the complete local RC2 file only after these values matched the recorded baseline:

- Size: `483360` bytes
- Git Blob SHA-1: `914dc7e394b9d87d555852c3faeffb13c6bcfb8f`
- SHA-256: `8b7357295f333a44b861d03d555b86b475df53bc1227b9cb5f195026bd4fda9c`

## Candidate identity

- File: `raqee3-v8.0.0-rc3-dev.html`
- Size: `483593` bytes
- Git Blob SHA-1: `0ec3926eb43315be86085e0cc275c525ea5ac845`
- SHA-256: `ebdb9c9f34f09c094d394bda897555758efe7aad9f30e43b41f1bd5fb7b873ed`

## Source changes

Two additive source-line changes were made in the separate RC3-DEV copy; no other source differences are present:

1. In `folderRunWriteBatch()`, after rollback processing:

   `if (attempted.length === 0 && failedItem) log.status = 'no_writes_attempted';`

   The existing `recovered`, `recovery_partial`, and `recovery_failed` branches remain in their prior order after this guard.

2. In `folderRenderWriteLog()`, an Arabic display label was added for `no_writes_attempted`, so the UI does not expose a raw internal status token.

The unified diff is included as `RC2-to-RC3-DEV.patch`.

## A–E regression harness

`FOLDER-LOG-01-RC3-DEV-AE-harness.node.js` embeds the helper and `folderRunWriteBatch()` functions extracted directly from the RC3-DEV HTML. It does not rely on the older RC2-based harness snippets.

Runtime: Node.js v22.16.0.

Three separate Node process executions were performed. Each execution completed all five cases and all 43 assertions:

| Run | Cases | Assertions | Result sequence |
|---|---:|---:|---|
| run-01 | 5/5 | 43/43 | `no_writes_attempted`, `recovered`, `recovery_failed`, `recovery_partial`, `recovered` |
| run-02 | 5/5 | 43/43 | same |
| run-03 | 5/5 | 43/43 | same |

Aggregate: **15/15 case executions and 129/129 assertions**. Behavioral results were identical across the three runs, ignoring timestamps.

### Case coverage

- A: injected third `getFile()` failure before `attempted.push`; expected `no_writes_attempted`, zero writes, zero rollback attempts, and unchanged original bytes.
- B: write commits, `close()` then throws, rollback succeeds; expected `recovered`.
- C: write commits, `close()` then throws, rollback writer creation fails; expected `recovery_failed`.
- D: two writes commit; one rollback succeeds and the other fails; expected `recovery_partial`.
- E: second item fails in `beforeWrite` before being appended to `attempted`; first item is restored and verified; expected `recovered`.

## Limits and non-claims

- These are Node mock-harness tests using synthetic in-memory file handles.
- `confirmWrite` is supplied as `() => true`; native `window.confirm()` and user cancellation are not exercised.
- The mock's `close()` behavior deliberately commits before injecting the selected close failure in B–D.
- No native File System Access API write was performed.
- Browser integration was not run. The earlier Chromium headless environment timed out even on a minimal HTML smoke test.
- Production reachability of the triggering `beforeWrite` read failure remains `UNPROVEN`.
- Case F remains a defensive source-level review, not a dynamic test.
- These results do not close `FOLDER-LOG-01` and do not constitute RC3 release acceptance.

## Reproduction

Run each case suite with Node.js v22 or compatible:

```sh
node FOLDER-LOG-01-RC3-DEV-AE-harness.node.js
```

Each invocation emits one JSON result. Three captured independent outputs are included as `run-01.json`, `run-02.json`, and `run-03.json`.
