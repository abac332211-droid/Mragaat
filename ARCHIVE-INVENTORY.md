# P0 — جرد الأرشيفات ومصادر النسخ

**تاريخ الجرد:** 2026-11-12 (Asia/Aden)  
**المستودع:** `abac332211-droid/Mragaat`  
**الفرع:** `review/direct-racefix2-native-fsa`  
**HEAD الجاري:** `22e49049f9114b812a491e774099961b06a99425`

## النتيجة التنفيذية

- لا يوجد أي ملف `.zip` في شجرة HEAD الحالية (عدد ملفات ZIP في HEAD = صفر).
- كانت الأرشيفات الأربعة التالية موجودة معًا في شجرة الالتزام `d24321fe0af741b4fa5d2daffaa2dd3d078a7bb4`، ثم يظهر Git Compare أنها حُذفت جميعًا في الانتقال من ذلك الالتزام إلى HEAD الحالي.
- الأرشيفات لم تختفِ من تاريخ Git؛ كائناتها محفوظة ويمكن الرجوع إليها من الالتزامات المدرجة أدناه.
- `Git Blob SHA-1` أدناه هو معرف Git للملف الثنائي، وليس SHA-256 لمحتوى ZIP. لم تُسجّل SHA-256 للأرشيفات الثنائية في هذا الفحص؛ لا تخلطها ببصمات الملفات النصية المفكوكة.

## الأرشيفات الأربعة

| الأرشيف | حجم ZIP بالبايت | Git Blob SHA-1 | التزام الإضافة | تاريخ الإضافة UTC | الحالة عند HEAD الحالي |
|---|---:|---|---|---|---|
| `DIRECT-RACE-01-04-RACEFIX-artifacts.zip` | 171608 | `bfa77f91db89c6079cc258851404ede1afc923d8` | `d24321fe0af741b4fa5d2daffaa2dd3d078a7bb4` | 2026-11-07 05:38:28 | محذوف من الشجرة؛ محفوظ في Git history |
| `DIRECT-RACE-01-04-artifacts.zip` | 150152 | `750e0a5c4fda35c80356c037d0d9134250f95646` | `8fcbfd89ab57c960a2042e156979e816244dc714` | 2026-11-06 14:58:57 | محذوف من الشجرة؛ محفوظ في Git history |
| `FOLDER-LOG-01-RC3-DEV-AE-artifacts-02.zip` | 140257 | `a689e71dac0e94b188e721db5960a555249a2c08` | `293c2799e145bc4954f7d0a27234ca2b0f9c6522` | 2026-11-06 13:40:19 | محذوف من الشجرة؛ محفوظ في Git history |
| `رقيع المطور.zip` | 142959 | `c781ae44635716ae5fd1cd47cfe2e19f1b23a00a` | `dbac27a2a7aa7c660bf5f1f3a2e7c73dc4ee15d0` | 2026-11-06 12:12:41 | محذوف من الشجرة؛ محفوظ في Git history |

**التزام المقارنة الجامع:** `d24321fe0af741b4fa5d2daffaa2dd3d078a7bb4`، شجرته `29fdbcf4150364864845187bc605088f8f7cbd70`. المقارنة إلى HEAD `22e49049f9114b812a491e774099961b06a99425` أعادت `status=ahead`, `ahead_by=18` وسجلت الأرشيفات الأربعة بالحالة `removed`.

## محتويات الأرشيفات حسب الجرد السابق

### 1. DIRECT-RACE-01-04-RACEFIX-artifacts.zip — 11 عنصرًا

- `A-B-byte-ledger.csv`
- `BUILD-METADATA.json`
- `DIRECT-RACE-01-04-RACEFIX-harness.py`
- `DIRECT-RACE-01-04-RACEFIX-result.json`
- `RC3-DEV-to-RACEFIX.patch`
- `README-DIRECT-RACE-01-04-RACEFIX.md`
- `SHA256SUMS.txt`
- `raqee3-v8.0.0-rc3-dev-racefix.html`
- `run-01.json`
- `run-02.json`
- `run-03.json`

### 2. DIRECT-RACE-01-04-artifacts.zip — 9 عناصر

- `A-B-byte-ledger.csv` (4835 bytes)
- `DIRECT-RACE-01-04-harness.py` (14858 bytes)
- `DIRECT-RACE-01-04-result.json` (121161 bytes)
- `README-DIRECT-RACE-01-04.md` (6458 bytes)
- `SHA256SUMS.txt` (705 bytes)
- `raqee3-v8.0.0-rc3-dev-tested.html` (483593 bytes)
- `run-01.json` (37579 bytes)
- `run-02.json` (37579 bytes)
- `run-03.json` (37579 bytes)

### 3. FOLDER-LOG-01-RC3-DEV-AE-artifacts-02.zip — 10 عناصر

داخل مجلد ZIP الداخلي `FOLDER-LOG-01-RC3-DEV-AE-package-02/`:

- `FOLDER-LOG-01-RC3-DEV-AE-harness.node.js` (26967 bytes)
- `RC2-to-RC3-DEV.patch` (1512 bytes)
- `RC3-DEV-build-metadata.json` (2400 bytes)
- `README-FOLDER-LOG-01-RC3-DEV-02.md` (4673 bytes)
- `SHA256SUMS.txt` (799 bytes)
- `SYNTAX-CHECK.txt` (345 bytes)
- `raqee3-v8.0.0-rc3-dev.html` (483593 bytes)
- `run-01.json` (7964 bytes)
- `run-02.json` (7964 bytes)
- `run-03.json` (7964 bytes)

### 4. رقيع المطور.zip — 6 عناصر

- `EVIDENCE.md` (20594 bytes)
- `r2-test v4.6.html` (18381 bytes)
- `r1-test v4.4.html` (17083 bytes)
- `tests.html` (42498 bytes)
- `EVIDENCE-test-run-2026-10-29T19-21-05.json` (3684 bytes)
- `index.html` (437963 bytes، CRC32 `41907657` بحسب جرد ZIP السابق)

## النسخ ذات الأسماء المشتركة — لا تعتمد على الاسم وحده

| الاسم | مصادره/أحجامه المعروفة | ملاحظة التمييز |
|---|---|---|
| `A-B-byte-ledger.csv` | حزمة RACEFIX وحزمة DIRECT الأساسية | نسختان بمحتويين/بصمتين مختلفتين؛ النسخة الحالية في HEAD حجمها 4835 bytes وهي النسخة الموجودة في حزمة DIRECT الأساسية بحسب مقارنة الرفع السابقة. |
| `SHA256SUMS.txt` | RACEFIX: 907 bytes؛ DIRECT الأساسية: 705 bytes؛ FOLDER-LOG: 799 bytes | ثلاث نسخ مختلفة. النسخة الحالية في HEAD حجمها 799 bytes وهي بيان FOLDER-LOG، لا Manifest شامل للمستودع. |
| `run-01.json`, `run-02.json`, `run-03.json` | RACEFIX: 83558 bytes لكل ملف؛ DIRECT الأساسية: 37579 bytes لكل ملف؛ FOLDER-LOG: 7964 bytes لكل ملف | النسخ ليست متبادلة. الملفات الحالية في HEAD حجمها 7964 bytes وهي مجموعة FOLDER-LOG. |
| `raqee3-v8.0.0-rc3-dev.html` / `raqee3-v8.0.0-rc3-dev-tested.html` | 483593 bytes | متطابقتان بايتًا بحسب Git Blob SHA-1 المشترك `0ec3926eb43315be86085e0cc275c525ea5ac845` وSHA-256 المشترك `ebdb9c9f34f09c094d394bda897555758efe7aad9f30e43b41f1bd5fb7b873ed`؛ اختلاف اسم فقط. |
| `index.html` في رقيع المطور | ZIP: 437963 bytes / CRC32 `41907657`; نسخة تاريخية عند commit `3c2429da4c6866a8d498e218e46a535278f5a8b7`: 437963 bytes | النسخة التاريخية تطابق الحجم وتاريخ ZIP بحسب الجرد السابق. Git Blob SHA-1: `e8b7e92cfa1b01e66050dddfd065ea356e2c99a9`; SHA-256 محسوبة هنا: `008e240d6a64ebfc07dfeff6afe1b464f971bb7dc7b0392e19ac3b649e5c3377`. |
| `index.html` في HEAD الحالي | 446164 bytes | نسخة أحدث ومختلفة؛ Git Blob SHA-1 `9bc89f98f9283b7e2536924d5c011299f1ccee71`; SHA-256 `1dadf2fc5dc22fa6b78755db37acdca7edb96dd848cb37a8c391f96f1fe255cb`. لا تُستبدل بالنسخة التاريخية تلقائيًا. |

## مصدر نسخ RC3 وRACEFIX وFOLDER-LOG وDIRECT-02

- RC2 المرجعي الحالي: `raqee3-v8.0.0-rc2-candidate.html`, 483360 bytes, SHA-256 `8b7357295f333a44b861d03d555b86b475df53bc1227b9cb5f195026bd4fda9c`.
- RC3-DEV baseline: `raqee3-v8.0.0-rc3-dev.html`، وهو مطابق بايتًا لـ`raqee3-v8.0.0-rc3-dev-tested.html`; 483593 bytes, SHA-256 `ebdb9c9f34f09c094d394bda897555758efe7aad9f30e43b41f1bd5fb7b873ed`.
- RACEFIX work copy: `raqee3-v8.0.0-rc3-dev-racefix.html`, 492397 bytes, SHA-256 `29f454fbf77a3e78336a8ca82ec01843ed8e2dff42a27cd911b5879e85573632`.
- RACEFIX2 file in current tree: `raqee3-v8.0.0-rc3-dev-racefix2.html`, 495312 bytes, SHA-256 `6e41866ff757518f641546083e5441e19f153c3585a6b43799fd2daa66561c13`.
- `BUILD-METADATA.json` يوثق أساس RC3-DEV وRACEFIX والاختبارات في Chromium بمقابض ذاكرية؛ يصرح أن Native FSA والكتابة إلى القرص الفعلي لم تُختبرا وأن production reachability غير مثبتة.
- `RC3-DEV-build-metadata.json` و`README-FOLDER-LOG-01-RC3-DEV-02.md` يوثقان تعديل تصنيف FOLDER-LOG-01 واختبار Node mock؛ لا يثبتان Native FSA أو الكتابة الفعلية.
- ملفات DIRECT-02 الحالية تتضمن صفحة `DIRECT-02-NativeFSA-Runner-Final.html` وتقارير سابقة، إضافة إلى تقريري Runner v1.1.9. وجود التقرير أو PASS داخله لا يعني اعتماد Native FSA؛ تقريرا v1.1.9 يعلنان `UNVALIDATED_HARNESS`, `NOT_ATTESTED`, `NOT_AUTHORIZED` و`closure_authorized=false` في البيانات التي سبق فحصها.
- ملفات الأدلة والاختبارات تبقى تقارير مصدرية؛ لا يجوز تحويل نتيجة Mock إلى إثبات Native أو اعتماد إصدار.

## حزمة اختبار رقيع ذات 8 ملفات — منفصلة

الالتزام `9578aba1dad20f2024f63cd0e1de3d6aa55b4b10` يخص حزمة اختبار رقيع ذات الثمانية ملفات، وليس حزمة DIRECT-RACE-01-04. لا تُدمج في جرد الأرشيفات الأربعة أعلاه.

## حدود الجرد

هذا الجرد يثبت وجود الأرشيفات تاريخيًا وأحجامها وGit Blob SHA-1 والتزامات إضافتها/حذفها، ويسجل قوائم المحتويات المستخرجة سابقًا. لم تُحسب SHA-256 للملفات ZIP الثنائية نفسها في هذا التدقيق؛ كما أن عدم وجودها في HEAD يعني عدم وجود «نسخة حالية» يمكن مقارنتها byte-for-byte داخل الشجرة الحالية. لا يُعد Git Blob SHA-1 بديلًا عن SHA-256.
