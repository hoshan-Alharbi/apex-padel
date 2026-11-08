# Design System — Apex Padel

**المصدر:** `ref/DESIGN.md` وشاشات `ref/*/screen.png`.

**مالك القيم:** [src/theme/tokens.js](../src/theme/tokens.js). هذا الملف يشرح المعنى والاستخدام فقط، ولا يكرر القيم إلا للتوضيح.

## قرار: أي مجموعة ألوان؟
`ref/DESIGN.md` فيه مجموعتان مختلفتان قليلاً:
- **مجموعة الـ YAML** (أعلى الملف): Volt `#CAF300`، Cyan `#00E3FD`، والخلفية `#0E131D`.
- **مجموعة النص الشرحي:** Volt `#D4FF00`، Cyan `#00E5FF`، والخلفية `#0D1117`.

**الشاشات المرجعية نفسها مبنية بمجموعة الـ YAML**، وهي اللي اعتمدناها. الاستثناء الوحيد هو **Crimson `#FF3366`**: ما له مقابل واضح في الـ YAML، فأخذناه من النص الشرحي.

## الألوان (أسماء دلالية)
| Token | Tailwind | الاستخدام |
|---|---|---|
| `bg` | `bg-bg` | خلفية التطبيق |
| `surface-low` | `bg-surface-low` | أقسام غير تفاعلية، شريط التاريخ، chips غير مختارة |
| `surface` | `bg-surface` | الكروت (ملاعب، حجوزات) |
| `surface-high` | `bg-surface-high` | عناصر داخل الكروت، الـ Sheets |
| `surface-highest` | `bg-surface-highest` | أعلى طبقة، حالات الضغط |
| `recessed` | `bg-recessed` | حقول الإدخال والبحث |
| `ink` | `text-ink` | النص الأساسي |
| `ink-strong` | `text-ink-strong` | العناوين والأسعار |
| `ink-soft` | `text-ink-soft` | النص الثانوي |
| `ink-muted` | `text-ink-muted` | تسميات، وحدات (ر.س)، أوقات معطّلة |
| `line` | `border-line/30` | حدود خفيفة |
| `volt` | `bg-volt` / `text-volt` | الأفعال الأساسية، الاختيار، المؤكد. **لا يُستخدم كخلفية مساحات كبيرة** |
| `volt-ink` | `text-volt-ink` | النص فوق Volt |
| `cyan` | `text-cyan` | المرافق (مكيّف، داخلي)، المعلومات، "متاح" |
| `crimson` | `text-crimson` | العدّاد، "باقي مكان واحد"، الإلغاء |

**حدود الكروت:** `border border-ink-strong/10` (≈ `rgba(255,255,255,0.08)` في المرجع).

## الزوايا (px)
| Token | القيمة | الاستخدام |
|---|---|---|
| `rounded-xs` | 4 | شارات صغيرة |
| `rounded-sm` (DEFAULT) | 8 | الحقول، خانات الأوقات |
| `rounded-md` | 12 | عناصر داخلية |
| `rounded-lg` | 16 | الكروت والأزرار الكبيرة |
| `rounded-xl` | 24 | الـ Sheets |
| `rounded-full` | — | chips، صور شخصية، شارات الحالة |

## المسافات
- مقياس Tailwind القياسي (`inlineRem: 16`، أي `p-4` = 16px).
- `px-gutter` = 16 هو هامش الشاشة الجانبي.
- أقل ارتفاع للعناصر القابلة للضغط: 48px.

## الخطوط
- Readex Pro (400/500/600/700) للعربي والإنجليزي، وSpace Mono Bold للأسعار والأوقات والتقييم.
- **مقياس الخط** منقول من Tailwind config في المرجع: [src/theme/typography.ts](../src/theme/typography.ts)، ويُستخدم عبر `AppText variant`.
- الـ tracking (letter-spacing) يُطبَّق على الإنجليزي فقط، لأنه يكسر اتصال الحروف العربية.

## المؤثرات (مكوّنات في `src/components/effects/`)
| المؤثر | المكوّن | ملاحظة |
|---|---|---|
| Volt glow `0 0 24px -2px rgba(202,243,0,.35)` | `boxShadow` مباشرة | يوضع على غلاف بدون `overflow: hidden` |
| بقعة توهج `bg-*/10 blur-2xl` | `GlowSpot` | تدرج دائري SVG |
| زجاج `backdrop-blur` | `Glass` + `BlurTargetView` | Android 12+ يحتاج ref للمحتوى خلف الزجاج؛ `ScreenBlurTarget` يشارك هدف الشاشة مع شريط التابات |
| نص متدرج `bg-clip-text` | `GradientText` | ألوان متتالية بدون كسر اتصال الحروف العربية |
| `animate-pulse` / `animate-ping` | `PulseDot` / `PingDot` | Reanimated، تحترم Reduced Motion |
| علامة صح ترسم نفسها + جزيئات | `DrawnCheck` | نجاح الدفع والتأكيد |

## المكونات المشتركة (`src/components/`)
| المكوّن | الاستخدام |
|---|---|
| `ScreenHeader` | هيدر شاشات الـ Stack: زر رجوع دائري، عنوان وعنوان فرعي، أزرار بالطرف |
| `TabScreen` | هيكل تابات حجوزاتي/المفضلة/حسابي: عنوان كبير ومساحة شريط التابات |
| `PrimaryButton` | الزر الرئيسي: Volt، ارتفاع 56، توهج؛ نسخة ثانوية بحد Volt |
| `BottomBar` | شريط ثابت بالأسفل (السعر + الزر) |
| `IconButton` | زر أيقونة دائري 40px (عادي أو فوق الصور) |
| `Sheet` | Bottom sheet بـ Spring (المدينة، وضع العرض) |
| `Toggle` | مفتاح Volt يحترم اتجاه اللغة |
| `SectionLabel` / `SectionTitle` | تسمية صغيرة فوق مجموعة / عنوان قسم |
| `EmptyState` | حالة فاضية بحد متقطع |
| `AnimatedNumber` | السعر يعدّ لقيمته الجديدة |
