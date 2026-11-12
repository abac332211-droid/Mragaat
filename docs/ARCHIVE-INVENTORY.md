# P0 — جرد الأرشيفات ومصادر النسخ

تاريخ الجرد: 2026-11-12  
المستودع: `abac332211-droid/Mragaat`  
الفرع: `review/direct-racefix2-native-fsa`  
HEAD: `c4a4eabdebd3062df14fb5d88a0b8c1c2588139d`

## النتيجة
لا يوجد أي ZIP في HEAD الحالي. الأرشيفات الستة أدناه تاريخية ومحفوظة في Git history؛ لا تستعدها إلى HEAD ولا تحذفها من التاريخ تلقائيًا. SHA-256 المذكورة هي للأرشيف الخام، وGit Blob SHA-1 معرف Git منفصل. لم تُفك جميع حمولات ZIP وتُعاد تجزئتها؛ لذلك لا ندّعي تحقق CRC/محتوى كامل لكل عنصر.

| الأرشيف | الحجم | Git Blob SHA-1 | SHA-256 | الالتزام التاريخي |
|---|---:|---|---|---|
| `DIRECT-RACE-01-04-RACEFIX-artifacts.zip` | 171608 | `bfa77f91db89c6079cc258851404ede1afc923d8` | `e36e491e4d88c6fa38a4a0de73beb1e4d8c7a450f1f394e25ed0a1ce2905200c` | `d24321fe0af741b4fa5d2daffaa2dd3d078a7bb4` |
| `DIRECT-RACE-01-04-artifacts.zip` | 150152 | `750e0a5c4fda35c80356c037d0d9134250f95646` | `d47a85f07efb350ab0817523bc5b9eaf6531012aa4e37308339ea51b09ec51f3` | `8fcbfd89ab57c960a2042e156979e816244dc714` |
| `FOLDER-LOG-01-RC3-DEV-AE-artifacts-02.zip` | 140257 | `a689e71dac0e94b188e721db5960a555249a2c08` | `ca9bdfda257d288561da9c93fd0ded0ed117cc06e8f0613002f1542ccd4cbb5d` | `293c2799e145bc4954f7d0a27234ca2b0f9c6522` |
| `رقيع المطور.zip` | 142959 | `c781ae44635716ae5fd1cd47cfe2e19f1b23a00a` | `f4e48102e7e2b52b20e2ba75d06f33964edc2920d44b118ea2fec3b5e4f25024` | `dbac27a2a7aa7c660bf5f1f3a2e7c73dc4ee15d0` |
| `DIRECT-02-NATIVE-FSA-RUNNER-v1.1.9-PACKAGE.zip` (auxiliary) | 173612 | `cc0adb0428ab2447c10d6863675ad76bd6d7c1fc` | `1439624aef2d1bbdb39f97414fd5e60b2e0112d6d1b87aabcfaf98333ef98835` | `2ea461c56c4b787d5cb0deaf425796fda99ac5be` |
| `FOLDER-LOG-01-BE-artifacts.zip` (auxiliary) | 13470 | `3b558f8a5a4c0e08c19bab158e65fdd1bb5c0f7a` | `72290fb68b3bf518a29c4be093caaa3698a807140cd2c560567cd699857cece8` | `d2505186c5b395f7aee8b3273241c2616fc19d60` |

## محتويات الحزم الرئيسية

### `DIRECT-RACE-01-04-RACEFIX-artifacts.zip` — 11 عنصرًا
`A-B-byte-ledger.csv`, `BUILD-METADATA.json`, `DIRECT-RACE-01-04-RACEFIX-harness.py`, `DIRECT-RACE-01-04-RACEFIX-result.json`, `RC3-DEV-to-RACEFIX.patch`, `README-DIRECT-RACE-01-04-RACEFIX.md`, `SHA256SUMS.txt`, `raqee3-v8.0.0-rc3-dev-racefix.html`, `run-01.json`, `run-02.json`, `run-03.json`.

### `DIRECT-RACE-01-04-artifacts.zip` — 9 عناصر
`A-B-byte-ledger.csv` (4835 B), `DIRECT-RACE-01-04-harness.py` (14858 B), `DIRECT-RACE-01-04-result.json` (121161 B), `README-DIRECT-RACE-01-04.md` (6458 B), `SHA256SUMS.txt` (705 B), `raqee3-v8.0.0-rc3-dev-tested.html` (483593 B), `run-01.json`, `run-02.json`, `run-03.json` (37579 B لكل ملف).

### `FOLDER-LOG-01-RC3-DEV-AE-artifacts-02.zip` — 10 عناصر
داخل `FOLDER-LOG-01-RC3-DEV-AE-package-02/`: `FOLDER-LOG-01-RC3-DEV-AE-harness.node.js` (26967 B), `RC2-to-RC3-DEV.patch` (1512 B), `RC3-DEV-build-metadata.json` (2400 B), `README-FOLDER-LOG-01-RC3-DEV-02.md` (4673 B), `SHA256SUMS.txt` (799 B), `SYNTAX-CHECK.txt` (345 B), `raqee3-v8.0.0-rc3-dev.html` (483593 B), وثلاثة ملفات run بحجم 7964 B لكل منها.

### `رقيع المطور.zip` — 6 عناصر
`EVIDENCE.md` (20594 B), `r2-test v4.6.html` (18381 B), `r1-test v4.4.html` (17083 B), `tests.html` (42498 B), `EVIDENCE-test-run-2026-10-29T19-21-05.json` (3684 B), `index.html` (437963 B؛ CRC32 `41907657` حسب فهرس ZIP).

## الأرشيفان المساعدان
- `DIRECT-02-NATIVE-FSA-RUNNER-v1.1.9-PACKAGE.zip` — 10 عناصر: manifest v1.1.9، runner HTML، README، SHA256SUMS، التطبيق racefix2، ملفات history v1.1.8، وfixtures A/B.
- `FOLDER-LOG-01-BE-artifacts.zip` — ستة ملفات: SHA256SUMS، run-01/02/03، harness Node، README.

## الأسماء المشتركة والنسخ
- `A-B-byte-ledger.csv` في حزم RACEFIX وDIRECT ليس مضمونًا أنه نفس المحتوى؛ اربط كل نسخة بحزمتها وبصمتها.
- `SHA256SUMS.txt`: ثلاث نسخ معروفة بأحجام 907 B (RACEFIX)، 705 B (DIRECT)، 799 B (FOLDER-LOG). النسخة الحالية 799 B وتخص FOLDER-LOG فقط.
- `run-01/02/03.json`: نسخ RACEFIX 83558 B، DIRECT 37579 B، FOLDER-LOG 7964 B؛ لا تستبدل إحداها بالأخرى بالاسم وحده.
- `raqee3-v8.0.0-rc3-dev.html` و`raqee3-v8.0.0-rc3-dev-tested.html` متطابقان في النسخة الحالية: 483593 B، Git Blob SHA-1 `0ec3926eb43315be86085e0cc275c525ea5ac845`.
- `index.html` التاريخي في حزمة المطور 437963 B؛ النسخة الحالية 446164 B. النسخة التاريخية محفوظة عند commit `3c2429da4c6866a8d498e218e46a535278f5a8b7`. لا تستبدل الحالية بها دون قرار صريح.

## مجموعات Fixtures — تمييز بالبصمة لا بالاسم
1. DIRECT-RACE mock: A=949 B، SHA-256 `1e32bcc37093e4248951245d92354805ed105172c8a1c50811981cbf6b5ac87b`; B=51 B، SHA-256 `7402f922922028f2963ed0ed380a7fd65b82529d9b67a67413bd2403cf4800dd`.
2. DIRECT-02 FINAL: A=1213 B، SHA-256 `1c11f7716973614bf592ddcfeb74ae48adaa28f725816922d63963259befb85a`; B=174 B، SHA-256 `88ebee9279a80a80b9eda7478e9859bfd235d2a184ecce696157ba7163beedd7`.
3. DIRECT-02 Runner v1.1.9: A=1213 B، SHA-256 مثل المجموعة 2؛ B=51 B، SHA-256 `2e29ee092d94c0df07fb4c7f2410de92089dc7f24521f80431a2bab283de9583`. هذه B مختلفة عن B الحالية 174 B.

## ملاحظات مصادر النتائج
- DIRECT-RACE pre-fix: 12/12 race reproductions، 51/72 assertions، و12 invariant failures؛ mock Chromium.
- RACEFIX: 24/24 safe و288/288 assertions عبر ثلاث جولات Chromium؛ FileSystem mock، وليس Native FSA حقيقيًا.
- DIRECT-02 final reports: 6 forced PASS ثم نتيجتان إضافيتان PASS على fixtures A1213/B174.
- Runner v1.1.9 report الأول: 7/8 forced PASS و2 UI PASS؛ `RUNTIME_FAIL_NOT_APPROVED` و`closure_authorized=false`.
- التقرير الثاني: 8/8 forced PASS و1 UI PASS، لكنه `NOT_AUTHORIZED`؛ `reference_run_status=NOT_EXECUTED`, `native_fsa_status=NOT_ATTESTED`, `closure_authorized=false`.
- PR-2 design review مراجعة تصميم ثابتة مرتبطة بحزمة المطور، وليست تشغيلًا متصفحًا.
- تقارير PR-2 تشير إلى `index-pr2-v8.0.0-candidate.html` ببصمة `c94943210814189d9e340731491444f85188fe7977ff6f619ff982f852649e85`، لكن الملف غير موجود في HEAD؛ هذه النتائج report-only.
- V3-v5 مراجعة ساكنة؛ Runner لم ينفذ؛ V3 ما زالت BLOCKED.

## حدود الدليل
المعلومات أعلاه تميز بين ملفات HEAD، والأرشيفات التاريخية، والتقارير، ونتائج mock، وادعاءات Native FSA. لم تُفك جميع ZIPs ويُعاد حساب بصمات كل payload؛ لا تُعامل أسماء الملفات أو PASS في تقرير على أنها اعتماد. لا تستعد أي أرشيف أو تبدّل ملفًا مشترك الاسم تلقائيًا.
