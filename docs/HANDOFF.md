# HANDOFF — Apex Padel

**آخر تحديث:** 2026-11-08

## الحالة الحالية
- المواصفات: [project-spec.md](project-spec.md)، الخطة: [development-plan.md](development-plan.md)، الهوية: [design-system.md](design-system.md).
- **آخر مهمة (طلب صاحب المشروع):** إكمال كل الـ Features الباقية دفعة وحدة بنفس ستايل Stitch: تفاصيل النادي، الحجز، الدفع، التذكرة، تقسيم الفاتورة (متابعة + صفحة الشريك + وضع العرض)، حجوزاتي، المفضلة، حسابي. **كلها منفّذة وبانتظار اختبار صاحب المشروع.**
  - الريفرنس المطابق: `club_details_court_view` ← `club/[id]`، `slot_booking_match_setup` ← `book/[clubId]`، `checkout_match_pass` ← `booking/[id]`.
  - انحرافات مقصودة عن الريفرنس: بدون "Resident Pro Coach" و"Match Style" (مو في المواصفات)، وبدون أسعار ذروة لكل فترة (التسعير حسب المدة فقط). زر Instagram صار "مشاركة". تبديل التقسيم في الدفع (حسب الخطة 4.2) مو في شاشة الحجز.
- **تعديلات بعد ملاحظات صاحب المشروع (نفس اليوم):**
  - الحركة: شلت حركات الـ spring من القوائم (`LinearTransition.springify`) لأنها كانت تهز الكروت وقت الانتقال بين التابات. الرئيسية صارت `LinearTransition.duration(220)`، والمفضلة وحجوزاتي ظهور تدريجي (fade) سريع، ومؤشر "القادمة/السابقة" بـ `withTiming` 200ms بدل spring.
  - التاريخ: الشريط الأفقي صار تقويم أسبوعي (`features/booking/DatePicker.tsx`)، الأحد أول الأسبوع، كل الـ 14 يوم ظاهرة، نقطة لليوم اللي فيه أوقات، وتحت التقويم التاريخ المختار وعدد الأوقات المتاحة.
  - `BottomBar` يقيس طوله (`useBottomBarSpace`)، والشاشات تترك مساحة بنفس الطول، فآخر عنصر ما يتغطى.
  - "/ 60 د" في شريط تفاصيل النادي صار أكبر وأوضح.
- **الدفعة الثانية من الملاحظات:**
  - علامة شريط التابات كانت مزاحة (عرض الصف ينحسب مع الحشوة الجانبية) — صُلحت في `TabBar.tsx` (`ROW_PAD`). حركة العلامة والأيقونة صارت `withTiming` 240ms بدون spring.
  - "محدد" في الأوقات: `ZoomIn.springify` (كان يرج) ← `FadeIn` 160ms، والضغطة 0.98.
  - `PrimaryButton` الخط أصغر (15)، ونسخة `compact` لزر "اختر الوقت واحجز".
  - بوابة الدفع صارت نافذة في نص الشاشة (`PaymentOverlay.tsx`) بدل Sheet من تحت: تحميل ← علامة صح. `GatewaySheet.tsx` حُذف.
  - ملخص الدفع للحجز المدفوع جزئياً يكتب "الإجمالي" بدل "المدفوع".
- **الأوبننج:** معتمد (الشعار يتركّب، `PACE = 1.5` ≈ 2.4 ث).
- الرئيسية: البانر صار يقرأ أقرب حجز فعّال من الحالة (`state/bookings`) بدل البيانات الثابتة، وزر "التفاصيل" يفتح التذكرة. الكروت تفتح تفاصيل النادي و"احجز موعد" يفتح الحجز.

## الريبو: تطبيق + لاندنج (طلب صاحب المشروع)
- **المهمة 1 (نقل التطبيق لـ `mobile/`): لم تكتمل.** `git mv src` يفشل (Permission denied) لأن سيرفرات Expo قديمة (PIDs 2588، 32632، 13104، 33776) ماسكة الملفات. داخل `mobile/` بقايا نسخة ناقصة غير متتبعة (assets، node_modules جزئي، .expo، .claude، .impeccable) من محاولة نقل وقفت، لازم تنحذف قبل إعادة النقل.
  - مؤقتاً: `tsconfig.json` في الجذر يستثني `land` و`mobile`.
- **المهمة 2 (تمت):** `mobile/scripts/capture-screens.mjs` (يشتغل من الجذر قبل النقل وبعده): demo mode لشريط الحالة، يفتح Expo Go ويعيد المحاولة لو ما فتح، deep links، ثم WebP 1080px في `land/public/screens/` (home، club-details، booking، split-bill، match-pass). يحتاج adb وffmpeg (libwebp)، ومرة وحدة: إطفاء زر Tools في قائمة مطوّر Expo Go.
  - التشغيل: `node mobile/scripts/capture-screens.mjs --url exp://127.0.0.1:<port>`.
- **المهمة 3 (تمت):** `land/` Next.js 16 (App Router، static)، عربي RTL، Readex Pro + Space Mono عبر `next/font`، أيقونات Phosphor. النصوص في `land/lib/site.ts`. SEO: metadata + OG image + robots + sitemap. `Dockerfile` في الجذر يبني `land/` (standalone) — مجرّب: `docker build` و`docker run` والمسارات كلها 200.
  - المكتبات (بموافقة صاحب المشروع): next 16.4.5، react/react-dom 19.3.1، @phosphor-icons/react 2.1.10، typescript 5.9.3 + أنواع React وNode.
- **تحسين اللاندنج (2026-11-09):** إيقاع أقسام (أرقام داكنة بأرقام ليمونية تعدّ، bento على خطوط ملعب، marquee مدن، مشهد تقسيم full-bleed حي، تحميل بخلفية ليمونية كاملة)، السماوي لون ثاني، خط عناوين Alexandria 900 (مؤقت لين يختار صاحب المشروع بينه وبين Reem Kufi)، parallax ماوس + لمعة زجاج + خطوط ملعب ترتسم في الهيرو، spotlight وحد متدرج للبطاقات، vignette + grain، devIndicators: false.
  - **ينتظر من صاحب المشروع:** صورة ملعب بالليل في `land/public/hero-court.jpg` (الهيرو يستخدمها تلقائياً لو موجودة، وإلا الخلفية المرسومة).
  - الـ marquee فيه "الدمام" بطلب صاحب المشروع، مع إن التطبيق فيه 3 مدن بس.
- **حزمة مواد الإعلان (2026-11-09):** `video/raw/` (مستثنى من Git): لقطات التطبيق PNG بدقة الجهاز + لحظات، `opening.mp4` 30fps، اللاندنج (desktop 1440@2x، mobile 390@3x، كاملة ولكل قسم)، `brand/`، و`assets.json` (أبعاد + وصف + نقاط ضغط). المراجعة: `video/raw/_review/grid.png`.
  - السكربتات: `mobile/scripts/capture-video-assets.mjs` (يحتاج Metro بـ `--no-dev`؛ خيارات `--taps-only` و`--trim-opening a-b`)، و`land/scripts/capture-video-assets.mjs` (Playwright عبر Chrome المثبت). helpers مشتركة في `mobile/scripts/lib/android.mjs`.
  - **إصلاح "فى" بدل "في" على أندرويد:** نقاط الياء الأخيرة في Readex Pro تنزل ~0.5em تحت السطر وأندرويد يقصها. الحل في `src/lib/arabicDescent.ts` (padding سفلي + margin سالب) ومطبّق في `AppText` و`GradientText`. المسافات السفلية للنص لازم تكون في `style` مو `className`.
  - **إصلاح نافذة الدفع:** ما كانت تظهر أبداً (opacity من shared value داخل Modal). صارت entering animations.
  - لقطات الويب الطويلة للتطبيق: متخطاة، لأن نسخة الويب تطلع إنجليزي LTR (اللغة من `I18nManager.isRTL`).
  - بعد أي تعديل والتشغيل بـ `--no-dev`: `pm clear` لـ Expo Go، ثم `set-app-locales ar-SA`، وإطفاء زر Tools من قائمة المطوّر.
- إصلاح جانبي في التطبيق: `Glass` يستخدم `blurMethod: 'none'` قبل ما يجهز الهدف (كان يطلع تحذير BlurView)، و`LogBox` يتجاهل تحذير ImageBackground من مكتبة خارجية.

## Features حسب الحالة
- **Approved:** 0.1، 0.2، 1.3
- **Awaiting User Testing:** 0.3، 1.1، 1.2، 2.1–2.3، 3.1–3.5، 4.1–4.5، 5.1، 5.2 (بدون تبديل اللغة)
- **جزئي:** 0.4 (زر تبديل اللغة داخل التطبيق لم يُبنَ — انظر المشاكل)، 0.5 (مولّد الأوقات صار موجود في `features/booking/slots.ts`)
- **Planned:** 6.1 (مراجعة كاملة للإنجليزي + الأداء)، 6.2 (README، MIT، Dockerfile)

## Git
- **قرار صاحب المشروع:** لا commit ولا push حتى ينتهي التصميم.
- Branch: `feature/foundation`، آخر commit (قبل القرار): `7778493`. كل العمل بعده غير مُثبت.
- `ref/` غير مضاف للـ Git. `git config user.name` = "اسمك" — يُصحح قبل أي رفع.

## الملفات في آخر جلسة
- **جديد:** `src/app/{club/[id],book/[clubId],booking/[id],checkout,split/[id],pay/[bookingId]/[shareId]}.tsx`، `src/features/clubs/details/*`، `src/features/booking/*`، `src/features/bookings/*`، `src/features/favorites/FavoritesScreen.tsx`، `src/features/account/*`، `src/features/splash/LogoMark.tsx`، `src/state/{bookings,bookingsSeed}.tsx/ts`، `src/lib/{format,useNow}.ts`، `src/components/{ScreenHeader,TabScreen,PrimaryButton,BottomBar,IconButton,Sheet,Toggle,SectionTitle,EmptyState,AnimatedNumber}.tsx`، `src/components/effects/DrawnCheck.tsx`، `src/i18n/{ar,en}.ts`.
- **معدّل:** `data/types.ts` و`data/clubs.ts` (عنوان، هاتف وهمي 555، مرافق، مواصفات، آراء)، `i18n/strings.ts` (صار يجمع `ar.ts` و`en.ts`)، `HomeScreen`، `NextBookingBanner`، `CitySheet` (يستخدم `Sheet` المشترك)، `_layout.tsx` (`BookingsProvider`).
- **محذوف:** `data/bookings.ts` (انتقل لـ `state/bookingsSeed.ts`)، `components/ComingSoon.tsx` (ما عاد مستخدم).

## آخر نتائج اختبار
- `tsc` ✓، `expo lint` ✓ (0 مشاكل)، `jest` 27/27 ✓ (تنسيق التاريخ، الأوقات، التسعير، التقسيم).
- محاكي Android (dev، عربي) — مسارات مجرّبة فعلياً:
  - الرئيسية ← تفاصيل النادي (Parallax + الهيدر يتحول) ← الحجز ← اختيار وقت وإضافات (الإجمالي يتحدث) ← الدفع بتقسيم 4 لاعبين ← البوابة ← التذكرة "بانتظار الشركاء".
  - متابعة التقسيم ← معاينة صفحة الشريك ← دفع حصته ← تحدّث الحالة والمتبقي.
  - وضع العرض (ضغطة مطولة على الشعار في حسابي) ← "العدّاد ينتهي بعد 10 ثواني" ← الحجز صار "ملغي ومسترجع" في السابقة.
  - "الدفع في الملعب" ← "بانتظار التأكيد" ← مؤكد تلقائياً بعد 8 ث.
  - الإنجليزي (LTR): تفاصيل النادي والحجز مرتبة.
- **ملاحظة:** بعد Fast Refresh على أندرويد أحياناً تنقص آخر كلمة من عنوان (مثل "آخر الليل" ← "آخر"). يختفي بإعادة التشغيل الكاملة؛ مو مشكلة في التطبيق.

## التشغيل والاختبار (مهم)
- `ANDROID_HOME="$LOCALAPPDATA/Android/Sdk" npx expo start` ثم فتح `exp://127.0.0.1:<port>` في Expo Go (مع `adb reverse tcp:<port> tcp:<port>`).
- **تبديل لغة Expo Go على المحاكي:** `adb shell cmd locale set-app-locales host.exp.exponent --locales ar-SA` (أو `en-US`) ثم إعادة تشغيل Expo Go. يحتاج `expo.extra.supportsRTL: true` في `app.json` (موجود).
- بعد تغيير babel/metro/tailwind: `--clear` + force-stop لـ Expo Go.
- الحالة (الحجوزات، المفضلة) في الذاكرة فقط: إعادة التشغيل ترجعها للبيانات الأولية.

## المشاكل المفتوحة
- **تبديل اللغة داخل التطبيق:** `forceRTL` + إعادة تحميل لا يعمل في Expo Go. الحلول: Development Build، أو تبديل فوري يدوي للاتجاه. يحتاج قرار. صف "اللغة" في حسابي يعرض اللغة الحالية فقط.
- **تخطي الأوبننج:** ضغطة تتخطى دائماً. "يعرض مرة وحدة فقط" يحتاج `@react-native-async-storage/async-storage` — بانتظار قرار.
- **مكتبات غير مستخدمة:** `expo-gl`، `three`، `@types/three` — حذفها بانتظار موافقة.
- **أيقونة التطبيق** من `ref/logo.png` (جزء من 1.3) لم تُحدّث بعد — `assets/icon.png` لسا الافتراضية.
- **الـ glow بـ `FeGaussianBlur`:** يشتغل على أندرويد. iOS ما انختبر.
- **رمز الدخول في التذكرة شكلي** (يشبه QR وما ينقرأ) — مقصود في نسخة UI فقط.
- **خطوط Sora + Plus Jakarta Sans** للإنجليزي — بانتظار موافقة.
- NativeWind 4.2.7 يعلن دعم SDK 57 رسمياً؛ يعمل على 58.
- وجهة الاسترجاع التلقائي: تُقرر لاحقاً.
- Expo Go يخزّن bundle الـ production: بعد `--no-dev` لازم `adb shell pm clear host.exp.exponent`.

## الخطوة التالية
- اختبار صاحب المشروع لكل الشاشات الجديدة (الخطوات في آخر تقرير).
- بعدها: Phase 6 (مراجعة الإنجليزي والأداء، README، MIT، Dockerfile، أيقونة التطبيق).
