# رقيع — الحالة التنفيذية للمشروع

> لقطة حالة محدثة على HEAD الفعلي في 2026-11-12. ترتيب المراحل ومعايير قبولها في `docs/MASTER-DEVELOPMENT-PLAN.md`.

## لقطة التحقق

- وقت التحقق: 2026-11-12 18:20 Asia/Aden (UTC+03:00)
- المستودع: `abac332211-droid/Mragaat`
- فرع العمل: `review/direct-racefix2-native-fsa`
- HEAD: `22e49049f9114b812a491e774099961b06a99425`
- رسالة HEAD: `Update index.html`
- وقت الالتزام UTC: `2026-11-12T14:25:15Z`
- Parent: `0574907741dc240f58a3b33a43f3aaeb2392aa6b`
- Tree SHA: `05f4d0648965839b423bec3ae7a4cdf2b7606611`
- ملفات Blob: 54
- Tree entries مع مجلد docs: 55
- ZIP في HEAD: 0
- الخطة تحت docs مطابقة للخطة في الجذر: نعم، Git Blob SHA `5b5afb1f47cfefc9e7360afe846f0adb8b8edfcd`.

## الحالة العامة

**`IN_PROGRESS` — P0 مفتوحة ولم تُقبل بعد.** تم جرد 54 ملفًا، وحساب حجم UTF-8 وGit Blob SHA-1 وSHA-256 لكل ملف، مع مطابقة الأحجام مع Git Tree. تم تثبيت تاريخ الأرشيفات الأربعة والنسخ المشتركة، لكن لا توجد ZIP في HEAD الحالي ولم تحسب SHA-256 للأرشيفات الثنائية. يلزم أيضًا رفع ملفات الوثائق المحدثة ومراجعة المصفوفة النهائية للنسخ وFixtures.

## حالة البوابات

| البوابة | الحالة | المبرر |
|---|---|---|
| P0 — Repository Baseline | `IN_PROGRESS` | الجرد والبصمات مكتملة؛ المقارنة الثنائية للأرشيفات وتحديث الوثائق والقبول النهائي ما زالت مفتوحة. |
| P1 — Evidence & Runner Unification | `NOT_STARTED` | لا تبدأ قبل قبول P0؛ تبقى مطابقة Fixtures لكل تشغيل. |
| P2 — RaceFix2 Source Review | `NOT_STARTED` | لم يبدأ ضمن هذا التدقيق. |
| P3 — DIRECT-02 / Native FSA | `OPEN` | تقارير Runner v1.1.9 لا تمنح اعتمادًا؛ `closure_authorized=false`. |
| P4 — Folder Mode | `OPEN` | اختبارات Node mock لا تثبت Native FSA أو إنتاجية الاسترجاع. |
| P5 — PR-2 / Unicode | `OPEN` | يلزم ربط النتائج بمرشح وبصمة محددين ومراجعتها. |
| P6 — F3/F6/F8/F9 | `OPEN` | لم تُغلق بقرار قبول في هذا التدقيق. |
| P7 — V3 | `BLOCKED` | المراجعة الحالية ساكنة؛ تشغيل الاختبار غير مثبت. |
| P8 — Security & Release | `NOT_STARTED` | لا يوجد قرار إصدار. |

## حقائق يجب الحفاظ عليها

- `SHA256SUMS.txt` الحالي (799 bytes) يخص مجموعة FOLDER-LOG: تسع بصمات للملفات المرافقة، وتطابق SHA-256 الحالية لهذه الملفات. ليس Manifest شاملًا.
- الأرشيفات الأربعة معروفة تاريخيًا، لكنها جميعًا غائبة عن HEAD الحالي. Git يحتفظ بكائناتها عند commits الإضافة؛ راجع `docs/ARCHIVE-INVENTORY.md`.
- نسخ `A-B-byte-ledger.csv` و`SHA256SUMS.txt` و`run-01/02/03.json` تختلف باختلاف حزمة المصدر؛ لا تعتمد على الاسم وحده.
- `raqee3-v8.0.0-rc3-dev.html` و`raqee3-v8.0.0-rc3-dev-tested.html` متطابقتان بايتًا.
- `index.html` الحالي 446164 bytes، ويختلف عن نسخة رقيع المطور التاريخية 437963 bytes. النسخة التاريخية محفوظة في commit `3c2429da4c6866a8d498e218e46a535278f5a8b7`.
- لا تعديل لكود التطبيق أو `main` في هذا التدقيق.

## الملفات المرجعية

- `docs/BASELINE-MANIFEST.json`: بصمات وأحجام 54 ملفًا.
- `docs/ARCHIVE-INVENTORY.md`: الأرشيفات وتاريخها ونسخ الملفات المشتركة.
- `docs/P0-BASELINE-REPORT-2026-11-12.md`: تقرير القبول والتناقضات.
- `docs/EXECUTION-LOG.md`: سجل append-only؛ أضف إليه نص `EXECUTION-LOG-APPEND.md` دون حذف الإدخالات السابقة.

لا تبدأ P1 قبل قبول مخرجات P0. لا تحذف أو تستبدل تقارير تاريخية.
