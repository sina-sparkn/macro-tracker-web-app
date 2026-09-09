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
import DiaryConsoleView from "./components/DiaryConsoleView";
import GoalsConsoleView from "./components/GoalsConsoleView";
import NutritionModal from "./components/NutritionModal";
import { ScannedLabel, FoodLogItem, DailyTotals, UserProfile } from "./types";
import { WORLD_FOODS, WorldFood, getLocalizedWorldFood } from "./worldFoods";
import { TRANSLATIONS } from "./translations";
import { RecommendedDish, getDailyRecommendedDish } from "./recommendedDishes";

export const TOMAN_PER_USD = 230000;

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

// Helper function to compress and downscale images client-side
const compressImage = (base64Str: string, mimeType: string, maxDim = 1200, quality = 0.8): Promise<string> => {
  return new Promise((resolve) => {
    const img = new Image();
    img.src = base64Str;
    img.onload = () => {
      let width = img.width;
      let height = img.height;
      let qualityTarget = quality;

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
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL("image/jpeg", qualityTarget));
      } else {
        resolve(base64Str);
      }
    };
    img.onerror = () => {
      resolve(base64Str);
    };
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

  // Food Diary State (preloaded with some meals with pricing and categorization)
  const [diaryItems, setDiaryItems] = useState<FoodLogItem[]>([
    {
      id: "pre-1",
      productName: "Ghormeh Sabzi with Saffron Rice",
      brand: "Authentic Persian Plate",
      foodType: "dish",
      cuisine: "Persian / ایرانی",
      loggedAt: new Date(Date.now() - 3600000 * 4).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      servingsCount: 1,
      servingSizeText: "1 plate (350g)",
      caloriesTotal: 420,
      proteinTotal: 28,
      carbsTotal: 38,
      fatTotal: 16,
      sodiumTotal: 480,
      priceToman: 950000,
      priceUSD: 4.13
    },
    {
      id: "pre-2",
      productName: "Almond Milk (Unsweetened)",
      brand: "Earth's Own",
      foodType: "beverage",
      cuisine: "International",
      loggedAt: new Date(Date.now() - 3600000 * 2).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      servingsCount: 1,
      servingSizeText: "1 cup (240ml)",
      caloriesTotal: 35,
      proteinTotal: 1,
      carbsTotal: 1,
      fatTotal: 3,
      sodiumTotal: 160,
      priceToman: 280000,
      priceUSD: 1.22
    }
  ]);

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
    exchangeRateTomanPerUSD: 230000
  };

  const [userProfile, setUserProfile] = useState<UserProfile>(DEFAULT_USER_PROFILE);

  // Recent Scans List (Persisted in localStorage)
  const [recentScans, setRecentScans] = useState<ScannedLabel[]>([]);

  // Active translation selector
  const currentLang = userProfile.language || "en";
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

  // Load persistence from localStorage on mount
  useEffect(() => {
    const savedDiary = localStorage.getItem("nutriscan_diary");
    if (savedDiary) {
      try {
        setDiaryItems(JSON.parse(savedDiary));
      } catch (e) {
        console.error(e);
      }
    }

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
            language: parsed.language || DEFAULT_USER_PROFILE.language
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
          setRecentScans([parsed[0]]);
        }
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  // Save persistence to localStorage on changes
  const saveDiary = (newItems: FoodLogItem[]) => {
    setDiaryItems(newItems);
    localStorage.setItem("nutriscan_diary", JSON.stringify(newItems));
  };

  const saveProfile = (newProfile: UserProfile) => {
    setUserProfile(newProfile);
    localStorage.setItem("nutriscan_profile", JSON.stringify(newProfile));
  };

  // Recent scan persistence helper (stores ONLY the single last scan from camera/upload)
  const addRecentScan = (scanned: ScannedLabel) => {
    const updated = [scanned];
    setRecentScans(updated);
    try {
      localStorage.setItem("nutriscan_recent_scans", JSON.stringify(updated));
    } catch (e) {
      console.error("Error saving recent scan to localStorage:", e);
    }
  };

  const handleClearRecentScans = () => {
    setRecentScans([]);
    try {
      localStorage.removeItem("nutriscan_recent_scans");
    } catch (e) {
      console.error(e);
    }
  };

  const handleSelectRecentScan = (item: ScannedLabel) => {
    setScannedResult(item);
    setPortionServings(1);
    setShowResultDetail(true);
  };

  const handleQuickLogRecentScan = (scanned: ScannedLabel) => {
    const rate = (userProfile.exchangeRateTomanPerUSD && userProfile.exchangeRateTomanPerUSD > 0)
      ? userProfile.exchangeRateTomanPerUSD
      : TOMAN_PER_USD;

    let costToman = scanned.estimatedPrice?.amountToman;
    let costUSD = scanned.estimatedPrice?.amountUSD;
    if (!costToman && costUSD) costToman = Math.round(costUSD * rate);
    if (!costUSD && costToman) costUSD = Number((costToman / rate).toFixed(2));

    const newItem: FoodLogItem = {
      id: Math.random().toString(36).substr(2, 9),
      productName: scanned.productName,
      brand: scanned.brand,
      foodType: scanned.foodType || "dish",
      cuisine: scanned.cuisine,
      loggedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      servingsCount: 1,
      servingSizeText: scanned.servingSize,
      caloriesTotal: Math.round(scanned.calories),
      proteinTotal: Number(scanned.protein.toFixed(1)),
      carbsTotal: Number(scanned.totalCarbohydrate.toFixed(1)),
      fatTotal: Number(scanned.totalFat.toFixed(1)),
      sodiumTotal: Math.round(scanned.sodium),
      priceToman: costToman,
      priceUSD: costUSD
    };

    saveDiary([newItem, ...diaryItems]);
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
      setScanError("Please upload an image or start the live camera to capture a nutrition label.");
      return;
    }

    setIsScanning(true);
    setScanError(null);

    const sizeInMB = base64Image.length / (1024 * 1024);
    console.log("%c[NutriScan] Starting scanning request...", "color: #4A5D4E; font-weight: bold; font-size: 13px;");
    console.log(`- Image Payload Size: ${(base64Image.length / 1024).toFixed(2)} KB (${sizeInMB.toFixed(2)} MB)`);
    console.log(`- MIME Type: ${mime || "image/jpeg"}`);

    if (sizeInMB > 4.0) {
      console.warn(
        `%c[NutriScan Warning] Large payload size of ${sizeInMB.toFixed(2)}MB detected. ` +
        `Vercel serverless functions have a strict 4.5MB payload limit. ` +
        `If this request fails with a 500 or 413 error, try uploading a smaller image or compression might have failed.`,
        "color: orange; font-weight: bold;"
      );
    }

    try {
      const response = await fetch("/api/scan-label", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          imageBase64: base64Image,
          mimeType: mime || "image/jpeg",
          language: currentLang
        })
      });

      console.log(`%c[NutriScan] Server responded with status: ${response.status} ${response.statusText}`, 
        response.ok ? "color: green; font-weight: bold;" : "color: red; font-weight: bold;"
      );

      const rawText = await response.text();
      console.log(`- Response Content Length: ${rawText.length} bytes`);
      if (rawText.length > 0) {
        console.log(`- Response Sample (first 300 chars):`, rawText.substring(0, 300));
      }

      if (!response.ok) {
        let serverErrorDetails = "";
        let errMsg = "Failed to scan label";
        try {
          const errJson = JSON.parse(rawText);
          errMsg = errJson.error || errMsg;
          serverErrorDetails = errJson.details || JSON.stringify(errJson, null, 2);
        } catch (e) {
          errMsg = `Server Error (${response.status}): ${response.statusText || "Internal Server Error"}`;
          serverErrorDetails = rawText;
        }

        console.error(
          `%c[NutriScan Scanner Error Detail]\n` +
          `----------------------------------------\n` +
          `HTTP Status: ${response.status}\n` +
          `Status Text: ${response.statusText}\n` +
          `Error Message: ${errMsg}\n` +
          `Raw Server Output:\n${serverErrorDetails}\n` +
          `----------------------------------------`,
          "color: #ff3333; font-weight: bold;"
        );

        throw new Error(errMsg);
      }

      let data: ScannedLabel;
      try {
        data = JSON.parse(rawText);
      } catch (jsonErr: any) {
        console.error("%c[NutriScan] JSON Parsing Error on client side! Response was not valid JSON.", "color: red; font-weight: bold;");
        console.error("Parse Error message:", jsonErr.message);
        console.error("Invalid raw content that failed parsing:", rawText);
        throw new Error("Invalid response received from the server. Please see developer console for raw details.");
      }

      console.log("%c[NutriScan] Successfully analyzed food label!", "color: green; font-weight: bold;");
      console.log("Extracted Label Data:", data);

      if (data.isDemoFallback && (data as any).originalScanError) {
        console.warn(
          `%c[NutriScan Notice] The scanner was loaded in Demo Fallback Mode because the server-side Gemini call failed. ` +
          `Original API Error: ${(data as any).originalScanError}`,
          "color: #d97706; font-weight: bold;"
        );
      }

      const scannedItem: ScannedLabel = {
        ...data,
        id: data.id || `scan-${Date.now()}`,
        scannedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setScannedResult(scannedItem);
      addRecentScan(scannedItem);
      setPortionServings(1);
      setShowResultDetail(true);
    } catch (err: any) {
      console.error(
        `%c[NutriScan Execution Exception]\n` +
        `----------------------------------------\n` +
        `Exception Name: ${err.name || "Error"}\n` +
        `Exception Message: ${err.message || String(err)}\n` +
        `Stack Trace:\n${err.stack || "N/A"}\n` +
        `----------------------------------------`,
        "color: #ff3333; font-weight: bold;"
      );
      setScanError(err.message || "An error occurred while analyzing the label.");
    } finally {
      setIsScanning(false);
    }
  };

  // Active exchange rate based on user setting or fallback
  const currentExchangeRate = (userProfile.exchangeRateTomanPerUSD && userProfile.exchangeRateTomanPerUSD > 0)
    ? userProfile.exchangeRateTomanPerUSD
    : TOMAN_PER_USD;

  // Format price helper according to user currency preference
  const formatPrice = (priceToman?: number, priceUSD?: number) => {
    const rate = currentExchangeRate;
    if (userProfile.currency === "USD") {
      if (priceUSD !== undefined && priceUSD > 0) return `$${priceUSD.toFixed(2)}`;
      if (priceToman !== undefined && priceToman > 0) return `$${(priceToman / rate).toFixed(2)}`;
      return null;
    }
    // Default IRT (Toman)
    const isFa = currentLang === "fa";
    const tomanUnit = isFa ? "تومان" : "Toman";
    if (priceToman !== undefined && priceToman > 0) {
      return `${priceToman.toLocaleString(isFa ? "fa-IR" : "en-US")} ${tomanUnit}`;
    }
    if (priceUSD !== undefined && priceUSD > 0) {
      return `${Math.round(priceUSD * rate).toLocaleString(isFa ? "fa-IR" : "en-US")} ${tomanUnit}`;
    }
    return null;
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

    const reader = new FileReader();
    reader.onload = async () => {
      const base64 = reader.result as string;
      setIsScanning(true);
      setScanError(null);
      try {
        const compressed = await compressImage(base64, file.type);
        triggerScan(compressed, "image/jpeg");
      } catch (err) {
        triggerScan(base64, file.type);
      }
    };
    reader.onerror = () => {
      setScanError("Error reading uploaded file.");
    };
    reader.readAsDataURL(file);
  };

  // Log currently analyzed product to diary
  const handleLogToDiary = () => {
    if (!scannedResult) return;

    const newItem: FoodLogItem = {
      id: Math.random().toString(36).substr(2, 9),
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

    const updated = [newItem, ...diaryItems];
    saveDiary(updated);
    
    // Smooth navigation to diary with feedback
    setShowResultDetail(false);
    setActiveTab("diary");
  };

  // Delete logged item
  const handleDeleteLogItem = (id: string) => {
    const updated = diaryItems.filter(item => item.id !== id);
    saveDiary(updated);
  };

  // Clear all logs
  const handleClearLogs = () => {
    if (window.confirm("Are you sure you want to clear your entire nutrition log for today?")) {
      saveDiary([]);
    }
  };

  // Calculate dynamic totals
  const dailyTotals: DailyTotals = diaryItems.reduce(
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

  // Percentage calculations
  const calPercent = Math.min(Math.round((dailyTotals.calories / userProfile.calorieGoal) * 100), 100);
  const proteinPercent = Math.min(Math.round((dailyTotals.protein / userProfile.proteinGoal) * 100), 100);
  const carbsPercent = Math.min(Math.round((dailyTotals.carbs / userProfile.carbsGoal) * 100), 100);
  const fatPercent = Math.min(Math.round((dailyTotals.fat / userProfile.fatGoal) * 100), 100);
  const sodiumPercent = Math.min(Math.round((dailyTotals.sodium / userProfile.sodiumGoal) * 100), 100);

  // Apply profile presets
  const applyPreset = (type: "weight-loss" | "muscle" | "keto" | "balanced") => {
    let newProfile = { ...userProfile };
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
    saveDiary([newItem, ...diaryItems]);
  };

  return (
    <AndroidFrame dir={currentLang === "fa" ? "rtl" : "ltr"}>
      <div className="min-h-screen w-full flex flex-col bg-[#08090a] text-[#e0e0e0] console-grid-bg relative select-none" dir={currentLang === "fa" ? "rtl" : "ltr"}>
        {/* TOP CONSOLE TELEMETRY STRIP */}
        <ConsoleHeader
          userProfile={userProfile}
          dailyTotals={dailyTotals}
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
          <main className="flex-1 overflow-y-auto bg-[#08090a]/90 flex flex-col min-h-0 pb-32 sm:pb-36 lg:pb-10">
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
              />
            )}

            {activeTab === "diary" && (
              <DiaryConsoleView
                diaryItems={diaryItems}
                dailyTotals={dailyTotals}
                userProfile={userProfile}
                onDeleteLogItem={handleDeleteLogItem}
                onClearLogs={handleClearLogs}
                onGoToScanner={() => setActiveTab("scan")}
              />
            )}

            {activeTab === "profile" && (
              <GoalsConsoleView
                userProfile={userProfile}
                onSaveProfile={saveProfile}
                onApplyPreset={applyPreset}
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
