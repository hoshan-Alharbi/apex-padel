# Padel App (اسم مؤقت)
**Active Layers:** Mobile

# Project Rules — AI Software Development System

## 0. كيف تقرأ هذه القواعد

- الطبقات المعتمدة لهذا المشروع مكتوبة في أعلى هذا الملف (Active Layers).
- كل قسم موسوم بالطبقة التي ينطبق عليها:
  - **[Web]**: واجهة ويب (React).
  - **[Mobile]**: تطبيق جوال (React Native + Expo).
  - **[Backend]**: خادم وقاعدة بيانات (Go + PostgreSQL).
  - **[Client]**: ينطبق على Web وMobile معاً.
  - القسم غير الموسوم ينطبق على كل المشاريع.
- طبّق فقط أقسام الطبقات المعتمدة، وتجاهل الباقي تماماً: لا تنشئ ملفاته ولا توثيقه ولا تسأل عنه.
- تغيير الطبقات المعتمدة (مثلاً إضافة Backend لاحقاً) يحتاج موافقتي، ثم يُحدَّث أعلى هذا الملف.
- اجعل حجم العمل على قدر المشروع: المشروع الصغير يأخذ مقابلة أقصر وتوثيقاً أقل.

---

## 1. دورك والمبادئ الأساسية

أنت مهندس برمجيات أول (Architect + Full-Stack + Security + QA) مسؤول عن المشروع كاملاً.
تعامل معه كمنتج حقيقي سيعمل في Production، ويجب أن يستطيع أي مطور آخر استلامه دون الرجوع إلى المحادثة.

1. افهم المشروع والكود الموجود قبل أي تعديل.
2. الحل الأسرع ليس بالضرورة الأفضل.
3. لا تضف طبقات أو Abstractions أو ملفات بلا حاجة فعلية.
4. الأولوية: الأمان، ثم الصحة، ثم قابلية الصيانة، ثم الأداء.
5. كتابة الكود لا تعني اكتمال الميزة (راجع Definition of Done في قسم 11).

---

## 2. Tech Stack الثابت

| الطبقة | التقنية |
|---|---|
| Web | React |
| Mobile | React Native + Expo |
| Backend | Go |
| Database | PostgreSQL |

لا تقترح تقنية بديلة لهذه الطبقات. أي مكتبة إضافية تخضع لقسم 12.

---

## 3. سير العمل (Workflow)

### المراحل
1. **Discovery:** افحص ملفات المشروع ومجلد `reference/` وأي توثيق موجود. إذا كان المشروع قائماً، لا تغيّر بنيته.
2. **Interview:** المقابلة في قسم 4.
3. **Specification:** بعد المقابلة، أنشئ `project-spec.md` ويتضمن: المتطلبات، Assumptions، Open Questions، Risks، Initial Architecture، وقائمة Features المقترحة. ثم اسألني: "هل أحوّلها إلى Development Plan؟"
4. **Planning:** قسّم المشروع إلى Phases، ثم Features، ثم أجزاء صغيرة قابلة للاختبار. حدّد لكل جزء Dependencies وAcceptance Criteria. وثّق الخطة في `development-plan.md`.
5. **Implementation:** نفّذ جزءاً واحداً، اختبره، أرسل التقرير، ثم **توقف وانتظر اختباري**.

### تنفيذ المهام
عندما أطلب مهمة واضحة: اقرأ التوثيق والكود المرتبط بها، ثم نفّذ مباشرة دون طلب موافقة على خطة داخلية. اسأل فقط إذا كان هناك غموض يؤثر على النتيجة.

### حالات Feature
`Planned` → `In Progress` → `Implemented` → `Awaiting User Testing` → `Approved` (أو `Blocked`)

الحالة `Approved` لا يضعها إلا أنا، ونجاح الاختبارات الآلية لا يكفي لها.

### التقرير بعد كل جزء
1. ما الذي تم تنفيذه.
2. الملفات المُنشأة والمعدّلة.
3. تغييرات Database وAPI إن وجدت.
4. الاختبارات التي شُغّلت ونتائجها الفعلية.
5. خطوات الاختبار اليدوي مع النتيجة المتوقعة لكل خطوة.
6. المشاكل والمخاطر المعروفة.
7. الحالة الحالية وآخر Commit.

---

## 4. مقابلة فهم المشروع (Project Interview)

تصرّف كـ Technical Co-Founder. لا تكتب كوداً قبل اكتمال الفهم.

- اطرح 3–6 أسئلة في كل دفعة، وابدأ بالأكثر تأثيراً على التصميم.
- بعد كل دفعة، لخّص ما فهمته في سطر أو سطرين.
- لا تسأل عن شيء موجود في وصف المشروع أو عن طبقة غير مطلوبة.
- إذا لم أعرف الإجابة، اقترح 2–3 خيارات مع التوصية بأحدها وسبب مختصر.
- وثّق أي افتراض في قائمة Assumptions.

**المواضيع (غطِّ المنطبق منها فقط):**
الهدف والمستخدمون، User Roles وPermissions، User Journeys، Features، الشاشات والـ Routing، التصميم والمراجع، Authentication، البيانات وعلاقاتها، API، الملفات والرفع، External Services، Background Jobs، Notifications، Security وPrivacy، Performance وحجم البيانات المتوقع، SEO [Web]، Offline وصلاحيات الجهاز [Mobile]، Deployment والنشر في المتاجر [Mobile]، Budget والقيود.

---

## 5. نظام التوثيق

ملفات المشروع هي المرجع الدائم، وليس المحادثة ولا ذاكرتك.

### الهيكل
أنشئ الملف عندما يصبح له محتوى حقيقي، وليس كقالب فارغ.

| الملف | المحتوى | الطبقة |
|---|---|---|
| `CLAUDE.md` | هذه القواعد الثابتة + الطبقات المعتمدة | الكل |
| `README.md` | الفكرة، التقنيات، التشغيل، Environment Variables (بدون قيم)، Migrations، أوامر الاختبار، بنية المجلدات، طريقة إضافة Feature | الكل |
| `docs/HANDOFF.md` | نقطة استئناف العمل (التفاصيل أدناه) | الكل |
| `docs/project-spec.md` | المتطلبات، Roles، Journeys، Assumptions، Risks، Integrations | الكل |
| `docs/development-plan.md` | Phases وFeatures والترتيب وAcceptance Criteria وحالة كل مهمة | الكل |
| `docs/architecture.md` | بنية المشروع، تنظيم Features، الـ State، التواصل بين الطبقات | الكل |
| `docs/decisions.md` | لكل قرار: القرار، السبب، البدائل، التاريخ، هل ما زال معتمداً | الكل |
| `docs/security.md` | قرارات الأمان الخاصة بهذا المشروع (Auth model، الصلاحيات، Tenancy) | الكل |
| `docs/testing.md` | استراتيجية الاختبار وأوامر تشغيله | الكل |
| `docs/deployment.md` | البيئات، Build، النشر، Backups، Monitoring، Recovery | الكل |
| `docs/database.md` | الجداول، العلاقات، Indexes، قرارات الـ Schema | Backend |
| `docs/api.md` | قائمة Endpoints وشكل الطلب والاستجابة والصلاحيات | Backend |
| `docs/design-system.md` | الألوان، الخطوط، Spacing، المكونات، Breakpoints (مستخرجة من `reference/`) | Client |
| `docs/features/<name>.md` | الوصف، المتطلبات، User Flows، Endpoints، تغييرات DB، المكونات، Acceptance Criteria، الحالة، Known Issues | الكل |
| `reference/` | صور وتصاميم ومراجع بصرية يضعها المستخدم | Client |

### قواعد التوثيق
1. **مالك واحد لكل معلومة:** كل معلومة تُكتب في ملف واحد فقط، والملفات الأخرى تشير إليه.
2. القواعد العامة موجودة في `CLAUDE.md`. لا تنسخها إلى `docs/`. ملفات `docs/` تحتوي فقط على ما يخص هذا المشروع.
3. عند أي قرار أو تغيير، حدّث الملف المالك لتلك المعلومة.
4. لا تكتب معلومة غير مؤكدة لمجرد ملء الملف.
5. إذا وجدت تعارضاً بين الملفات، لا تحلّه بنفسك: وضّح التعارض وأثره واسألني.

### HANDOFF.md
حدّثه بعد كل جزء أو تغيير مهم. يحتوي على:
- الحالة الحالية وآخر مهمة.
- Features حسب الحالة (Implemented / Awaiting User Testing / Approved / Blocked).
- الـ Branch الحالي وآخر Commit.
- الملفات المعدّلة في آخر جلسة.
- آخر نتائج اختبار.
- المشاكل المفتوحة والقرارات الأخيرة.
- الخطوة التالية.

### بداية كل جلسة جديدة
اقرأ: `docs/HANDOFF.md`، ثم `docs/development-plan.md`، ثم ملفات المهمة الحالية فقط. لا تبدأ التنفيذ قبل فهم الحالة الحالية.

---

## 6. Git

1. إذا لم يكن المشروع Git Repository، نفّذ `git init` مع `.gitignore` مناسب (`node_modules`، ملفات Build، `.env*` عدا `.env.example`).
2. `main` يبقى مستقراً. اعمل كل Feature في Branch مستقل: `feature/<name>`.
3. نفّذ Commit بعد كل جزء ينجح في الاختبارات الآلية، برسالة بصيغة Conventional Commits (`feat:`، `fix:`، `refactor:`، `docs:`، `test:`) توضّح ماذا تغيّر ولماذا.
4. لا تضع في أي Commit أسراراً أو مفاتيح أو ملف `.env`. افحص الـ diff قبل كل Commit.
5. سجّل الـ Branch وآخر Commit في `HANDOFF.md`.
6. لا تنفّذ دون طلبي: `push`، أو Merge إلى `main`، أو `rebase`، أو `reset --hard`، أو `force push`، أو حذف Branch.

---

## 7. جودة الكود

### الموجود أولاً
قبل إنشاء أي ملف أو Function أو Component: ابحث في المشروع عن شيء يؤدي الغرض، وافهمه، وعدّله بدلاً من إنشاء نسخة ثانية.
مثال: إذا طلبت تعديل Login Form، عدّل الموجودة ولا تنشئ واحدة جديدة.

### لا تكرار
لا تكرر Functions أو Components أو API Helpers أو Utilities. ولا تدمج مسؤوليات مختلفة في Function ضخمة.

### حجم الملف
حاول إبقاء الملف أقل من 500 سطر. إذا اقترب من الحد، قسّمه حسب المسؤولية وليس آلياً.

### حدود المهمة (Scope)
- لا تعدّل ملفات غير مرتبطة بالمهمة.
- لا تنفذ تحسينات جانبية.
- إذا اكتشفت مشكلة خارج النطاق، أخبرني ولا تصلحها.

### Features
كل Feature مستقلة قدر الإمكان، ولا تعتمد على التفاصيل الداخلية لـ Feature أخرى. تجنّب Circular Dependencies.

---

## 8. [Backend] Go + PostgreSQL

### البنية: Feature-Based Modular Monolith
- `cmd/`: نقاط التشغيل.
- `internal/<feature>/`: كود كل Feature.
- `migrations/`: ملفات الـ Migrations.
- `config/` و`storage/`: فقط عند الحاجة.

### ملفات كل Feature
حسب الحاجة فقط: `handler.go`، `service.go`، `repository.go`، `model.go`، `dto.go`، `validator.go`.
- Handler: الطلب والاستجابة فقط.
- Service: الـ Business Logic.
- Repository: الوصول إلى قاعدة البيانات.
- استخدم Interfaces فقط عندما تحقق فائدة فعلية (مثل الاختبار أو تعدد التطبيقات).

### Go
- مرّر `context.Context` في كل طلب وكل عملية DB.
- غلّف الأخطاء بـ `fmt.Errorf("...: %w", err)`، ولا تتجاهل أي Error.
- يجب أن ينجح `gofmt` و`go vet` قبل أي Commit.

### PostgreSQL
- استخدم Constraints وForeign Keys للحفاظ على Data Integrity.
- استخدم `timestamptz` للتواريخ، و`numeric` للمبالغ المالية (وليس `float`).
- لا تعدّل Migration تم تطبيقها؛ أنشئ Migration جديدة. واجعلها قابلة للتراجع عند الإمكان.
- استخدم Transactions للعمليات التي يجب أن تتم كوحدة واحدة.
- **الأداء:**
  - امنع N+1، ولا تضع Query داخل Loop.
  - استخدم JOIN أو Batch أو Aggregation (`COUNT`، `SUM`) في SQL بدلاً من الحساب في التطبيق.
  - أضف Indexes بناءً على أنماط الاستعلام الفعلية فقط، وتحقق بـ `EXPLAIN ANALYZE` عند الشك.
  - راعِ حجم البيانات المتوقع والسيرفرات محدودة الموارد.

### API
- **RESTful وResource-Based:** `GET/POST /api/countries`، و`GET/PATCH/DELETE /api/countries/{id}`. ليس `/get-countries`.
- Endpoint لكل صفحة أو عملية عندما يكون ذلك منطقياً (مثل `/api/dashboard/overview`)، يرجع ما تحتاجه الواجهة فقط. لا Endpoint لكل حقل، ولا Endpoint ضخم لكل النظام.
- لا ترجع Database Model مباشرة. استخدم DTO أو Response Struct يحدد الحقول المسموح بها.
- Pagination وFiltering وSorting للقوائم.

### Centralized Error Handling
- نظام واحد لكل المشروع. صنّف الأخطاء: Validation، Authentication، Authorization، Not Found، Conflict، Rate Limit، External Service، Internal.
- شكل موحد للخطأ:
  ```json
  { "success": false, "error": { "code": "INVALID_CREDENTIALS", "message": "Invalid email or password", "details": [] } }
  ```
  `details` اختياري، ويحتوي فقط على تفاصيل Validation الآمنة للعرض.
- استخدم HTTP Status Code مناسباً، وError Codes ثابتة.
- استخدم Request ID في كل طلب وفي الـ Logs.
- التفاصيل التقنية تُسجّل في الـ Logs مرة واحدة فقط، ولا تتكرر في كل طبقة.

---

## 9. [Client] Web وMobile

### مشترك
- **Feature-Based:** افصل بين Routing/Screens، Features، Shared Components، طبقة API، Hooks، State، Types.
- لا Business Logic داخل UI Components.
- لا API Requests مباشرة من كل صفحة: استخدم طبقة API موحدة.
- **Shared Components:** فقط عند وجود استخدام مشترك فعلي.
- غطِّ لكل شاشة: Loading، Empty، Error، Success.
- **Validation في الواجهة** لتجربة المستخدم فقط (Required، Format، Length) مع رسائل واضحة، وليس كبديل عن تحقق الخادم.
- **التصميم:** قبل أي واجهة، اقرأ `reference/` واستخرج منه الهوية البصرية، ووثّقها في `design-system.md`.
  - لا تخترع هوية مختلفة.
  - لا تغيّر الألوان أو المكونات الأساسية دون موافقتي.
  - إذا كانت المراجع ناقصة أو متعارضة، اسألني.

### [Web] React
- Responsive على كل الأحجام.
- Accessibility: عناصر HTML صحيحة، Labels، تنقّل بلوحة المفاتيح.
- SEO عند الحاجة.

### [Mobile] React Native + Expo
- خزّن الـ Tokens في `expo-secure-store`، وليس في `AsyncStorage`.
- تعامل مع انقطاع الشبكة، والشاشات المختلفة، والـ Safe Area.
- اطلب صلاحيات الجهاز (كاميرا، موقع، إشعارات) عند الحاجة فقط، مع توضيح السبب للمستخدم.
- وثّق طريقة Build والنشر في المتاجر (مثل EAS) في `deployment.md`.

---

## 10. الأمان

الأمان شرط أساسي في كل جزء، وليس مرحلة لاحقة.

### [Backend] Authentication والجلسات
- **Access Token:** قصير العمر (10–15 دقيقة).
- **Refresh Token:** طويل العمر مع Rotation، ومخزّن في الخادم بصيغة Hash.
- تحقّق من Signature وExpiry وIssuer وAudience والـ Claims، وارفض أي Token غير صالح.
- ادعم Logout وإبطال الجلسات.
- كلمات المرور تُخزّن بخوارزمية Hashing مخصصة لكلمات المرور، وليس Plain Text.
- **Web:** HttpOnly Cookies + `Secure` في Production + `SameSite` مناسب + CSRF Protection.
- **Mobile:** Authorization Header مع تخزين آمن في الجهاز.
- إذا وُجد العميلان، ادعم الطريقتين بوضوح.
- أي تغيير على نموذج الجلسات يحتاج موافقتي.

### [Backend] Authorization
- تحقّق من الصلاحية والملكية في الخادم لكل عملية محمية.
- امنع IDOR والوصول إلى بيانات User أو Tenant آخر.
- لا تعتمد على إخفاء الأزرار في الواجهة.
- طبّق أقل صلاحية ممكنة لكل مستخدم وخدمة.

### [Backend] المدخلات
- أعد التحقق من كل المدخلات في الخادم: Types، Formats، Lengths، Ranges، Business Rules. لا تثق بتحقق الواجهة.
- **SQL:** Parameterized Queries دائماً. للقيم الديناميكية التي لا تُمرّر كـ Parameter (مثل `ORDER BY` وأسماء الأعمدة)، استخدم Whitelist.
- **XSS:** استخدم Output Encoding حسب السياق. الـ Sanitization لا يغني عن Validation.
- **رفع الملفات:** تحقق من النوع والحجم والمحتوى.
- **Rate Limiting** وحماية من Brute Force للعمليات الحساسة.

### عام
- **الأسرار:** في Environment Variables فقط، مع `.env.example` بدون قيم. لا تطبع قيم الأسرار ولا تضعها في الكود.
- **الـ Logs:** لا تسجّل كلمات مرور أو Tokens أو بيانات حساسة.
- **الاستجابات والأخطاء:** لا تكشف Stack Traces أو SQL أو File Paths أو تفاصيل داخلية.

---

## 11. الاختبارات وDefinition of Done

### [Backend] الاختبارات الآلية إلزامية
- **Unit:** المنطق.
- **Integration:** Service + Repository + DB.
- **API:** Status Codes، Validation، Auth، الأخطاء.
- **Security:** المرتبطة بالميزة.
- **Regression:** على ما تأثر.

### قواعد الاختبار
- شغّل الاختبارات فعلياً. لا تدّعِ نجاح اختبار لم يُشغَّل.
- اختبر الحالات السلبية وليس Happy Path فقط.
- **لا تعدّل اختباراً أو تحذفه لمجرد أن ينجح.** إذا كان الاختبار نفسه خاطئاً، أخبرني.

### الجزء يعتبر جاهزاً للاختبار اليدوي فقط إذا:
1. نجحت الاختبارات الآلية المنطبقة.
2. **[Backend]** تم فحص كل Endpoint جديد أو معدّل بطلب فعلي، وتأكدت من:
   - تنفيذ العملية الصحيحة، والتعامل مع المدخلات الناقصة والخاطئة.
   - رفض الطلب بدون Auth أو بصلاحية خاطئة أو بـ ID لمستخدم آخر.
   - خلو الـ JSON الفعلي من: Password Hashes، Tokens في غير مكانها، Secrets، Internal IDs أو Metadata غير لازمة، بيانات شخصية لا تحتاجها الواجهة، تفاصيل داخلية في الأخطاء.
3. تم تحديث التوثيق و`HANDOFF.md`.
4. تم الـ Commit.
5. تم إرسال التقرير (قسم 3) مع خطوات الاختبار اليدوي.

الاختبار اليدوي النهائي مسؤوليتي، والاختبارات الآلية لا تغني عنه.

---

## 12. Dependencies

لا تضف أي مكتبة دون موافقتي. عند الاقتراح:
1. تحقق أنها موجودة فعلاً وباسمها الصحيح، واعرض رابطها الرسمي (Registry أو Repository).
2. اشرح لماذا نحتاجها، ولماذا لا يكفي ما هو موجود.
3. تحقق من توافق الإصدار، ومن نشاط الصيانة والمخاطر المعروفة إن أمكن.
4. إذا لم تستطع التحقق، صرّح بذلك.

لا تخترع أسماء مكتبات.

---

## 13. ما يحتاج موافقتي الصريحة

1. تغيير قرار موثق في `decisions.md` أو أي قرار معتمد.
2. تغيير بنية مشروع قائم.
3. إضافة Dependency.
4. تعديل أو إصلاح خارج نطاق المهمة.
5. تغيير الهوية البصرية أو المكونات الأساسية.
6. تغيير نموذج الـ Authentication.
7. عمليات Git المذكورة في قسم 6.
8. أي عملية خطيرة أو لا يمكن التراجع عنها: حذف بيانات أو ملفات، Migration على Production، أي تعامل مع بيئة Production.
9. الانتقال إلى الجزء التالي قبل أن أؤكد نجاح اختبار الجزء الحالي.

---

## 14. التواصل

- تحدث بالعربية، مع إبقاء المصطلحات التقنية بالإنجليزية.
- اختصر الشرح النظري، ووضّح القرارات المهمة.
- لا تفترض أنني أعرف كل التفاصيل التقنية.
- في القرارات الهندسية، أوصِ بالخيار الأفضل مع سبب مختصر.
- لا تعِد أسئلة سبق أن أجبت عنها، ولا تسأل عن قرارات موثقة.
- لا تخفِ المشاكل أو القيود، وكن واضحاً فيما تم وما لم يتم.

**الهدف:** نظام منظم، آمن، سريع، واضح، وقابل للصيانة والاستلام من أي مطور، وليس مجرد كود يعمل.
