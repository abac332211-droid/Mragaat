# AC-1 + AC-5 Reverification — Current Work File

## Target identity
- File: `index-pr2-v8.0.0-work-AC2-clear-patched.html`
- Size: 465411 bytes
- SHA-256: `fb85ba60c04b325e7ee0c56b0891e9f02fe976e831c1c355cdcf8f8077a69050`
- Browser: `Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) HeadlessChrome/144.0.0.0 Safari/537.36`

## AC-1 — PASS
DOM inspection in Chromium:
- `h3` containing `5. التنفيذ`: found.
- `.notice.warn` under the same parent: found.
- class: `notice warn`.
- `document.querySelector` exists.
- warning contains `قاعدة verify:`, the chained-patch failure reason (`رقعًا مترابطة`), and `البديل`.
- Screenshot: `AC1-verify-warning.png`.

Exact warning text:
> ⚠️ قاعدة verify: يُشغَّل على الناتج النهائي بعد كل الرقع، لا بعد كل رقعة. لا تستخدم رقعًا مترابطة (find في رقعة = replace في أخرى) مع verify — سيفشل verify الرقعة الأولى كاذبًا ولن يُنتج ملف. البديل: اجعل verify يتحقق من الحالة النهائية فقط.

## AC-5 — PASS (5/5)
For each case, the test harness set `currentFileName`, configured one enabled patch with `targetFile: 'index.html'`, invoked the page's actual `targetWarning()` function, then read `#targetNotice` from the DOM.

### Case 1 — `index.html`
- `className`: `notice ok`
- `display`: `block`
- `innerHTML`: `✅ اسم الملف <b>index.html</b> مطابق للهدف: <b>index.html</b>`
- Screenshot: `AC5-case-1.png`

### Case 2 — `index-patched.html`
- `className`: `notice ok`
- `display`: `block`
- `innerHTML`: `✅ اسم الملف <b>index-patched.html</b> مطابق للهدف: <b>index.html</b>`
- Screenshot: `AC5-case-2.png`

### Case 3 — `index-patched (2).html`
- `className`: `notice ok`
- `display`: `block`
- `innerHTML`: `✅ اسم الملف <b>index-patched (2).html</b> مطابق للهدف: <b>index.html</b>`
- Screenshot: `AC5-case-3.png`

### Case 4 — `index (2)-patched.html`
- `className`: `notice ok`
- `display`: `block`
- `innerHTML`: `✅ اسم الملف <b>index (2)-patched.html</b> مطابق للهدف: <b>index.html</b>`
- Screenshot: `AC5-case-4.png`

### Case 5 — `index (1)-patched.html`
- `className`: `notice ok`
- `display`: `block`
- `innerHTML`: `✅ اسم الملف <b>index (1)-patched.html</b> مطابق للهدف: <b>index.html</b>`
- Screenshot: `AC5-case-5.png`

## Console / runtime
- JavaScript page errors: 0
- Console errors: 0

## Scope limitations
- The exact target file and SHA-256 above were loaded into Chromium using `page.set_content`.
- AC-5 exercised the actual `targetWarning()` implementation and DOM output, with `currentFileName` and the enabled patch target set by the test harness. It did not perform five real OS file-picker selections or read five physical files.
- This establishes runtime behavior of the target-name matching and notice rendering for the five supplied names, not end-to-end FileReader/file-selection behavior.
- AC-1 and AC-5 passed on the exact current file fingerprint. This does not remove the previously documented AC-2/AC-3/AC-4 limitations.
