// test-v3-fixed.js — V3 re-run (shared scope fix)
// Bug: previous version used separate eval per function, so targetFileNameMatches
//      could not see splitOutputFileName → "splitOutputFileName is not defined".
// Fix: load all 4 functions in ONE shared scope. Cases preserved verbatim.
// Run:  node test-v3-fixed.js > v3-rerun.log 2>&1
// Exit: 0 = 26/26 pass, 1 = failures, 2 = source not found, 3 = identity/extraction error
'use strict';

const fs     = require('fs');
const crypto = require('crypto');

const SOURCE_FILE   = process.env.SOURCE_FILE || 'after-D.html';
const EXPECTED_SHA  = '5614fbee7ea733441136c58830d623a67c22b7b683c3db773cea24c2a893f094';
const EXPECTED_SIZE = 483209;

// ─── Source identity gate ───
if (!fs.existsSync(SOURCE_FILE)) {
  console.error('FATAL: source not found: ' + SOURCE_FILE);
  process.exit(2);
}
const buf  = fs.readFileSync(SOURCE_FILE);
const src  = buf.toString('utf-8');
const sha  = crypto.createHash('sha256').update(buf).digest('hex');
const size = buf.length;

console.log('=== V3 Re-run Raw Log ===');
console.log('Source file:    ' + SOURCE_FILE);
console.log('Source size:    ' + size + ' bytes (expected ' + EXPECTED_SIZE + ')');
console.log('Source SHA-256: ' + sha);
console.log('Expected SHA:   ' + EXPECTED_SHA);
console.log('Timestamp:      ' + new Date().toISOString());
console.log('Node:           ' + process.version);
console.log('');

if (sha !== EXPECTED_SHA) {
  console.error('FATAL: SHA-256 mismatch');
  console.error('  got:      ' + sha);
  console.error('  expected: ' + EXPECTED_SHA);
  process.exit(3);
}
if (size !== EXPECTED_SIZE) {
  console.error('FATAL: size mismatch');
  process.exit(3);
}
console.log('✓ Source identity verified (SHA-256 + size)');
console.log('');

// ─── Extraction (same logic as before, unchanged) ───
function extractFunction(text, name) {
  const re = new RegExp('function\\s+' + name + '\\s*\\(', 'g');
  const m = re.exec(text);
  if (!m) return null;
  let i = m.index + m[0].length;
  let depth = 1;
  while (i < text.length && depth > 0) {
    if (text[i] === '(') depth++;
    else if (text[i] === ')') { depth--; if (depth === 0) { i++; break; } }
    i++;
  }
  while (i < text.length && text[i] !== '{') i++;
  if (i >= text.length) return null;
  depth = 1; i++;
  while (i < text.length && depth > 0) {
    const ch = text[i];
    if (ch === '"' || ch === "'" || ch === '`') {
      const q = ch; i++;
      while (i < text.length) {
        if (text[i] === '\\') i += 2;
        else if (text[i] === q) { i++; break; }
        else i++;
      }
      continue;
    }
    if (ch === '/' && text[i + 1] === '/') {
      i += 2; while (i < text.length && text[i] !== '\n') i++;
      continue;
    }
    if (ch === '/' && text[i + 1] === '*') {
      i += 2;
      while (i < text.length && !(text[i] === '*' && text[i + 1] === '/')) i++;
      i += 2;
      continue;
    }
    if (ch === '{') depth++;
    else if (ch === '}') depth--;
    i++;
  }
  if (depth !== 0) return null;
  return text.slice(m.index, i);
}

const REQUIRED = [
  'splitOutputFileName',
  'escapeRegexLiteral',
  'normalizeOutputMarker',
  'targetFileNameMatches'
];

const extracted = {};
for (const name of REQUIRED) {
  const fn = extractFunction(src, name);
  if (!fn) {
    console.error('FATAL: could not extract ' + name);
    process.exit(3);
  }
  extracted[name] = fn;
  console.log('Extracted ' + name + ': ' + fn.length + ' chars');
}
console.log('');

// ═══════════════════════════════════════════════════════════════════
// THE FIX — single shared scope
// Previous bug: separate eval per function → targetFileNameMatches
// could not resolve splitOutputFileName → "splitOutputFileName is not defined".
// ═══════════════════════════════════════════════════════════════════
const sharedCode =
  REQUIRED.map(n => extracted[n]).join('\n\n') +
  '\nreturn {' + REQUIRED.map(n => n + ': ' + n).join(', ') + '};';

let fns;
try {
  fns = new Function(sharedCode)();
} catch (e) {
  console.error('FATAL: shared-scope compilation failed: ' + e.message);
  process.exit(3);
}

for (const n of REQUIRED) {
  if (typeof fns[n] !== 'function') {
    console.error('FATAL: ' + n + ' not callable after loading');
    process.exit(3);
  }
}
console.log('✓ All 4 functions loaded in shared scope');
console.log('');

// ─── 26 original cases (verbatim, unchanged) ───
const warningCases = [
  ['index.html',                  'index.html',  true ],
  ['index (2)-patched.html',      'index.html',  true ],
  ['index.htm',                   'index.html',  true ],
  ['app.js',                      'app.js',      true ],
  ['app-patched.js',              'app.js',      true ],
  ['app-patched-v2.js',           'app.js',      true ],
  ['app (1) (2).js',              'app.js',      true ],
  ['app-script.js',               'app.js',      true ],
  ['app-patch-preview.js',        'app.js',      true ],
  ['APP.JS',                      'app.js',      true ],
  ['other.txt',                   'app.js',      false],
  ['app2.js',                     'app.js',      false],
  ['app-patched.exe',             'app.js',      false],
  ['app-unknown-v2.js',           'app.js',      false],
  ['.gitignore',                  '.gitignore',  true ],
  ['.gitignore-patched',          '.gitignore',  true ],
  ['Makefile',                    'Makefile',    true ],
  ['Makefile-patched',            'Makefile',    true ],
  ['archive.test-patched.js',     'archive.test.js', true ],
  ['app-patched-backup.js',       'app.js',      true ]
];

const markerCases = [
  ['-patched',    '-patched'],
  ['.bak',        '-bak'    ],
  ['bak',         '-bak'    ],
  ['',            '-patched'],
  [null,          '-patched'],
  ['-bad marker', '-patched']
];

// ─── targetFileNameMatches: 20 cases ───
console.log('=== targetFileNameMatches: 20 cases ===');
let wP = 0, wF = 0;
warningCases.forEach((c, i) => {
  let got;
  try { got = fns.targetFileNameMatches(c[0], c[1]); }
  catch (e) { got = 'THREW: ' + e.message; }
  const ok = got === c[2];
  if (ok) wP++; else wF++;
  console.log('  [' + String(i + 1).padStart(2) + '] ' + (ok ? 'PASS' : 'FAIL') +
    '  ' + JSON.stringify(c[0]) + ' → ' + JSON.stringify(c[1]) +
    ' | expected=' + c[2] + ' actual=' + got);
});
console.log('  Result: ' + wP + '/' + warningCases.length);
console.log('');

// ─── normalizeOutputMarker: 6 cases ───
console.log('=== normalizeOutputMarker: 6 cases ===');
let mP = 0, mF = 0;
markerCases.forEach((c, i) => {
  let got;
  try { got = fns.normalizeOutputMarker(c[0]); }
  catch (e) { got = 'THREW: ' + e.message; }
  const ok = got === c[1];
  if (ok) mP++; else mF++;
  console.log('  [' + String(i + 1).padStart(2) + '] ' + (ok ? 'PASS' : 'FAIL') +
    '  ' + JSON.stringify(c[0]) + ' → ' + JSON.stringify(got) +
    ' | expected=' + c[1]);
});
console.log('  Result: ' + mP + '/' + markerCases.length);
console.log('');

// ─── Final verdict ───
const totalP = wP + mP;
const totalC = warningCases.length + markerCases.length;

console.log('══════════════════════════════════════════════════════════════');
console.log('  V3 TOTAL: ' + totalP + '/' + totalC);
console.log('  targetFileNameMatches:  ' + wP + '/' + warningCases.length);
console.log('  normalizeOutputMarker:  ' + mP + '/' + markerCases.length);
console.log('══════════════════════════════════════════════════════════════');
console.log('');
console.log('  Source SHA-256: ' + sha + ' ✓');
console.log('  Source size:    ' + size + ' bytes ✓');
console.log('');

if (totalP === totalC) {
  console.log('  RESULT: PASS');
  process.exit(0);
} else {
  console.log('  RESULT: FAIL (' + (totalC - totalP) + ' failed)');
  process.exit(1);
}