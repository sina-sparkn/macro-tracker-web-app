/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from "react";
import {
  Camera,
  Upload,
  Plus,
  Trash2,
  Flame,
  Apple,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Heart,
  RefreshCw,
  Settings,
  User,
  BookOpen,
  ChevronRight,
  X,
  Scale,
  FileText,
  Info,
  Sliders,
  Maximize2,
  Globe,
  Coins,
  DollarSign,
  Utensils,
  Receipt,
  Terminal,
  Cpu,
  Zap,
  Activity,
  ShieldCheck
} from "lucide-react";
import AndroidFrame from "./components/AndroidFrame";
import ConsoleHeader from "./components/ConsoleHeader";
import { IconBar, NavPane, VitalsPane } from "./components/ConsoleSidebars";
import ScannerConsoleView from "./components/ScannerConsoleView";
import DiaryConsoleView, { SqliteDbStats } from "./components/DiaryConsoleView";
import GoalsConsoleView from "./components/GoalsConsoleView";
import NutritionModal from "./components/NutritionModal";
import { ScannedLabel, FoodLogItem, DailyTotals, UserProfile, ThemeMode, EffectiveTheme } from "./types";
import { WORLD_FOODS, WorldFood, getLocalizedWorldFood } from "./worldFoods";
import { TRANSLATIONS } from "./translations";
import { RecommendedDish, getDailyRecommendedDish } from "./recommendedDishes";
import {
  normalizeScannedLabel,
  formatSmartPrice,
  getPricingTierMultiplier
} from "./utils/dishLocalization";

export const TOMAN_PER_USD = 230000;

export function getTodayIsoDate(): string {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export interface CyberPresetDish {
  refId: string;
  nameFa: string;
  nameEn: string;
  calories: number;
  priceToman: number;
  priceUSD: number;
  protein: number;
  carbs: number;
  fat: number;
  sodium: number;
  origin: string;
  servingSize: string;
  ingredients: string[];
  summaryFa: string;
  summaryEn: string;
}

export const CYBER_PRESET_DISHES: CyberPresetDish[] = [
  {
    refId: "REF_ID: 1011",
    nameFa: "قورمه سبزی با برنج زعفرانی",
    nameEn: "Ghormeh Sabzi with Saffron Rice",
    calories: 420,
    priceToman: 950000,
    priceUSD: 4.13,
    protein: 28,
    carbs: 38,
    fat: 16,
    sodium: 480,
    origin: "Iran / ایران",
    servingSize: "1 plate (350g)",
    ingredients: [
      "سبزی قورمه تازه (تره، جعفری، شنبلیله)",
      "گوشت گوسفندی بدون چربی",
      "لوبیا قرمز مرغوب",
      "لیمو عمانی اعلا",
      "برنج دم‌کشیده زعفرانی"
    ],
    summaryFa: "خورش اصیل ایرانی سرشار از سبزیجات معطر، گوشت پروتئینی و آنتی‌اکسیدان‌های لیمو عمانی همراه برنج زعفرانی.",
    summaryEn: "Authentic Persian herb stew with lean lamb, red kidney beans, dried limes, and aromatic saffron rice."
  },
  {
    refId: "REF_ID: 1012",
    nameFa: "آش رشته سنتی",
    nameEn: "Traditional Ash Reshteh",
    calories: 340,
    priceToman: 420000,
    priceUSD: 1.83,
    protein: 14,
    carbs: 52,
    fat: 9,
    sodium: 520,
    origin: "Iran / ایران",
    servingSize: "1 bowl (400g)",
    ingredients: [
      "رشته آشی سنتی",
      "نخود و لوبیا چیتی پخته",
      "عدس قهوه‌ای",
      "سبزی آش (اسفناج، گشنیز، تره)",
      "پیازداغ و نعناداغ معطر",
      "کشک غلیظ پروبیوتیک"
    ],
    summaryFa: "سوپ سنتی غنی و پر انرژی ایرانی سرشار از حبوبات فیبردار و پروبیوتیک کشک طبیعی.",
    summaryEn: "Wholesome traditional Persian legume soup with thin wheat noodles, fresh greens, and fermented whey (kashk)."
  },
  {
    refId: "REF_ID: 1013",
    nameFa: "کیمچی و توفو سنتی کره",
    nameEn: "Korean Kimchi & Tofu Plate",
    calories: 145,
    priceToman: 430000,
    priceUSD: 1.87,
    protein: 15,
    carbs: 12,
    fat: 4,
    sodium: 380,
    origin: "South Korea / کره جنوبی",
    servingSize: "1 bowl (250g)",
    ingredients: [
      "کیمچی تخمیر شده سنتی کلم ناپا",
      "توفوی طبیعی سفت",
      "روغن کنجد خالص",
      "پیازچه خرد شده",
      "کنجد بو داده"
    ],
    summaryFa: "بشقاب تخمیر شده کره‌ای با بالاترین ارزش پروبیوتیک روده و پروتئین گیاهی متراکم توفو.",
    summaryEn: "Nutrient-dense probiotic kimchi with steamed organic tofu, rich in digestive enzymes and clean plant protein."
  },
  {
    refId: "REF_ID: 1014",
    nameFa: "تاکو ذرت با آووکادو",
    nameEn: "Corn Taco with Fresh Avocado",
    calories: 360,
    priceToman: 710000,
    priceUSD: 3.08,
    protein: 12,
    carbs: 42,
    fat: 15,
    sodium: 290,
    origin: "Mexico / مکزیک",
    servingSize: "2 tacos (220g)",
    ingredients: [
      "ترتیلای ذرت سنتی بدون گلوتن",
      "آووکادوی تازه هاس و گواکاموله",
      "لوبیا سیاه مکزیکی",
      "سالسای پیکو د گالو",
      "گشنیز و لیمو ترش تازه"
    ],
    summaryFa: "تاکوی ذرت تازه مکزیکی غنی از اسیدهای چرب غیراشباع مفید آووکادو و فیبر لوبیا سیاه.",
    summaryEn: "Crisp gluten-free corn tortillas filled with heart-healthy avocado guacamole, black beans, and fresh pico de gallo."
  }
];

export const CYBER_RECOMMENDED_DISH = getDailyRecommendedDish();

// Helper function to compress and downscale images client-side for rapid transmission & Vercel serverless safety
const compressImage = (base64Str: string, mimeType: string = "image/jpeg", maxDim = 960, quality = 0.72): Promise<string> => {
  return new Promise((resolve) => {
    if (!base64Str || !base64Str.startsWith("data:")) {
      return resolve(base64Str);
    }

    const img = new Image();
    img.onload = () => {
      try {
        let width = img.width;
        let height = img.height;

        if (width > maxDim || height > maxDim) {
          if (width > height) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          } else {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }

        const canvas = document.createElement("canvas");
        canvas.width = Math.max(1, width);
        canvas.height = Math.max(1, height);
        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          const compressed = canvas.toDataURL("image/jpeg", quality);
          // If still over 1.2MB, downscale one more pass
          if (compressed.length > 1.2 * 1024 * 1024) {
            const smallCanvas = document.createElement("canvas");
            smallCanvas.width = Math.round(width * 0.75);
            smallCanvas.height = Math.round(height * 0.75);
            const sCtx = smallCanvas.getContext("2d");
            if (sCtx) {
              sCtx.drawImage(canvas, 0, 0, smallCanvas.width, smallCanvas.height);
              return resolve(smallCanvas.toDataURL("image/jpeg", 0.65));
            }
          }
          return resolve(compressed);
        }
        resolve(base64Str);
      } catch (err) {
        resolve(base64Str);
      }
    };
    img.onerror = () => {
      resolve(base64Str);
    };
    img.src = base64Str;
  });
};

export default function App() {
  // Navigation: 'scan' | 'diary' | 'profile'
  const [activeTab, setActiveTab] = useState<"scan" | "diary" | "profile">("scan");

  // App State
  const [scannedResult, setScannedResult] = useState<ScannedLabel | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scanStep, setScanStep] = useState(0);
  const [scanError, setScanError] = useState<string | null>(null);
  const [portionServings, setPortionServings] = useState<number>(1);
  const [showResultDetail, setShowResultDetail] = useState(false);

  // Real Camera State
  const [useRealCamera, setUseRealCamera] = useState(false);
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);

  // Food Diary State (backed by SQLite database via /api/diary)
  const [diaryItems, setDiaryItems] = useState<FoodLogItem[]>([]);

  const [selectedDiaryDate, setSelectedDiaryDate] = useState<string>(() => getTodayIsoDate());
  const [isSyncingDb, setIsSyncingDb] = useState<boolean>(false);
  const [isSyncingRate, setIsSyncingRate] = useState<boolean>(false);
  const [sqliteStats, setSqliteStats] = useState<SqliteDbStats>({
    engine: "SQLite 3 (WAL)",
    fileName: "nutriscan.sqlite",
    totalEntries: 0,
    activeDays: 0
  });

  // User Goals/Profile (Default)
  const DEFAULT_USER_PROFILE: UserProfile = {
    name: "Sina",
    calorieGoal: 2000,
    proteinGoal: 80,
    carbsGoal: 250,
    fatGoal: 65,
    sodiumGoal: 2300,
    language: "en",
    currency: "IRT",
    dailyBudgetToman: 1800000,
    dailyBudgetUSD: 7.8,
    exchangeRateTomanPerUSD: 230000,
    pricingTier: "market",
    hidePrices: false,
    autoRateSourceEn: "Domestic Food Purchasing-Power Index (Auto-Calibrated)",
    autoRateSourceFa: "شاخص قدرت خرید و قیمت مستقیم بازار داخلی (کالیبره خودکار)",
    activePreset: "balanced"
  };

  const [userProfile, setUserProfile] = useState<UserProfile>(DEFAULT_USER_PROFILE);

  // Theme state: defaults to 'system' so it dynamically mirrors the user's device theme
  const [themeMode, setThemeMode] = useState<ThemeMode>(() => {
    if (typeof window !== "undefined") {
      const savedTheme = localStorage.getItem("nutriscan_theme");
      if (savedTheme === "light" || savedTheme === "dark" || savedTheme === "system") {
        return savedTheme as ThemeMode;
      }
    }
    return "system";
  });

  const [devicePrefersDark, setDevicePrefersDark] = useState<boolean>(() => {
    if (typeof window !== "undefined" && window.matchMedia) {
      return window.matchMedia("(prefers-color-scheme: dark)").matches;
    }
    return true;
  });

  // Calculate active effective theme
  const effectiveTheme: EffectiveTheme =
    themeMode === "system" ? (devicePrefersDark ? "dark" : "light") : themeMode;

  // Listen to device / operating system theme changes
  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    const handleChange = (e: MediaQueryListEvent) => {
      setDevicePrefersDark(e.matches);
    };

    setDevicePrefersDark(mediaQuery.matches);
    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  // Synchronize document classes & data-theme attribute
  useEffect(() => {
    if (typeof document === "undefined") return;
    const root = document.documentElement;
    root.classList.remove("dark", "light");
    root.classList.add(effectiveTheme);
    root.setAttribute("data-theme", effectiveTheme);
  }, [effectiveTheme]);

  const handleSelectTheme = (mode: ThemeMode) => {
    setThemeMode(mode);
    try {
      localStorage.setItem("nutriscan_theme", mode);
    } catch (e) {
      console.error(e);
    }
    setUserProfile((prev) => ({
      ...prev,
      themePreference: mode
    }));
  };

  // Recent Scans List (Persisted in localStorage)
  const [recentScans, setRecentScans] = useState<ScannedLabel[]>([]);

  // Active translation selector
  const currentLang = userProfile.language || "en";
  const isFa = currentLang === "fa";
  const t = TRANSLATIONS[currentLang] || TRANSLATIONS.en;

  // Synchronize document language and direction
  useEffect(() => {
    document.documentElement.lang = currentLang;
    document.documentElement.dir = currentLang === "fa" ? "rtl" : "ltr";
  }, [currentLang]);

  // Simulator/Scan dynamic messages
  useEffect(() => {
    let interval: any;
    if (isScanning) {
      setScanStep(0);
      interval = setInterval(() => {
        setScanStep((prev) => (prev + 1) % 4);
      }, 1200);
    }
    return () => clearInterval(interval);
  }, [isScanning]);

  const getLoaderMessage = () => {
    const stepMessages: Record<string, string[]> = {
      en: [
        "Initializing secure Gemini AI proxy...",
        "Preprocessing high-resolution camera stream...",
        "Decoding typography and layout structures...",
        "Analyzing nutritional indexes and ingredients..."
      ],
      fa: [
        "راه‌اندازی پروکسی امن هوش مصنوعی Gemini...",
        "پیش‌پردازش تصویر با کیفیت دوربین...",
        "رمزگشایی ساختار نوشتار و چیدمان...",
        "تحلیل شاخص‌های تغذیه‌ای و مواد تشکیل‌دهنده..."
      ]
    };
    const messages = stepMessages[currentLang] || stepMessages.en;
    return messages[scanStep % messages.length];
  };

  // Load persistence from SQLite database (/api/diary) and localStorage on mount
  useEffect(() => {
    const fetchSqliteDiary = async () => {
      setIsSyncingDb(true);
      try {
        const res = await fetch("/api/diary");
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data.entries)) {
            const cleanEntries = data.entries.filter((entry: FoodLogItem) => !entry.id?.startsWith("pre-") && !entry.id?.startsWith("sql-seed-"));
            setDiaryItems(cleanEntries);
            localStorage.setItem("nutriscan_diary", JSON.stringify(cleanEntries));
          }
          if (data.stats) {
            setSqliteStats(data.stats);
          }
          return;
        }
      } catch (err) {
        console.warn("SQLite fetch fallback to localStorage:", err);
      } finally {
        setIsSyncingDb(false);
      }

      const savedDiary = localStorage.getItem("nutriscan_diary");
      if (savedDiary) {
        try {
          const parsed = JSON.parse(savedDiary);
          if (Array.isArray(parsed)) {
            const cleanParsed = parsed.filter((entry: FoodLogItem) => !entry.id?.startsWith("pre-") && !entry.id?.startsWith("sql-seed-"));
            setDiaryItems(cleanParsed);
            localStorage.setItem("nutriscan_diary", JSON.stringify(cleanParsed));
          }
        } catch (e) {
          console.error(e);
        }
      }
    };

    fetchSqliteDiary();

    // Automatically calibrate exchange rate in background so user never has to configure dollar price
    const syncRateInBackground = async () => {
      try {
        const res = await fetch("/api/exchange-rate");
        if (res.ok) {
          const info = await res.json();
          if (info && typeof info.rateTomanPerUSD === "number") {
            setUserProfile((prev) => {
              const updated: UserProfile = {
                ...prev,
                exchangeRateTomanPerUSD: info.rateTomanPerUSD,
                autoRateSourceEn: info.sourceEn,
                autoRateSourceFa: info.sourceFa,
                autoRateUpdatedAt: info.updatedAt,
                isLiveRateFeed: info.isLiveFeed
              };
              localStorage.setItem("nutriscan_profile", JSON.stringify(updated));
              return updated;
            });
          }
        }
      } catch {
        // Silent fallback to domestic index
      }
    };
    syncRateInBackground();

    const savedProfile = localStorage.getItem("nutriscan_profile");
    if (savedProfile) {
      try {
        const parsed = JSON.parse(savedProfile);
        if (parsed && typeof parsed === "object") {
          setUserProfile((prev) => ({
            ...DEFAULT_USER_PROFILE,
            ...parsed,
            calorieGoal: typeof parsed.calorieGoal === "number" ? parsed.calorieGoal : DEFAULT_USER_PROFILE.calorieGoal,
            proteinGoal: typeof parsed.proteinGoal === "number" ? parsed.proteinGoal : DEFAULT_USER_PROFILE.proteinGoal,
            carbsGoal: typeof parsed.carbsGoal === "number" ? parsed.carbsGoal : DEFAULT_USER_PROFILE.carbsGoal,
            fatGoal: typeof parsed.fatGoal === "number" ? parsed.fatGoal : DEFAULT_USER_PROFILE.fatGoal,
            sodiumGoal: typeof parsed.sodiumGoal === "number" ? parsed.sodiumGoal : DEFAULT_USER_PROFILE.sodiumGoal,
            dailyBudgetToman: typeof parsed.dailyBudgetToman === "number" ? parsed.dailyBudgetToman : DEFAULT_USER_PROFILE.dailyBudgetToman,
            dailyBudgetUSD: typeof parsed.dailyBudgetUSD === "number" ? parsed.dailyBudgetUSD : DEFAULT_USER_PROFILE.dailyBudgetUSD,
            exchangeRateTomanPerUSD: typeof parsed.exchangeRateTomanPerUSD === "number" ? parsed.exchangeRateTomanPerUSD : DEFAULT_USER_PROFILE.exchangeRateTomanPerUSD,
            currency: parsed.currency || DEFAULT_USER_PROFILE.currency,
            language: parsed.language || DEFAULT_USER_PROFILE.language,
            themePreference: parsed.themePreference || undefined,
            activePreset: parsed.activePreset || undefined
          }));
        }
      } catch (e) {
        console.error(e);
      }
    }

    const savedRecentScans = localStorage.getItem("nutriscan_recent_scans");
    if (savedRecentScans) {
      try {
        const parsed = JSON.parse(savedRecentScans);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const userScans = parsed.filter((item: any) => !item.id?.startsWith("scan-sample-"));
          const normList = userScans.map((item) => normalizeScannedLabel(item, currentLang, 230000));
          setRecentScans(normList);
          localStorage.setItem("nutriscan_recent_scans", JSON.stringify(normList));
        } else {
          setRecentScans([]);
          localStorage.setItem("nutriscan_recent_scans", JSON.stringify([]));
        }
      } catch (e) {
        console.error(e);
        setRecentScans([]);
      }
    } else {
      setRecentScans([]);
      try {
        localStorage.setItem("nutriscan_recent_scans", JSON.stringify([]));
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  // Save persistence to localStorage & SQLite state helper
  const saveDiary = (newItems: FoodLogItem[]) => {
    setDiaryItems(newItems);
    localStorage.setItem("nutriscan_diary", JSON.stringify(newItems));
    const distinctDays = new Set(newItems.map((i) => i.entryDate || getTodayIsoDate())).size;
    setSqliteStats((prev) => ({
      ...prev,
      totalEntries: newItems.length,
      activeDays: distinctDays
    }));
  };

  const persistSingleEntryToSqlite = async (newItem: FoodLogItem) => {
    const itemWithDate: FoodLogItem = {
      ...newItem,
      entryDate: newItem.entryDate || getTodayIsoDate(),
      createdAt: newItem.createdAt || Date.now()
    };
    const optimistic = [itemWithDate, ...diaryItems];
    saveDiary(optimistic);

    setIsSyncingDb(true);
    try {
      const res = await fetch("/api/diary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ item: itemWithDate })
      });
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data.entries)) {
          setDiaryItems(data.entries);
          localStorage.setItem("nutriscan_diary", JSON.stringify(data.entries));
        }
        if (data.stats) {
          setSqliteStats(data.stats);
        }
      }
    } catch (err) {
      console.warn("Failed to sync new entry to SQLite server, kept in local cache:", err);
    } finally {
      setIsSyncingDb(false);
    }
  };

  const saveProfile = (newProfile: UserProfile) => {
    setUserProfile(newProfile);
    localStorage.setItem("nutriscan_profile", JSON.stringify(newProfile));
    // If language changed, normalize all current recent scans to match new language
    if (recentScans.length > 0) {
      const targetLang = newProfile.language === "fa" ? "fa" : "en";
      const targetRate = newProfile.exchangeRateTomanPerUSD || 230000;
      const updatedRecent = recentScans.map((scan) =>
        normalizeScannedLabel(scan, targetLang, targetRate)
      );
      setRecentScans(updatedRecent);
      try {
        localStorage.setItem("nutriscan_recent_scans", JSON.stringify(updatedRecent));
      } catch (e) {
        console.error(e);
      }
    }
  };

  // Recent scan persistence helper (stores up to 30 past scans in history log)
  const addRecentScan = (scanned: ScannedLabel) => {
    const rate = userProfile.exchangeRateTomanPerUSD || TOMAN_PER_USD;
    const normalized = normalizeScannedLabel(
      scanned,
      currentLang,
      rate
    );
    const itemWithMeta: ScannedLabel = {
      ...normalized,
      id: scanned.id || `scan-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      scannedAt: scanned.scannedAt || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setRecentScans((prev) => {
      const filtered = prev.filter(
        (item) => (item.id !== itemWithMeta.id) && (item.productName.toLowerCase() !== itemWithMeta.productName.toLowerCase())
      );
      const updated = [itemWithMeta, ...filtered].slice(0, 30);
      try {
        localStorage.setItem("nutriscan_recent_scans", JSON.stringify(updated));
      } catch (e) {
        console.error("Error saving recent scan to localStorage:", e);
      }
      return updated;
    });
  };

  const handleClearRecentScans = () => {
    setRecentScans([]);
    try {
      localStorage.removeItem("nutriscan_recent_scans");
    } catch (e) {
      console.error(e);
    }
  };

  const handleRemoveRecentScan = (idOrName: string) => {
    setRecentScans((prev) => {
      const updated = prev.filter((item) => (item.id || item.productName) !== idOrName);
      try {
        localStorage.setItem("nutriscan_recent_scans", JSON.stringify(updated));
      } catch (e) {
        console.error(e);
      }
      return updated;
    });
  };

  const handleSelectRecentScan = (item: ScannedLabel) => {
    const normalized = normalizeScannedLabel(
      item,
      currentLang,
      userProfile.exchangeRateTomanPerUSD || TOMAN_PER_USD
    );
    setScannedResult(normalized);
    setPortionServings(1);
    setShowResultDetail(true);
  };

  const handleQuickLogRecentScan = (scanned: ScannedLabel, targetDate?: string, servings = 1) => {
    const rate = (userProfile.exchangeRateTomanPerUSD && userProfile.exchangeRateTomanPerUSD > 0)
      ? userProfile.exchangeRateTomanPerUSD
      : TOMAN_PER_USD;
    const normalized = normalizeScannedLabel(scanned, currentLang, rate);

    let costToman = normalized.estimatedPrice?.amountToman;
    let costUSD = normalized.estimatedPrice?.amountUSD;
    if (!costToman && costUSD) costToman = Math.round(costUSD * rate);
    if (!costUSD && costToman) costUSD = Number((costToman / rate).toFixed(2));

    const effectiveDate = targetDate || (selectedDiaryDate !== "all" ? selectedDiaryDate : getTodayIsoDate());

    const newItem: FoodLogItem = {
      id: `scan-log-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      entryDate: effectiveDate,
      createdAt: Date.now(),
      productName: normalized.productName,
      brand: normalized.brand || (currentLang === "fa" ? "سوابق اسکنر نوتری‌اسکن" : "NutriScan Scan History"),
      foodType: normalized.foodType || "dish",
      cuisine: normalized.cuisine,
      loggedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      servingsCount: servings,
      servingSizeText: normalized.servingSize || "1 serving",
      caloriesTotal: Math.round(normalized.calories * servings),
      proteinTotal: Number((normalized.protein * servings).toFixed(1)),
      carbsTotal: Number((normalized.totalCarbohydrate * servings).toFixed(1)),
      fatTotal: Number((normalized.totalFat * servings).toFixed(1)),
      sodiumTotal: Math.round((normalized.sodium || 0) * servings),
      priceToman: costToman ? Math.round(costToman * servings) : undefined,
      priceUSD: costUSD ? Number((costUSD * servings).toFixed(2)) : undefined
    };

    persistSingleEntryToSqlite(newItem);
  };

  // Stop real camera stream
  const stopCamera = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach(track => track.stop());
      setCameraStream(null);
    }
    setUseRealCamera(false);
  };

  // Start real camera
  const startCamera = async () => {
    try {
      setUseRealCamera(true);
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" }
      });
      setCameraStream(stream);
      setHasCameraPermission(true);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.warn("Camera initialization failed, fallback to simulation:", err);
      setHasCameraPermission(false);
      setUseRealCamera(false);
    }
  };

  // Cleanup camera stream
  useEffect(() => {
    return () => {
      if (cameraStream) {
        cameraStream.getTracks().forEach(track => track.stop());
      }
    };
  }, [cameraStream]);

  // Trigger Scanner Execution
  const triggerScan = async (base64Image?: string, mime?: string) => {
    if (!base64Image) {
      setScanError(isFa ? "لطفاً یک تصویر بارگذاری کنید یا دوربین را فعال نمایید." : "Please upload an image or start the live camera to capture a nutrition label.");
      return;
    }

    setIsScanning(true);
    setScanError(null);

    // Auto-compress safety check if payload is still large
    let finalBase64 = base64Image;
    if (finalBase64.length > 1.5 * 1024 * 1024) {
      try {
        finalBase64 = await compressImage(finalBase64, mime || "image/jpeg", 800, 0.65);
      } catch (e) {
        // keep as is
      }
    }

    const sizeInMB = finalBase64.length / (1024 * 1024);
    console.log("%c[NutriScan] Starting scanning request...", "color: #ff3e00; font-weight: bold; font-size: 13px;");
    console.log(`- Image Payload Size: ${(finalBase64.length / 1024).toFixed(2)} KB (${sizeInMB.toFixed(2)} MB)`);
    console.log(`- MIME Type: ${mime || "image/jpeg"}`);

    const abortController = new AbortController();
    const abortTimeout = setTimeout(() => {
      abortController.abort();
    }, 45000);

    try {
      const response = await fetch("/api/scan-label", {
        method: "POST",
        signal: abortController.signal,
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          imageBase64: finalBase64,
          mimeType: mime || "image/jpeg",
          language: currentLang,
          exchangeRateTomanPerUSD: userProfile.exchangeRateTomanPerUSD || TOMAN_PER_USD
        })
      });

      clearTimeout(abortTimeout);

      console.log(`%c[NutriScan] Server responded with status: ${response.status} ${response.statusText}`,
        response.ok ? "color: green; font-weight: bold;" : "color: red; font-weight: bold;"
      );

      const rawText = await response.text();
      console.log(`- Response Content Length: ${rawText.length} bytes`);

      if (!response.ok) {
        let errMsg = "Failed to scan label";
        try {
          const errJson = JSON.parse(rawText);
          errMsg = errJson.error || errMsg;
        } catch (e) {
          if (response.status === 504) {
            errMsg = isFa
              ? "زمان پردازش سرور به پایان رسید (Vercel Timeout). تصویر فشرده شد؛ لطفاً مجدداً امتحان کنید."
              : "Server analysis timed out (Vercel 504 Timeout). The image was compressed; please try again.";
          } else if (response.status === 413) {
            errMsg = isFa
              ? "حجم تصویر برای سرور ورسل بیش از حد بزرگ است (413 Payload Too Large)."
              : "Image size exceeds Vercel upload limit (413 Payload Too Large).";
          } else {
            errMsg = `Server Error (${response.status}): ${response.statusText || "Internal Server Error"}`;
          }
        }

        throw new Error(errMsg);
      }

      let data: ScannedLabel;
      try {
        data = JSON.parse(rawText);
      } catch (jsonErr: any) {
        console.error("%c[NutriScan] JSON Parsing Error on client side!", "color: red; font-weight: bold;");
        throw new Error(isFa ? "پاسخ نامعتبر از سرور دریافت شد." : "Invalid response received from the server.");
      }

      console.log("%c[NutriScan] Successfully analyzed food label!", "color: green; font-weight: bold;");

      if (data.isDemoFallback && (data as any).originalScanError) {
        console.warn(
          `%c[NutriScan Notice] The scanner was loaded in Demo Fallback Mode because the server-side Gemini call failed. ` +
          `Original API Error: ${(data as any).originalScanError}`,
          "color: #d97706; font-weight: bold;"
        );
      }

      const normalizedData = normalizeScannedLabel(
        data,
        currentLang,
        userProfile.exchangeRateTomanPerUSD || TOMAN_PER_USD
      );

      const scannedItem: ScannedLabel = {
        ...normalizedData,
        id: data.id || `scan-${Date.now()}`,
        scannedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setScannedResult(scannedItem);
      addRecentScan(scannedItem);
      setPortionServings(1);
      setShowResultDetail(true);
    } catch (err: any) {
      clearTimeout(abortTimeout);
      let message = err.message || "An error occurred while analyzing the label.";
      if (err.name === "AbortError") {
        message = isFa
          ? "درخواست به دلیل طولانی شدن زمان پاسخ سرور متوقف شد (Timeout). لطفاً اتصال یا کلید API را بررسی و مجدداً تلاش کنید."
          : "The scan request timed out. Please check your network or Vercel serverless configuration and try again.";
      }
      setScanError(message);
    } finally {
      setIsScanning(false);
    }
  };

  // Active exchange rate based on user setting or fallback
  const currentExchangeRate = (userProfile.exchangeRateTomanPerUSD && userProfile.exchangeRateTomanPerUSD > 0)
    ? userProfile.exchangeRateTomanPerUSD
    : TOMAN_PER_USD;

  // Format price helper according to user currency preference & smart tier
  const formatPrice = (priceToman?: number, priceUSD?: number) => {
    return formatSmartPrice(priceToman, priceUSD, userProfile, 1);
  };

  const handleSyncExchangeRate = async () => {
    setIsSyncingRate(true);
    try {
      const res = await fetch("/api/exchange-rate?refresh=true");
      if (res.ok) {
        const info = await res.json();
        if (info && typeof info.rateTomanPerUSD === "number") {
          const updated: UserProfile = {
            ...userProfile,
            exchangeRateTomanPerUSD: info.rateTomanPerUSD,
            autoRateSourceEn: info.sourceEn,
            autoRateSourceFa: info.sourceFa,
            autoRateUpdatedAt: info.updatedAt,
            isLiveRateFeed: info.isLiveFeed
          };
          saveProfile(updated);
        }
      }
    } catch (err) {
      console.warn("Exchange rate sync fallback:", err);
    } finally {
      setIsSyncingRate(false);
    }
  };

  // Select a global food around the world to display
  const handleSelectWorldFood = (rawFood: WorldFood) => {
    const food = getLocalizedWorldFood(rawFood, currentLang);
    const mapped: ScannedLabel = {
      productName: food.name,
      brand: `${food.nativeName && food.nativeName !== food.name ? food.nativeName + " • " : ""}${t.origin}: ${food.origin}`,
      foodType: "dish",
      cuisine: `${food.regionFa && currentLang === "fa" ? food.regionFa : food.region} (${food.origin})`,
      servingSize: food.servingSize,
      servingsPerContainer: 1,
      calories: food.calories,
      totalFat: food.fat,
      sodium: food.sodium,
      totalCarbohydrate: food.carbs,
      protein: food.protein,
      healthScore: food.healthScore,
      healthRatingLabel: currentLang === "fa"
        ? (food.healthScore >= 90 ? "A - عالی" : food.healthScore >= 75 ? "B - خوب" : "C - متوسط")
        : food.healthRatingLabel,
      summary: `${food.funFact} ${food.summary}`,
      nutritionalHighlights: food.nutritionalHighlights,
      nutritionalWarnings: food.nutritionalWarnings,
      ingredientsList: food.ingredientsList,
      estimatedPrice: {
        amountToman: food.priceToman,
        amountUSD: food.priceUSD,
        confidence: "high"
      },
      ingredientCosts: food.ingredientCosts,
      culturalNotes: food.culturalBackground,
      priceDisclaimer: currentLang === "fa"
        ? "قیمت‌ها بر اساس میانگین تخمینی هزینه خرید مواد اولیه در بازار ایران برآورد شده است."
        : "Prices are based on average estimated wholesale raw ingredient market costs.",
      scannedAt: currentLang === "fa" ? "غذای برگزیده ملل" : "Global Discovery"
    };
    setScannedResult(mapped);
    setPortionServings(1);
    setShowResultDetail(true);
  };

  // Real Camera Snapshot
  const captureSnapshot = () => {
    if (!videoRef.current) return;

    try {
      const video = videoRef.current;
      const canvas = document.createElement("canvas");
      let width = video.videoWidth || 640;
      let height = video.videoHeight || 480;
      const maxDim = 1200;
      if (width > maxDim || height > maxDim) {
        if (width > height) {
          height = Math.round((height * maxDim) / width);
          width = maxDim;
        } else {
          width = Math.round((width * maxDim) / height);
          height = maxDim;
        }
      }
      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const base64 = canvas.toDataURL("image/jpeg", 0.8);
        stopCamera();
        triggerScan(base64, "image/jpeg");
      }
    } catch (err) {
      setScanError("Could not capture image from camera stream.");
    }
  };

  // File Upload Handler
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Reset input value so user can upload the same file again if desired
    event.target.value = "";

    const reader = new FileReader();
    reader.onload = async () => {
      const base64 = reader.result as string;
      setIsScanning(true);
      setScanError(null);
      try {
        const compressed = await compressImage(base64, file.type, 960, 0.72);
        triggerScan(compressed, "image/jpeg");
      } catch (err) {
        // Fallback to second pass compression
        try {
          const fallbackCompressed = await compressImage(base64, "image/jpeg", 720, 0.65);
          triggerScan(fallbackCompressed, "image/jpeg");
        } catch (e) {
          triggerScan(base64, file.type);
        }
      }
    };
    reader.onerror = () => {
      setScanError(isFa ? "خطا در خواندن فایل بارگذاری‌شده." : "Error reading uploaded file.");
    };
    reader.readAsDataURL(file);
  };

  // Log currently analyzed product to diary
  const handleLogToDiary = () => {
    if (!scannedResult) return;

    const todayIso = getTodayIsoDate();
    const newItem: FoodLogItem = {
      id: Math.random().toString(36).substr(2, 9),
      entryDate: todayIso,
      createdAt: Date.now(),
      productName: scannedResult.productName,
      brand: scannedResult.brand,
      foodType: scannedResult.foodType || "dish",
      cuisine: scannedResult.cuisine,
      loggedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      servingsCount: portionServings,
      servingSizeText: scannedResult.servingSize,
      caloriesTotal: Math.round(scannedResult.calories * portionServings),
      proteinTotal: Number((scannedResult.protein * portionServings).toFixed(1)),
      carbsTotal: Number((scannedResult.totalCarbohydrate * portionServings).toFixed(1)),
      fatTotal: Number((scannedResult.totalFat * portionServings).toFixed(1)),
      sodiumTotal: Math.round(scannedResult.sodium * portionServings),
      priceToman: scannedResult.estimatedPrice?.amountToman
        ? Math.round(scannedResult.estimatedPrice.amountToman * portionServings)
        : undefined,
      priceUSD: scannedResult.estimatedPrice?.amountUSD
        ? Number((scannedResult.estimatedPrice.amountUSD * portionServings).toFixed(2))
        : undefined
    };

    persistSingleEntryToSqlite(newItem);
    setSelectedDiaryDate(todayIso);

    // Smooth navigation to diary with feedback
    setShowResultDetail(false);
    setActiveTab("diary");
  };

  // Add manual / past entry to SQLite diary
  const handleAddManualEntry = async (partial: Partial<FoodLogItem>) => {
    const newItem: FoodLogItem = {
      id: `sql-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      entryDate: partial.entryDate || getTodayIsoDate(),
      createdAt: Date.now(),
      productName: partial.productName || "Custom Dish",
      brand: partial.brand || "SQLite Diary",
      foodType: partial.foodType || "dish",
      cuisine: partial.cuisine || "",
      loggedAt: partial.loggedAt || new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      servingsCount: partial.servingsCount || 1,
      servingSizeText: partial.servingSizeText || "1 serving",
      caloriesTotal: Math.round(Number(partial.caloriesTotal || 0)),
      proteinTotal: Number(Number(partial.proteinTotal || 0).toFixed(1)),
      carbsTotal: Number(Number(partial.carbsTotal || 0).toFixed(1)),
      fatTotal: Number(Number(partial.fatTotal || 0).toFixed(1)),
      sodiumTotal: Math.round(Number(partial.sodiumTotal || 0)),
      priceToman: partial.priceToman,
      priceUSD: partial.priceUSD
    };
    await persistSingleEntryToSqlite(newItem);
  };

  // Delete logged item from SQLite
  const handleDeleteLogItem = async (id: string) => {
    const updated = diaryItems.filter(item => item.id !== id);
    saveDiary(updated);

    setIsSyncingDb(true);
    try {
      const res = await fetch(`/api/diary/${encodeURIComponent(id)}`, {
        method: "DELETE"
      });
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data.entries)) {
          setDiaryItems(data.entries);
          localStorage.setItem("nutriscan_diary", JSON.stringify(data.entries));
        }
        if (data.stats) {
          setSqliteStats(data.stats);
        }
      }
    } catch (err) {
      console.warn("Failed to delete item on SQLite server:", err);
    } finally {
      setIsSyncingDb(false);
    }
  };

  // Clear logs (for selected date or all) in SQLite
  const handleClearLogs = async (dateFilter?: string) => {
    if (dateFilter) {
      const remaining = diaryItems.filter(
        (item) => (item.entryDate || getTodayIsoDate()) !== dateFilter
      );
      saveDiary(remaining);
    } else {
      saveDiary([]);
    }

    setIsSyncingDb(true);
    try {
      const url = dateFilter
        ? `/api/diary?date=${encodeURIComponent(dateFilter)}`
        : "/api/diary";
      const res = await fetch(url, { method: "DELETE" });
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data.entries)) {
          setDiaryItems(data.entries);
          localStorage.setItem("nutriscan_diary", JSON.stringify(data.entries));
        }
        if (data.stats) {
          setSqliteStats(data.stats);
        }
      }
    } catch (err) {
      console.warn("Failed to clear logs on SQLite server:", err);
    } finally {
      setIsSyncingDb(false);
    }
  };

  // Filter items for Today vs Selected Diary Date
  const todayIso = getTodayIsoDate();
  const todayDiaryItems = diaryItems.filter(
    (item) => (item.entryDate || todayIso) === todayIso
  );
  const selectedDiaryItems =
    selectedDiaryDate === "all"
      ? diaryItems
      : diaryItems.filter((item) => (item.entryDate || todayIso) === selectedDiaryDate);

  const computeTotalsForList = (items: FoodLogItem[]): DailyTotals =>
    items.reduce(
      (acc, curr) => {
        const rate = currentExchangeRate;
        let itemToman = curr.priceToman || 0;
        let itemUSD = curr.priceUSD || 0;
        if (!itemToman && itemUSD) itemToman = Math.round(itemUSD * rate);
        if (!itemUSD && itemToman) itemUSD = Number((itemToman / rate).toFixed(2));

        return {
          calories: acc.calories + curr.caloriesTotal,
          protein: acc.protein + curr.proteinTotal,
          carbs: acc.carbs + curr.carbsTotal,
          fat: acc.fat + curr.fatTotal,
          sodium: acc.sodium + curr.sodiumTotal,
          costTomanTotal: acc.costTomanTotal + itemToman,
          costUSDTotal: Number((acc.costUSDTotal + itemUSD).toFixed(2))
        };
      },
      { calories: 0, protein: 0, carbs: 0, fat: 0, sodium: 0, costTomanTotal: 0, costUSDTotal: 0 }
    );

  // Calculate dynamic totals for today (header/vitals) and for selected diary view
  const dailyTotals: DailyTotals = computeTotalsForList(todayDiaryItems);
  const selectedDiaryTotals: DailyTotals = computeTotalsForList(selectedDiaryItems);

  // Percentage calculations
  const calPercent = Math.min(Math.round((dailyTotals.calories / userProfile.calorieGoal) * 100), 100);
  const proteinPercent = Math.min(Math.round((dailyTotals.protein / userProfile.proteinGoal) * 100), 100);
  const carbsPercent = Math.min(Math.round((dailyTotals.carbs / userProfile.carbsGoal) * 100), 100);
  const fatPercent = Math.min(Math.round((dailyTotals.fat / userProfile.fatGoal) * 100), 100);
  const sodiumPercent = Math.min(Math.round((dailyTotals.sodium / userProfile.sodiumGoal) * 100), 100);

  // Apply profile presets
  const applyPreset = (type: "weight-loss" | "muscle" | "keto" | "balanced") => {
    let newProfile = { ...userProfile, activePreset: type };
    switch (type) {
      case "weight-loss":
        newProfile.calorieGoal = 1600;
        newProfile.proteinGoal = 90;
        newProfile.carbsGoal = 180;
        newProfile.fatGoal = 50;
        break;
      case "muscle":
        newProfile.calorieGoal = 2500;
        newProfile.proteinGoal = 140;
        newProfile.carbsGoal = 300;
        newProfile.fatGoal = 75;
        break;
      case "keto":
        newProfile.calorieGoal = 1800;
        newProfile.proteinGoal = 100;
        newProfile.carbsGoal = 30;
        newProfile.fatGoal = 130;
        break;
      case "balanced":
        newProfile.calorieGoal = 2000;
        newProfile.proteinGoal = 80;
        newProfile.carbsGoal = 250;
        newProfile.fatGoal = 65;
        break;
    }
    saveProfile(newProfile);
  };

  // Handle clicking one of the 4 Cyber Data Console preset grid items
  const handleSelectCyberDish = (dish: CyberPresetDish) => {
    const isFa = currentLang === "fa";
    const mapped: ScannedLabel = {
      productName: isFa ? dish.nameFa : dish.nameEn,
      brand: `${dish.refId} • ${dish.origin}`,
      servingSize: dish.servingSize,
      servingsPerContainer: 1,
      calories: dish.calories,
      totalFat: dish.fat,
      saturatedFat: Math.round(dish.fat * 0.35 * 10) / 10,
      transFat: 0,
      cholesterol: dish.protein > 20 ? 45 : 0,
      sodium: dish.sodium,
      totalCarbohydrate: dish.carbs,
      dietaryFiber: Math.round(dish.carbs * 0.15 * 10) / 10,
      totalSugars: Math.round(dish.carbs * 0.08 * 10) / 10,
      addedSugars: 0,
      protein: dish.protein,
      healthScore: 92,
      healthRatingLabel: isFa ? "A - عالی" : "A - Excellent",
      ingredientsList: dish.ingredients,
      nutritionalHighlights: [
        isFa ? `پروتئین خالص: ${dish.protein} گرم` : `Pure Protein: ${dish.protein}g`,
        isFa ? `کربوهیدرات: ${dish.carbs} گرم` : `Carbs: ${dish.carbs}g`,
        isFa ? `برآورد هزینه: ${formatPrice(dish.priceToman, dish.priceUSD)}` : `Est. Cost: ${formatPrice(dish.priceToman, dish.priceUSD)}`
      ],
      nutritionalWarnings: dish.sodium > 500 ? [isFa ? "میزان سدیم متوسط به بالا" : "Moderate to high sodium"] : [],
      summary: isFa ? dish.summaryFa : dish.summaryEn,
      foodType: "dish",
      cuisine: dish.origin,
      estimatedPrice: {
        amountToman: dish.priceToman,
        amountUSD: dish.priceUSD,
        confidence: "high"
      },
      scannedAt: "Cyber Data Console"
    };
    setScannedResult(mapped);
    setPortionServings(1);
    setShowResultDetail(true);
  };

  // Direct 1-click logger for the RECOMMENDED dish in the vitals pane
  const handleLogRecommendedDish = (targetDish?: RecommendedDish) => {
    const dish = targetDish || getDailyRecommendedDish();
    const isFa = currentLang === "fa";
    const newItem: FoodLogItem = {
      id: Math.random().toString(36).substr(2, 9),
      entryDate: getTodayIsoDate(),
      createdAt: Date.now(),
      productName: isFa ? dish.nameFa : dish.nameEn,
      brand: `${dish.refId} • ${isFa ? dish.originFa : dish.originEn}`,
      foodType: "dish",
      cuisine: isFa ? dish.originFa : dish.originEn,
      loggedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      servingsCount: 1,
      servingSizeText: isFa ? dish.servingSizeFa : dish.servingSizeEn,
      caloriesTotal: dish.calories,
      proteinTotal: dish.protein,
      carbsTotal: dish.carbs,
      fatTotal: dish.fat,
      sodiumTotal: dish.sodium,
      priceToman: dish.priceToman,
      priceUSD: dish.priceUSD
    };
    persistSingleEntryToSqlite(newItem);
  };

  return (
    <AndroidFrame dir={currentLang === "fa" ? "rtl" : "ltr"}>
      <div className="min-h-screen w-full flex flex-col bg-[#08090a] text-[#e0e0e0]  relative select-none" dir={currentLang === "fa" ? "rtl" : "ltr"}>
        {/* TOP CONSOLE TELEMETRY STRIP */}
        <ConsoleHeader
          userProfile={userProfile}
          dailyTotals={dailyTotals}
          themeMode={themeMode}
          effectiveTheme={effectiveTheme}
          devicePrefersDark={devicePrefersDark}
          onSelectTheme={handleSelectTheme}
          onToggleLanguage={() => saveProfile({ ...userProfile, language: currentLang === "en" ? "fa" : "en" })}
          onOpenDiary={() => setActiveTab("diary")}
        />

        {/* PROCESSING LOADING OVERLAY */}
        {isScanning && (
          <div className="fixed inset-0 bg-[#08090a]/95 backdrop-blur-md z-50 flex flex-col items-center justify-center p-6 text-center animate-[fadeIn_0.2s_ease-out]">
            <div className="relative w-28 h-28 flex items-center justify-center mb-6">
              <div className="absolute inset-0 rounded-full border border-[#ff3e00]/20 animate-ping" />
              <div className="absolute -inset-2 rounded-full border border-dashed border-[#ff3e00]/40 animate-[spin_10s_linear_infinite]" />
              <div className="w-16 h-16 bg-[#111214] border border-[#ff3e00] flex items-center justify-center shadow-lg">
                <Sparkles className="w-8 h-8 text-[#ff3e00] animate-pulse" />
              </div>
            </div>

            <h3 className="text-base font-extrabold text-[#e0e0e0] font-mono tracking-wider uppercase">
              {t.processingLabel}
            </h3>

            <p className="text-xs text-[#707070] font-mono mt-2.5 max-w-[280px] h-8 leading-relaxed">
              {getLoaderMessage()}
            </p>

            <div className="w-48 bg-[#1a1b1e] h-1.5 overflow-hidden mt-5 relative border border-[#2a2c31]">
              <div className="h-full bg-[#ff3e00] w-24 absolute left-0 top-0 animate-loading-progress" />
            </div>

            <div className="mt-6 flex flex-wrap gap-2 justify-center max-w-[280px] font-mono text-[9px]">
              <span className="bg-[#111214] border border-[#2a2c31] px-2 py-1 text-[#ff3e00] flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-[#ff3e00] animate-ping" />
                {currentLang === "fa" ? "حسگر بینایی" : "OCR_SENSOR"}
              </span>
              <span className="bg-[#111214] border border-[#2a2c31] px-2 py-1 text-[#ff3e00]">
                {currentLang === "fa" ? "هوش مصنوعی" : "GEMINI_AI"}
              </span>
              <span className="bg-[#111214] border border-[#2a2c31] px-2 py-1 text-[#707070]">
                {currentLang === "fa" ? "شاخص درشت‌مغذی" : "MACRO_INDEX"}
              </span>
            </div>
          </div>
        )}

        {/* MAIN MULTI-COLUMN CONSOLE GRID (VARIATION 6 ARCHITECTURE) */}
        <div className="flex-1 flex flex-col lg:flex-row min-h-0">
          {/* COLUMN 1: ICON BAR */}
          <IconBar
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            diaryCount={diaryItems.length}
            currentLang={currentLang}
          />

          {/* COLUMN 2: NAV PANE */}
          <NavPane
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            diaryCount={diaryItems.length}
            currentLang={currentLang}
          />

          {/* COLUMN 3: MAIN DISPLAY AREA */}
          <main className="flex-1 overflow-y-auto bg-transparent flex flex-col min-h-0 pb-20 lg:pb-6">
            {activeTab === "scan" && (
              <ScannerConsoleView
                userProfile={userProfile}
                useRealCamera={useRealCamera}
                isScanning={isScanning}
                scanError={scanError}
                videoRef={videoRef}
                recentScans={recentScans}
                onStartCamera={startCamera}
                onStopCamera={stopCamera}
                onCaptureSnapshot={captureSnapshot}
                onFileUpload={handleFileUpload}
                onSelectCyberDish={handleSelectCyberDish}
                onSelectWorldFood={handleSelectWorldFood}
                onLogRecommendedDish={handleLogRecommendedDish}
                onSelectRecentScan={handleSelectRecentScan}
                onQuickLogRecentScan={handleQuickLogRecentScan}
                onClearRecentScans={handleClearRecentScans}
                onRemoveRecentScan={handleRemoveRecentScan}
              />
            )}

            {activeTab === "diary" && (
              <DiaryConsoleView
                diaryItems={selectedDiaryItems}
                allHistoryItems={diaryItems}
                recentScans={recentScans}
                onQuickLogRecentScan={handleQuickLogRecentScan}
                onSelectRecentScan={handleSelectRecentScan}
                onRemoveRecentScan={handleRemoveRecentScan}
                selectedDate={selectedDiaryDate}
                onSelectDate={setSelectedDiaryDate}
                dailyTotals={selectedDiaryTotals}
                userProfile={userProfile}
                dbStats={sqliteStats}
                isSyncingDb={isSyncingDb}
                onDeleteLogItem={handleDeleteLogItem}
                onClearLogs={handleClearLogs}
                onAddManualEntry={handleAddManualEntry}
                onGoToScanner={() => setActiveTab("scan")}
              />
            )}

            {activeTab === "profile" && (
              <GoalsConsoleView
                userProfile={userProfile}
                isSyncingRate={isSyncingRate}
                onSaveProfile={saveProfile}
                onApplyPreset={applyPreset}
                onSyncExchangeRate={handleSyncExchangeRate}
              />
            )}
          </main>

          {/* COLUMN 4: RIGHT VITALS PANE (ONLY ON SCAN VIEW) */}
          {activeTab === "scan" && (
            <VitalsPane
              userProfile={userProfile}
              dailyTotals={dailyTotals}
            />
          )}
        </div>

        {/* DETAILED NUTRITION MODAL */}
        {showResultDetail && (
          <NutritionModal
            scannedResult={scannedResult}
            portionServings={portionServings}
            userProfile={userProfile}
            setPortionServings={setPortionServings}
            onClose={() => setShowResultDetail(false)}
            onLogToDiary={handleLogToDiary}
          />
        )}

        {/* MOBILE NAVIGATION DOCK (BOTTOM OF SCREEN) */}
        <nav
          aria-label={currentLang === "fa" ? "ناوبری موبایل" : "Mobile Navigation"}
          className="lg:hidden bg-[#0e1013] border-t border-[#27272a] py-2 px-4 flex justify-around items-center shrink-0 shadow-2xl z-40 fixed bottom-0 inset-x-0"
        >
          <button
            onClick={() => setActiveTab("scan")}
            type="button"
            aria-selected={activeTab === "scan"}
            className={`min-h-[48px] min-w-[64px] flex flex-col items-center justify-center gap-1 py-1 px-3 rounded-lg transition-colors cursor-pointer ${
              activeTab === "scan" ? "text-[#ff3e00] font-bold" : "text-[#9ca3af] hover:text-[#f4f4f5]"
            }`}
          >
            <Camera className="w-5 h-5" />
            <span className="text-xs font-medium">
              {currentLang === "fa" ? "اسکن" : "Scan"}
            </span>
          </button>

          <button
            onClick={() => setActiveTab("diary")}
            type="button"
            aria-selected={activeTab === "diary"}
            className={`min-h-[48px] min-w-[64px] flex flex-col items-center justify-center gap-1 py-1 px-3 rounded-lg transition-colors cursor-pointer relative ${
              activeTab === "diary" ? "text-[#ff3e00] font-bold" : "text-[#9ca3af] hover:text-[#f4f4f5]"
            }`}
          >
            <BookOpen className="w-5 h-5" />
            <span className="text-xs font-medium">
              {currentLang === "fa" ? "یادداشت" : "Diary"}
            </span>
            {diaryItems.length > 0 && (
              <span className="absolute top-1 right-2 min-w-4 h-4 px-1 rounded-full bg-[#ff3e00] text-black text-[10px] font-bold flex items-center justify-center">
                {currentLang === "fa" ? diaryItems.length.toLocaleString("fa-IR") : diaryItems.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab("profile")}
            type="button"
            aria-selected={activeTab === "profile"}
            className={`min-h-[48px] min-w-[64px] flex flex-col items-center justify-center gap-1 py-1 px-3 rounded-lg transition-colors cursor-pointer ${
              activeTab === "profile" ? "text-[#ff3e00] font-bold" : "text-[#9ca3af] hover:text-[#f4f4f5]"
            }`}
          >
            <Sliders className="w-5 h-5" />
            <span className="text-xs font-medium">
              {currentLang === "fa" ? "اهداف" : "Goals"}
            </span>
          </button>
        </nav>
      </div>
    </AndroidFrame>
  );
}
