// test-v3-fixed.js — V3 re-run (نسخة مُصلَحة)
// إصلاح: جميع الدوال في نطاق Function واحد (يحل مشكلة splitOutputFileName/escapeRegexLiteral)
// سجل خام مع SHA-256 للمصدر — يربط السجل بهوية after-D.html
// التشغيل: node test-v3-fixed.js > v3-rerun.log 2>&1

'use strict';

var fs = require('fs');
var crypto = require('crypto');

var SOURCE_FILE = process.env.SOURCE_FILE || 'after-D.html';

if (!fs.existsSync(SOURCE_FILE)) {
  console.error('FATAL: SOURCE_FILE not found:', SOURCE_FILE);
  process.exit(1);
}

var srcBuffer = fs.readFileSync(SOURCE_FILE);
var src = srcBuffer.toString('utf-8');
var srcSha = crypto.createHash('sha256').update(srcBuffer).digest('hex');
var srcSize = srcBuffer.length;

console.log('=== V3 Re-run Raw Log ===');
console.log('Source file: ' + SOURCE_FILE);
console.log('Source size: ' + srcSize + ' bytes');
console.log('Source SHA-256: ' + srcSha);
console.log('Timestamp: ' + new Date().toISOString());
console.log('Node version: ' + process.version);
console.log('');

// ═══════════════════════════════════════════
// استخراج دالة واحدة بعدّ الأقواس
// ═══════════════════════════════════════════

function extractFunction(text, name) {
  var re = new RegExp('function\\s+' + name + '\\s*\\(', 'g');
  var m = re.exec(text);
  if (!m) return null;
  var start = m.index;
  var i = m.index + m[0].length;
  while (i < text.length && text[i] !== '{') {
    if (text[i] === ')') { i++; break; }
    i++;
  }
  if (i >= text.length || text[i] !== '{') return null;
  var braceCount = 1;
  i++;
  while (i < text.length && braceCount > 0) {
    var ch = text[i];
    if (ch === '{') braceCount++;
    else if (ch === '}') braceCount--;
    i++;
  }
  if (braceCount !== 0) return null;
  return text.slice(start, i);
}

// ═══════════════════════════════════════════
// استخراج وتجميع الدوال في نطاق واحد
// ═══════════════════════════════════════════

var requiredFns = [
  'splitOutputFileName',
  'escapeRegexLiteral',
  'normalizeOutputMarker',
  'targetFileNameMatches'
];

var optionalFns = [
  'regexEscape'
];

var allFns = requiredFns.concat(optionalFns);
var found = {};
var combined = '';

allFns.forEach(function(name) {
  var fn = extractFunction(src, name);
  if (fn) {
    found[name] = true;
    combined += fn + '\n\n';
  } else {
    found[name] = false;
  }
});

console.log('=== Functions found ===');
allFns.forEach(function(n) {
  var type = requiredFns.indexOf(n) >= 0 ? 'required' : 'optional';
  console.log('  ' + n + ' [' + type + ']: ' + (found[n] ? 'OK' : 'MISSING'));
});
console.log('');

// التحقق من المطلوبة قبل التجميع
var missingRequired = requiredFns.filter(function(n) { return !found[n]; });
if (missingRequired.length > 0) {
  console.error('FATAL: Missing required functions: ' + missingRequired.join(', '));
  process.exit(1);
}

// ═══════════════════════════════════════════
// التقييم في نطاق Function واحد
// (هذا يحل مشكلة ربط ال��وال)
// ═══════════════════════════════════════════

var returnStmt = 'return {' + allFns.map(function(n) {
  return n + ': (typeof ' + n + ' === "function") ? ' + n + ' : null';
}).join(', ') + '};';

var extracted;
try {
  extracted = new Function(combined + '\n' + returnStmt)();
} catch (e) {
  console.error('FATAL: Failed to compile combined functions: ' + e.message);
  process.exit(1);
}

// التحقق من كل دالة مطلوبة
console.log('=== Extracted functions ===');
requiredFns.forEach(function(n) {
  if (typeof extracted[n] !== 'function') {
    console.error('FATAL: ' + n + ' not extracted as function');
    process.exit(1);
  }
  console.log('  ' + n + ' → OK');
});
console.log('');

var targetFileNameMatches = extracted.targetFileNameMatches;
var normalizeOutputMarker = extracted.normalizeOutputMarker;

// ═══════════════════════════════════════════
// 20 حالة targetFileNameMatches
// ═══════════════════════════════════════════

var warningCases = [
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

var wPass = 0, wFail = 0;
var wFailures = [];

console.log('=== targetFileNameMatches: 20 cases ===');
warningCases.forEach(function(c, i) {
  var got;
  try {
    got = targetFileNameMatches(c[0], c[1]);
  } catch (e) {
    got = 'THREW: ' + e.name + ': ' + e.message;
  }
  if (got === c[2]) {
    wPass++;
    console.log('  [' + (i+1) + '] PASS  ' + JSON.stringify(c[0]) + ' → ' + JSON.stringify(c[1]) + ' → ' + got);
  } else {
    wFail++;
    wFailures.push({ index: i+1, name: c[0], target: c[1], expected: c[2], got: got });
    console.log('  [' + (i+1) + '] FAIL  ' + JSON.stringify(c[0]) + ' → ' + JSON.stringify(c[1]) + ' | expected=' + c[2] + ' actual=' + got);
  }
});

console.log('');
console.log('  targetFileNameMatches: ' + wPass + '/' + warningCases.length + ' PASS');
if (wFailures.length > 0) {
  console.log('  Failures:');
  wFailures.forEach(function(f) {
    console.log('    #' + f.index + ': ' + JSON.stringify(f.name) + ' → ' + JSON.stringify(f.target) + ' | expected=' + f.expected + ' got=' + f.got);
  });
}

// ═══════════════════════════════════════════
// 6 حالات normalizeOutputMarker
// ═══════════════════════════════════════════

var markerCases = [
  ['-patched',     '-patched'],
  ['.bak',         '-bak'    ],
  ['bak',          '-bak'    ],
  ['',             '-patched'],
  [null,           '-patched'],
  ['-bad marker',  '-patched']
];

var mPass = 0, mFail = 0;
var mFailures = [];

console.log('');
console.log('=== normalizeOutputMarker: 6 cases ===');
markerCases.forEach(function(c, i) {
  var got;
  try {
    got = normalizeOutputMarker(c[0]);
  } catch (e) {
    got = 'THREW: ' + e.name + ': ' + e.message;
  }
  if (got === c[1]) {
    mPass++;
    console.log('  [' + (i+1) + '] PASS  ' + JSON.stringify(c[0]) + ' → ' + JSON.stringify(got));
  } else {
    mFail++;
    mFailures.push({ index: i+1, input: c[0], expected: c[1], got: got });
    console.log('  [' + (i+1) + '] FAIL  ' + JSON.stringify(c[0]) + ' | expected=' + c[1] + ' actual=' + got);
  }
});

console.log('');
console.log('  normalizeOutputMarker: ' + mPass + '/' + markerCases.length + ' PASS');
if (mFailures.length > 0) {
  console.log('  Failures:');
  mFailures.forEach(function(f) {
    console.log('    #' + f.index + ': ' + JSON.stringify(f.input) + ' | expected=' + f.expected + ' got=' + f.got);
  });
}

// ═══════════════════════════════════════════
// الحكم النهائي
// ═══════════════════════════════════════════

var totalPass = wPass + mPass;
var totalCases = warningCases.length + markerCases.length;

console.log('');
console.log('══════════════════════════════════════════');
console.log('  V3 RE-RUN TOTAL: ' + totalPass + '/' + totalCases);
console.log('  targetFileNameMatches:  ' + wPass + '/' + warningCases.length);
console.log('  normalizeOutputMarker:  ' + mPass + '/' + markerCases.length);
console.log('══════════════════════════════════════════');
console.log('');
console.log('  Source: ' + SOURCE_FILE);
console.log('  Source SHA-256: ' + srcSha);
console.log('  Source size: ' + srcSize + ' bytes');
console.log('');

if (totalPass === totalCases) {
  console.log('  RESULT: PASS');
  process.exit(0);
} else {
  console.log('  RESULT: FAIL (' + (totalCases - totalPass) + ' failures)');
  process.exit(1);
}
