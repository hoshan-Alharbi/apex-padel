// Landing-page copy and constants (Arabic, approved by the owner). One place to edit text.

export const SITE = {
  name: 'أبكس بادل',
  nameLatin: 'Apex Padel',
  title: 'أبكس بادل | احجز ملعب البادل في السعودية',
  description: 'اكتشف أندية البادل في الرياض وجدة والخبر، احجز وقتك في ثواني، وقسّم الفاتورة على الشلة.',
  url: process.env.SITE_URL ?? 'http://localhost:3000',
};

export const NAV = { features: 'المزايا', download: 'حمّل التطبيق' };

export const HERO = {
  eyebrow: 'حجز ملاعب البادل في السعودية',
  titleAccent: 'ملعبك الجاي،',
  title: 'بضغطة وحدة',
  body: 'اكتشف أندية البادل في الرياض وجدة والخبر، اختر الوقت اللي يناسبك، وقسّم الفاتورة على الشلة.',
  primary: 'حمّل التطبيق',
  secondary: 'شوف المزايا',
  screenAlt: 'الشاشة الرئيسية في تطبيق أبكس بادل: الأندية المميزة وحجزك القادم',
};

export const FEATURES_TITLE = 'كل اللي تحتاجه قبل المباراة';

export const DISCOVER = {
  title: 'اكتشف الأندية حولك',
  body: 'فلتر المكيّف والداخلي والخارجي، شوف التقييمات والمرافق، واحفظ ناديك المفضل.',
  points: ['أندية في الرياض وجدة والخبر', 'ملاعب مكيّفة وبانورامية', 'تقييمات وآراء اللاعبين'],
  screenAlt: 'صفحة تفاصيل النادي: الصور والمرافق والملاعب',
};

export const BOOK = {
  title: 'احجز وقتك في ثواني',
  body: 'تقويم واضح، أوقات مقسّمة حسب الفترة، والسعر يتحدّث مع المدة والإضافات.',
  points: ['14 يوم قدامك في تقويم واحد', 'مدة 60 أو 90 أو 120 دقيقة', 'مضارب وكور ومويه مع الحجز'],
  screenAlt: 'شاشة الحجز: التقويم والمدة والأوقات المتاحة',
};

export const SPLIT = {
  title: 'قسّم الفاتورة على الشلة',
  body: 'كل لاعب يدفع حصته برابط. ولو ما اكتمل الدفع خلال ساعة، ينلغي الحجز ويرجع المبلغ تلقائياً.',
  screenAlt: 'شاشة تقسيم الفاتورة: العدّاد وحالة دفع كل لاعب',
  // Mirrors the app's seed split booking (220 SAR on four players).
  players: [
    { name: 'فهد', amount: '55 ر.س', paid: true },
    { name: 'طارق', amount: '55 ر.س', paid: true },
    { name: 'سلمان', amount: '55 ر.س', paid: true },
    { name: 'خالد', amount: '55 ر.س', paid: false },
  ],
  paid: 'دفع',
  waiting: 'بانتظار الدفع',
  timer: 'الوقت المتبقي',
};

export const DOWNLOAD = {
  title: 'جاهز للمباراة الجاية؟',
  body: 'تذكرة الدخول ورمز البوابة وتفاصيل الدفع في مكان واحد.',
  ios: 'حمّل للآيفون',
  android: 'حمّل للأندرويد',
  screenAlt: 'تذكرة المباراة: رمز الدخول وتفاصيل الحجز',
};

export const FOOTER = {
  rights: '© 2026 أبكس بادل',
  disclaimer: 'مشروع استعراضي — ليس تطبيقاً منشوراً',
};

/** Screenshot files written by mobile/scripts/capture-screens.mjs. */
export const SCREENS = {
  home: '/screens/home.webp',
  club: '/screens/club-details.webp',
  booking: '/screens/booking.webp',
  split: '/screens/split-bill.webp',
  pass: '/screens/match-pass.webp',
} as const;

/** Screenshot size (1080 wide, the emulator's 1344×2992 scaled down). */
export const SCREEN_SIZE = { width: 1080, height: 2404 };
