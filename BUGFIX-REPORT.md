# تقرير رقعة fix-evidence-leak-and-verify-semantics

## هوية المرجع والناتج

- المرجع: `index.html`
- SHA-256 المرجع: `008e240d6a64ebfc07dfeff6afe1b464f971bb7dc7b0392e19ac3b649e5c3377`
- حجم المرجع: `437,963` bytes
- الناتج: `index-bugfix-evidence-leak.html`
- SHA-256 الناتج: `b97bb89b006e3f70837db8cff23b082cc586e75992b499bef0c372ca985b8ac2`
- حجم الناتج: `439,265` bytes
- المرجع الأصلي بقي دون تغيير.

## سجل محرك الرقع

- استيراد JSON: نجح؛ رقعة واحدة صالحة.
- Preflight: `ok=1 applied=0 skip=0 fail=0`؛ لم يحدث فشل.
- Apply: `ok=1 applied=0 skip=0 fail=0`؛ `outputAccepted=true`.
- Verify: الشروط الستة كلها نجحت؛ `verificationPassed=true` و`verifyFailed=false`.

## اختبارات القبول

- T1: PASS ضمن محاكاة المتصفح. حمّل الاختبار `EVIDENCE.md` ثم فتح `test.txt` عبر معالج الفتح المباشر مع mock لـ`showOpenFilePicker`؛ سجل الأدلة حمل اسم `test.txt` وحجمه `44` بايت وبصمته الفعلية `826746b9cfea1d4539254d8b9046d37a4f2b70135af7e177bca1f7c4913a15f7`، لا بصمة `EVIDENCE.md` السابقة. لم يُختبر منتقي نظام الملفات أو الإذن الحقيقي.
- T2: PASS. نتيجة رقعة بلا verify: `verificationPassed=false`, `verificationSkipped=1`, `verifyFailed=false`. النص المسجل: `skipped (1 رقعة بلا verify)`، والحكم: `verify-skipped (patches without verify; not proof of failure)`.
- T3: PASS. فشل شرط verify الحقيقي أعاد `verifyFailed=true`؛ بقي النص `failed` والحكم `verify-failed`، ولم يُقبل الناتج.

## فحص اختبارات إضافي متاح

الملف الموجود في الأرشيف هو `tests.html v2.1` وليس v2.2. شُغّل v2.1 على الناتج: `6 PASS / 0 FAIL`، واختبار جودة المحك PASS. مسار `crypto.subtle` لم يكن متاحًا في سياق `about:blank` المعزول، واستُخدم `sha256HexPure`. كما أن `overallAssessment.readyForAcceptance=false` حسب المحك نفسه.

لم يُشغّل `tests.html v2.2` لأن نسخة v2.2 غير موجودة ضمن الملفات المتاحة؛ لا تُعد نتيجة v2.1 بديلًا عنها، ولا تتضمن حالات NFC الخمس.

## حدود النتيجة

الرقعة مطبّقة على الناتج المنفصل واجتازت preflight/apply/verify في محرك التطبيق، واختبارات T1/T2/T3 كما هو موضح. لم تحصل كتابة على `index.html` المرجعي أو إلى `EVIDENCE.md` الفعلي. لم يُختبر File System Access API الحقيقي، ولا تُغلق هذه النتيجة بوابة PR-2.
