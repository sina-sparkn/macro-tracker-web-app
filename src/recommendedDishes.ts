export interface RecommendedDish {
  refId: string;
  nameFa: string;
  nameEn: string;
  descFa: string;
  descEn: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  sodium: number;
  priceToman: number;
  priceUSD: number;
  originFa: string;
  originEn: string;
  servingSizeFa: string;
  servingSizeEn: string;
  ingredientsFa: string[];
  ingredientsEn: string[];
  funFactFa: string;
  funFactEn: string;
  tagFa: string;
  tagEn: string;
}

export const RECOMMENDED_DISHES_POOL: RecommendedDish[] = [
  {
    refId: "REC_101",
    nameFa: "چلو کباب کوبیده سنتی زعفرانی",
    nameEn: "Saffron Chelo Kabab Koobideh",
    descFa: "کباب کوبیده سنتی زغالی تهیه شده از ترکیب گوشت تازه گوسفندی و گوساله همراه با چلو زعفرانی و گوجه کبابی.",
    descEn: "Charcoal-grilled minced lamb & lean beef skewers served with fragrant saffron basmati rice and blistered tomatoes.",
    calories: 680,
    protein: 38,
    carbs: 62,
    fat: 28,
    sodium: 610,
    priceToman: 1150000,
    priceUSD: 5.0,
    originFa: "ایران / سنتی اصیل",
    originEn: "Iran / Authentic Heritage",
    servingSizeFa: "۱ پرس کامل (۳۸۰ گرم)",
    servingSizeEn: "1 full plate (380g)",
    ingredientsFa: [
      "گوشت قلوه‌گاه گوسفندی و راسته گوساله",
      "پیاز رنده شده آب‌گرفته",
      "زعفران دم‌کرده قائنات",
      "برنج طارم ایرانی درجه یک",
      "سماق تبریز و کره حیوانی"
    ],
    ingredientsEn: [
      "Minced lamb flank & lean beef loin",
      "Grated sweet onions (drained)",
      "Premium brewed saffron",
      "Persian Tarom basmati rice",
      "Sumac & cultured butter"
    ],
    funFactFa: "سماق حاوی پلی‌فنول‌های قوی و آنتوسیانین است که ترشح آنزیم‌های گوارشی را تحریک کرده و هضم چربی را تسهیل می‌کند.",
    funFactEn: "Sumac delivers potent polyphenols and organic acids that stimulate lipid-digesting enzymes and balance blood sugars.",
    tagFa: "پروتئین بالا • غذای پرچمدار",
    tagEn: "High Protein • Signature Pick"
  },
  {
    refId: "REC_102",
    nameFa: "زرشک پلو با مرغ زعفرانی و خلال پسته",
    nameEn: "Zereshk Polo with Saffron Chicken",
    descFa: "ران مرغ آرام‌پز شده در سس زعفران و گوجه فرنگی، سرو شده بر روی چلو دم‌کشیده با زرشک پفکی تفت‌داده شده و خلال پسته.",
    descEn: "Slow-simmered tender chicken in aromatic saffron reduction, crowned over steamed rice with sweet-tart barberries & slivered pistachios.",
    calories: 590,
    protein: 44,
    carbs: 68,
    fat: 16,
    sodium: 520,
    priceToman: 890000,
    priceUSD: 3.87,
    originFa: "ایران / خراسان",
    originEn: "Iran / Khorasan Heritage",
    servingSizeFa: "۱ دیس متوسط (۳۹۰ گرم)",
    servingSizeEn: "1 medium platter (390g)",
    ingredientsFa: [
      "سینه و ران مرغ بدون پوست",
      "زرشک اناری سرخ‌شده در کره گیاهی",
      "خلال پسته و بادام اعلا",
      "زعفران خالص سرگل",
      "برنج هاشمی ایرانی"
    ],
    ingredientsEn: [
      "Skinless farm chicken fillet",
      "Persian dried barberries (Zereshk)",
      "Slivered pistachios & almonds",
      "Pure Persian red saffron",
      "Steamed Hashemi basmati rice"
    ],
    funFactFa: "زرشک غنی از بربرین است؛ ترکیبی طبیعی که به تنظیم حساسیت به انسولین و سلامت کبد کمک شایانی می‌کند.",
    funFactEn: "Barberries are rich in berberine, an alkaloid clinically recognized for improving metabolic function and liver health.",
    tagFa: "تعادل عالی ماکروها • محبوب روزانه",
    tagEn: "Balanced Macros • Daily Favorite"
  },
  {
    refId: "REC_103",
    nameFa: "سالمون نروژی گریل با کینوا و آووکادو",
    nameEn: "Grilled Salmon with Quinoa & Avocado",
    descFa: "فیله ماهی سالمون کبابی با روغن زیتون فرابکر، همراه با بستر کینوای ارگانیک سه رنگ، آووکادوی تازه و سس لیمو گشنیز.",
    descEn: "Wild-caught grilled salmon fillet drizzled with cold-pressed olive oil over organic tri-color quinoa and fresh avocado wedges.",
    calories: 520,
    protein: 41,
    carbs: 34,
    fat: 22,
    sodium: 340,
    priceToman: 1450000,
    priceUSD: 6.3,
    originFa: "مدیترانه‌ای / سلامت‌محور",
    originEn: "Mediterranean / Clean Eating",
    servingSizeFa: "۱ بشقاب سلامت (۳۴۰ گرم)",
    servingSizeEn: "1 wellness bowl (340g)",
    ingredientsFa: [
      "فیله تازه سالمون نروژی",
      "کینوا سه رنگ ارگانیک پخته‌شده",
      "برش‌های آووکادوی هاس",
      "روغن زیتون فرابکر رودبار",
      "لیموترش شیرازی و شوید تازه"
    ],
    ingredientsEn: [
      "Fresh Atlantic salmon fillet",
      "Cooked tri-color organic quinoa",
      "Fresh Haas avocado slices",
      "Cold-pressed virgin olive oil",
      "Shirazi lime juice & fresh dill"
    ],
    funFactFa: "اسیدهای چرب امگا ۳ موجود در سالمون (EPA و DHA) التهاب مزمن عروقی را کاهش داده و حافظه را تقویت می‌کنند.",
    funFactEn: "Salmon delivers vital Omega-3 fatty acids that combat cellular inflammation and optimize cardiovascular wellness.",
    tagFa: "امگا ۳ فراوان • بدون قند مضر",
    tagEn: "Omega-3 Dense • Zero Added Sugar"
  },
  {
    refId: "REC_104",
    nameFa: "خورش فسنجان جاافتاده با گردوی تویسرکان",
    nameEn: "Persian Fesenjan Walnut Stew",
    descFa: "خورش مجلسی آرام‌پخته با آسیاب غلیظ گردوی تازه، رب انار ارگانیک ملس ساوه و فیله نرم سینه مرغ در کنار چلو قالبی.",
    descEn: "Rich Persian sweet-sour pomegranate and toasted walnut stew with tender chicken, slow-cooked to natural nutty perfection.",
    calories: 640,
    protein: 36,
    carbs: 48,
    fat: 32,
    sodium: 390,
    priceToman: 1280000,
    priceUSD: 5.57,
    originFa: "ایران / گیلان و مرکز",
    originEn: "Iran / Northern Heritage",
    servingSizeFa: "۱ کاسه خورش با برنج (۳۷۰ گرم)",
    servingSizeEn: "1 stew bowl with rice (370g)",
    ingredientsFa: [
      "مغز گردوی تازه تویسرکان آسیاب‌شده",
      "رب انار ترش و ملس سنتی ساوه",
      "فیله مرغ تکه‌ای مغزپخت",
      "برنج طارم خوش‌عطر",
      "اندکی زعفران و دارچین"
    ],
    ingredientsEn: [
      "Finely ground Persian walnuts",
      "Authentic pomegranate molasses",
      "Tender chicken breast chunks",
      "Aromatic Persian basmati rice",
      "Hint of saffron and Ceylon cinnamon"
    ],
    funFactFa: "گردو تنها مغز آجیلی با مقادیر فوق‌العاده اسید آلفا-لینولنیک (ALA) است که انعطاف‌پذیری دیواره عروق قلبی را حفظ می‌کند.",
    funFactEn: "Walnuts provide rich Alpha-Linolenic Acid (plant Omega-3) and ellagic acid antioxidants that protect cellular DNA.",
    tagFa: "آنتی‌اکسیدان غلیظ • انرژی ماندگار",
    tagEn: "Antioxidant Rich • Sustained Energy"
  },
  {
    refId: "REC_105",
    nameFa: "پنه مرغ رژیمی با سس سبزیجات و ریحان",
    nameEn: "Tuscan Grilled Chicken Penne",
    descFa: "پاستای پنه گندم سبوس‌دار با تکه‌های فیله گریل‌شده مرغ، قارچ دکمه‌ای، سس گوجه آفتابی و برگ‌های ریحان تازه معطر.",
    descEn: "Whole-wheat penne rigate tossed with char-grilled chicken slices, button mushrooms, sun-ripened tomato puree, and sweet basil.",
    calories: 490,
    protein: 39,
    carbs: 56,
    fat: 11,
    sodium: 430,
    priceToman: 760000,
    priceUSD: 3.3,
    originFa: "ایتالیا / توسکانی",
    originEn: "Italy / Tuscan Clean",
    servingSizeFa: "۱ بشقاب پاستا (۳۶۰ گرم)",
    servingSizeEn: "1 pasta bowl (360g)",
    ingredientsFa: [
      "پنه سبوس‌دار گندم دوروم",
      "فیله سینه مرغ مرینیت‌شده با رزماری",
      "پوره گوجه فرنگی تازه و سیر تفت‌داده",
      "قارچ تازه ورقه شده",
      "برگ ریحان تازه و پارمزان کم‌چرب"
    ],
    ingredientsEn: [
      "Durum whole-wheat penne",
      "Rosemary-marinated chicken breast",
      "Fresh crushed tomato pomodoro",
      "Sliced cremini mushrooms",
      "Fresh Italian basil & aged parmesan"
    ],
    funFactFa: "پاستای سبوس‌دار دارای شاخص گلیسمی پایینی است و همراه با پروتئین مرغ، آزادسازی گلوکز به جریان خون را کاملاً یکنواخت می‌کند.",
    funFactEn: "Whole-wheat pasta paired with lean poultry offers complex low-GI carbs, preventing post-meal fatigue and energy crashes.",
    tagFa: "کربوهیدرات پیچیده • عالی برای ورزش",
    tagEn: "Complex Carbs • Pre-Workout Fuel"
  },
  {
    refId: "REC_106",
    nameFa: "میرزاقاسمی اصیل دودی با سنگک کنجدی",
    nameEn: "Smoked Mirza Ghasemi & Sangak",
    descFa: "بادمجان کباب‌شده روی زغال با عطر دودی اصیل شمال، ترکیب شده با سیر تازه سرخ‌کوهی، تخم‌مرغ مزرعه و نان سبوس‌دار سنگک.",
    descEn: "Fire-roasted smoked eggplant puree blended with golden garlic cloves, crushed vine tomatoes, farm eggs, and whole-wheat Sangak.",
    calories: 380,
    protein: 18,
    carbs: 42,
    fat: 15,
    sodium: 480,
    priceToman: 490000,
    priceUSD: 2.13,
    originFa: "ایران / گیلان سرسبز",
    originEn: "Iran / Caspian Cuisine",
    servingSizeFa: "۱ ظرف سفالی با نان (۳۴۰ گرم)",
    servingSizeEn: "1 earthenware bowl with bread (340g)",
    ingredientsFa: [
      "بادمجان قلمی کبابی زغالی دودی",
      "گوجه فرنگی رنده‌شده پخته",
      "سیر تازه خرد شده",
      "تخم‌مرغ محلی ارگانیک",
      "نان سنگک داغ کنجدی سبوس‌دار"
    ],
    ingredientsEn: [
      "Open-flame smoked eggplants",
      "Simmered vine tomatoes",
      "Fresh crushed aromatic garlic",
      "Farm-fresh pasture egg",
      "Whole-wheat sesame flatbread (Sangak)"
    ],
    funFactFa: "پوست بادمجان حاوی ناسونین (نوعی آنتوسیانین قوی) است که از غشای چربی سلول‌های مغز در برابر رادیکال‌های آزاد دفاع می‌کند.",
    funFactEn: "Eggplant contains nasunin, a rare anthocyanin that safeguards brain cell membranes from lipid peroxidation.",
    tagFa: "کم‌کالری • فیبر بالا • گیاه‌پایه",
    tagEn: "Low Calorie • High Fiber • Veg-Friendly"
  },
  {
    refId: "REC_107",
    nameFa: "کاسه ماهی تریاکی با برنج قهوه‌ای و ادامامه",
    nameEn: "Japanese Teriyaki Salmon Bowl",
    descFa: "تکه‌های فیله ترد پخته‌شده با لعاب تریاکی کم‌نمک زنجبیلی، سرو شده روی برنج قهوه‌ای با دانه‌های سبز ادامامه و جلبک تست‌شده نوری.",
    descEn: "Glazed salmon medallions in ginger-soy reduction over nutrient-dense short-grain brown rice, edamame pods, and roasted nori ribbons.",
    calories: 510,
    protein: 37,
    carbs: 49,
    fat: 17,
    sodium: 490,
    priceToman: 1390000,
    priceUSD: 6.04,
    originFa: "ژاپن / سبک اوزاکا",
    originEn: "Japan / Osaka Coastal",
    servingSizeFa: "۱ کاسه ناهار آسیایی (۳۳۰ گرم)",
    servingSizeEn: "1 Asian lunch bowl (330g)",
    ingredientsFa: [
      "فیله ماهی سفید یا سالمون گریل",
      "سس تریاکی خانگی با زنجبیل تازه و عسل",
      "برنج قهوه‌ای بخارپز غلات کامل",
      "دانه‌های سویای سبز تازه (ادامامه)",
      "جلبک نوری برشته و کنجد سیاه"
    ],
    ingredientsEn: [
      "Grilled salmon medallion",
      "Honey-ginger low-sodium teriyaki glaze",
      "Steamed whole brown rice",
      "Fresh shelled edamame soybeans",
      "Toasted nori seaweed & black sesame"
    ],
    funFactFa: "ادامامه یکی از معدود منابع گیاهی پروتئین کامل با تمامی ۹ اسید آمینه ضروری به همراه ایزوفلاون‌های محافظ عروق است.",
    funFactEn: "Edamame provides a complete plant amino acid profile with all 9 essentials plus protective cardiovascular isoflavones.",
    tagFa: "سوپرفود مدرن • پاک و سبک",
    tagEn: "Modern Superfood • Clean Fuel"
  },
  {
    refId: "REC_108",
    nameFa: "باقالی‌پلو با گوشت ماهیچه گوسفندی زعفرانی",
    nameEn: "Baghali Polo with Braised Lamb Shank",
    descFa: "ماهیچه گوسفندی نرم و لطیف پخته‌شده در آب پیاز و چوب دارچین، همراه با پلوی معطر شوید تازه و باقالی اعلا آغشته به زعفران ناب.",
    descEn: "Melt-in-mouth braised lamb shank infused with onion and cinnamon essence, alongside fragrant dill and tender fava bean rice.",
    calories: 720,
    protein: 48,
    carbs: 58,
    fat: 31,
    sodium: 580,
    priceToman: 1850000,
    priceUSD: 8.04,
    originFa: "ایران / مجلسی اصیل",
    originEn: "Iran / Royal Persian Festive",
    servingSizeFa: "۱ دیس شاهانه (۴۲۰ گرم)",
    servingSizeEn: "1 royal feast platter (420g)",
    ingredientsFa: [
      "ماهیچه کامل گوسفند با استخوان قلم",
      "باقالی سبز اعلای پوست‌گرفته",
      "شوید خشک و تازه شیرازی",
      "زعفران دم‌کشیده فراوان",
      "پیاز طلایی و ادویه هفت‌رنگ سنتی"
    ],
    ingredientsEn: [
      "Slow-braised pasture lamb shank",
      "Tender split baby fava beans",
      "Aromatic Shirazi dill weeds",
      "Abundant pure saffron broth",
      "Golden onions & Persian gentle spices"
    ],
    funFactFa: "شوید حاوی فلاونوئیدهایی نظیر کامپفرول و آنزیم‌های کارون است که نفخ باقالی را مهار کرده و چربی خون را تعدیل می‌بخشد.",
    funFactEn: "Fresh dill contains kaempferol flavonoids that aid gastric digestion of legumes while naturally supporting healthy lipid profiles.",
    tagFa: "پروتئین سنگین • کلاژن‌ساز طبیعی",
    tagEn: "High Protein • Natural Collagen"
  },
  {
    refId: "REC_109",
    nameFa: "سوولاکی مرغ یونانی با سس تزاتزیکی ماست چکیده",
    nameEn: "Greek Chicken Souvlaki & Tzatziki",
    descFa: "سیخ‌های کوچک سینه مرغ طعم‌دار شده با پونه کوهی مدیترانه‌ای و روغن زیتون، سرو شده با ماست یونانی خیار و نان پیتای سبوس‌دار.",
    descEn: "Tender skewers of oregano & lemon-marinated chicken breast served with probiotic garlic-cucumber tzatziki and warm flatbread.",
    calories: 440,
    protein: 42,
    carbs: 28,
    fat: 16,
    sodium: 460,
    priceToman: 820000,
    priceUSD: 3.56,
    originFa: "یونان / حوزه اژه",
    originEn: "Greece / Aegean Coast",
    servingSizeFa: "۲ سیخ با سالاد و دیپ (۳۱۰ گرم)",
    servingSizeEn: "2 skewers with dip & salad (310g)",
    ingredientsFa: [
      "سینه مرغ خرد شده مکعبی مزه‌دار با پونه کوهی",
      "ماست چکیده پروبیوتیک سنتی یونانی",
      "خیار قلمی رنده شده و سیر تازه",
      "نان پیتای سبوس‌دار تنوری",
      "روغن زیتون بکر فشرده سرد"
    ],
    ingredientsEn: [
      "Diced chicken breast marinated in Greek oregano",
      "Strained probiotic Greek yogurt",
      "Grated English cucumber & crushed garlic",
      "Baked whole-wheat pita bread",
      "Cold-pressed Aegean olive oil"
    ],
    funFactFa: "ماست چکیده سنتی یونانی تا دو برابر ماست‌های معمولی پروتئین دارد و باکتری‌های زنده لاکتوباسیلوس آن ایمنی دستگاه گوارش را بالا می‌برند.",
    funFactEn: "Authentic strained Greek yogurt packs twice the protein of standard yogurt and infuses active gut-protective live cultures.",
    tagFa: "پروتئین تمیز • پروبیوتیک فعال",
    tagEn: "Clean Protein • Active Probiotic"
  },
  {
    refId: "REC_110",
    nameFa: "قورمه‌سبزی رژیمی با گوشت لخم و برنج قهوه‌ای",
    nameEn: "Lean Herb Ghormeh Sabzi with Brown Rice",
    descFa: "خورش خوش‌عطر سبزیجات معطر تفت‌داده با حداقل روغن کنجد، همراه با تکه‌های راسته گوشت بدون چربی، لوبیا چیتی و برنج قهوه‌ای.",
    descEn: "Traditional green herb stew gently braised with minimal cold-pressed oil, lean beef chunks, nutrient-rich red beans, and brown rice.",
    calories: 410,
    protein: 34,
    carbs: 42,
    fat: 12,
    sodium: 440,
    priceToman: 980000,
    priceUSD: 4.26,
    originFa: "ایران / سبک کم‌کالری",
    originEn: "Iran / Healthy Persian",
    servingSizeFa: "۱ بشقاب سلامت (۳۵۰ گرم)",
    servingSizeEn: "1 wholesome plate (350g)",
    ingredientsFa: [
      "سبزی قورمه تازه (تره، جعفری، گشنیز، شنبلیله)",
      "گوشت راسته گوساله کاملاً پاک‌شده بدون چربی",
      "لوبیا قرمز تازه منبع روی و آهن",
      "لیمو عمانی اعلا با ویتامین ث",
      "برنج قهوه‌ای با سبوس دست‌نخورده"
    ],
    ingredientsEn: [
      "Fresh herbs: leek, parsley, coriander, fenugreek",
      "Ultra-lean beef loin chunks",
      "Red kidney beans rich in zinc & iron",
      "Sun-dried black Persian limes",
      "Whole intact bran brown rice"
    ],
    funFactFa: "شنبلیله موجود در سبزی قورمه حاوی ساپونین‌هایی است که از افزایش ناگهانی قند خون بعد از صرف غذا پیشگیری می‌کنند.",
    funFactEn: "Fenugreek greens contain active saponins that optimize glucose tolerance and support healthy glycemic balance.",
    tagFa: "فیبر فوق‌العاده • کم‌چرب و مقوی",
    tagEn: "High Fiber • Low Fat Wholesome"
  },
  {
    refId: "REC_111",
    nameFa: "خوراک طاجین سبزیجات و نخود مراکشی",
    nameEn: "Moroccan Vegetable & Chickpea Tagine",
    descFa: "طاجین سنتی سفالی پخته شده با نخودهای فیبردار، کدو، هویج، آلو بخارا، زیره، دارچین و زعفران به همراه غلات کوسکوس کامل.",
    descEn: "Earthenware-simmered Moroccan stew of fiber-dense chickpeas, sweet carrots, courgettes, dried prunes, and warm Maghrebi spices with couscous.",
    calories: 395,
    protein: 16,
    carbs: 64,
    fat: 8,
    sodium: 320,
    priceToman: 530000,
    priceUSD: 2.3,
    originFa: "مراکش / شمال آفریقا",
    originEn: "Morocco / Atlas Mountains",
    servingSizeFa: "۱ طاجین کامل (۳۶۰ گرم)",
    servingSizeEn: "1 full tagine bowl (360g)",
    ingredientsFa: [
      "نخود آبگوشتی خیسانده و پخته شده",
      "کدو حلوایی و هویج تازه حلقه شده",
      "آلوی خشک طبیعی بدون شکر",
      "ادویه راس الحانوت (زیره، گشنیز، زردچوبه)",
      "کوسکوس گندم کامل بخارپز"
    ],
    ingredientsEn: [
      "Slow-cooked plump chickpeas",
      "Butternut squash and sweet baby carrots",
      "Sun-dried Moroccan sweet prunes",
      "Ras el Hanout spice blend",
      "Fluffy steamed whole-wheat couscous"
    ],
    funFactFa: "ترکیب زردچوبه و فلفل در طاجین، جذب کورکومین را تا ۲۰ برابر بالا برده و از مفاصل و سلول‌ها محافظت می‌کند.",
    funFactEn: "Combining black pepper with turmeric in tagine elevates curcumin bioavailability by up to 2,000% for joint comfort.",
    tagFa: "کاملاً گیاهی • گوارش آرامش‌بخش",
    tagEn: "100% Plant-Based • Soothing Digestion"
  },
  {
    refId: "REC_112",
    nameFa: "دلمه برگ مو اصیل تبریزی با زرشک و سبزی",
    nameEn: "Persian Stuffed Grape Leaves (Dolmeh)",
    descFa: "برگ‌های تازه مو پر شده با گوشت چرخ‌کرده کم‌چرب، برنج دانه کوتاه، لپه ریز تبریز و چاشنی ملس سرکه و شیره انگور طبیعی.",
    descEn: "Tender grape leaves rolled around seasoned lean minced beef, split yellow peas, fragrant aromatic herbs, and natural grape molasses glaze.",
    calories: 360,
    protein: 20,
    carbs: 46,
    fat: 10,
    sodium: 380,
    priceToman: 670000,
    priceUSD: 2.91,
    originFa: "ایران / آذربایجان و تبریز",
    originEn: "Iran / Tabriz Heritage",
    servingSizeFa: "۶ عدد دلمه درشت (۲۹۰ گرم)",
    servingSizeEn: "6 large rolled parcels (290g)",
    ingredientsFa: [
      "برگ موی جوان و لطیف بهاره",
      "گوشت گوساله چرخ‌کرده بدون دنبه",
      "لپه پخته شده مغزپخت",
      "برنج و سبزی دلمه (ترخون، مرزه، شوید)",
      "شیره انگور ملایر و سرکه خانگی"
    ],
    ingredientsEn: [
      "Tender spring grape leaves",
      "Lean minced beef loin",
      "Cooked tender yellow split peas",
      "Fragrant tarragon, savory, and mint",
      "Grape molasses and natural cider vinegar"
    ],
    funFactFa: "برگ مو سرشار از کلسیم، منیزیم و تانن‌های ضدباکتری طبیعی است که به تقویت رگ‌ها و بهبود گردش خون محیطی کمک می‌کند.",
    funFactEn: "Grape vine leaves pack bioavailable calcium, magnesium, and vascular-strengthening tannins that boost microcirculation.",
    tagFa: "سنتی مقوی • بدون گلوتن اضافه",
    tagEn: "Nutritious Classic • Naturally Wholesome"
  },
  {
    refId: "REC_113",
    nameFa: "کاسه فاهیتای استیک گریل مکزیکی با لوبیا سیاه",
    nameEn: "Mexican Grilled Steak Fajita Bowl",
    descFa: "نوارهای آبدار راسته گوساله گریل‌شده با فلفل دلمه‌ای‌های رنگی، پیاز تفت‌داده، لوبیا سیاه ارگانیک و سالسای تازه گشنیز و لیمو ترش.",
    descEn: "Char-grilled flank steak strips tossed with sizzling bell peppers, caramelized sweet onions, fiber-packed black beans, and citrus salsa.",
    calories: 540,
    protein: 43,
    carbs: 38,
    fat: 19,
    sodium: 490,
    priceToman: 1190000,
    priceUSD: 5.17,
    originFa: "مکزیک / سونورا",
    originEn: "Mexico / Sonora Style",
    servingSizeFa: "۱ کاسه بزرگ فاهیتا (۳۷۰ گرم)",
    servingSizeEn: "1 loaded fajita bowl (370g)",
    ingredientsFa: [
      "راسته گوساله گریل با ادویه فاخیتا",
      "فلفل دلمه‌ای سه رنگ تفت‌داده با روغن زیتون",
      "لوبیا سیاه ارگانیک سرشار از پروتئین و فیبر",
      "پیاز بنفش کاراملی‌شده",
      "سالسای تازه پیکو د گالو و لیمو سنگی"
    ],
    ingredientsEn: [
      "Marinated grilled flank steak cuts",
      "Sautéed tri-color sweet bell peppers",
      "Slow-cooked seasoned black beans",
      "Caramelized red onion slivers",
      "Fresh pico de gallo salsa & lime juice"
    ],
    funFactFa: "لوبیا سیاه از قوی‌ترین منابع آنتوسیانین در میان حبوبات است و سرعت جذب گلوکز گوشت را تا سطح ایده‌آل تنظیم می‌کند.",
    funFactEn: "Black beans contain anthocyanin pigments that moderate glucose uptake and sustain steady amino-acid utilization.",
    tagFa: "پروتئین سنگین • بدون کربوهیدرات ساده",
    tagEn: "Heavy Protein • Clean Low-GI Energy"
  },
  {
    refId: "REC_114",
    nameFa: "کوکو سبزی مغزدار تبریزی با گردو و زرشک",
    nameEn: "Persian Herb Kookoo with Walnuts",
    descFa: "کوکوی سنتی سرشار از انواع سبزیجات تازه معطر (تره، جعفری، شوید، شنبلیله) همراه با مغز گردوی خردشده، زرشک ترش و نان جو سبوس‌دار.",
    descEn: "Classic fluffy Persian frittata packed with aromatic mountain herbs, crushed walnuts, sweet barberries, and whole-grain barley flatbread.",
    calories: 340,
    protein: 17,
    carbs: 22,
    fat: 20,
    sodium: 360,
    priceToman: 410000,
    priceUSD: 1.78,
    originFa: "ایران / آذربایجان",
    originEn: "Iran / Northwest Traditional",
    servingSizeFa: "۲ اسلایس ضخیم با نان (۲۶۰ گرم)",
    servingSizeEn: "2 thick slices with bread (260g)",
    ingredientsFa: [
      "تره، جعفری، گشنیز، شوید و اندکی شنبلیله تازه",
      "تخم‌مرغ تازه مزرعه",
      "مغز گردوی دندان‌گیر تازه",
      "زرشک یاقوتی تفت‌داده شده",
      "سیر تازه و نان جو دست‌ساز سبوس‌دار"
    ],
    ingredientsEn: [
      "Leek, parsley, coriander, dill & fenugreek greens",
      "Pasture-raised farm eggs",
      "Chunky toasted walnut pieces",
      "Tart Persian ruby barberries",
      "Fresh garlic & whole barley bread"
    ],
    funFactFa: "کلروفیل و لوتئین متراکم در سبزیجات معطر به سم‌زدایی کبد کمک کرده و از سلول‌های بینایی چشم در برابر پیری محافظت می‌کند.",
    funFactEn: "Dense chlorophyll and lutein in fresh greens promote hepatic cleansing and shield retinal pigments against digital blue light.",
    tagFa: "سم‌زدایی طبیعی • سبک و مغذی",
    tagEn: "Natural Detox • Light & Wholesome"
  }
];

/**
 * Calculates a stable, deterministic daily seed based on the calendar date (YYYY-MM-DD).
 * This ensures that every calendar day gets a fresh dish automatically.
 */
export function getDailySeed(date: Date = new Date()): number {
  const year = date.getFullYear();
  const month = date.getMonth();
  const day = date.getDate();
  // Standard days since epoch
  const epochDays = Math.floor(new Date(year, month, day).getTime() / (1000 * 60 * 60 * 24));
  return epochDays;
}

/**
 * Returns today's recommended dish, rotating daily automatically.
 * Optional offset allows browsing / shuffling next recommendation.
 */
export function getDailyRecommendedDish(date: Date = new Date(), offset: number = 0): RecommendedDish {
  const seed = getDailySeed(date);
  const total = RECOMMENDED_DISHES_POOL.length;
  // Modulo calculation that handles positive and negative offsets cleanly
  const index = ((seed + offset) % total + total) % total;
  return RECOMMENDED_DISHES_POOL[index];
}

/**
 * Returns localized formatted date label for today's recommendation badge
 */
export function getDailyFormattedDate(date: Date = new Date(), lang: "fa" | "en" = "en"): string {
  try {
    if (lang === "fa") {
      return new Intl.DateTimeFormat("fa-IR", {
        weekday: "long",
        day: "numeric",
        month: "long"
      }).format(date);
    }
    return new Intl.DateTimeFormat("en-US", {
      weekday: "long",
      month: "short",
      day: "numeric"
    }).format(date);
  } catch {
    return lang === "fa" ? "امروز" : "Today";
  }
}
