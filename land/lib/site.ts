// Landing-page copy and constants (Arabic, approved by the owner). One place to edit text.
// Facts here come from the app itself (cities, durations, split rules), not invented metrics.

export const SITE = {
  name: 'أبكس بادل',
  nameLatin: 'Apex Padel',
  title: 'أبكس بادل | احجز ملعب البادل في السعودية',
  description: 'اكتشف أندية البادل في الرياض وجدة والخبر، احجز وقتك في ثواني، وقسّم الفاتورة على الشلة.',
  url: process.env.SITE_URL ?? 'http://localhost:3000',
};

export const NAV = { features: 'المزايا', split: 'تقسيم الفاتورة', how: 'طريقة الحجز', download: 'حمّل التطبيق' };

export const HERO = {
  eyebrow: 'حجز ملاعب البادل في السعودية',
  // Rendered as: ملعبك <الجاي>، / بضغطة وحدة (the middle word gets the volt→cyan gradient).
  titleLead: 'ملعبك',
  titleHighlight: 'الجاي',
  titleTail: '،',
  title: 'بضغطة وحدة',
  body: 'اكتشف أندية البادل في الرياض وجدة والخبر، اختر الوقت اللي يناسبك، وقسّم الفاتورة على الشلة.',
  primary: 'حمّل التطبيق',
  secondary: 'شوف المزايا',
  screenAlt: 'الشاشة الرئيسية في تطبيق أبكس بادل: الأندية المميزة وحجزك القادم',
  chips: {
    next: { label: 'حجزك القادم', value: 'الليلة 9:00 م' },
    club: { label: 'نادي الصدارة للبادل', value: '4.9' },
    split: { label: 'باقي شريك واحد', value: '55 ر.س' },
  },
};

export const FACTS = [
  { value: '3', label: 'مدن: الرياض، جدة، الخبر' },
  { value: '14', label: 'يوم تقدر تحجز فيها مقدماً' },
  { value: '60-120', label: 'دقيقة لكل حجز، والسعر يتحدّث مباشرة' },
  { value: '2-4', label: 'لاعبين يتقاسمون الفاتورة' },
];

export const FEATURES = {
  title: 'كل اللي تحتاجه قبل المباراة',
  discover: {
    title: 'اكتشف الأندية حولك',
    body: 'شوف الصور والتقييمات والمرافق، وقارن الملاعب الداخلية والخارجية قبل ما تحجز.',
    screenAlt: 'صفحة تفاصيل النادي: الصور والمرافق والملاعب',
  },
  book: {
    title: 'احجز وقتك في ثواني',
    body: 'تقويم واضح، وأوقات مقسّمة حسب الفترة، والمحجوز مشطوب.',
    screenAlt: 'شاشة الحجز: التقويم والمدة والأوقات المتاحة',
  },
  filters: {
    title: 'الملعب اللي يناسب جوّك',
    body: 'مكيّف في عز الصيف، أو خارجي على نسمة الليل.',
    chips: ['الكل', 'مكيّف', 'داخلي', 'خارجي'],
  },
  durations: {
    title: 'اختر المدة',
    items: [
      { mins: '60', hint: 'أساسي', price: '120' },
      { mins: '90', hint: 'الأنسب للمباراة', price: '170', active: true },
      { mins: '120', hint: 'لعب ممتد', price: '220' },
    ],
    unit: 'د',
    currency: 'ر.س',
  },
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
  /** Collected so far, by number of players who paid (1 to 3). */
  collected: ['55 من 220 ر.س', '110 من 220 ر.س', '165 من 220 ر.س'],
  complete: 'اكتمل الدفع، الحجز مؤكد',
  /** Countdown start in seconds (44:04, as in the app's seed booking). */
  startSeconds: 44 * 60 + 4,
};

/** Marquee between the features and the split-bill scene. */
export const CITIES = ['الرياض', 'جدة', 'الخبر', 'الدمام'];

export const STEPS = {
  title: 'من الفكرة للملعب',
  items: [
    { title: 'اختر النادي', body: 'فلتر حسب المدينة ونوع الملعب، وشوف أقرب وقت متاح.' },
    { title: 'احجز الوقت', body: 'اختر اليوم والمدة والإضافات، وادفع بمدى أو Apple Pay أو STC Pay.' },
    { title: 'ادعُ الشلة', body: 'شارك رابط الدفع، وتذكرة الدخول توصلك أول ما يكتمل.' },
  ],
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
