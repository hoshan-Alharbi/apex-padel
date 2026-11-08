# مطابقة شاشة الرئيسية — `ref/club_discovery_home`

المرجع: `ref/club_discovery_home/code.html` + `screen.png`. هذا الملف قائمة التحقق للمطابقة: كل عنصر ومؤثر، وكيف يُنقل لـ React Native، وحالته.

## الخطوط والمقاسات (Tailwind config في المرجع)
| Token | المقاس / السطر | الوزن | Tracking | الخط في المرجع | عندنا |
|---|---|---|---|---|---|
| headline-lg-mobile (H1) | 26 / 32 | 800 (extrabold) | -0.015em | Sora | Readex Pro Bold |
| headline-sm | 18 / 24 | 700 (font-bold) | 0 | Sora | Readex Pro Bold |
| body-md | 14 / 20 | 400 | — | Plus Jakarta Sans | Readex Pro |
| body-sm | 12 / 18 | 400 | — | Plus Jakarta Sans | Readex Pro |
| label-numeric | 14 / 18 | 700 | 0.05em | Space Mono | Space Mono ✓ |
| label-badge | 11 / 14 | 700 | 0.08em + UPPERCASE | Plus Jakarta Sans | Readex Pro Bold |
| action-button | 15 / 20 | 700 | 0.01em | Sora | Readex Pro Bold |

- الـ tracking يُطبَّق على اللاتيني فقط: التباعد بين الحروف يكسر اتصال الحروف العربية.
- Sora وPlus Jakarta Sans لا تدعم العربي، فالعربي دائماً Readex Pro. للإنجليزي: مطابقة الخطين تحتاج موافقة على مكتبتين (انظر آخر الملف).

## الألوان المستخدمة فعلياً في الشاشة
`background/surface #0E131D` · `surface-container-low #171C26` · `surface-container #1B202A` · `surface-container-high #252A35` · `surface-variant #303540` · `card #1F242D` · `recessed #121721` · `outline #8F9378` · `outline-variant #444932` · `on-surface #DEE2F1` · `on-surface-variant #C5C9AC` · `primary-container (volt) #CAF300` · `on-primary #2A3400` · `secondary #BDF4FF` · `secondary-container #00E3FD` · `error #FFB4AB` · `error-container #93000A` · `tertiary-fixed #FFD9DC` · `white/8%` و`white/10%` للحدود.

## المؤثرات
| المؤثر | المرجع | التنفيذ في RN |
|---|---|---|
| Volt glow | `box-shadow: 0 0 24px -2px rgba(202,243,0,.35)` (الشريحة النشطة + بانر المباراة) | `boxShadow` (RN 0.88، Android + iOS) |
| Cyan glow | `0 0 20px -2px rgba(0,227,253,.25)` (معرّف، غير مستخدم في الشاشة) | — |
| بقعة توهج | دائرة 144px `volt/10` مع `blur-2xl` في زاوية البانر (-40, -40) | `RadialGradient` في react-native-svg |
| تدرج البانر | `to-br`: surface-container-high → surface-container → surface-container-low | `expo-linear-gradient` بثلاث نقاط |
| نص متدرج | "Next Court": `from-primary via-on-surface to-primary-container` | نص SVG بـ `LinearGradient` fill |
| زجاج الهيدر | `surface/90` + `backdrop-blur-md` + حد سفلي `outline-variant/30` | `BlurView` + `BlurTargetView` (Android) |
| زجاج الشارات | `surface-container-low/90` + `backdrop-blur-md` + حد `white/10` | `BlurView` لكل شارة، والهدف صورة الكرت |
| زجاج الشريط السفلي | `surface-container-low/95` + `backdrop-blur-lg` + ظل `0 -8px 25px rgba(0,0,0,.5)` | `BlurView` (الهدف محتوى الشاشة النشطة) + `boxShadow` |
| نبض | نقطة التحية `animate-pulse` | Reanimated: opacity 1↔0.5 |
| Ping | نقطة "1 Spot Left" `animate-ping` | Reanimated: scale 1→2 + opacity 1→0 |
| ضغط | `active:scale-95` على الأزرار والشرائح | `PressableScale` |

## العناصر بالترتيب
1. **الهيدر (ثابت، 56px):** أيقونة موقع volt 20 · عمود: "Apex Padel KSA" (body-sm outline) فوق "Riyadh, KSA" (headline-sm bold) + سهم 16 · زر تنبيه دائري `p-2 bg-surface-container` بنقطة volt بإطار surface · صورة حساب 36px بإطار `ring-2 volt/40` و`p-0.5`.
2. **التحية:** شارة `rounded-full bg-surface-container border outline-variant/30 px-2.5 py-1` بنقطة volt نابضة + "Salam, Fahad 🎾".
3. **العنوان:** سطرين، 26/32 extrabold: "Find & Book Your" ثم "Next Court" بتدرج.
4. **البحث:** حقل `py-3 rounded-xl bg-#121721 border outline-variant/30` بأيقونة بحث، + زر فلتر 48×48 `rounded-xl bg-surface-container border outline-variant/40` أيقونة tune.
5. **الشرائح:** النشطة `bg-volt text-surface px-4 py-2` بنقطة 6px + glow · الباقي `bg-surface-container border outline-variant/30 text-on-surface-variant px-3.5` مع إيموجي.
6. **بانر المباراة:** `rounded-2xl p-4` تدرج + حد `outline-variant/40` + volt glow + بقعة توهج · صف: شارة cyan + وقت mono volt | شارة حمراء مع ping · عنوان headline-sm · سطر تفاصيل · فاصل · صور لاعبين متداخلة 28px (+1 منقط volt) | زر volt `rounded-xl px-4 py-2` + سهم.
7. **عنوان القسم:** "Featured Clubs" + وصف outline | "View All ›" volt.
8. **كرت النادي:** `bg-#1F242D rounded-2xl border white/8` · صورة 176px · شارات زجاج أعلى البداية (cyan/volt) + تقييم زجاج أعلى النهاية (`rounded-lg`، نجمة مملوءة volt، رقم mono، عدد outline) · الجسم `p-4 space-y-3`: الاسم + الموقع | السعر mono 18 volt + "/ hour" · شرائح مميزات `rounded bg-surface-container text-xs` · فاصل `white/6` · "Next:" + أوقات mono (الأول volt بحد volt/40، الباقي on-surface-variant) | زر "Book Slot" ثانوي `rounded-lg bg-surface-container border outline-variant/40`.
9. **"Players Looking for 4th":** **مستبعد** (قرار سابق: لا مباريات عامة).
10. **الشريط السفلي:** ملتصق بكامل العرض 64px · أيقونة 24 + label-badge · النشط volt مملوء، الباقي on-surface-variant.

## انحرافات مقصودة (قرارات سابقة)
- **بانر "Open Match":** نفس التصميم والمؤثرات بالضبط، لكن المحتوى "حجزك القادم" (حجز مقسّم بانتظار شريك)، لأن المباريات العامة مستبعدة من المشروع.
- **الشرائح:** نفس الشكل، بفلاترنا المعتمدة (الكل، مكيّف، داخلي، خارجي).
- **التابات:** نفس الشكل، بتاباتنا المعتمدة (الرئيسية، حجوزاتي، المفضلة، حسابي).
- **السعر:** نضيف "يبدأ من" (متطلب المشروع: السعر يبدأ من أقل مدة).
- **صورة الحساب:** صورة المرجع مولّدة من Stitch ولا يمكن استخدامها؛ نستخدم الحرف الأول بنفس الإطار.

## فروقات وُجدت بالمقارنة وأُصلحت
| # | الفرق | السبب | الإصلاح |
|---|---|---|---|
| 1 | "Next Court" المتدرج: حروف عربية مفككة | SVG text لا يشكّل العربي على Android | `GradientText`: نص واحد بألوان متتالية، والتقسيم فقط بعد الحروف غير المتصلة (ا د ذ ر ز و ة) والمسافات |
| 2 | كل الشارات بأحرف كبيرة | المرجع يستخدم `uppercase` على شارة "OPEN MATCH" فقط | `uppercase` صار خاصية لكل استخدام |
| 3 | "/ hour" يظهر "/" فقط | Android يقيس النص المحاذى للنهاية في عمود بعرض المحتوى أقل من حجمه | العمود `stretch` والنص `align=end` |
| 4 | الجرس والنجمة مملوءة | المرجع Material Symbols Outlined | `notifications-none` و `star-border` |
| 5 | شارات الصورة أعرض من نصها | Android يبالغ في قياس النص مع `letterSpacing` لهذا الخط | `letterSpacing: 0` لهذه الشارات (فرق 0.88px غير ملحوظ) |
| 6 | "+1" يظهر "1+" بالعربي | ترتيب ثنائي الاتجاه | علامات LRM حول النص |

## فروقات متبقية (تحتاج قرار)
- **الخطوط:** المرجع Sora (العناوين والأزرار) وPlus Jakarta Sans (النصوص)، والتطبيق Readex Pro للغتين. الخطان لا يدعمان العربي، فالنسخة العربية تبقى Readex Pro في كل الأحوال. مطابقة النسخة الإنجليزية تحتاج `@expo-google-fonts/sora` و`@expo-google-fonts/plus-jakarta-sans` (موافقة).
- **صورة الحساب:** المرجع صورة شخص مولّدة؛ عندنا الحرف الأول بنفس الإطار.
- **النسب:** المرجع مصمم لعرض 390، والمحاكي 448dp. المقاسات بالـ dp كما هي في المرجع، فالعناصر تبدو أصغر قليلاً نسبةً لعرض الشاشة. هذا هو السلوك الصحيح للتطبيقات.
- **الشريط السفلي:** مطابق، مع خط volt صغير ينزلق فوق التاب النشط (للأنيميشن المطلوب)، غير موجود في المرجع.

## الحالة
- [x] التنفيذ LTR والمقارنة مع screen.png (3 جولات)
- [x] الفروقات وإصلاحها
- [x] التعريب RTL بنفس الكثافة والمؤثرات
- [x] موافقة صاحب المشروع (2026-11-08)
