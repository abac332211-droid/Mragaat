# PR-2 v8.0.0 — تقرير تنفيذ الدورة الجديدة

- المرشح: `index-pr2-v8.0.0-candidate.html`
- SHA-256: `c94943210814189d9e340731491444f85188fe7977ff6f619ff982f852649e85`
- v2.5: **27/27 PASS**
- Evidence regressions: **4/4 PASS**
- 400 KB Arabic-heavy Node measurement: normalize/map 358.40 ms; search 52.64 ms; 10850 matches; fallback=False.
- تمت معالجة partial-grapheme: مطابقة `ك` داخل `كَ` تُرفض عندما يكون تجاهل التشكيل معطلاً؛ المطابقة الكاملة `كَ` تبقى مقبولة.
- المتصفح/Android وR1/R2 على الجهاز ما زالت pending.
- لا نشر ولا تعديل على `index.html`.

التفاصيل والقيود في `EVIDENCE-v8.0.0.md`.
