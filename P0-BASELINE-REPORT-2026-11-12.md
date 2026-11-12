# تقرير P0 — خط الأساس وجرد الأدلة

**الحالة:** `IN_PROGRESS` — لم تُغلق P0 بعد.  
**تاريخ الفحص:** 2026-11-12، Asia/Aden (UTC+03:00).  
**المستودع:** `abac332211-droid/Mragaat`.  
**الفرع:** `review/direct-racefix2-native-fsa`.

## 1. لقطة Git المثبتة

| العنصر | القيمة |
|---|---|
| HEAD | `22e49049f9114b812a491e774099961b06a99425` |
| رسالة الالتزام | `Update index.html` |
| وقت الالتزام UTC | `2026-11-12T14:25:15Z` |
| Parent | `0574907741dc240f58a3b33a43f3aaeb2392aa6b` |
| Tree SHA | `05f4d0648965839b423bec3ae7a4cdf2b7606611` |
| عدد ملفات Blob | 54 |
| إجمالي Tree entries مع مجلد `docs` | 55 |
| ملفات ZIP في HEAD | 0 |

تم جلب شجرة Git كاملة مع `recursive=1`، وكانت `truncated=false`. أحجام UTF-8 لجميع الملفات الـ54 طابقت قيمة `size` في Git Tree. كما سُجل Git Blob SHA-1 منفصلًا عن SHA-256.

## 2. التحقق من SHA-256

حُسبت SHA-256 من كامل محتوى كل ملف نصي مسترجع من GitHub بعد ترميزه UTF-8. جرى التحقق من خوارزمية الحساب باختباري SHA-256 القياسيين:

- السلسلة الفارغة: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`
- `abc`: `ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad`

**إجمالي البايتات النصية في اللقطة:** 5,080,040 bytes عبر 54 ملفًا.  
**النتيجة:** بصمات SHA-256 والأحجام لكل ملفات HEAD مدرجة أدناه وفي الملف المرافق `BASELINE-MANIFEST.json`.

## 3. قائمة Manifest الكاملة

| المسار | Bytes | Git Blob SHA-1 | SHA-256 |
|---|---:|---|---|
| `A-B-byte-ledger.csv` | 4835 | `a22cdc2302e4694ec0f462137e1f83b872e343b8` | `82079ab984b61602ccb449fdade28cbdc26b779f27aacdbe241391fcf1de2ad8` |
| `AGENTS.md` | 19585 | `3d388a4c6733d4fd4a9f2ee296de8eef55e991f5` | `6fac2400b7d867f09fb107f40782c582b37d046639ed07d69c83eb1d7f6c04b2` |
| `B.txt` | 174 | `a346c21d4e314fc5659afe85d21c8d099b0e9a18` | `88ebee9279a80a80b9eda7478e9859bfd235d2a184ecce696157ba7163beedd7` |
| `BUGFIX-REPORT.md` | 2866 | `380f17341f2bf71a3f868a802d2536edbb788267` | `45c6e54c3abcd71e4e287a6f4a3f94df1e37a658977e513c488a1e16f0428533` |
| `BUILD-METADATA.json` | 2461 | `81933d8706620f912acde7ead3a7bf02cbb1805e` | `5b694899b0debcd4c7130c5b35f8cd55ead7de7de6ba1ec8bc941b3362dc8d81` |
| `DIRECT-02-NativeFSA-Runner-Final.html` | 43971 | `81f25ec6d372a48b842d03cb7571eae9d2b379f4` | `857118fafe93fd3afb1ff02bbf5b76d620b859786024ff1f835090e67c236a7c` |
| `DIRECT-02-native-fsa-final-1794074818104.json` | 11462 | `f8d575a30c22ef6ef16b29547ae29dfb09543a18` | `33b0d9fddc34b73aa811500ddcaee236f178038f3787ef86e940511fabeb913a` |
| `DIRECT-02-native-fsa-final-1794115520990.json` | 3742 | `5666e3f89ca62a2dde66f8e6472a788f3d818d55` | `47fb65124ba13f65bc6715c4a717e12013a3985ee0e751d3cbbdaedd86135db6` |
| `DIRECT-02-native-fsa-runner-v1.1.9-1794317937567.json` | 161594 | `7f8baa9c28047f22cf027b0a290b834ab1be25ab` | `886633c48365b7be651b967573c5a3e206b2a58459d0374cec3fa5eb02c804a6` |
| `DIRECT-02-native-fsa-runner-v1.1.9-1794320481463.json` | 128207 | `f80d5c403a9488e62d009259f67574af88ade9d7` | `e327a8f3f150cc3cccb29aa3012da7af91259bd994b9bb9e21055fe4208ce8c3` |
| `DIRECT-RACE-01-04-RACEFIX-harness.py` | 21724 | `07f52ebcb1f658ffcc0de77f8648e77695ef28ab` | `bd7ad985445d4cf242b619633fb9b622fe7770c616630c9fed1ffdc1de2c2597` |
| `DIRECT-RACE-01-04-RACEFIX-result.json` | 274168 | `8ca8249cf622f61ed3195ce562dba0a9352e1bd1` | `01134e5740413b1391a89aff407ef4f3c1fab7ca6ccc62fe5a9b58b09d0348ba` |
| `DIRECT-RACE-01-04-harness.py` | 14858 | `e754e6e8987a462b949f19da7da3ac8dd16fa814` | `d3deb2f9e186f4572658553e2b474c4b527e44acffa04e358cc9262cdce54823` |
| `DIRECT-RACE-01-04-result.json` | 121161 | `bb64bbdafc9b34dad48d6861490d5923ec093463` | `26e4f02febc53b3ac7b24dd04b04005d812d38700b16f4466c2e040bcb17df7c` |
| `EVIDENCE-AC1-AC5.md` | 3213 | `57fbb3e35908a841f10eaccab8771372d9daf584` | `84575ef82056e3906b1954cfd62277f39e3a4587731d86004533fa1c0753e595` |
| `EVIDENCE-test-run-2026-10-29T19-21-05.json` | 3684 | `47a26757f59a1a33ab8c9e613096ceb0208228a5` | `089ce34535fa5c600b0936358638d54c2c878a45a38211012c76adde7ebd70cf` |
| `EVIDENCE-v8.0.0.md` | 6778 | `ca4fa0a75ca4f7969a1bcaf5c9cec3d2ef2ca648` | `8232b6f353160612e34e526d7af9ed6cecc0e6c0c31f5ed743aff513d2daaece` |
| `EVIDENCE.md` | 20594 | `b44c294afbe2ba10a547cfd2f5ed64d25fcf8e64` | `193c66657c476a8655e46985e66a31449301555ed8b8ed64d75fb214e33b4f63` |
| `FOLDER-LOG-01-RC3-DEV-AE-harness.node.js` | 26967 | `07e3873fa91436fdc533788adf12bec3ce898801` | `484a03a8892e0879836d603392f8437474369a7b392135b694cf6e71739d99cd` |
| `PR-2-design-review-v8.0.0.md` | 22819 | `046e33427aac37eaf03f5bbfdfb7e5b5f808f909` | `5c5b82d49d70be5c16e8d00d0f506deea086e8eb74de74bbfa4bf3ff9ea330e8` |
| `PR-2-v8.0.0-execution-report.md` | 767 | `ce6e855f548d276dabc6b73009f577b0ac51810a` | `37875980dabc151a478456b2d4e001be39e604cb136c725a8281f03e3a94a8de` |
| `RAQEE3-MASTER-DEVELOPMENT-PLAN-v1.1.md` | 40176 | `5b5afb1f47cfefc9e7360afe846f0adb8b8edfcd` | `19bcdb0f134b4df7164737039eafe56efb721abb6a75350ea329de393b190d12` |
| `RAQEE3-v8.0.0-FIRST-BATCH-QA.md` | 7965 | `09bf37fbfee481588845e6955acc590add717366` | `56f753d2eca5095bd320e6f1f8eafd1deaabdf33c5cbce0113c80a0c6d1669a2` |
| `RC2-to-RC3-DEV.patch` | 1512 | `36020f12c4176230828e79f59c6c1b4a50f8e643` | `e3ab0d24ff660fb400618e3d90c6b8f4e45dad2f04d7aa298736ebfe69d8e011` |
| `RC3-DEV-build-metadata.json` | 2400 | `646d548c04fbd6e91435b7a834613cc5231ed143` | `e2167c9b40b1182bf3ed17548935821223ccb9df3f6c6813b9823c431fa2936a` |
| `RC3-DEV-to-RACEFIX.patch` | 28431 | `7201c6a09252f630732ebb632525f4a2d07d42a6` | `8cfd318db0fa354e26b3b82f995edf945e4ba120092eaa784e2c08460642bc6b` |
| `README-DIRECT-RACE-01-04-RACEFIX.md` | 6505 | `9822fcca2a4c02d9a36e035cbad381b3cde13381` | `4e7c631790e14557d53c270db5d70d929d3f1baf8c5c4bd25183805ad229b602` |
| `README-DIRECT-RACE-01-04.md` | 6458 | `e2ffcb7fec9bfbfac868e880759aeebd1325e3cc` | `8e5dc7b56e89dea9486489bf3248950a3c6bb46c802d3df41475afc14a32be59` |
| `README-FOLDER-LOG-01-RC3-DEV-02.md` | 4673 | `48b4acb1eacea2d44c13602e9fc9aa829ef45bef` | `719b4b935e4b5b26b42538b14a9bc916f6a8df4b7bb47cfcee49ca5aad458dfc` |
| `SHA256SUMS.txt` | 799 | `08143b27d26dbfe6db5909d55d60f886d8286827` | `8c7f71c78a14416d6fdf7fd8cfc2a6924e1be6d95f612b93d9d97eb2aed6f434` |
| `SYNTAX-CHECK.txt` | 345 | `585baba312e96624930312021156c21c158534ea` | `00b4193a2c9bc175728a18d8c0dcffdda7e14659929e291ad74c90921887cfa3` |
| `V3-v5-static-review.md` | 4582 | `2040168467197633ca061c26aca1b2c177881a68` | `5b2bbdbe691cca46547170044327b393128cabb80d5f27083a54fe61743683c4` |
| `after-C2.html` | 483702 | `96ad9e3a8b34935d0bca0f3df29c9a9622a81c74` | `d1bebe5a0a5bb95553897b5cb355b04a164a0215a601e668ba6f34304c5db5c4` |
| `after-D.html` | 483209 | `97c1f46b9e5558d48a2488a67e145f3a30a80b90` | `5614fbee7ea733441136c58830d623a67c22b7b683c3db773cea24c2a893f094` |
| `docs/EXECUTION-LOG.md` | 4395 | `0155559ed9859180508a7e2515d1012627b67143` | `0a73a4ed661bb21f0d42b0d2feb994deffa03cea3e0b1de53aa83fd471a253ee` |
| `docs/MASTER-DEVELOPMENT-PLAN.md` | 40176 | `5b5afb1f47cfefc9e7360afe846f0adb8b8edfcd` | `19bcdb0f134b4df7164737039eafe56efb721abb6a75350ea329de393b190d12` |
| `docs/STATUS.md` | 6973 | `a27688d03291273f622253ae163107b9934de8ac` | `cd2529e2f65112e6fa977e3de19b8e552b007922cd3c37b36b86e48e7b523920` |
| `index.html` | 446164 | `9bc89f98f9283b7e2536924d5c011299f1ccee71` | `1dadf2fc5dc22fa6b78755db37acdca7edb96dd848cb37a8c391f96f1fe255cb` |
| `r1-test v4.4.html` | 17083 | `bc232a73d5473ce7c4e605c4ad17f13ef79ebfce` | `cbd5d9c53f026dffb8db753f570a54bdd235c70418a0e9ae85780efc90952e82` |
| `r2-test v4.6.html` | 18381 | `ad0f15706d7632ae1bb307d39f98959f336c03da` | `563584c739d14feb5b006cc95d177e9731e612f8dca2f065d0961a89611b6b78` |
| `raqee3-v8.0.0-rc2-candidate.html` | 483360 | `914dc7e394b9d87d555852c3faeffb13c6bcfb8f` | `8b7357295f333a44b861d03d555b86b475df53bc1227b9cb5f195026bd4fda9c` |
| `raqee3-v8.0.0-rc3-dev-racefix.html` | 492397 | `48d8379c8fad38cb7d839b3a8369f252b56a4eeb` | `29f454fbf77a3e78336a8ca82ec01843ed8e2dff42a27cd911b5879e85573632` |
| `raqee3-v8.0.0-rc3-dev-racefix2.html` | 495312 | `9e582fd76b471c51edb91587ce56e2629916f0ec` | `6e41866ff757518f641546083e5441e19f153c3585a6b43799fd2daa66561c13` |
| `raqee3-v8.0.0-rc3-dev-tested.html` | 483593 | `0ec3926eb43315be86085e0cc275c525ea5ac845` | `ebdb9c9f34f09c094d394bda897555758efe7aad9f30e43b41f1bd5fb7b873ed` |
| `raqee3-v8.0.0-rc3-dev.html` | 483593 | `0ec3926eb43315be86085e0cc275c525ea5ac845` | `ebdb9c9f34f09c094d394bda897555758efe7aad9f30e43b41f1bd5fb7b873ed` |
| `rc2-notes.md` | 8162 | `b06d319bf5ee9e2f8aaab7fff0f3db1eff797d7f` | `a84be4b662fd67a52836f14610f89dca229004f1e369dde592a65e4304469287` |
| `run-01.json` | 7964 | `f86f83c6ba0b33989c3faad4ff9dd6654bc1a716` | `87ad1d255742f5532aaaf25fc8228f769c8f958927fcad6069812df4602169c6` |
| `run-02.json` | 7964 | `6b8f73ee07a206c79c88879d91a04df090fe4c2f` | `82804079e5499cd26be2b04f7f987214f278cfdcbd30ed50c6659f5114e4846a` |
| `run-03.json` | 7964 | `22e0a147a50b1d3533c6249280747bd908a62658` | `f3616f3b48d61157245d198b468a9b8afb87beb66463cb10c3972a089a21c3bc` |
| `test-v3-fixed. .js` | 8521 | `6d3dfca1170db7601c8b0f0eb625399b595f2e28` | `c053f1441e5420ee301069221b1a45213252c652db7ad0205b07e662f06b68c3` |
| `test-v3-fixed.js` | 9749 | `e7073aee7600180c15e210cfcd9cc5a58889df34` | `23ae7204b25d4a70b10a8c1ff16d04295fd2c3e72fbe99a62f420c05a641334a` |
| `tests.html` | 42498 | `5ec8f302f19d2cc31ec72088e28fbef92fde2730` | `69ff175f6875b5748a5afe2cb1e930d285ef70762fc093a6273c4b3156d792fb` |
| `v4-diff-raw.txt` | 26 | `33c126dba11dfe4bd5931c5694acd543ab1f024c` | `4c8c34eec9c22a083e4ce4ee66e384894b61b76763b89fa45db0cf751f3ace04` |
| `نتائج الاختبار.txt` | 49378 | `6d323c49acc94922aeba243a38d9c074b6192366` | `219d2ca58bdf898ac720385ae32a3291a4f0a63b56db3ea60806b6b801d286b5` |

## 4. مراجعة ملفات التوثيق

- `RAQEE3-MASTER-DEVELOPMENT-PLAN-v1.1.md` و`docs/MASTER-DEVELOPMENT-PLAN.md` متطابقان على مستوى Git Blob SHA-1: `5b5afb1f47cfefc9e7360afe846f0adb8b8edfcd`.
- `docs/BASELINE-MANIFEST.json` غير موجود في HEAD الحالي (404). ملف Manifest المرافق لهذه الحزمة جاهز لرفعه إلى ذلك المسار.
- `docs/ARCHIVE-INVENTORY.md` غير موجود في HEAD الحالي (404). ملف الجرد المرافق لهذه الحزمة جاهز لرفعه.
- `docs/STATUS.md` الموجود في HEAD قديم: يصف HEAD=`724f7dac97d6f824909f1243d3b3cbb35857acf3` وTree=`bb19b38bcc0979ee3a6b8aa1722061e47895eced` وعدد 24 ملفًا وخمسة ZIP، بينما اللقطة الحالية HEAD=`22e490...` وتحوي 54 ملفًا ولا ZIP. لذلك لا يجوز اعتماد STATUS الحالي دون تحديث.
- `docs/EXECUTION-LOG.md` ما زال يسجل أن Manifest وجرد الأرشيفات وتثبيت HEAD غير مكتملة؛ أُرفق ملف `EXECUTION-LOG-APPEND.md` لإضافته في نهاية السجل دون حذف ما سبق.

## 5. SHA256SUMS.txt — النطاق الصحيح

الملف الحالي `SHA256SUMS.txt` حجمه 799 bytes، Git Blob SHA-1=`08143b27d26dbfe6db5909d55d60f886d8286827`، وSHA-256=`8c7f71c78a14416d6fdf7fd8cfc2a6924e1be6d95f612b93d9d97eb2aed6f434`.

محتواه يحوي تسع بصمات للملفات المرافقة لحزمة FOLDER-LOG: harness، patch، metadata، README، syntax check، HTML، وrun-01 إلى run-03. بصمات هذه الملفات التسعة تطابق SHA-256 المحسوبة في Manifest. لا يحوي بصمات بقية ملفات المستودع، ولا يمثل Manifest شاملًا، ولا يثبت SHA-256 للـ ZIP نفسه.

## 6. الأرشيفات والنسخ المشتركة

لا يوجد ZIP في HEAD الحالي. الأرشيفات الأربعة موثقة في التاريخ، وكانت مجتمعة عند commit `d24321fe0af741b4fa5d2daffaa2dd3d078a7bb4`، ثم حُذفت جميعها من شجرة الفرع قبل HEAD الحالي (المقارنة سجلت 18 التزامًا لاحقًا و`status=ahead`). Git يحتفظ بأجسام الأرشيفات عند التزامات الإضافة. تفاصيل الأسماء والأحجام وGit Blob SHA-1 وقوائم عناصر ZIP والنسخ ذات الأسماء المشتركة في `ARCHIVE-INVENTORY.md` المرافق.

لم تُحسب SHA-256 للملفات ZIP الثنائية نفسها، وGit Blob SHA-1 ليس SHA-256. كما لا توجد نسخة ZIP حالية في HEAD لتكون طرفًا حاليًا في مقارنة بايتية. لذلك يظل شرط المقارنة الثنائية للأرشيف المحذوف غير مكتمل.

## 7. المصادر والمرشحات التي أمكن تثبيتها

| النوع | الملف/المصدر | الحجم | SHA-256 |
|---|---|---:|---|
| RC2 reference | `raqee3-v8.0.0-rc2-candidate.html` | 483360 | `8b7357295f333a44b861d03d555b86b475df53bc1227b9cb5f195026bd4fda9c` |
| RC3-DEV baseline | `raqee3-v8.0.0-rc3-dev.html` | 483593 | `ebdb9c9f34f09c094d394bda897555758efe7aad9f30e43b41f1bd5fb7b873ed` |
| RC3-DEV tested alias | `raqee3-v8.0.0-rc3-dev-tested.html` | 483593 | `ebdb9c9f34f09c094d394bda897555758efe7aad9f30e43b41f1bd5fb7b873ed` |
| RACEFIX work copy | `raqee3-v8.0.0-rc3-dev-racefix.html` | 492397 | `29f454fbf77a3e78336a8ca82ec01843ed8e2dff42a27cd911b5879e85573632` |
| RACEFIX2 current file | `raqee3-v8.0.0-rc3-dev-racefix2.html` | 495312 | `6e41866ff757518f641546083e5441e19f153c3585a6b43799fd2daa66561c13` |

`BUILD-METADATA.json` يربط خط الأساس والنسخة RACEFIX والـ patch؛ اختبارات RACEFIX الموثقة كانت Chromium mock/in-memory، وليست Native FSA ولا كتابة قرص فعلية. `RC3-DEV-build-metadata.json` يربط RC2 والمرشح RC3-DEV وpatch FOLDER-LOG-01؛ README يذكر اختبارات Node mock فقط. لذلك لا يُحوّل أي من هذه النتائج إلى اعتماد Native أو اعتماد إصدار.

توجد في HEAD تقارير DIRECT-02 القديمة وتقارير Runner v1.1.9 (`1794317937567` و`1794320481463`). البيانات التي سبق فحصها تضعها تحت `UNVALIDATED_HARNESS` و`NOT_ATTESTED` و`NOT_AUTHORIZED` مع `closure_authorized=false`. كما تسجل حالات تبديل اصطناعي لحالة global، وبعض شروط `write-pending`/`close-pending` كانت قد انتهت Promises الأصلية عند لحظة التبديل؛ واختبار UI لم يسجل نقرة بشرية موثوقة. وجود `PASS` في تقرير لا يغلق DIRECT-02.

## 8. تناقضات الخطة الستة — نتيجة P0 الحالية

1. **بيان البصمات:** حُسم النطاق. `SHA256SUMS.txt` الحالي خاص بحزمة FOLDER-LOG ويتطابق مع ملفاتها التسعة، لكنه ليس Manifest المستودع. أُعد Manifest كامل منفصل.
2. **Fixtures:** تبقى مجموعات A/B مختلفة ولا يجوز توحيدها بالاسم. خطة التطوير تسجل: حزمة يدوية A=949 وB=51 bytes؛ تقرير Android سابق A=1213 وB=174؛ وRunner v1.1.8 A=1213 وB=51 مع بصمات مختلفة. الملف `B.txt` الحالي حجمه 174 bytes، ولا يظهر `A.txt` مستقل بالاسم في HEAD. يلزم إكمال ربط كل تقرير بـfixtureSetId والبصمات الدقيقة في P1.
3. **Runner v1.1.8:** الخطة تصفه بأنه غير معتمد ويحتاج مراجعة مستقلة، وبعض توقيتات pending غير مثبتة بوصفها Promise أصلية معلقة. لا يظهر ملف باسم v1.1.8 في شجرة HEAD الحالية؛ الموجود تقريرا v1.1.9. هذا البند موثق، وتبقى إعادة التحقق من مصدر Runner القديم ومراجعة الاختبارات في P1.
4. **أرشيف RACEFIX المحذوف:** التصحيح: الأرشيف لا يوجد في HEAD الحالي، لكنه محفوظ تاريخيًا. الأرشيفات الأربعة كانت عند commit `d24321...` ثم تظهر `removed` بالمقارنة إلى HEAD الحالي. المقارنة البايتية مع نسخة ZIP حالية غير ممكنة حتى تتوفر نسخة حالية/مرفق ثنائي للمقارنة.
5. **PR-2 / Unicode:** ملفات التصميم والتنفيذ موجودة، لكن يلزم في P1 ربط كل نتيجة بمرشح حاضر محدد البصمة قبل إعادة اعتماد نتائجها. لم يُمنح إغلاق PR-2 في هذا التدقيق.
6. **CASRAI:** الخطة تنص على تعريف الاختصار إن احتيج إليه أو حذفه. يسجل هذا كتدقيق تحريري مفتوح، ولا يؤثر في صلاحية Manifest أو SHA.

## 9. حالة البوابة والقرار

| البند | الحالة | المبرر |
|---|---|---|
| HEAD / Tree / قائمة الملفات | `PASS` | مثبتة من Git API؛ 54 ملفًا، Tree SHA موثق |
| حجم كل ملف وGit Blob SHA-1 | `PASS` | 54/54؛ الحجم يطابق Git Tree |
| SHA-256 للملفات النصية في HEAD | `PASS` | 54/54؛ اختبارات تحقق قياسية ناجحة |
| نسخة الخطة تحت docs | `PASS` | Git Blob SHA مطابق للجذر |
| مراجعة نطاق SHA256SUMS.txt | `PASS` | نطاق FOLDER-LOG واضح وتطابق التسعة ملفات |
| جرد الأرشيفات وتاريخ الإضافة/الإزالة | `PARTIAL` | أربعة أرشيفات موثقة تاريخيًا، لا ZIP في HEAD، ولم تحسب SHA-256 للـZIP binary |
| مقارنة ZIP تاريخي بنسخة حالية | `BLOCKED` | لا توجد نسخة ZIP في HEAD للمقارنة الحالية |
| ربط جميع Fixtures بكل تشغيل | `OPEN` | يلزم إكمال المصفوفة في P1؛ مجموعات A/B ليست واحدة |
| تحديث STATUS وEXECUTION-LOG ورفع الملفات المرافقة | `PENDING_UPLOAD` | الملفات جاهزة؛ لم تُرفع إلى المستودع من هذا التدقيق |

**القرار:** `P0 = IN_PROGRESS`. لا تنتقل إلى P1 قبل رفع الوثائق ومراجعة استكمال عناصر المقارنة الثنائية والأرشيفات وقبول صاحب المشروع/مراجع مستقل. لم يُعدّل كود التطبيق أو `main` في هذا التدقيق.

## 10. ملفات هذه الحزمة ومواقع رفعها

- `BASELINE-MANIFEST.json` ← ارفعه إلى `docs/BASELINE-MANIFEST.json`.
- `ARCHIVE-INVENTORY.md` ← ارفعه إلى `docs/ARCHIVE-INVENTORY.md`.
- `STATUS.md` ← استبدل به `docs/STATUS.md` (النسخة الموجودة قديمة ولا تطابق HEAD الحالي).
- `EXECUTION-LOG-APPEND.md` ← أضف محتواه في نهاية `docs/EXECUTION-LOG.md`؛ لا تستبدل السجل كاملًا ولا تحذف إدخالاته السابقة.
- `P0-BASELINE-REPORT-2026-11-12.md` ← ارفعه إلى `docs/P0-BASELINE-REPORT-2026-11-12.md` كمرجع تدقيق.
- لا ترفع أو تستبدل `docs/MASTER-DEVELOPMENT-PLAN.md`؛ نسخته الحالية مطابقة لأصل الجذر.
