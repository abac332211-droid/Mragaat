function norm(s){return String(s).replace(/\r\n/g,'\n').replace(/\r/g,'\n')}

var LIMITS = {
  patchFileBytes:  5 * 1024 * 1024,
  patchesCount:    500,
  stepsPerPatch:   100,
  totalSteps:      2000,
  verifyPerPatch:  100,
  targetFileBytes: 20 * 1024 * 1024,
  folderFilesCount: 500,
  folderTotalBytes: 50 * 1024 * 1024
};

function folderCreateMockFromFiles(fileList) {
  // V9: null-prototype maps treat names such as '__proto__' as ordinary keys.
  var files = Object.create(null);
  var rawBytesByPath = Object.create(null);
  var tree = { __isDir: true, __children: Object.create(null) };
  var stats = { writeAttempts: 0, reads: 0 };
  var arr = Array.prototype.slice.call(fileList);
  if (arr.length === 0) return Promise.resolve(null);
  if (arr.length > LIMITS.folderFilesCount) return Promise.reject(new Error('عدد ملفات المجلد يتجاوز الحد (' + LIMITS.folderFilesCount + ' ملفًا).'));
  var totalBytes = 0;
  for (var pre = 0; pre < arr.length; pre++) {
    var size = Number(arr[pre] && arr[pre].size);
    if (!Number.isFinite(size) || size < 0) return Promise.reject(new Error('تعذر التحقق من حجم أحد ملفات المجلد.'));
    if (size > LIMITS.targetFileBytes) return Promise.reject(new Error('الملف «' + (arr[pre].name || 'بدون اسم') + '» يتجاوز حد 20 MiB قبل القراءة.'));
    totalBytes += size;
    if (totalBytes > LIMITS.folderTotalBytes) return Promise.reject(new Error('مجموع ملفات المجلد يتجاوز حد 50 MiB قبل القراءة؛ قسّم الملفات إلى مجموعات أصغر.'));
  }
  var firstRel = arr[0].webkitRelativePath || arr[0].name;
  var rootName = firstRel.split('/')[0];
  return (async function(){
    // Sequential reads avoid unbounded concurrent ArrayBuffers on large folder selections.
    for (var fidx = 0; fidx < arr.length; fidx++) {
      var f = arr[fidx];
      var rel = f.webkitRelativePath || f.name;
      var parts = rel.split('/');
      if (parts.length > 1 && parts[0] === rootName) parts = parts.slice(1);
      if (!parts.length || parts.some(function(part){ return !part || part === '.' || part === '..'; })) {
        throw new Error('مسار ملف غير صالح داخل المجلد: ' + rel);
      }
      var path = parts.join('/');
      var cur = tree;
      for (var i = 0; i < parts.length - 1; i++) {
        if (!cur.__children[parts[i]]) cur.__children[parts[i]] = { __isDir: true, __children: Object.create(null) };
        cur = cur.__children[parts[i]];
      }
      if (cur.__children[parts[parts.length - 1]]) throw new Error('مسار مكرر داخل المجلد: ' + path);
      cur.__children[parts[parts.length - 1]] = { __isDir: false, __path: path };
      var buf = await f.arrayBuffer();
      if (buf.byteLength > LIMITS.targetFileBytes) throw new Error('الملف «' + path + '» تجاوز حد 20 MiB أثناء القراءة.');
      var _bytes = new Uint8Array(buf);
      rawBytesByPath[path] = _bytes;
      if (_bytes.length >= 2 && ((_bytes[0] === 0xFF && _bytes[1] === 0xFE) || (_bytes[0] === 0xFE && _bytes[1] === 0xFF))) {
        throw new Error('ملف "' + path + '" بترميز UTF-16 غير مدعوم في وضع المجلد. حوّله إلى UTF-8 أولًا.');
      }
      var _hasBom = _bytes.length >= 3 && _bytes[0] === 0xEF && _bytes[1] === 0xBB && _bytes[2] === 0xBF;
      var _decoded = new TextDecoder('utf-8').decode(buf);
      if (_hasBom && _decoded.charCodeAt(0) !== 0xFEFF) _decoded = '\uFEFF' + _decoded;
      files[path] = norm(_decoded);
    }
    return buildHandle(tree, '', rootName);
  })();

  function buildHandle(node, basePath, rootName) {
    var children = (node === tree) ? tree.__children : node.__children;
    var handle = {
      kind: 'directory', name: (node === tree) ? rootName : basePath.split('/').pop(),
      files: files, rawBytes: rawBytesByPath, stats: stats
    };
    handle.getDirectoryHandle = async function(name) {
      if (typeof name !== 'string' || !/^[^\/\\]+$/.test(name) || name === '.' || name === '..') {
        var e = new Error('TypeMismatchError'); e.name = 'TypeMismatchError'; throw e;
      }
      var t = children[name];
      if (!t || !t.__isDir) { var e2 = new Error('NotFoundError'); e2.name = 'NotFoundError'; throw e2; }
      return buildHandle(t, basePath ? basePath + '/' + name : name, rootName);
    };
    handle.getFileHandle = async function(name) {
      if (typeof name !== 'string' || !/^[^\/\\]+$/.test(name) || name === '.' || name === '..') {
        var e = new Error('TypeMismatchError'); e.name = 'TypeMismatchError'; throw e;
      }
      var t = children[name];
      if (!t || t.__isDir) { var e2 = new Error('NotFoundError'); e2.name = 'NotFoundError'; throw e2; }
      var filePath = t.__path;
      return {
        kind: 'file', name: name,
        getFile: async function() { stats.reads++; return new File([files[filePath]], name, { type: 'text/plain' }); },
        createWritable: async function() {
          var buffer = '';
          return { write: async function(c) { buffer = c; }, close: async function() { stats.writeAttempts++; files[filePath] = buffer; } };
        }
      };
    };
    return handle;
  }
}

async function folderResolvePath(root, path) {
  var parts = path.split('/'), cur = root;
  for (var i = 0; i < parts.length - 1; i++) cur = await cur.getDirectoryHandle(parts[i]);
  return await cur.getFileHandle(parts[parts.length - 1]);
}

function folderBytesEqual(a, b) {
  if (!a || !b || a.length !== b.length) return false;
  for (var i = 0; i < a.length; i++) if (a[i] !== b[i]) return false;
  return true;
}

async function folderReadRawBytes(dir, path) {
  var fh = await folderResolvePath(dir, path);
  var file = await fh.getFile();
  return { handle: fh, file: file, bytes: new Uint8Array(await file.arrayBuffer()) };
}

async function folderRunWriteBatch(dir, plan, confirmWrite) {
  var log = {
    schemaVersion: 2,
    createdAt: new Date().toISOString(),
    mode: 'multi-file-write-with-backup-and-best-effort-rollback',
    folderName: dir && dir.name ? dir.name : null,
    status: 'not_started',
    filesInMap: plan && plan.items ? plan.items.length : 0,
    writesAttempted: 0,
    verifiedWrites: 0,
    rollbackAttempts: 0,
    rollbackFailures: 0,
    entries: [],
    error: null
  };
  function stop(status, message) { log.status = status; log.error = message || null; return log; }
  function entryFor(item, status, extra) {
    var o = { path: item.path, status: status };
    if (extra) Object.keys(extra).forEach(function(k) { o[k] = extra[k]; });
    return o;
  }
  try {
    if (!dir || dir.kind !== 'directory') return stop('blocked', 'مقبض مجلد غير صالح');
    if (!plan || !Array.isArray(plan.items) || !plan.items.length) return stop('blocked', 'لا توجد خطة كتابة موثقة؛ أعد إنشاء النسخة الاحتياطية');
    if (plan.dir !== dir || plan.folderName !== dir.name) return stop('blocked', 'خطة النسخة الاحتياطية لا تخص المجلد المحدد حالياً');
    if (!plan.items.every(function(x) { return x && typeof x.path === 'string' && x.originalBytes instanceof Uint8Array && x.expectedBytes instanceof Uint8Array && typeof x.patchedContent === 'string'; })) {
      return stop('blocked', 'خطة الكتابة ناقصة أو غير صالحة');
    }
    var changed = plan.items.filter(function(x) { return x.changed; });
    if (!changed.length) {
      plan.items.forEach(function(x) { log.entries.push(entryFor(x, 'unchanged')); });
      return stop('no_change', 'لا توجد ملفات متغيرة؛ لم تحدث كتابة');
    }

    // Check the entire mapped set against the exact bytes used to create the backup.
    log.status = 'freshness_check_1';
    for (var a = 0; a < plan.items.length; a++) {
      var itemA = plan.items[a];
      var snapA = await folderReadRawBytes(dir, itemA.path);
      if (!folderBytesEqual(snapA.bytes, itemA.originalBytes)) {
        log.entries.push(entryFor(itemA, 'stale_preflight', { message: 'تغيّرت البايتات الأصلية بعد تجهيز النسخة الاحتياطية' }));
        return stop('stale_preflight', 'تغيّر الملف «' + itemA.path + '» منذ إنشاء النسخة الاحتياطية؛ لم تبدأ الكتابة. أنشئ نسخة وخطة جديدتين.');
      }
    }

    var ask = confirmWrite || function(message) { return window.confirm(message); };
    var changedPaths = changed.map(function(x) { return '• ' + x.path; }).join('\n');
    var message = 'تأكيد كتابة حقيقية لعدة ملفات.\n\nالمجلد: ' + dir.name +
      '\nعدد الملفات التي ستتغير: ' + changed.length + '\nإجمالي الملفات المفحوصة: ' + plan.items.length +
      '\n\n' + changedPaths + '\n\nتم إنشاء ZIP للنسخ الأصلية. ستعيد الأداة فحص البايتات بعد التأكيد، ثم تكتب بالتتابع وتتحقق من كل ملف. عند الفشل ستحاول الاسترجاع، لكن لا توجد ذرّية مضمونة لعدة ملفات.\n\nهل تريد المتابعة؟';
    if (!ask(message)) return stop('cancelled', 'ألغى المستخدم الكتابة؛ لم تحدث كتابة');

    // Re-check every mapped path immediately after the confirmation dialog.
    log.status = 'freshness_check_2';
    for (var b = 0; b < plan.items.length; b++) {
      var itemB = plan.items[b];
      var snapB = await folderReadRawBytes(dir, itemB.path);
      if (!folderBytesEqual(snapB.bytes, itemB.originalBytes)) {
        log.entries.push(entryFor(itemB, 'stale_preflight', { message: 'تغيّر محتوى الملف أثناء التأكيد' }));
        return stop('stale_preflight', 'تغيّر الملف «' + itemB.path + '» أثناء التأكيد؛ لم تبدأ الكتابة.');
      }
    }

    var attempted = [];
    var failedItem = null;
    var failureMessage = null;
    log.status = 'writing';
    for (var w = 0; w < plan.items.length; w++) {
      var item = plan.items[w];
      if (!item.changed) {
        log.entries.push(entryFor(item, 'unchanged'));
        continue;
      }
      try {
        // Per-file check narrows the race window while earlier files are being written.
        var beforeWrite = await folderReadRawBytes(dir, item.path);
        if (!folderBytesEqual(beforeWrite.bytes, item.originalBytes)) {
          throw new Error('تغيّر الملف قبل دوره في الكتابة؛ أوقفت الدفعة لتجنب استبدال تغيير خارجي');
        }
        attempted.push(item); // Include this file even if create/write/close throws.
        log.writesAttempted++;
        var writer = await beforeWrite.handle.createWritable();
        await writer.write(item.expectedBytes);
        await writer.close();
        var afterWrite = await folderReadRawBytes(dir, item.path);
        if (!folderBytesEqual(afterWrite.bytes, item.expectedBytes)) {
          throw new Error('التحقق بعد الكتابة لم يطابق البايتات المتوقعة');
        }
        log.verifiedWrites++;
        log.entries.push(entryFor(item, 'written_verified', { sizeBefore: item.originalBytes.length, sizeAfter: afterWrite.bytes.length }));
      } catch (writeErr) {
        failedItem = item;
        failureMessage = (writeErr && writeErr.name ? writeErr.name + ': ' : '') + (writeErr && writeErr.message ? writeErr.message : String(writeErr));
        // Ensure the failed file appears in the report even if failure happened before its write record.
        if (!log.entries.some(function(e) { return e.path === item.path; })) {
          log.entries.push(entryFor(item, 'write_failed', { error: failureMessage }));
        } else {
          log.entries.forEach(function(e) { if (e.path === item.path) { e.status = 'write_failed'; e.error = failureMessage; } });
        }
        break;
      }
    }

    if (!failedItem) {
      log.status = 'verified';
      log.error = null;
      log.entries.sort(function(x, y) { return plan.items.findIndex(function(i) { return i.path === x.path; }) - plan.items.findIndex(function(i) { return i.path === y.path; }); });
      return log;
    }

    // Best-effort recovery in reverse write order, restoring the exact original bytes.
    log.error = 'فشل أثناء الكتابة عند «' + failedItem.path + '»: ' + failureMessage;
    for (var r = attempted.length - 1; r >= 0; r--) {
      var itemR = attempted[r];
      log.rollbackAttempts++;
      try {
        var currentR = await folderReadRawBytes(dir, itemR.path);
        if (!folderBytesEqual(currentR.bytes, itemR.originalBytes)) {
          var rollbackWriter = await currentR.handle.createWritable();
          await rollbackWriter.write(itemR.originalBytes);
          await rollbackWriter.close();
        }
        var restored = await folderReadRawBytes(dir, itemR.path);
        if (!folderBytesEqual(restored.bytes, itemR.originalBytes)) throw new Error('فشل التحقق من تطابق بايتات النسخة الأصلية بعد الاسترجاع');
        log.entries.forEach(function(e) {
          if (e.path === itemR.path) { e.status = 'rolled_back_verified'; e.rollbackVerified = true; }
        });
      } catch (rollbackErr) {
        log.rollbackFailures++;
        var found = false;
        log.entries.forEach(function(e) {
          if (e.path === itemR.path) { e.status = 'rollback_failed'; e.rollbackVerified = false; e.rollbackError = (rollbackErr && rollbackErr.name ? rollbackErr.name + ': ' : '') + (rollbackErr && rollbackErr.message ? rollbackErr.message : String(rollbackErr)); found = true; }
        });
        if (!found) log.entries.push(entryFor(itemR, 'rollback_failed', { rollbackVerified: false, rollbackError: rollbackErr.message || String(rollbackErr) }));
      }
    }
    // Report non-attempted files and preserve input order in the final log.
    plan.items.forEach(function(itemN) {
      if (!log.entries.some(function(e) { return e.path === itemN.path; })) {
        log.entries.push(entryFor(itemN, itemN.changed ? 'not_written' : 'unchanged'));
      }
    });
    log.entries.sort(function(x, y) { return plan.items.findIndex(function(i) { return i.path === x.path; }) - plan.items.findIndex(function(i) { return i.path === y.path; }); });
    if (attempted.length === 0 && failedItem) log.status = 'no_writes_attempted';
    else if (log.rollbackFailures === 0) log.status = 'recovered';
    else if (log.rollbackFailures < log.rollbackAttempts) log.status = 'recovery_partial';
    else log.status = 'recovery_failed';
    return log;
  } catch (err) {
    return stop('error', (err && err.name ? err.name + ': ' : '') + (err && err.message ? err.message : String(err)));
  }
}


const encoder = new TextEncoder();
function bytes(s) { return encoder.encode(s); }
function equal(a,b) { return folderBytesEqual(a,b); }
async function makeDir(paths) {
  const list = paths.map((p) => {
    const b = bytes('original-' + p + '\n');
    return { name: p.split('/').pop(), webkitRelativePath: 'fixture/' + p, size: b.length, arrayBuffer: async () => b.slice().buffer };
  });
  return folderCreateMockFromFiles(list);
}
function makePlan(dir, paths) {
  return {
    dir,
    folderName: dir.name,
    items: paths.map((p) => ({
      path: p, changed: true,
      originalBytes: bytes('original-' + p + '\n'),
      expectedBytes: bytes('patched-' + p + '\n'),
      patchedContent: 'patched-' + p + '\n'
    }))
  };
}
function installFaults(dir, rules) {
  const gets = Object.create(null);
  const writable = Object.create(null);
  const closes = Object.create(null);
  const origGetFileHandle = dir.getFileHandle.bind(dir);
  dir.getFileHandle = async function(name) {
    const fh = await origGetFileHandle(name);
    const path = name; // direct-child fixtures only
    const oldGetFile = fh.getFile.bind(fh);
    const oldCreateWritable = fh.createWritable.bind(fh);
    fh.getFile = async function() {
      gets[path] = (gets[path] || 0) + 1;
      if (rules.failGet && rules.failGet(path, gets[path])) throw new Error(rules.failGet(path, gets[path]));
      return oldGetFile();
    };
    fh.createWritable = async function(...args) {
      writable[path] = (writable[path] || 0) + 1;
      if (rules.failCreate && rules.failCreate(path, writable[path])) throw new Error(rules.failCreate(path, writable[path]));
      const w = await oldCreateWritable(...args);
      return {
        write: async function(chunk) { return w.write(chunk); },
        close: async function() {
          closes[path] = (closes[path] || 0) + 1;
          await w.close(); // commit first, then optionally inject close failure
          if (rules.failClose && rules.failClose(path, closes[path])) throw new Error(rules.failClose(path, closes[path]));
        }
      };
    };
    return fh;
  };
  return { gets, writable, closes };
}
function bytesOfFile(dir, p) {
  return dir.files[p] instanceof Uint8Array ? new Uint8Array(dir.files[p]) : bytes(String(dir.files[p]));
}
async function runA() {
  const original = bytes('hello\nworld\n');
  const syntheticFile = {
    name: 'a.txt', webkitRelativePath: 'fixture/a.txt', size: original.byteLength,
    arrayBuffer: async () => original.slice().buffer
  };
  const dir = await folderCreateMockFromFiles([syntheticFile]);
  const plan = {
    dir, folderName: dir.name,
    items: [{ path: 'a.txt', changed: true, originalBytes: new Uint8Array(original),
      expectedBytes: bytes('patched\n'), patchedContent: 'patched\n' }]
  };
  const structuralChecks = {
    same_dir_reference: plan.dir === dir,
    folder_name_matches: plan.folderName === dir.name,
    one_item: plan.items.length === 1,
    correct_path: plan.items[0].path === 'a.txt',
    changed_true: plan.items[0].changed === true,
    original_bytes_uint8array: plan.items[0].originalBytes instanceof Uint8Array,
    original_bytes_match: equal(plan.items[0].originalBytes, original),
    expected_bytes_uint8array: plan.items[0].expectedBytes instanceof Uint8Array,
    patched_content_string: typeof plan.items[0].patchedContent === 'string'
  };
  const counters = installFaults(dir, {
    failGet: (p,n) => p === 'a.txt' && n === 3 ? 'MOCKED_READ_FAILURE' : null
  });
  const log = await folderRunWriteBatch(dir, plan, () => true);
  const finalBytes = bytesOfFile(dir, 'a.txt');
  const assertions = {
    plan_structurally_valid: Object.values(structuralChecks).every(Boolean),
    status_no_writes_attempted: log.status === 'no_writes_attempted',
    zero_writes_attempted: log.writesAttempted === 0,
    zero_verified_writes: log.verifiedWrites === 0,
    zero_rollback_attempts: log.rollbackAttempts === 0,
    zero_rollback_failures: log.rollbackFailures === 0,
    exactly_three_getFile_attempts: counters.gets['a.txt'] === 3,
    exactly_two_successful_mock_reads: dir.stats.reads === 2,
    no_createWritable_calls: (counters.writable['a.txt'] || 0) === 0,
    no_mock_close_writes: dir.stats.writeAttempts === 0,
    write_failed_entry: !!(log.entries[0] && log.entries[0].status === 'write_failed'),
    entry_error_has_injected_marker: !!(log.entries[0] && String(log.entries[0].error).includes('MOCKED_READ_FAILURE')),
    log_error_has_path_and_marker: String(log.error).includes('a.txt') && String(log.error).includes('MOCKED_READ_FAILURE'),
    file_unchanged: equal(finalBytes, original)
  };
  return {
    test_id: 'FOLDER-LOG-01-A',
    expected_status: 'no_writes_attempted',
    actual: {
      status: log.status, writesAttempted: log.writesAttempted, verifiedWrites: log.verifiedWrites,
      rollbackAttempts: log.rollbackAttempts, rollbackFailures: log.rollbackFailures,
      entries: log.entries, getFileCalls: counters.gets, createWritableCalls: counters.writable,
      mockCloseWrites: dir.stats.writeAttempts, finalFileMatchesOriginal: equal(finalBytes, original), error: log.error
    },
    assertions,
    passed: Object.values(assertions).every(Boolean)
  };
}
async function runCase(id, paths, rules, expected) {
  const dir = await makeDir(paths);
  const originals = Object.fromEntries(paths.map(p => [p, bytes('original-' + p + '\n')]));
  const plan = makePlan(dir, paths);
  const counters = installFaults(dir, rules);
  const log = await folderRunWriteBatch(dir, plan, () => true);
  const finalBytes = Object.fromEntries(paths.map(p => [p, bytesOfFile(dir,p)]));
  const assertions = {};
  for (const [key, test] of Object.entries(expected.assertions)) assertions[key] = !!test({log, counters, finalBytes, originals, dir});
  const passed = Object.values(assertions).every(Boolean);
  return {
    test_id: id, expected: expected.description, expected_status: expected.status,
    actual: {
      status: log.status, writesAttempted: log.writesAttempted, verifiedWrites: log.verifiedWrites,
      rollbackAttempts: log.rollbackAttempts, rollbackFailures: log.rollbackFailures,
      entries: log.entries, getFileCalls: counters.gets, createWritableCalls: counters.writable,
      closeCalls: counters.closes, mockCloseWrites: dir.stats.writeAttempts,
      finalFilesMatchOriginal: paths.every(p => equal(finalBytes[p], originals[p])),
      finalFiles: Object.fromEntries(paths.map(p => [p, new TextDecoder().decode(finalBytes[p])]))
    },
    assertions, passed
  };
}
(async () => {
  const results = [await runA()];
  results.push(await runCase('FOLDER-LOG-01-B', ['a.txt'], {
    failClose: (p,n) => p === 'a.txt' && n === 1 ? 'INJECTED_POST_COMMIT_CLOSE_FAILURE' : null
  }, {
    status: 'recovered',
    description: 'write committed then throws; rollback restores and verifies original bytes',
    assertions: {
      recovered: ({log}) => log.status === 'recovered',
      one_write_entered: ({log}) => log.writesAttempted === 1,
      one_rollback_attempt: ({log}) => log.rollbackAttempts === 1,
      no_rollback_failures: ({log}) => log.rollbackFailures === 0,
      entry_rolled_back: ({log}) => log.entries[0]?.status === 'rolled_back_verified' && log.entries[0]?.rollbackVerified === true,
      original_bytes_restored: ({finalBytes, originals}) => equal(finalBytes['a.txt'], originals['a.txt']),
      exactly_two_committed_mock_closes: ({dir}) => dir.stats.writeAttempts === 2
    }
  }));
  results.push(await runCase('FOLDER-LOG-01-C', ['a.txt'], {
    failClose: (p,n) => p === 'a.txt' && n === 1 ? 'INJECTED_POST_COMMIT_CLOSE_FAILURE' : null,
    failCreate: (p,n) => p === 'a.txt' && n === 2 ? 'INJECTED_ROLLBACK_CREATE_FAILURE' : null
  }, {
    status: 'recovery_failed',
    description: 'write committed then throws; rollback cannot start and original bytes remain unrestored',
    assertions: {
      recovery_failed: ({log}) => log.status === 'recovery_failed',
      one_write_entered: ({log}) => log.writesAttempted === 1,
      one_rollback_attempt: ({log}) => log.rollbackAttempts === 1,
      one_rollback_failure: ({log}) => log.rollbackFailures === 1,
      entry_rollback_failed: ({log}) => log.entries[0]?.status === 'rollback_failed' && log.entries[0]?.rollbackVerified === false,
      patched_bytes_remain: ({finalBytes}) => equal(finalBytes['a.txt'], bytes('patched-a.txt\n'))
    }
  }));
  results.push(await runCase('FOLDER-LOG-01-D', ['a.txt','b.txt'], {
    failClose: (p,n) => p === 'b.txt' && n === 1 ? 'INJECTED_POST_COMMIT_CLOSE_FAILURE_B' : null,
    failCreate: (p,n) => p === 'a.txt' && n === 2 ? 'INJECTED_ROLLBACK_CREATE_FAILURE_A' : null
  }, {
    status: 'recovery_partial',
    description: 'two writes entered; reverse rollback restores b.txt but fails for a.txt',
    assertions: {
      recovery_partial: ({log}) => log.status === 'recovery_partial',
      two_writes_entered: ({log}) => log.writesAttempted === 2,
      two_rollback_attempts: ({log}) => log.rollbackAttempts === 2,
      one_rollback_failure: ({log}) => log.rollbackFailures === 1,
      a_marked_rollback_failed: ({log}) => log.entries.find(e => e.path === 'a.txt')?.status === 'rollback_failed',
      b_marked_rolled_back: ({log}) => log.entries.find(e => e.path === 'b.txt')?.status === 'rolled_back_verified',
      a_remains_patched: ({finalBytes}) => equal(finalBytes['a.txt'], bytes('patched-a.txt\n')),
      b_restored: ({finalBytes, originals}) => equal(finalBytes['b.txt'], originals['b.txt'])
    }
  }));
  results.push(await runCase('FOLDER-LOG-01-E', ['a.txt','b.txt'], {
    failGet: (p,n) => p === 'b.txt' && n === 3 ? 'INJECTED_BEFORE_WRITE_READ_FAILURE_B' : null
  }, {
    status: 'recovered',
    description: 'later item fails before attempted.push; earlier committed item is successfully rolled back',
    assertions: {
      recovered: ({log}) => log.status === 'recovered',
      one_write_entered: ({log}) => log.writesAttempted === 1,
      one_rollback_attempt: ({log}) => log.rollbackAttempts === 1,
      no_rollback_failures: ({log}) => log.rollbackFailures === 0,
      a_restored: ({finalBytes, originals}) => equal(finalBytes['a.txt'], originals['a.txt']),
      b_unchanged: ({finalBytes, originals}) => equal(finalBytes['b.txt'], originals['b.txt']),
      b_write_failed: ({log}) => log.entries.find(e => e.path === 'b.txt')?.status === 'write_failed',
      a_rolled_back: ({log}) => log.entries.find(e => e.path === 'a.txt')?.status === 'rolled_back_verified'
    }
  }));
  const passedCases = results.filter(r => r.passed).length;
  const passedAssertions = results.reduce((n,r) => n + Object.values(r.assertions).filter(Boolean).length, 0);
  const totalAssertions = results.reduce((n,r) => n + Object.keys(r.assertions).length, 0);
  const result = {
    suite_id: 'FOLDER-LOG-01-RC3-DEV-AE',
    source_file: 'raqee3-v8.0.0-rc3-dev.html',
    source_git_blob_sha1: '0ec3926eb43315be86085e0cc275c525ea5ac845',
    source_sha256: 'ebdb9c9f34f09c094d394bda897555758efe7aad9f30e43b41f1bd5fb7b873ed',
    source_basis: 'exact extracted helper and folderRunWriteBatch function text from RC3-DEV candidate; mock File handles only',
    runtime: process.version,
    execution_status: passedCases === 5 && passedAssertions === totalAssertions ? 'COMPLETED' : 'FAILED',
    passed_cases: passedCases, total_cases: results.length,
    passed_assertions: passedAssertions, total_assertions: totalAssertions,
    expected_status_sequence: ['no_writes_attempted','recovered','recovery_failed','recovery_partial','recovered'],
    actual_status_sequence: results.map(r => r.actual.status),
    production_reachability: 'UNPROVEN', browser_integration_status: 'NOT_RUN',
    finding_status: 'OPEN', results, timestamp: new Date().toISOString()
  };
  console.log(JSON.stringify(result, null, 2));
  if (result.execution_status !== 'COMPLETED') process.exitCode = 1;
})().catch(err => { console.error(err && err.stack ? err.stack : String(err)); process.exitCode = 1; });
