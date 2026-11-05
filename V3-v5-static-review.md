# V3-rerun — static review record for v5

**Status:** `CANDIDATE — STATIC REVIEW ONLY; NOT EXECUTED; V3 REMAINS OPEN/BLOCKED`

## Files prepared

| File | Size | SHA-256 |
|---|---:|---|
| `test-v3-v5-ast-reviewed.js` | 34,351 bytes | `9d4e04087cef3a2fa575f7db97adfa4fc387f6eae7cf7ab711ad014db76cece0` |
| `package.json` | 342 bytes | `e5150465674c29e4b236b8553372f286c56ddd071f37508450d7bc2dc43a6112` |

## Corrections applied to the supplied v4 design

1. **HTML extraction:** uses `parse5` with `sourceCodeLocationInfo`; raw script text is sliced from the original HTML string using the parser's start/end tag offsets. No DOM serialization or hand-written `<script>` scanner is used. External `src` scripts and non-JavaScript data blocks are skipped; module blocks are parsed as modules but required test functions are rejected if defined in a module block because the VM harness models classic scripts.
2. **HTML fixtures:** includes a fake `<script>` inside an HTML comment, a non-matching `<scripture>` tag, and a `</scripture>` sequence inside script text. These test the HTML parser boundary behavior rather than a regex approximation.
3. **Scope-aware dependencies:** uses `eslint-scope` on the combined extracted declarations. For each required function it inspects the corresponding function scope's unresolved `through` references; local variables, nested closures, parameters, and sibling required functions are therefore not flattened into one global binding set. The global allowlist is narrowed to the globals actually used by the four source functions (`String`, `RegExp`, `console`, `undefined`). Direct `eval` and `with` are rejected because they make static name resolution unreliable.
4. **Scope fixtures:** includes positive and negative fixtures for nested local capture, an unresolved name inside a nested function, parameter shadowing, and sibling function references.
5. **Fixed Acorn version:** `acorn@8.11.3` mismatch is a hard setup failure, not a warning. `parse5@7.2.1` and `eslint-scope@8.4.0` are also exact-pinned.
6. **Lock integrity gate:** the runner requires a v3 `package-lock.json`, exact root and package versions, and an integrity field for every direct tool. A clean `npm ci` install is required before execution.
7. **Original test data:** the original 20 `targetFileNameMatches` and 6 `normalizeOutputMarker` cases are preserved in order and values. Their JSON serialization is compared against the fixed SHA-256 `f0640f4a7ce0eb125510d47d331a01dbfb3d3b9b0145ffb06363155880897014`; a mismatch exits with code 11 before any behavioral cases.
8. **Behavioral coverage:** retains 9 helper cases (including trailing-dot and fallback behavior) and the original 26 cases (35 total), uses `vm.runInContext` with a 1,000 ms timeout for each call, and preserves the source SHA-256/byte-size gate.

## Dependency setup required before running

The supplied `package.json` has exact direct versions. Generate the lock file once:

```sh
npm install --package-lock-only --ignore-scripts --lockfile-version=3
```

Then install strictly from the lock:

```sh
npm ci
```

The runner checks `package.json`, `package-lock.json`, installed package versions, and the lock integrity fields. `npm ci` also requires an existing lock file and fails rather than updating an inconsistent one.

## Execution status and blockers

- Environment discovery returned Node.js `v22.16.0` and npm `10.9.2`.
- The three packages were not installed in this workspace.
- Lock generation was attempted with `npm install --package-lock-only --ignore-scripts --lockfile-version=3` but timed out. No `package-lock.json` or `node_modules` directory was produced.
- **The runner was not executed.** No `node --check` was run, no `v3-rerun.log` was created, and no PASS/FAIL result is claimed.
- The `after-D.html` input was not modified. No repository files or branches were written.
- The runner will independently compute and compare the source's raw-byte SHA-256 and byte size when executed. The expected reference values are embedded as supplied; this review does not claim to have independently computed the SHA-256 of the downloaded source bytes.

## Decision

This v5 draft addresses the four blocking design issues identified in the v4 review. It is **not yet an execution-approved artifact** because the package lock could not be generated here and the script has not been parsed or executed in a dependency-complete environment. Keep `V3 = BLOCKED` until the lock is created, the static review is accepted, the runner executes, and the raw `v3-rerun.log` is reviewed.
