# سجل الأدلة — رقيع المطوّر

> يُحدَّث هذا السجل من داخل الأداة بعد فحص الرقع أو تطبيقها أو اختبار رقعة مفردة. يميّز السجل بين بصمة ملف اختير فعليًا، وبصمة ناتج مرشّح، وبصمة ملف تمت كتابته والتحقق منه.
>
> **قاعدة التوثيق:** `reported` تعني أن نتيجة سابقة أُبلغ عنها ولم يُحفظ أثرها الأصلي هنا. ولا تتحول إلى `runtime-tested (artifact saved)` بمجرد نقلها إلى هذا الملف.

## حالة الإصدار

**v7.0.9 — R1/R2 gates passed (2026-10-30).**

- R1: `real-browser integration verified`
- R2: `real-browser integration verified`
- **خارج نطاق اعتماد v7.0.9**: F3-adj, F6, TOCTOU, أعطال فيزيائية, PR-2..PR-5. **تبقى مفتوحة على مستوى المشروع ككل** (انظر «بوابات لا تزال مفتوحة»).
- البصمة المرجعية: `008e240d...`

**PR-2 على `f514af44...` — Reported closed (2026-11-01); operator-supplied evidence, pending independent verification.**

- 26/26 محك v2.4، R1/R2 على البصمة `f514af44`، Folder Mode عربي، Smart Search 5/5.
- `unicodeNfc` في الواجهة: `false` (مُعطَّل بقرار).
- التحفظات المسجلة والتفاصيل الكاملة في «بوابات الإصدار PR-2 — f514af44» أدناه.
- **لا اعتماد إنتاجي، لا نشر، لا استبدال لـ `index.html` المنشور.**

**PR-2 v8.0.0 — In progress (2026-11-01).**

- **Cycle 1** (`c949432`): **closed with partial failure**. v2.6c-fast كشف 18/21 (3 فشل في `smartReplacementText` — Policy A غير محققة). سبب الإغلاق: رقعة `smartReplacementText` مطلوبة.
- **Cycle 2** (`22d21d42`, candidate-2): **technically tested, pending review**. جميع المجموعات الست PASS على المتصفح. `smartReplacementText` Policy A مُطبَّقة ومُختبَرة. `mapOverflow` مُختبر عند الحد الحقيقي 65536/65537.
- **Pending**: Android performance، مراجعة بشرية مستقلة، تقييم مدى دعم `\p{M}` في مصفوفة المتصفحات المستهدفة.
- **لا اعتماد إنتاجي، لا نشر، لا استبدال `index.html`.**

## هوية النسخة المرجعية

- **اسم الملف المرجعي:** `index-v7.0.8-pr-evidence-008e240d.html`
- **SHA-256 الكامل:** `008e240d6a64ebfc07dfeff6afe1b464f971bb7dc7b0392e19ac3b649e5c3377`
- **حجم الملف بالبايت:** `437963`
- **إصدار المحرك داخل الملف:** `v7.0.8` — لم يُرفع رقم المحرك في هذا التعديل.
- **تاريخ تثبيت النسخة المرجعية:** `2026-10-29`
- **مصدر البصمة:** بايتات الملف الأصلي كما حُسبت بواسطة محك المتصفح (`crypto.subtle`). لم تُشغَّل `sha256sum` على الملف في هذه الجلسة.
- **تأكيد مستقل من المحك:** ملف `index.html` المحلي يُطابق بصمة الاسم المنشور (`008e240d...`، `437,963` بايت، بلا BOM). التشغيل موثق في «سجل التشغيلات الموثقة» أدناه.
- **تأكيد جودة المحك:** المحك أُثبتت قدرته على كشف عطل «الحالة B» عند تعطيل `script` من `rawLikeTags` (`PASS`). راجع قسم «سجل التشغيلات الموثقة».

## مصدر التعديل

- **اسم الملف الوارد:** `index-BEFORE-PR1.html`
- **SHA-256 قبل التعديل:** `ddc05869ed2478af87d3d290449302d1037212969029730e213d062a6fb3499d`
- **الحجم قبل التعديل:** `405498` بايت.
- **ما ثبت بفحص المصدر:** رغم اسم الملف، يحتوي المصدر على تنفيذ `extractHtmlSection` بالماسح المتوازن، وتعليق `V8 PR-1 VERIFIED`، وكذلك مسار الكتابة والتحقق. لا يُستخدم اسم الملف وحده للحكم على محتواه.

## PR-EVIDENCE — أتمتة سجل الأدلة

- **الحالة:** `implemented; isolated and mocked integration tests passed; real-device file access pending`
- **ما أُضيف:**
  - زر `📎 ربط/تحديث EVIDENCE.md` بجوار «تقرير كامل».
  - زر احتياطي `⬇️ تصدير سجل الأدلة` لتنزيل نسخة Markdown عند تعذّر الوصول المباشر.
  - التقاط SHA-256 للبايتات الأصلية عند اختيار الملف المستهدف، قبل تطبيع نهايات الأسطر داخل الذاكرة.
  - تحديث كتلة هوية النسخة تلقائيًا عند تحميل ملف HTML اسمه يطابق `index*.html`، مع الحفاظ على تاريخ التثبيت إذا بقي الاسم والبصمة متطابقين.
  - تسجيل الفحص فقط، والتطبيق، واختبار الرقعة المفردة؛ ويشمل السجل الأعداد ونتيجة تحقق المحرك ونتائج الرقع الفردية.
  - حساب SHA-256 وحجم الناتج المرشّح، وعدم وصف رابط التنزيل بأنه إثبات أن المستخدم نزّل الملف.
  - عند الكتابة المباشرة، تسجيل بايتات الملف المقروءة بعد الكتابة ومقارنتها ببصمة الناتج المرشّح.
  - حفظ السجلات المعلّقة محليًا، ومزامنتها بعد ربط ملف `EVIDENCE.md`، مع معرّف يمنع تكرار السجل نفسه.
  - حفظ مقبض الملف في IndexedDB متى دعمت البيئة ذلك؛ تبقى صلاحية الكتابة خاضعة لإذن المتصفح.
  - تحديث رسالة الحالة لتمييز السجل المزامَن من السجل المعلّق أو المحفوظ في ذاكرة الجلسة فقط.
- **الاختبارات المنفذة في هذا التعديل:**
  - `3/3` كتل JavaScript المضمّنة اجتازت تحليل الصياغة عبر `Node vm.Script`.
  - اختبارات SHA-256 المعروفة نجحت: النص الفارغ و`abc`، باستخدام مسار SHA-256 الاحتياطي.
  - اختبار معزول للدالة الفعلية `extractHtmlSection` في الملف: حافظ على نهاية عنصر `<article>` الخارجي بعد وجود `<article>` متداخل، وحافظ على عنصر `<article>` الشقيق التالي؛ أُنتجت نتيجتان فقط. تضمّن الإدخال محتوى `<textarea>` و`<title>` يحوي وسومًا ظاهرية.
  - اختبار تكامل بمحاكاة `FileSystemFileHandle`: أُضيف السجل تلقائيًا، بقي عدد البلوكات نفسه بعد إعادة المزامنة، حُدِّثت كتلة الهوية، أُدرجت نتيجة الرقعة وتفاصيل `verify` لكل رقعة، وفرغت قائمة الانتظار بعد نجاح الكتابة الوهمية.
  - اختبار محاكاة لكتابة مرشّحة وكتابة فعلية متطابقتين: سُجِّلت بصمتا SHA-256 منفصلتان وأظهر السجل مطابقتهما.
- **أثر الاختبار القابل لإعادة التشغيل:** `test-evidence-automation.js` — SHA-256: `3f1f1a7a30efcb2b5db1693d02ca50c6fa13d35d45ca9f0d9a594cc2b22751ab`.
- **سجل آخر تشغيل للاختبار:** `EVIDENCE-test-run.log` — SHA-256: `2a04f129a2db8b62e97f9670d6d7453904fba9f3f4001f60b4e26eca344d9703`.
- **نتيجة الأثر المحفوظ:** `5/5` اختبارات في harness؛ تتضمن هذه النتيجة اختبارات معزولة ومحاكاة، لا اختبار كتابة على جهاز فعلي.
- **حدود الاختبار:**
  - تعذّر تشغيل الصفحة في Chromium في بيئة الاختبار؛ رُفض كل من عنوان `file://` والخادم المحلي بالخطأ `ERR_BLOCKED_BY_ADMINISTRATOR`. لذلك لم تُصنَّف الواجهة كلها على أنها مختبرة في المتصفح.
  - الكتابة إلى ملف `EVIDENCE.md` حقيقي على جهاز المستخدم **لم تُختبر بعد**؛ اختبار الكتابة أعلاه استخدم مقبض ملف وهميًا، لا ملفًا على القرص.
  - يحتاج الربط الأول إلى اختيار `EVIDENCE.md` ومنح إذن الكتابة في متصفح يدعم File System Access API. هذه قيود أمان من المتصفح، وليست كتابة تلقائية بلا إذن.

## PR-1 — `extractHtmlSection` / balanced scanner

- **الحالة التاريخية:** `integration-tested (reported)` — وفق تقرير سابق من مالك المشروع؛ لا تُعاد الاختبارات لمجرد بدء محادثة جديدة.
- **النتائج المُبلّغ عنها سابقًا:** `19/19` اختبارات معزولة، و`2/2` اختبار تكامل (`<textarea>` داخل `<article>` و`<title>` داخل `<article>`)، إضافة إلى `already-applied detection` و`rawLikeTags` و`findRawClose`. لم تُرفق مخرجات الجلسة الأصلية بهذا الملف.
- **التحقق الإضافي في هذه الجلسة:** اختبار معزول للنسخة الفعلية من الدالة؛ نجح في حفظ العنصر الخارجي ومحتواه بعد العنصر المتداخل وعدم احتساب العنصر الشقيق ضمن العنصر الأول.
- **الحكم:** تنفيذ الماسح المتوازن موجود في النسخة المرجعية. الاختبار المعزول في هذه الجلسة محفوظ بوصفه نتيجة موثقة هنا؛ أما تقرير التكامل السابق فيبقى `reported` لعدم وجود أثره الأصلي.

## الرقع السابقة — حالة منقولة من سجل المشروع

- **fix2 — MIME:** `runtime-tested (reported)` — أُبلغ عن اختباره على الجهاز؛ لا يوجد أثر الاختبار الأصلي هنا.
- **fix3 — اسم ملف الناتج:** `runtime-tested (reported)` — أُبلغ عن اختباره على الجهاز؛ لا يوجد أثر الاختبار الأصلي هنا.
- **fix4 — الحد الأدنى/الأقصى:** `runtime-tested (reported)` — أُبلغ عن اختباره على الجهاز؛ لا يوجد أثر الاختبار الأصلي هنا.
- **fix5 — `maxCount: 0`:** `reasoned/static-reviewed (reported)`؛ لا يُعد اختبار تشغيل ناجحًا.
- **F1 — `customMsg`:** `reasoned/static-reviewed (reported)`؛ لا يوجد إثبات تشغيل مستقل محفوظ هنا.
- **F2 / F9:** `reasoned/static-reviewed (reported)`؛ لم تُسجّل في هذه الجلسة اختبارات تشغيل جديدة لهما.

## الكتابة والتحقق (write / verify)

- **الحالة التاريخية:** `runtime-tested (reported)`.
- **النتيجة المُبلّغ عنها سابقًا:** أربع تشغيلات ناجحة على Chrome للهواتف؛ تغيّر الملف فعليًا؛ كان `_verifyLevel === 'full'`؛ وتطابق الحجم وSHA-256 مع المتوقع.
- **الحد المعروف:** مسار `rollback` لم يُستدعَ في تلك التشغيلات، ولذلك لا يصح وصفه بأنه مختبَر.

### مشاهدة تشغيلية — فشل حفظ مباشر مع تراجع آمن (2026-10-30)

- **السياق:** تطبيق رقعة `evidence-add-release-status-v7-0-9` على `EVIDENCE-current.md` في وضع «تعديل الملف الأصلي مباشرةً».
- **الحدث:** أثناء محاولة الحفظ، أعاد المتصفح `NotFoundError` («A requested file or directory could not be found…»)، لأن الملف أُعيدت تسميته خارجيًا (`EVIDENCE-current.md` → `EVIDENCE.md`) بينما كان مفتوحًا في الأداة.
- **سلوك الأداة:**
  - طُبّقت الرقعة في الذاكرة بنجاح؛ اجتازت 3/3 فحوص `verify`.
  - لم تكتب الأداة على أي ملف؛ اعترضت `NotFoundError` **قبل بدء الكتابة**.
  - تراجعت إلى التنزيل البديل (`⬇️ تنزيل الملف المُرقَّع`).
  - الملف المنزَّل `EVIDENCE-current-patched.md` يحوي الرقعة كاملة، وهو الذي اعتُمد بعد إعادة التسمية إلى `EVIDENCE.md`.
- **التصنيف:** `real-world observation` — ليست بوابة إصدار، ولا تُرقّي R1 أو R2، ولا تُغلق أي بند.
- **ما يُثبته:** أن مسار الفشل الآمن (لا كتابة جزئية، لا إنشاء ملف بديل، تنزيل واضح) يعمل في بيئة Android/Chrome حقيقية عند فشل الكتابة **قبل** بدء التحقق.
- **ما لا يُثبته:** لا يُثبت rollback بعد بدء الكتابة (R1 مُغطّى باختبارها)، ولا TOCTOU بعد بدء الكتابة (R2 مُغطّى باختبارها)، ولا سلوك الأعطال الفيزيائية (خارج النطاق).

## بوابات الإصدار v7.0.9

### R1 — Real-browser integration verification

- **الحالة:** `real-browser integration verified; physical-failure scenarios pending`.
- **البيئة:** Chrome على Android، باستخدام File System Access API، مع صلاحية readwrite ممنوحة لمجلد اختبار مستقل (`R1`).
- **النسخة المختبرة:** `index.html` — SHA-256: `008e240d6a64ebfc07dfeff6afe1b464f971bb7dc7b0392e19ac3b649e5c3377` (يطابق الأصل).
- **الفحص البنيوي قبل التشغيل:** 7/7 — الكود الحرج لـ R1 موجود في الملف المختبر.
- **الأداة:** `r1-test.html v4.4` — 3 أزرار منفصلة، فحص بنيوي بدل بصمة ثابتة، مُختبر على Chrome/Android.
- **النتيجة التشغيلية:**
  - `status = recovered`
  - `bCorrupted = 1`
  - `bWriteCallAttempts = 2`
  - `verifiedWrites = 1`
  - `rollbackAttempts = 2`
  - `rollbackFailures = 0`
  - المحتوى النهائي المقروء من القرص عبر File System Access API:
    - `a.txt = HELLO-A`
    - `b.txt = HELLO-B`
- **الاستنتاج:** `folderRunWriteBatch` استعاد المحتوى الأصلي للملفين في اختبار تكامل باستخدام مقابض ملفات حقيقية، بعد حقن فساد لمرة واحدة في مسار كتابة `b.txt`.
- **حدود الإثبات:** لا تغطي النتيجة انقطاع الطاقة، أو امتلاء التخزين، أو تعطل المتصفح، أو فشل عملية الاستعادة نفسها، ولا تمثل تحققًا مستقلًا من ثبات البيانات على وسيط التخزين الفيزيائي بعد انقطاع الطاقة.
- **ملاحظة تصنيف:** العطل المحقون عطل **منطقي** في طبقة الكتابة، لا عطل فيزيائي في وسيط التخزين. ما أُثبت هو **مسار الاستعادة**، لا **مقاومة الكوارث**.
- **قرار البوابة:** **مغلقة** على مستوى المنطق + التكامل الحقيقي. تبقى ملاحظة مفتوحة لسيناريوهات الأعطال الفيزيائية، وهي خارج نطاق الأدوات الحالية.

### R2 — `freshness_check`

- **الحالة:** `real-browser integration verified (Chrome on Android, File System Access API); physical-failure scenarios pending`.
- **البيئة:** Chrome على Android، File System Access API، صلاحية readwrite على مجلد `R1`.
- **النسخة المختبرة:** `index.html` — SHA-256: `008e240d6a64ebfc07dfeff6afe1b464f971bb7dc7b0392e19ac3b649e5c3377` (يطابق الأصل).
- **الأداة:** `r2-test.html v4.6` — ثلاثة أزرار منفصلة، حقن تغيير خارجي بين `freshness_check_1` و`freshness_check_2`، فحص `log.error` بدل الاعتماد على عدّاد القراءات وحده.
- **النتيجة التشغيلية (2026-10-30):**
  - `status = stale_preflight`
  - `writesAttempted = 0` — لم تُكتب أي بايتة
  - `verifiedWrites = 0`
  - `rollbackAttempts = 0` — لا شيء لاستعادته
  - `error = "تغيّر الملف «a.txt» أثناء التأكيد؛ لم تبدأ الكتابة."` — **`freshness_check_2` هو من اكتشف، لا `freshness_check_1`** (تمييز نصي صريح في المصدر)
  - `a.txt` على القرص بعد التعديل الخارجي: `EXTERNAL-CHANGE` — التعديل نجا من الكتابة
  - `b.txt` على القرص: `HELLO-B` — لم يُمس
- **الاستنتاج:** `folderRunWriteBatch` يكتشف التغييرات الخارجية في الفحص الثاني، ويرفض الكتابة **قبل** لمس أي بايتة. لا كتابة جزئية، ولا كتابة فوق تعديل خارجي.
- **ما لا يثبته:** التغييرات المتزامنة في نافذة أجزاء من الثانية بين القراءة والكتابة (TOCTOU) — مقلّصة لكنها غير ملغاة؛ الأعطال الفيزيائية أثناء العملية.
- **قرار البوابة:** **مغلقة** على مستوى المنطق + التكامل الحقيقي. تبقى ملاحظة مفتوحة لسيناريو TOCTOU والنوافذ الزمنية الضيقة، وهي خارج نطاق الأدوات الحالية.

## بوابات الإصدار PR-2 — f514af44 (reported-closed)

**Status:** REPORTED-CLOSED (operator-supplied evidence; pending independent verification) — WITH DOCUMENTED LIMITATIONS

PR-2 is considered technically closed within the scope of the tests reported as executed on the candidate build. This status does not mean: final independent human approval, production acceptance, authorization to replace `index.html`, or authorization to deploy.

### Candidate Identity — f514af44

| Field | Value |
|---|---|
| Candidate file | `index-pr2-failclosed-v2-patched.html` |
| Reported SHA-256 | `f514af442ccefaf7d09d9c025d882bef1096680e138f416967ac84d6ea0197c8` |
| Reported file size | 447,651 bytes |
| Reported text length | 415,370 characters |
| UTF-8 BOM | Absent |

### Automated Test Harness — v2.4 on f514af44

| Test group | Result |
|---|---:|
| Legacy tests | 6/6 PASS |
| NFC tests | 20/20 PASS |
| Total | 26/26 PASS |
| Harness capability | PASS |

`appTests.result: PASS`, `testGates.legacy.result: PASS`, `testGates.nfc.result: PASS`, `testGates.total.result: PASS`, `harnessCapability.result: PASS`, `overallAssessment.failed: []`, `overallAssessment.notTested: []`.

The harness capability test successfully detected an injected fault in `balanced-scanner-tricky-attributes-and-scripts` without breaking the other tests.

**Important limitation:** The harness's passing result does not establish NFC integration through the complete patch UI. The patch UI explicitly keeps `unicodeNfc: false`.

### R1 — Rollback on f514af44 (real filesystem)

`status=recovered`, `writesAttempted=2`, `verifiedWrites=1`, `rollbackAttempts=2`, `rollbackFailures=0`, `bCorrupted=1`, `bWriteCallAttempts=2`. Final disk: `a.txt=HELLO-A`, `b.txt=HELLO-B`. Reported error: `فشل أثناء الكتابة عند «b.txt»: Error: التحقق بعد الكتابة لم يطابق البايتات المتوقعة`. **PASS** — injected write failure detected, original contents restored.

### R2 — Freshness on f514af44 (real filesystem)

`status=stale_preflight`, `modificationTriggered=true`, `aModifiedOnCall=2`, `writesAttempted=0`, `verifiedWrites=0`, `rollbackAttempts=0`, `rollbackFailures=0`. Error: `تغيّر الملف «a.txt» أثناء التأكيد؛ لم تبدأ الكتابة.` Disk: `a.txt=EXTERNAL-CHANGE` (survived), `b.txt=HELLO-B` (untouched). **PASS** — freshness check prevented writing.

### File Identity Changes — Android

Operator-reported successful real-device tests for renaming, moving, deleting the file before applying changes. Behavior: direct writing was prevented, application switched to download path. **PASS (reported-applied; independently unverified)** — detailed logs and hashes for these three runs were not included.

### Folder Mode — Real Android Filesystem

`showDirectoryPicker` with `readwrite` worked; application map contained two files with Arabic paths; `folderRunPreflight` succeeded; ZIP backup created, downloaded, and confirmed saved; multi-file write batch executed with `writesAttempted=2`, `verifiedWrites=2`, both files reached `written_verified`; rollback not required. Final contents: `<p>تم التعديل ✓</p>`. **PASS** — real multi-file Folder Mode writing on Android.

### Smart Search — Patch UI (f514af44)

Five behaviors reported PASS: alef (`احمد→أحمد`), tashkeel (`كتب→كَتب`), teh marbuta (`مدرسه→مدرسة`), yah (`علي→على`), hidden character (`ab` matched across `U+200B`).

**Verification limitation:** The hidden-character patch did not include an automated `verify` rule. Resulting content was checked manually. Recorded as functional success, not as pass of automated verification layer. The results demonstrate the five tested behaviors, not every possible Unicode or Smart Search input.

### Documented Architectural Decisions — f514af44

**`unicodeNfc` remains `false` in `getPatchSmartOpts()`.** No change authorized by this closure. NFC integration through patch UI not established for f514af44. Enabling requires separate design decision and additional testing.

**Mock ZIP export** (`webkitdirectory`, `folderMockBundleSnapshot`) was not tested. Real Folder Mode backup path was tested separately.

### Outstanding — f514af44

| Item | Status |
|---|---|
| Independent human code review | Pending |
| Final production acceptance | Pending |
| Production `index.html` replacement | Not authorized |
| Deployment | Not authorized |
| Mock ZIP export | Not tested |
| NFC patch UI integration | Not enabled / not tested |

**No production replacement or deployment is implied or authorized.**

### Evidence provenance — f514af44

Test results and descriptions supplied by the operator in the project conversation. Raw test logs, screenshots, ZIP artifact, and candidate file should be retained alongside this document where available. Do not treat this report as a substitute for retaining the original test outputs.

---

## PR-2 v8.0.0 — Cycle 1: c949432 (closed with partial failure)

### هوية Cycle 1

| Field | Value |
|---|---|
| File | `index-pr2-v8.0.0-candidate.html` |
| Size | 452,496 bytes |
| SHA-256 | `c94943210814189d9e340731491444f85188fe7977ff6f619ff982f852649e85` |
| ENGINE_VERSION | `8.0.0` |
| UnicodeNfc | `true` (enabled for the first time) |
| Status | **Closed with partial failure** |

### تغييرات Cycle 1

1. تثبيت هوية الإصدار v8.0.0 في العنوان والواجهة و`ENGINE_VERSION` وبيانات الأداة.
2. **تفعيل NFC افتراضيًا** في بحث الرقع الذكي (`unicodeNfc: true`)، مع الإبقاء على النص الأصلي مصدرًا وحيدًا لعمليات الاستبدال.
3. اعتماد خريطة مقاطع NFC تربط حدود النص المطبع بنطاقات المصدر بوحدات UTF-16، مع حدود نصف مفتوحة.
4. الاحتفاظ بمقاطع grapheme المركبة (`hasAtomicInterior`) حتى عندما لا يغير NFC نصها.
5. استمرار الرفض الآمن عند حدود غير قابلة للإثبات، واستخدام `fallbackWholeString` عند تجاوز حد خريطة المقاطع.
6. الاحتفاظ بإصلاحات سجل الأدلة: تحديث هوية الملف عند الفتح المباشر، وتمييز `verificationSkipped` عن فشل verify الحقيقي.

### نتائج Cycle 1

**`tests-v2.5.js` (Node.js) على c949432:** 27/27 PASS، 0 FAIL.

اختبارات الدوال في Node.js فقط — لا متصفح. التغطية: NFC، Hangul، Arabic composition، CRLF، UTF-16 offsets، tatweel، tashkeel preservation، partial segment، replaceAll، 5000 عينة عشوائية، 30000 ضغط.

**قياس أداء Node.js على 400KB عربي كثيف:** UTF-8=401,435 bytes، UTF-16=227,841، normalize=358.40ms، search=52.64ms، matches=10,850، runs=21,700، `fallbackWholeString=false`. **هذا قياس Node.js، وليس Android أو المتصفح**.

**`tests-v2.6c-fast` على c949432 (المتصفح):** **18/21 PASS، 3 FAIL**.

- ❌ `smart-B-fully-marked`: قَّلم + [fatha, shadda] → `قَّ + ف + ش` (تكرار).
- ❌ `smart-C-mixed`: قَلم + [shadda] → `قَّ` بترتيب غير قانوني (شدة قبل فتحة).
- ❌ `smart-E-reverse-preserved`: قَّلم (ترتيب المستخدم) + [fatha, shadda] → مضاعفة.

**سبب الإغلاق:** رقعة `smartReplacementText` (Policy A) مطلوبة. الكود الحالي يفتقد فحص وجود العلامة قبل إرفاقها.

**ما بقي صحيحًا في Cycle 1:** NFC core، grapheme، `\p{M}` (7/7)، `mapOverflow` (synthetic)، `smart-A`، `smart-D`. جميع اختبارات v2.5 مرّت، لكنها **لم تكشف عطل Policy A** لأن اختبارات `smartReplacementText` أُضيفت في `v2.6c` **بعد** تدوين التقرير الأصلي.

### ما لم يُختبر في Cycle 1

لم تُشغَّل R1/R2/NFC UI على `c949432`. لم تُقس الأداء على Android. لا مراجعة بشرية مستقلة.

---

## PR-2 v8.0.0 — Cycle 2: candidate-2 (22d21d42, technically tested)

**Status:** Technically tested in reported browser runs; **not approved for production**.

### هوية Cycle 2

| Field | Value |
|---|---|
| File | `index-pr2-v8.0.0-candidate-patched.html` (`candidate-2` هو الاسم الرسمي للدورة) |
| Size | 453,557 bytes (Δ +1,061 bytes vs c949432 = رقعة `smartReplacementText`) |
| SHA-256 | `22d21d42ffa90537dda66d449ee08aa64c16ac1ab67d680d382d1a897d72c32f` |
| Text length | 421,607 characters |
| ENGINE_VERSION | `8.0.0` |
| UnicodeNfc | `true` |
| Policy | `smartReplacementText` Policy A |

### الرقعة المُطبَّقة

`smartReplacementText` Policy A — احترام العلامات الموجودة في `replacement`، إرفاق المحفوظ المفقود فقط، بدون مضاعفة. الرقعة **معزولة** في `smartReplacementText`؛ لم تمس NFC core، ولا `folderRunWriteBatch`، ولا `getPatchSmartOpts`.

### نتائج Cycle 2 — ست مجموعات مُبلّغ عنها

| المجموعة | الطبيعة | النتيجة | المرجع |
|---|---|---|---|
| `tests-v2.5.1-browser` | محك دوال آلي (متصفح) | 27/27 PASS | `tests-v2.5.1-browser-results-*.json` |
| `tests-v2.6c-fast` | محك دوال آلي (synthetic overflow) | 21/21 PASS | `tests-v2.6c-results-*.json` (جزء) |
| `tests-v2.6c-full` | محك دوال آلي (real overflow) | 23/23 PASS | نفس الملف (fast + 2 real) |
| `R1 v4.5` | تكامل نظام ملفات حقيقي | 9/9 PASS | يُسجَّل يدويًا |
| `R2` | تكامل نظام ملفات حقيقي | `stale_preflight` | يُسجَّل يدويًا |
| `NFC UI` positive | تكامل واجهة مستخدم | PASS (functional) | `sample (1).html → sample (1)-patched.html` |

**المجموعات ليست متكافئة**. ثلاث محكات دوال آلية قابلة للتحقق عبر JSON، اختباران تكامل على نظام ملفات حقيقي، واختبار واجهة واحد. "6 مجموعات PASS" = التقارير أفادت نجاحها في بيئتها المعلنة. **لا يُترجم إلى "6 أدلة متكافئة"**.

**ملاحظة على التكرار:** لا يصح وصفها بـ"82/82" — `v2.6c-fast` و `v2.6c-full` يشتركان في 21 اختبارًا؛ `v2.5.1` و `v2.6c` يختبران `smartReplacementText` (تكرار). **عدد الاختبارات الفريدة أقل من مجموع الأرقام**.

### `mapOverflow` — الحد الحقيقي (new in v2.6c-full)

| Measurement | `map-real-65536-fit` | `map-real-65537-overflow` |
|---|---|---|
| units | 65,536 | 65,537 |
| source_len | 131,072 | 131,074 |
| segments | **65,536** | **1** |
| fallback | **false** | **true** |
| collapsed_to_single | — | true |
| elapsed_ms | 107 | 230 |

**ما يُثبته:** الحد يعمل عند القيمة المحددة (65,536) بدون fallback، ويتجاوز عند القيمة التالية (65,537) بتفعيل `fallbackWholeString`. **الانهيار إلى segment واحد هو تخفيض دقة حدود المطابقة إلى حدود النص الكامل** — ليس حماية فقط.

### `smartReplacementText` — Policy A مُحقَّقة (5/5 exact match)

| Test | Input | Output (exact) |
|---|---|---|
| smart-A-no-marks | قلم + [fatha, shadda] | قَّلم ✅ |
| smart-B-fully-marked | قَّلم + [fatha, shadda] | قَّلم (لا زيادة) ✅ |
| smart-C-mixed | قَلم + [shadda] | قَّلم (ترتيب قانوني) ✅ |
| smart-D-with-space | ق لم + [fatha] | قَ لم ✅ |
| smart-E-reverse-preserved | قَّلم (ترتيب مستخدم) + [fatha, shadda] | قَّلم (بلا زيادة) ✅ |

**حدود الإثبات:** خمس حالات معروضة فقط. لا تُثبت كل ترتيبات Unicode الممكنة أو كل أنماط `replacement`.

### `\p{M}` fallback — 7/7

| Char | Auto (`\p{M}`) | Forced fallback | is_known_gap |
|---|---|---|---|
| U+0301 acute | T | T | false |
| U+0654 hamza | T | T | false |
| U+064B fathatan | T | T | false |
| U+0643 kaf | F | F | false |
| **U+1D165 musical** | T | **F** | **true** |
| **U+0F71 tibetan** | T | **F** | **true** |
| U+20D0 symbol | T | T | false |

`pM-state-restored`: PASS — الحالة قبل الاختبار تُحفظ وتُستعاد بشكل صحيح.

### `R1 v4.5` على candidate-2 — 9/9

`appHashAtTestTime=22d21d42...`, `status=recovered`, `writesAttempted=2`, `verifiedWrites=1`, `rollbackAttempts=2`, `rollbackFailures=0`, `bCorrupted=1`, `bWriteCallAttempts=2`. Final disk: `a.txt=HELLO-A`, `b.txt=HELLO-B`. **PASS**.

**ما يُثبته:** `folderRunWriteBatch` سليم بعد رقعة `smartReplacementText` — الرقعة لم تُكسِر مسار الكتابة.

### R2 — اختبار freshness على candidate-2

`appHashAtTestTime=22d21d42...`, `status=stale_preflight`, `writesAttempted=0`, `verifiedWrites=0`, `rollbackAttempts=0`, `rollbackFailures=0`, `aGetFileCalls=2`, `aModifiedOnCall=2`, `modificationTriggered=true`. Disk: `a.txt=EXTERNAL-CHANGE` (survived), `b.txt=HELLO-B`. **PASS**.

**تحفظ إصدار:** الأداة المستخدمة هي `R2-test-v4.5-strict.html` (العنوان الداخلي `v4.5`). الفحوص الـ12 تشمل `rollbackFailures === 0` (فحص أُضيف في v4.7 وفق سجل سابق). **لا يُعتمد توصيف "v4.7" نهائيًا** قبل: (أ) فحص مصدر الأداة الفعلي، (ب) تصحيح عنوانها. **السلوك مُثبت؛ الهوية الإصدارية غير محسومة.**

### NFC UI positive على candidate-2

**Source:** `sample (1).html` — 67 حرفًا، 68 بايت. حجم المصدر وتركيبه يؤكدان أنه يحتوي **تمثيل Unicode مفكّك** (`cafe` + `U+0301`). **نجاح المطابقة مع النمط المركّب يتوافق مع عمل مسار NFC**، لكنه لا يثبت بمفرده أن مسار NFC هو سبب المطابقة. **اختبار مضاد (بحث ذكي معطَّل) على `candidate-2` مطلوب** لتأكيد أن `enabled: true` هو الذي فعّل المسار.

**Result:** `<p>coffee</p>` نظيف، **بدون `U+0301` يتيمة**. هذا يُثبت دقة `normMatchesToOriginal` — لو أعادت النطاق الأصلي ناقصًا، لظهرت العلامة يتيمة.

**Output file:** `sample (1)-patched.html`.

**قيد:** لم يُعَد الاختبار مع «بحث ذكي معطَّل» على `candidate-2`. السلوك المتوقع: `found=0` (كما في `c949432`)، لكن **غير مُثبت صراحةً**.

---

## Test Harness Corrections

تم إجراء تصحيحات على المحكات خلال الدورة:

- **`test12` (v2.5 → v2.5.1):** أُعيدت تسميته من `12-partial-nfc-segment-rejected` إلى `12-full-nfc-segment-preserved`. الاسم الأصلي لم يطابق السلوك (كان يختبر قبول عنقود كامل، لا رفض جزئي). تغطية الرفض موجودة في `test23`؛ القبول الكامل في `test24`.
- **`test14` (v2.5 → v2.5.1):** أُعيد كتابته ليختبر القبول **والرفض** معًا. الإصدار السابق كان يختبر القبول فقط بقيمة متوقعة خاطئة (`<p>ABCD</p>` على `<p>A B CD</p>` بعد التطبيع — التطبيع يحذف LRM والتطويل، لكنه **يُبقي المسافة الأصلية** ويحوّل NBSP إلى مسافة، فلا يعبر النمط بلا مسافات).
- **`test27` (v2.5 → v2.5.1):** شُدِّد من `matches >= 1000` إلى `matches === 17000` (العدد الدقيق المتوقع من النص المُولَّد).
- **`R2` (على candidate-2):** العنوان الداخلي ما زال v4.5، لكن الفحوص هي فحوص v4.7. **السلوك مُثبت؛ هوية الإصدار غير محسومة**. يجب فحص مصدر الأداة وتصحيح عنوانها قبل اعتماد التوصيف.

**ملاحظة:** تصحيحات المحكات **لم تُعدِّل المرشح** — لم تُغيَّر بصمة `candidate-2`. المحكات أُعيدت كتابتها لتعكس السلوك الصحيح؛ الكود لم يتغيّر.

---

## Known Limitations (consolidated)

### 1. Map size — `PATCH_NFC_MAX_MAP_RUNS = 65536`

- **حد فعلي**: عند 65,536 segment، لا fallback. عند 65,537، `fallbackWholeString = true` و`atomicSegments` تنهار إلى 1.
- **تأثير `hasAtomicInterior` على التقدير**: كل عنقود جرافيمي عربي (base + diacritics) يُسجَّل كـ segment حتى لو NFC لم يُغيِّر نصه. القياس المرجعي: 34,000 segments لـ 374KB نمط `كتاب مُشكّل ` (2 segments لكل وحدة 12-حرفًا).
- **النطاق التقريبي 400KB-1.5MB** يعتمد على كثافة التشكيل. **ليس حدًا مضمونًا لحجم الملف** — النصوص الكثيفة التشكيل تُنتج segments أكثر.
- **عند التجاوز**: `fallbackWholeString` يُفعَّل، دقة المطابقة تنحدر إلى **حدود النص الكامل فقط** — لا يمكن مطابقة عناصر داخلية. هذا **تخفيض دقة**، لا "حماية صامتة".
- **لم يُقس على Android**.

### 2. Combining-mark fallback gaps

- **`U+1D165` (Musical combining stem)**: `\p{M}=true`, fallback=`false`.
- **`U+0F71` (Tibetan vowel sign)**: `\p{M}=true`, fallback=`false`.
- **العينات المُختبَرة** من العربية واللاتينية (U+0301، U+0654، U+064B، U+0643، U+20D0) اجتازت fallback بنتائج متوقعة. **لم تُثبت التغطية الشاملة لجميع علامات الفئة `M`**.
- **افتراض غير متحقق**: `\p{M}` مدعوم في المتصفحات المستهدفة، لذا fallback نظريًا معطَّل. **إن كان `\p{M}` مدعومًا في كل المتصفحات المستهدفة، الفجوتان كود ميت**. **لم يُجرَ تقييم مصفوفة المتصفحات المستهدفة**.

### 3. Policy A — `smartReplacementText`

- يحترم العلامات الموجودة في `replacement`، ويُرفق المفقودة من `preservedTashkeel`.
- **لا يعيد الترتيب القانوني** — ترتيب المستخدم غير القانوني (مثل `smart-E`) محفوظ كما هو.
- **الاختبارات الخمسة تثبت الحالات المعروضة فقط** — لا كل ترتيبات Unicode الممكنة.
- **لم يُختبر عبر UI** على `كَتب` (نص عربي مشكول).

### 4. Android performance

- **لم يُقس على جهاز Android فعلي**.
- قياسات المتصفح: `map-real-*` (107ms / 230ms لـ 131KB) — هذه **قياسات متصفح سطح مكتب/محاكاة، ليست Android**.
- قياسات Node.js: 112ms / 34ms لـ 400KB.
- **لا تُوصف كقياسات Android**.

### 5. UI coverage

- ✅ NFC UI positive (café→coffee) على `candidate-2`.
- ❌ NFC UI مع `smart: off` على `candidate-2` — **لم يُعَد** (متوقع `found=0` من `c949432`، لكن غير مُثبت).
- ❌ `insertBefore`/`insertAfter` مع NFC عبر UI — **لم يُختبر**.
- ❌ ملفات > 400KB عبر UI — **لم يُختبر**.

### 6. Long-duration / PWA

- استقرار طويل المدى: **لم يُقس**.
- ذاكرة: **لم تُقاس**.
- PWA و Service Worker: **لم يُختبرا** في هذه الدورة.

### 7. Overlap in reported test totals

`tests-v2.6c-fast` و `tests-v2.6c-full` يشتركان في 21 اختبارًا. `tests-v2.5.1` و `tests-v2.6c` يختبران `smartReplacementText` (تكرار). **المجموع "82" مضلل**. الصياغة الصحيحة: **"6 مجموعات، كلها PASS على candidate-2"**.

### 8. R2 tooling — title mismatch

ملف `R2-test-v4.5-strict.html` يحمل `<title>...v4.5...</title>` بينما الفحوص هي فحوص v4.7 (12 فحصًا تشمل `rollbackFailures=0`). **قيد توثيقي** — يجب تصحيح العنوان في الجولة التالية.

---

## Pending before any production decision

| Item | Status |
|---|---|
| Physical Android performance measurement on `candidate-2` | ⏳ لم يُقس |
| Independent human review — انظر `REVIEW-CHECKLIST-v8.0.0.md` | ⏳ معلّقة |
| Fallback reachability assessment — هل `\p{M}` مدعوم في كل المتصفحات المستهدفة؟ | ⏳ غير مُقيَّم |
| NFC UI with `smart: off` on `candidate-2` (اختبار مضاد) | ⏳ لم يُعَد |
| NFC UI with `insertBefore`/`insertAfter` (اختياري) | ⏳ لم يُختبر |
| `R2` title update v4.5 → v4.7 | ⏳ تصحيحي |
| توثيق التحفظات `\p{M}` و `Policy A` و `PATCH_NFC_MAX_MAP_RUNS` في `EVIDENCE.md` | ✅ (هذا الملف) |

**لا اعتماد إنتاجي. لا نشر. لا استبدال `index.html`.**

---

## بوابات لا تزال مفتوحة

- `F3-adj v2` مع LF / CRLF / CR / نهايات مختلطة / نهاية الملف: `PENDING verification`.
- `F6 DIAG disabled behavior`: `PENDING verification`.
- `PR-2 v8.0.0 (candidate-2)`: **independent human review pending**.

## خارطة الطريق إلى v8

- **PR-1 — balanced scanner:** التنفيذ موجود؛ تقرير التكامل السابق `reported`، مع اختبار معزول إضافي موثق.
- **PR-2 — NFC مع mapping إلى offsets الأصلية:**
  - `f514af44`: **`reported-closed`** (26/26 v2.4, R1/R2, Folder Mode, Smart Search 5/5, `unicodeNfc: false`).
  - `c949432`: **closed with partial failure** (v2.5 27/27, v2.6c 18/21, Policy A لم تكن محققة).
  - `22d21d42`: **technically tested, pending review** (6 مجموعات PASS، Policy A محققة، real mapOverflow).
- **PR-3 — dynamic context expansion في `generatePatchFromDiff`:** `pending`.
- **PR-4 — Extended Light JSON5:** `pending`.
- **PR-5 — فصل standalone single-file عن PWA:** `pending`.
- **إطلاق v8.0.0 والـ QA النهائي:** `pending`.

## سجل التشغيلات الموثقة

<!-- browser-test-run:20261029T200430871Z-008e240d6a64ebfc07dfeff6afe1b464f971bb7dc7b0392e19ac3b649e5c3377 -->
### تشغيل محك المتصفح — `2026-10-29T20:04:30.871Z`

- **الملف كما اختير في المحك:** `index.html`
- **SHA-256 المسجّل من المحك:** `008e240d6a64ebfc07dfeff6afe1b464f971bb7dc7b0392e19ac3b649e5c3377`
- **الحجم المسجّل:** 437,963 بايت
- **UTF-8 BOM:** لا
- **المحك:** `browser-test-harness-v2.1`
- **تاريخ التشغيل:** `2026-10-29T20:04:30.871Z`
- **الاختبارات الناجحة:** 6/6
- **نتيجة جودة المحك:** `PASS`

**نتائج اختبارات التطبيق:**

| الاختبار | الحالة |
|---|---|
| `inline-script-syntax-check-only` | PASS |
| `sha256-known-vectors` | PASS |
| `balanced-scanner-isolated-regression` | PASS |
| `balanced-scanner-tricky-attributes-and-scripts` | PASS |
| `evidence-filehandle-mock-integration` | PASS |
| `source-artifact-identity` | PASS |

**حدود هذا التشغيل:**
- فحص صياغة JavaScript لا يثبت تنفيذ التطبيق كاملًا.
- أي تكامل يستخدم FileSystemFileHandle وهميًا يبقى اختبار محاكاة.
- هذه الإضافة تسجل التقرير، ولا تنفذ اختبارات R1 أو R2.

**تصنيف الحالة:**
- PR-1: نتائج محك المتصفح مرتبطة بملف المصدر المسجّل؛ التحقق المستقل من البصمة يظل ممكنًا.
- تنفيذ التطبيق كاملًا: غير مثبت بهذا التقرير وحده.
- R1 — rollback: مفتوح.
- R2 — freshness_check: مفتوح.
- اعتماد v7.0.9: محجوب حتى إغلاق البوابات المطلوبة.

<!-- browser-test-run:20261030T141018213Z-008e240d6a64ebfc07dfeff6afe1b464f971bb7dc7b0392e19ac3b649e5c3377 -->
### تشغيل محك المتصفح — `2026-10-30T14:10:18.213Z`

- **الملف كما اختير في المحك:** `index.html`
- **SHA-256 المسجّل من المحك:** `008e240d6a64ebfc07dfeff6afe1b464f971bb7dc7b0392e19ac3b649e5c3377`
- **الحجم المسجّل:** 437,963 بايت
- **UTF-8 BOM:** لا
- **المحك:** `browser-test-harness-v2.2`
- **تاريخ التشغيل:** `2026-10-30T14:10:18.213Z`
- **الاختبارات الناجحة:** 6/11 (5 SKIP)
- **نتيجة جودة المحك:** `PASS`

**نتائج اختبارات التطبيق:**

| الاختبار | الحالة |
|---|---|
| `inline-script-syntax-check-only` | PASS |
| `sha256-known-vectors` | PASS |
| `balanced-scanner-isolated-regression` | PASS |
| `balanced-scanner-tricky-attributes-and-scripts` | PASS |
| `evidence-filehandle-mock-integration` | PASS |
| `source-artifact-identity` | PASS |
| `nfc-mapping-basic` | SKIP |
| `nfc-mapping-f3-tatweel` | SKIP |
| `nfc-mapping-f4-boundary` | SKIP |
| `nfc-mapping-general` | SKIP |
| `nfc-mapping-regression` | SKIP |

**حدود هذا التشغيل:**
- فحص صياغة JavaScript لا يثبت تنفيذ التطبيق كاملًا.
- أي تكامل يستخدم FileSystemFileHandle وهميًا يبقى اختبار محاكاة.
- اختبارات NFC ذات الحالة SKIP تعني أن كتلة NFC غير موجودة في الملف المُختبَر؛ لا تعني نجاحًا.

**تصنيف الحالة:**
- PR-1: نتائج محك المتصفح مرتبطة بملف المصدر المسجّل؛ التحقق المستقل من البصمة يظل ممكنًا.
- PR-2: مغطى فقط إذا ظهرت الاختبارات الخمسة PASS على المرشح.
- R1 — rollback: مفتوح.
- R2 — freshness_check: مفتوح.
- اعتماد v8.0.0: محجوب حتى إغلاق بوابات PR-2 وR1/R2.

<!-- browser-test-run:20261031T091345930Z-e3999783d32c1fe3a6f7dcb4d3f9a84aec6f4926f073412e82d4b87c6807caa3 -->
### تشغيل محك المتصفح — `2026-10-31T09:13:45.930Z`

- **الملف كما اختير في المحك:** `index-bugfix-evidence-leak-patched-patched-patched-patched.html`
- **SHA-256 المسجّل من المحك:** `e3999783d32c1fe3a6f7dcb4d3f9a84aec6f4926f073412e82d4b87c6807caa3`
- **الحجم المسجّل:** 446,505 بايت
- **UTF-8 BOM:** لا
- **المحك:** `browser-test-harness-v2.3`
- **تاريخ التشغيل:** `2026-10-31T09:13:45.930Z`
- **الاختبارات الناجحة:** 13/19
- **نتيجة جودة المحك:** `FAIL`

**نتائج اختبارات التطبيق:** 6 legacy PASS + 7 NFC PASS + 6 NFC FAIL (`nfc-env-dependency-extraction`, `nfc-fail-closed-normalize`, `nfc-null-cluster-invalidates-view`, `nfc-success-marker`, `nfc-fail-closed-match-consumers`, `nfc-fail-closed-scoped-consumers`).

**تصنيف الحالة:** مرشح غير مكتمل — يُستخدم كخط أساس فقط.

<!-- browser-test-run:20261031T092341901Z-a0c99a02f2f2ce12e23e4b4f87014e7ce67b1dbde55ba493218105e27d97d9d8 -->
### تشغيل محك المتصفح — `2026-10-31T09:23:41.901Z`

- **الملف كما اختير في المحك:** `index-bugfix-evidence-leak-patched-patched-patched-patched-patched.html`
- **SHA-256 المسجّل من المحك:** `a0c99a02f2f2ce12e23e4b4f87014e7ce67b1dbde55ba493218105e27d97d9d8`
- **الحجم المسجّل:** 447,442 بايت
- **UTF-8 BOM:** لا
- **المحك:** `browser-test-harness-v2.3`
- **تاريخ التشغيل:** `2026-10-31T09:23:41.901Z`
- **الاختبارات الناجحة:** 19/19
- **نتيجة جودة المحك:** `PASS`

**تصنيف الحالة:** مرشح PR-2 المبكر — اجتاز v2.3 (19/19) لكن v2.4 (26 اختبارًا) كشف ثغرات إضافية.

<!-- browser-test-run:20261031T101432452Z-a0c99a02f2f2ce12e23e4b4f87014e7ce67b1dbde55ba493218105e27d97d9d8 -->
### تشغيل محك المتصفح — `2026-10-31T10:14:32.452Z`

- **الملف كما اختير في المحك:** `index-pr2-failclosed-v2.html`
- **SHA-256 المسجّل من المحك:** `a0c99a02f2f2ce12e23e4b4f87014e7ce67b1dbde55ba493218105e27d97d9d8`
- **الحجم المسجّل:** 447,442 بايت
- **UTF-8 BOM:** لا
- **المحك:** `browser-test-harness-v2.4`
- **تاريخ التشغيل:** `2026-10-31T10:14:32.452Z`
- **الاختبارات الناجحة:** 24/26
- **نتيجة جودة المحك:** `FAIL`

**الفشلان:** `nfc-arabic-composition`, `nfc-tatweel-mapping` — قبل A.5. **قاد إلى candidate `f514af44`**.

<!-- browser-test-run:20261031T105055622Z-f514af442ccefaf7d09d9c025d882bef1096680e138f416967ac84d6ea0197c8 -->
### تشغيل محك المتصفح — `2026-10-31T10:50:55.622Z`

- **الملف كما اختير في المحك:** `index-pr2-failclosed-v2-patched.html`
- **SHA-256 المسجّل من المحك:** `f514af442ccefaf7d09d9c025d882bef1096680e138f416967ac84d6ea0197c8`
- **الحجم المسجّل:** 447,651 بايت
- **UTF-8 BOM:** لا
- **المحك:** `browser-test-harness-v2.4`
- **تاريخ التشغيل:** `2026-10-31T10:50:55.622Z`
- **الاختبارات الناجحة:** 26/26
- **نتيجة جودة المحك:** `PASS`

**تصنيف الحالة:** مرشح PR-2 الأول الذي اجتاز v2.4 كاملًا. `unicodeNfc: false` في UI. تفاصيل الأدلة في «بوابات PR-2 — f514af44» أعلاه.

## قالب السجل الآلي للتشغيلات التالية

> **ملاحظة:** هذا قالب لبلوكات تُضيفها **الأداة نفسها** في `index.html` عند تشغيل الرقع. يختلف عن بلوكات **المحك** (`browser-test-run:...`) التي تُسجَّل يدويًا أو من `tests.html`. لا تخلط بينهما.

```markdown
<!-- evidence-id: generated-by-app -->
### تشغيل — <ISO date>
- **العملية:** `dry-run` / `apply` / `single-patch-test`
- **الملف المستهدف:** `<name>`
- **SHA-256 للملف الأصلي:** `<full hash>`
- **الحجم الأصلي:** `<bytes>` بايت
- **إصدار المحرك:** `<version>`
- **آخر run:** `ok=N applied=M skip=S fail=K`
- **نتيجة verify للمحرك:** `passed` / `failed` / `not completed`
- **وضع/حالة الحفظ:** `<mode/status>`
- **SHA-256 للناتج المرشّح:** `<full hash>`
- **بصمة الملف الفعلي بعد الكتابة:** `<full hash, only if read back>`
- **الحكم المقترح:** `<honest classification>`