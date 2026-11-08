# HANDOFF — Apex Padel

**آخر تحديث:** 2026-11-08

## الحالة الحالية
- المواصفات: [project-spec.md](project-spec.md)، الخطة: [development-plan.md](development-plan.md).
- آخر مهمة: الجزء **0.1** (إنشاء مشروع Expo SDK 58 + expo-router) — `Awaiting User Testing`.

## Features حسب الحالة
- **Awaiting User Testing:** 0.1
- **Approved / Blocked:** لا يوجد.
- **باقي الأجزاء:** `Planned`.

## Git
- Branch: `feature/foundation`
- `main` فيه commit التوثيق فقط.
- `ref/` غير مضاف للـ Git (بانتظار قرار صاحب المشروع: يُرفع أو يُتجاهل).
- `git config user.name` في الجهاز = "اسمك" (قيمة افتراضية) — بانتظار قرار قبل أي push.

## الملفات في آخر جلسة
`package.json`, `app.json`, `tsconfig.json`, `.gitignore`, `eslint.config.js`, `src/app/_layout.tsx`, `src/app/index.tsx`, `AGENTS.md` (من قالب Expo), `.claude/settings.json` (من قالب Expo).

## آخر نتائج اختبار
- `tsc --noEmit`: ناجح.
- `expo lint`: ناجح.
- `expo-doctor`: 20/20.
- تشغيل فعلي على محاكي `Pixel_9_Pro_XL` بـ Expo Go: الشاشة المؤقتة تظهر.

## التشغيل
- `ANDROID_HOME` غير مضبوط في الجهاز. يُمرَّر داخل الأمر: `ANDROID_HOME="$LOCALAPPDATA/Android/Sdk" npx expo start --android`.

## المشاكل المفتوحة
- وجهة الاسترجاع التلقائي (بنك أو رصيد داخل التطبيق): تُقرر لاحقاً.

## الخطوة التالية
- بعد موافقة صاحب المشروع على 0.1: الجزء **0.2** (NativeWind + Design tokens + `design-system.md`).
