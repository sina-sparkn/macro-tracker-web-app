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
  Receipt
} from "lucide-react";
import AndroidFrame from "./components/AndroidFrame";
import { ScannedLabel, FoodLogItem, DailyTotals, UserProfile } from "./types";
import { WORLD_FOODS, WorldFood, getLocalizedWorldFood } from "./worldFoods";
import { TRANSLATIONS } from "./translations";

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
      priceToman: 185000,
      priceUSD: 3.2
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
      priceToman: 55000,
      priceUSD: 0.95
    }
  ]);

  // User Goals/Profile (Default)
  const [userProfile, setUserProfile] = useState<UserProfile>({
    name: "Sina",
    calorieGoal: 2000,
    proteinGoal: 80,
    carbsGoal: 250,
    fatGoal: 65,
    sodiumGoal: 2300,
    language: "en",
    currency: "IRT",
    dailyBudgetToman: 400000,
    dailyBudgetUSD: 7.5
  });

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
        setUserProfile(JSON.parse(savedProfile));
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

      setScannedResult({ ...data, scannedAt: new Date().toLocaleTimeString() });
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

  // Format price helper according to user currency preference
  const formatPrice = (priceToman?: number, priceUSD?: number) => {
    if (userProfile.currency === "USD") {
      if (priceUSD !== undefined && priceUSD > 0) return `$${priceUSD.toFixed(2)}`;
      if (priceToman !== undefined && priceToman > 0) return `$${(priceToman / 60000).toFixed(2)}`;
      return null;
    }
    // Default IRT (Toman)
    const isFa = currentLang === "fa";
    const tomanUnit = isFa ? "تومان" : "Toman";
    if (priceToman !== undefined && priceToman > 0) {
      return `${priceToman.toLocaleString(isFa ? "fa-IR" : "en-US")} ${tomanUnit}`;
    }
    if (priceUSD !== undefined && priceUSD > 0) {
      return `${Math.round(priceUSD * 60000).toLocaleString(isFa ? "fa-IR" : "en-US")} ${tomanUnit}`;
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
    (acc, curr) => ({
      calories: acc.calories + curr.caloriesTotal,
      protein: acc.protein + curr.proteinTotal,
      carbs: acc.carbs + curr.carbsTotal,
      fat: acc.fat + curr.fatTotal,
      sodium: acc.sodium + curr.sodiumTotal,
      costTomanTotal: acc.costTomanTotal + (curr.priceToman || 0),
      costUSDTotal: Number((acc.costUSDTotal + (curr.priceUSD || 0)).toFixed(2))
    }),
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

  return (
    <AndroidFrame dir={currentLang === "fa" ? "rtl" : "ltr"}>
      <div className="min-h-screen w-full flex flex-col bg-[#F8F5F2]" dir={currentLang === "fa" ? "rtl" : "ltr"}>
        {/* RESPONSIVE TOP HEADER */}
        <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-[#E5DCC5] shadow-xs shrink-0 select-none">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex justify-between items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-[#7D8F69] rounded-xl flex items-center justify-center shadow-xs">
                <Apple className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-extrabold text-[#4A5D4E] tracking-tight leading-none">NutriScan</h1>
                <span className="text-[10px] text-[#8C8279] font-bold uppercase tracking-[0.08em] leading-none block mt-1">{t.appSubtitle}</span>
              </div>
            </div>

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center gap-1.5 bg-[#F8F5F2] p-1 rounded-xl border border-[#E5DCC5]">
              <button
                onClick={() => setActiveTab("scan")}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  activeTab === "scan"
                    ? "bg-white text-[#4A5D4E] shadow-xs border border-[#E5DCC5]"
                    : "text-[#8C8279] hover:text-[#2D3033]"
                }`}
              >
                <Camera className="w-4 h-4" />
                <span>{t.scanner}</span>
              </button>

              <button
                onClick={() => setActiveTab("diary")}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  activeTab === "diary"
                    ? "bg-white text-[#4A5D4E] shadow-xs border border-[#E5DCC5]"
                    : "text-[#8C8279] hover:text-[#2D3033]"
                }`}
              >
                <BookOpen className="w-4 h-4" />
                <span>{t.diary}</span>
                {diaryItems.length > 0 && (
                  <span className="mx-1 px-1.5 py-0.2 bg-[#7D8F69]/15 text-[#4A5D4E] text-[10px] rounded-full font-mono">
                    {diaryItems.length}
                  </span>
                )}
              </button>

              <button
                onClick={() => setActiveTab("profile")}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  activeTab === "profile"
                    ? "bg-white text-[#4A5D4E] shadow-xs border border-[#E5DCC5]"
                    : "text-[#8C8279] hover:text-[#2D3033]"
                }`}
              >
                <Sliders className="w-4 h-4" />
                <span>{t.goals}</span>
              </button>
            </nav>

            {/* Header Utilities: Language toggle & Calorie counter */}
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Quick language toggle */}
              <button
                onClick={() => saveProfile({ ...userProfile, language: currentLang === "en" ? "fa" : "en" })}
                className="px-2.5 py-1.5 bg-[#F8F5F2] hover:bg-[#E5DCC5]/40 text-[#4A5D4E] border border-[#E5DCC5] rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5"
                title={t.switchLanguage}
              >
                <Globe className="w-3.5 h-3.5 text-[#7D8F69]" />
                <span className="font-mono text-[11px]">{currentLang === "en" ? "فارسی" : "EN"}</span>
              </button>

              {/* Small Calorie Counter Bubble */}
              <div 
                onClick={() => setActiveTab("diary")}
                className="flex items-center gap-2 bg-[#F8F5F2] hover:bg-[#E5DCC5]/50 active:scale-95 transition-all border border-[#E5DCC5] px-3 py-1.5 rounded-full cursor-pointer shadow-2xs"
                title={t.dailyCalorieIntake}
              >
                <Flame className="w-3.5 h-3.5 text-[#C97D60] fill-[#C97D60]/20" />
                <span className="text-xs font-bold text-[#2D3033] font-mono">
                  {dailyTotals.calories} <span className="text-[10px] font-normal text-[#8C8279] font-sans">/ {userProfile.calorieGoal} {t.kcalUnit}</span>
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* VIEW CONTAINER */}
        <div className="flex-1 bg-[#F8F5F2] relative flex flex-col pb-20 md:pb-8">
        
        {/* TAB 1: CALORIE SCANNER & WORLD FOOD LANDING */}
        {activeTab === "scan" && (() => {
          const todayIndex = new Date().getDay() % WORLD_FOODS.length;
          const rawFoodOfTheDay = WORLD_FOODS[todayIndex];
          const foodOfTheDay = getLocalizedWorldFood(rawFoodOfTheDay, currentLang);

          return (
            <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 flex-1 flex flex-col animate-[fadeIn_0.25s_ease-out] relative">
              
              {/* BEAUTIFUL PROCESSING LOADING STATE */}
              {isScanning && (
                <div className="fixed inset-0 bg-[#F8F5F2]/95 backdrop-blur-md z-40 flex flex-col items-center justify-center p-6 text-center animate-[fadeIn_0.2s_ease-out]">
                  {/* Outer Pulsing Aura */}
                  <div className="relative w-32 h-32 flex items-center justify-center mb-6">
                    <div className="absolute inset-0 rounded-full bg-[#7D8F69]/10 animate-[ping_2s_infinite] opacity-60" />
                    <div className="absolute -inset-2 rounded-full border-2 border-dashed border-[#7D8F69]/25 animate-[spin_12s_linear_infinite]" />
                    <div className="absolute inset-2 rounded-full border border-[#7D8F69]/40 animate-[spin_8s_linear_infinite_reverse]" />
                    
                    <div className="w-20 h-20 bg-white border border-[#E5DCC5] rounded-full flex items-center justify-center shadow-lg relative">
                      <Sparkles className="w-9 h-9 text-[#7D8F69] animate-pulse" />
                    </div>
                  </div>

                  <h3 className="text-base font-extrabold text-[#2D3033]">
                    {t.processingLabel}
                  </h3>
                  
                  {/* Dynamic subtitle changer */}
                  <p className="text-xs text-[#8C8279] mt-2.5 max-w-[240px] h-8 leading-relaxed font-medium">
                    {getLoaderMessage()}
                  </p>

                  {/* Elegant loading progress line */}
                  <div className="w-48 bg-slate-200 h-1.5 rounded-full overflow-hidden mt-6 shadow-inner relative">
                    <div className="h-full bg-[#7D8F69] rounded-full w-24 absolute left-0 top-0 animate-loading-progress" />
                  </div>

                  {/* Animated micro facts label list */}
                  <div className="mt-8 flex flex-wrap gap-2 justify-center max-w-[280px]">
                    <span className="text-[9px] font-bold uppercase tracking-wider bg-white border border-[#E5DCC5] px-2.5 py-1 rounded-full text-[#7D8F69] flex items-center gap-1.5 shadow-2xs">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#7D8F69] animate-ping" />
                      {t.ocrVision}
                    </span>
                    <span className="text-[9px] font-bold uppercase tracking-wider bg-white border border-[#E5DCC5] px-2.5 py-1 rounded-full text-[#7D8F69] flex items-center gap-1.5 shadow-2xs">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#7D8F69]" />
                      {t.geminiApi}
                    </span>
                    <span className="text-[9px] font-bold uppercase tracking-wider bg-white border border-[#E5DCC5] px-2.5 py-1 rounded-full text-[#8C8279] shadow-2xs">
                      {t.extractMacros}
                    </span>
                  </div>
                </div>
              )}

              {/* RESPONSIVE 2-COLUMN GRID ON DESKTOP */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                
                {/* LEFT COLUMN: SCANNER / LAUNCHER / FOOD OF THE DAY */}
                <div className="lg:col-span-5 space-y-4">
                  {/* LENS SCANNER CONTAINER (ACTIVE CAMERA VIEW) */}
                  {useRealCamera ? (
                    <div className="relative bg-slate-950 aspect-[4/3] w-full rounded-2xl flex-col overflow-hidden flex items-center justify-center border border-[#E5DCC5] shadow-sm">
                      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60 z-10 pointer-events-none" />
                      <video
                        ref={videoRef}
                        autoPlay
                        playsInline
                        className="w-full h-full object-cover"
                      />
                      {isScanning && (
                        <div className="absolute inset-x-0 h-1 bg-[#7D8F69] shadow-[0_0_15px_#7D8F69] z-20 animate-[bounce_2s_infinite] opacity-80" />
                      )}
                      <div className="absolute w-[240px] h-[190px] pointer-events-none z-20">
                        <div className="absolute top-0 left-0 w-6 h-6 border-t-4 border-l-4 border-[#7D8F69] rounded-tl-md" />
                        <div className="absolute top-0 right-0 w-6 h-6 border-t-4 border-r-4 border-[#7D8F69] rounded-tr-md" />
                        <div className="absolute bottom-0 left-0 w-6 h-6 border-b-4 border-l-4 border-[#7D8F69] rounded-bl-md" />
                        <div className="absolute bottom-0 right-0 w-6 h-6 border-b-4 border-r-4 border-[#7D8F69] rounded-br-md" />
                      </div>
                      <div className="absolute bottom-3 left-0 right-0 text-center z-20 flex flex-col items-center gap-2">
                        <span className="bg-black/60 text-white/90 text-[10px] font-bold px-3 py-1 rounded-full backdrop-blur-md border border-white/10 tracking-wider uppercase">
                          {isScanning ? t.processingLabel : t.alignLabelBracket}
                        </span>
                        <div className="flex gap-2">
                          <button
                            onClick={captureSnapshot}
                            disabled={isScanning}
                            className="px-4 py-2 bg-[#7D8F69] text-white text-xs font-bold rounded-lg shadow-sm hover:bg-[#6c7c5b] active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer"
                          >
                            <Camera className="w-3.5 h-3.5" />
                            {t.captureSnapshot}
                          </button>
                          <button
                            onClick={stopCamera}
                            className="px-4 py-2 bg-slate-800 text-white text-xs font-bold rounded-lg shadow-sm hover:bg-slate-700 active:scale-95 transition-all cursor-pointer"
                          >
                            {t.cancel}
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    /* INACTIVE CAMERA: COMPACT BEAUTIFUL LAUNCHER CARD */
                    <div className="bg-white rounded-2xl border border-[#E5DCC5] p-5 shadow-sm flex flex-col gap-3 relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-[#7D8F69]/5 rounded-full blur-2xl -mr-8 -mt-8 pointer-events-none" />
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 bg-[#7D8F69]/10 rounded-xl flex items-center justify-center text-[#7D8F69] shrink-0">
                          <Camera className="w-5 h-5" />
                        </div>
                        <div>
                          <h3 className="text-sm font-extrabold text-[#2D3033]">{t.scanNutritionLabel}</h3>
                          <p className="text-xs text-[#8C8279] mt-0.5 leading-relaxed">
                            {t.snapPhotoDesc}
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2 mt-1">
                        <button
                          onClick={startCamera}
                          className="py-2.5 bg-[#7D8F69] text-white hover:bg-[#6c7c5b] text-xs font-bold rounded-xl transition-all shadow-sm active:scale-[0.97] flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          <Camera className="w-3.5 h-3.5" />
                          <span>{t.startCamera}</span>
                        </button>

                        <label className="py-2.5 bg-[#F8F5F2] hover:bg-[#E5DCC5]/40 text-[#2D3033] border border-[#E5DCC5] text-xs font-bold rounded-xl transition-all active:scale-[0.97] cursor-pointer flex items-center justify-center gap-1.5">
                          <Upload className="w-3.5 h-3.5 text-[#8C8279]" />
                          <span>{t.uploadPhoto}</span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleFileUpload}
                            className="hidden"
                          />
                        </label>
                      </div>
                    </div>
                  )}

                  {/* ERROR DISPLAY */}
                  {scanError && (
                    <div className="p-3 bg-red-50 border border-red-200 rounded-xl flex items-start gap-2 text-xs text-red-800">
                      <AlertTriangle className="w-4 h-4 shrink-0 text-red-600 mt-0.5" />
                      <div>
                        <p className="font-bold">{t.scanIssueDetected}</p>
                        <p className="opacity-90 mt-0.5">{scanError}</p>
                      </div>
                    </div>
                  )}

                  {/* FOOD OF THE DAY (HERO CARD) */}
                  <div className="bg-white rounded-2xl border border-[#E5DCC5] shadow-sm overflow-hidden flex flex-col">
                <div className="bg-[#7D8F69]/10 px-4 py-2.5 border-b border-[#E5DCC5]/40 flex justify-between items-center">
                  <div className="flex items-center gap-1.5 text-[#4A5D4E] font-extrabold text-[10px] uppercase tracking-wider">
                    <Sparkles className="w-3.5 h-3.5 text-[#7D8F69]" />
                    <span>{t.foodOfTheDay}</span>
                  </div>
                  <span className="text-[9px] font-bold text-white bg-[#7D8F69] px-2 py-0.5 rounded-full uppercase tracking-widest font-mono">
                    {t.globalSpec}
                  </span>
                </div>

                <div className="p-4 flex flex-col gap-3">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3">
                      <span className="text-3xl select-none" role="img" aria-label={foodOfTheDay.name}>
                        {foodOfTheDay.emoji}
                      </span>
                      <div>
                        <h4 className="text-base font-extrabold text-[#2D3033]">
                          {foodOfTheDay.name}
                        </h4>
                        {foodOfTheDay.nativeName && foodOfTheDay.nativeName !== foodOfTheDay.name && (
                          <p className="text-[11px] font-bold text-[#7D8F69] font-sans">
                            {foodOfTheDay.nativeName}
                          </p>
                        )}
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <span className="text-[10px] text-[#8C8279] font-bold uppercase tracking-wider">
                            🌍 {foodOfTheDay.origin} • {foodOfTheDay.regionFa && currentLang === "fa" ? foodOfTheDay.regionFa : foodOfTheDay.region}
                          </span>
                          <span className="text-[9px] bg-amber-50 text-amber-800 border border-amber-200 px-1.5 py-0.5 rounded font-bold">
                            🍽️ {t.dish}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="text-right flex flex-col items-end gap-1">
                      <div className="inline-block bg-[#F8F5F2] border border-[#E5DCC5] px-2 py-1 rounded-lg">
                        <p className="text-[8px] font-bold text-[#8C8279] uppercase leading-none">{t.calorieEstimate}</p>
                        <p className="text-sm font-black font-mono text-[#C97D60] leading-none mt-1">
                          {foodOfTheDay.calories} <span className="text-[9px] font-normal text-[#2D3033] font-sans">{t.kcalUnit}</span>
                        </p>
                      </div>
                      {formatPrice(foodOfTheDay.priceToman, foodOfTheDay.priceUSD) && (
                        <div className="inline-flex items-center gap-1 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-lg text-[10px] font-extrabold text-emerald-800 font-mono">
                          <Coins className="w-3 h-3 text-emerald-600" />
                          <span>{formatPrice(foodOfTheDay.priceToman, foodOfTheDay.priceUSD)}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <p className="text-xs text-[#2D3033] leading-relaxed italic">
                    "{foodOfTheDay.description}"
                  </p>

                  <div className="p-3 bg-[#F8F5F2] rounded-xl border border-[#E5DCC5]/60 flex items-start gap-2.5">
                    <Info className="w-4 h-4 text-[#7D8F69] shrink-0 mt-0.5" />
                    <p className="text-[11px] text-[#4A5D4E] leading-relaxed">
                      {foodOfTheDay.funFact}
                    </p>
                  </div>

                  {/* Micro Nutrients Line */}
                  <div className="grid grid-cols-4 gap-2 border-t border-b border-[#F8F5F2] py-2.5 text-center">
                    <div>
                      <p className="text-[8px] font-bold text-[#8C8279] uppercase">{t.protein}</p>
                      <p className="text-xs font-bold font-mono text-[#7D8F69] mt-0.5">{foodOfTheDay.protein}{t.gramUnit}</p>
                    </div>
                    <div>
                      <p className="text-[8px] font-bold text-[#8C8279] uppercase">{t.carbs}</p>
                      <p className="text-xs font-bold font-mono text-[#8C8279] mt-0.5">{foodOfTheDay.carbs}{t.gramUnit}</p>
                    </div>
                    <div>
                      <p className="text-[8px] font-bold text-[#8C8279] uppercase">{t.fat}</p>
                      <p className="text-xs font-bold font-mono text-amber-700 mt-0.5">{foodOfTheDay.fat}{t.gramUnit}</p>
                    </div>
                    <div>
                      <p className="text-[8px] font-bold text-[#8C8279] uppercase">{t.healthScore}</p>
                      <p className="text-xs font-bold font-mono text-emerald-700 mt-0.5">{foodOfTheDay.healthScore}/100</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 mt-1">
                    <button
                      onClick={() => handleSelectWorldFood(rawFoodOfTheDay)}
                      className="py-2 bg-slate-100 hover:bg-slate-200 text-[#2D3033] text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <span>{t.fullNutritionFacts}</span>
                      <ChevronRight className="w-3.5 h-3.5 rtl:rotate-180" />
                    </button>

                    <button
                      onClick={() => {
                        const newItem: FoodLogItem = {
                          id: Math.random().toString(36).substr(2, 9),
                          productName: foodOfTheDay.name,
                          brand: `${foodOfTheDay.nativeName && foodOfTheDay.nativeName !== foodOfTheDay.name ? foodOfTheDay.nativeName + " • " : ""}${t.origin}: ${foodOfTheDay.origin}`,
                          foodType: "dish",
                          cuisine: `${foodOfTheDay.regionFa && currentLang === "fa" ? foodOfTheDay.regionFa : foodOfTheDay.region} (${foodOfTheDay.origin})`,
                          loggedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                          servingsCount: 1,
                          servingSizeText: foodOfTheDay.servingSize,
                          caloriesTotal: foodOfTheDay.calories,
                          proteinTotal: foodOfTheDay.protein,
                          carbsTotal: foodOfTheDay.carbs,
                          fatTotal: foodOfTheDay.fat,
                          sodiumTotal: foodOfTheDay.sodium,
                          priceToman: foodOfTheDay.priceToman,
                          priceUSD: foodOfTheDay.priceUSD
                        };
                        saveDiary([newItem, ...diaryItems]);
                        setActiveTab("diary");
                      }}
                      className="py-2 bg-[#2D3033] hover:bg-slate-800 text-white text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1 shadow-sm active:scale-[0.98] cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>{t.logToDiary}</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN: FOODS AROUND THE WORLD GRID */}
                <div className="lg:col-span-7 bg-white rounded-2xl border border-[#E5DCC5] p-4 sm:p-5 shadow-sm flex flex-col">
                  <div className="flex items-center justify-between gap-2 mb-3.5 pb-2.5 border-b border-[#F8F5F2]">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 bg-[#7D8F69]/10 rounded-lg flex items-center justify-center text-[#7D8F69]">
                        <Globe className="w-4 h-4" />
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-[#2D3033] leading-none">{t.foodsAroundWorld}</h3>
                        <span className="text-[10px] text-[#8C8279] font-medium mt-0.5 block">{t.globalRecipesSubtitle}</span>
                      </div>
                    </div>
                    <span className="text-[10px] font-mono font-bold text-[#7D8F69] bg-[#7D8F69]/10 px-2 py-0.5 rounded-full">
                      {WORLD_FOODS.length} {t.dishesCount}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {WORLD_FOODS.map((rawFood) => {
                      const food = getLocalizedWorldFood(rawFood, currentLang);
                      return (
                        <button
                          key={food.id}
                          onClick={() => handleSelectWorldFood(rawFood)}
                          className="bg-[#F8F5F2]/50 hover:bg-white hover:border-[#7D8F69]/60 border border-[#E5DCC5]/70 p-3.5 rounded-xl transition-all text-start flex items-center justify-between shadow-2xs group cursor-pointer hover:shadow-sm"
                        >
                          <div className="flex items-center gap-3 min-w-0 pr-2">
                            <span className="text-2xl select-none shrink-0" role="img" aria-label={food.name}>
                              {food.emoji}
                            </span>
                            <div className="min-w-0">
                              <p className="text-xs font-bold text-[#2D3033] group-hover:text-[#7D8F69] transition-colors leading-snug truncate">
                                {food.name}
                              </p>
                              {food.nativeName && food.nativeName !== food.name && (
                                <p className="text-[10px] font-medium text-[#7D8F69] truncate">
                                  {food.nativeName}
                                </p>
                              )}
                              <p className="text-[10px] text-[#8C8279] mt-0.5 truncate">
                                {food.origin} • {food.servingSize}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 shrink-0">
                            <div className="text-right flex flex-col items-end gap-0.5">
                              <p className="text-xs font-bold font-mono text-[#C97D60]">{food.calories} {t.kcalUnit}</p>
                              {formatPrice(food.priceToman, food.priceUSD) && (
                                <span className="text-[9px] font-extrabold font-mono text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-100">
                                  {formatPrice(food.priceToman, food.priceUSD)}
                                </span>
                              )}
                              <span className="text-[8px] font-bold text-[#7D8F69] bg-[#7D8F69]/10 px-1.5 py-0.2 rounded">
                                {t.score} {food.healthScore}
                              </span>
                            </div>
                            <ChevronRight className="w-4 h-4 text-[#8C8279]/50 group-hover:text-[#7D8F69] transition-colors rtl:rotate-180" />
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

              </div>

              {/* FLOATING ACTION PREVIEW BANNER IF SCANNED LABELS EXIST */}
              {scannedResult && !showResultDetail && (
                <div className="fixed bottom-20 md:bottom-6 right-4 left-4 sm:left-auto sm:right-6 sm:w-96 p-3.5 bg-white border border-[#E5DCC5] rounded-2xl flex items-center justify-between shadow-xl z-30 animate-[slideUp_0.2s_ease-out] gap-3">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-8 h-8 rounded-lg bg-[#7D8F69]/10 flex items-center justify-center text-[#7D8F69] shrink-0">
                      <FileText className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-[#2D3033] truncate">{scannedResult.productName}</p>
                      <p className="text-[10px] text-[#8C8279]">{scannedResult.calories} {t.kcalPerServing}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      onClick={() => setShowResultDetail(true)}
                      className="px-3 py-1.5 bg-[#2D3033] text-white text-[11px] font-bold rounded-lg hover:bg-slate-800 transition-all active:scale-95 cursor-pointer"
                    >
                      {t.viewDetails}
                    </button>
                    <button
                      onClick={() => setScannedResult(null)}
                      className="w-7 h-7 bg-[#F8F5F2] hover:bg-slate-200 border border-[#E5DCC5]/60 text-[#8C8279] hover:text-[#2D3033] rounded-lg flex items-center justify-center transition-all cursor-pointer active:scale-90"
                      title={currentLang === "fa" ? "بستن" : "Close"}
                      aria-label={currentLang === "fa" ? "بستن" : "Close"}
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })()}

        {/* TAB 2: DAILY FOOD DIARY */}
        {activeTab === "diary" && (
          <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 flex-1 flex flex-col animate-[fadeIn_0.25s_ease-out]">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* LEFT COLUMN: DAILY NUTRITION DASHBOARD & BUDGET */}
            <div className="lg:col-span-5 bg-white rounded-2xl border border-[#E5DCC5] p-5 shadow-sm space-y-4">
              <span className="text-[10px] font-extrabold text-[#8C8279] uppercase tracking-wider block">
                {t.todaysIntake}
              </span>
 
              {/* Progress Summary Section */}
              <div className="grid grid-cols-12 gap-4 items-center mb-4 pb-4 border-b border-[#F8F5F2]">
                {/* Calories Ring */}
                <div className="col-span-5 flex flex-col items-center justify-center relative">
                  <div className="relative w-24 h-24 flex items-center justify-center">
                    {/* SVG Progress Circle */}
                    <svg className="w-full h-full transform -rotate-90">
                      <circle
                        cx="48"
                        cy="48"
                        r="40"
                        className="stroke-[#F8F5F2]"
                        strokeWidth="8"
                        fill="transparent"
                      />
                      <circle
                        cx="48"
                        cy="48"
                        r="40"
                        className="stroke-[#7D8F69] transition-all duration-500"
                        strokeWidth="8"
                        fill="transparent"
                        strokeDasharray={`${2 * Math.PI * 40}`}
                        strokeDashoffset={`${2 * Math.PI * 40 * (1 - calPercent / 100)}`}
                        strokeLinecap="round"
                      />
                    </svg>
                    {/* Center Info */}
                    <div className="absolute flex flex-col items-center justify-center text-center">
                      <span className="text-xl font-extrabold text-[#2D3033] leading-none">
                        {dailyTotals.calories}
                      </span>
                      <span className="text-[9px] text-[#8C8279] uppercase font-bold tracking-wider mt-0.5">
                        / {userProfile.calorieGoal} {t.kcalUnit}
                      </span>
                    </div>
                  </div>
                </div>
 
                {/* Macro percentages */}
                <div className="col-span-7 space-y-2.5">
                  <div>
                    <div className="flex justify-between text-[11px] font-bold text-[#2D3033] mb-0.5">
                      <span>{t.protein} ({Math.round(dailyTotals.protein)}{t.gramUnit})</span>
                      <span>{proteinPercent}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-[#F8F5F2] rounded-full overflow-hidden">
                      <div className="h-full bg-[#7D8F69] rounded-full" style={{ width: `${proteinPercent}%` }} />
                    </div>
                  </div>
 
                  <div>
                    <div className="flex justify-between text-[11px] font-bold text-[#2D3033] mb-0.5">
                      <span>{t.carbs} ({Math.round(dailyTotals.carbs)}{t.gramUnit})</span>
                      <span>{carbsPercent}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-[#F8F5F2] rounded-full overflow-hidden">
                      <div className="h-full bg-[#E5DCC5] rounded-full" style={{ width: `${carbsPercent}%` }} />
                    </div>
                  </div>
 
                  <div>
                    <div className="flex justify-between text-[11px] font-bold text-[#2D3033] mb-0.5">
                      <span>{t.fat} ({Math.round(dailyTotals.fat)}{t.gramUnit})</span>
                      <span>{fatPercent}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-[#F8F5F2] rounded-full overflow-hidden">
                      <div className="h-full bg-[#C97D60] rounded-full" style={{ width: `${fatPercent}%` }} />
                    </div>
                  </div>
                </div>
              </div>
 
              {/* Extra Health Limit Warners (e.g. Sodium) */}
              <div className="bg-[#F8F5F2] px-3.5 py-2.5 rounded-xl border border-[#E5DCC5] flex items-center justify-between text-[11px]">
                <div className="flex items-center gap-1.5 text-[#2D3033] font-bold">
                  <Info className="w-3.5 h-3.5 text-[#8C8279]" />
                  <span>{t.sodium}:</span>
                  <span className="font-mono text-xs">{dailyTotals.sodium} {t.mgUnit}</span>
                  <span className="text-[#8C8279] font-normal">/ {userProfile.sodiumGoal} {t.mgUnit}</span>
                </div>
                <span className={`px-2 py-0.5 rounded font-black text-[9px] uppercase ${
                  sodiumPercent > 90 
                    ? "bg-red-100 text-red-700" 
                    : sodiumPercent > 60 
                      ? "bg-amber-100 text-amber-700" 
                      : "bg-emerald-100 text-emerald-700"
                }`}>
                  {sodiumPercent > 100 
                    ? t.limitExceeded 
                    : `${sodiumPercent}% ${t.maxLimit}`}
                </span>
              </div>

              {/* DAILY FOOD EXPENSE & MEAL BUDGET TRACKER */}
              <div className="mt-3 pt-3 border-t border-[#F8F5F2]">
                <div className="flex justify-between items-center text-xs mb-1.5">
                  <div className="flex items-center gap-1.5 font-bold text-[#2D3033]">
                    <Coins className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{t.estimatedFoodSpend}</span>
                  </div>
                  <div className="text-right">
                    <span className="font-black font-mono text-emerald-700 text-xs">
                      {formatPrice(dailyTotals.costTomanTotal, dailyTotals.costUSDTotal) || (currentLang === "fa" ? "۰ تومان" : "$0.00")}
                    </span>
                    <span className="text-[10px] text-[#8C8279] font-medium ml-1">
                      / {formatPrice(userProfile.dailyBudgetToman, userProfile.dailyBudgetUSD)}
                    </span>
                  </div>
                </div>

                {/* Budget Utilization Bar */}
                {(() => {
                  const targetBudget = userProfile.currency === "USD" 
                    ? (userProfile.dailyBudgetUSD || 7.5) 
                    : (userProfile.dailyBudgetToman || 400000);
                  const currentSpent = userProfile.currency === "USD" 
                    ? dailyTotals.costUSDTotal 
                    : dailyTotals.costTomanTotal;
                  const spendPercent = Math.min(Math.round((currentSpent / targetBudget) * 100), 100);
                  const isOverBudget = currentSpent > targetBudget;

                  return (
                    <div>
                      <div className="w-full h-1.5 bg-[#F8F5F2] rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full transition-all duration-500 ${
                            isOverBudget ? "bg-red-500" : spendPercent > 80 ? "bg-amber-500" : "bg-emerald-600"
                          }`} 
                          style={{ width: `${spendPercent}%` }} 
                        />
                      </div>
                      <div className="flex justify-between items-center mt-1 text-[9px] text-[#8C8279]">
                        <span>{spendPercent}% {t.dailyBudgetUtilized}</span>
                        {isOverBudget && (
                          <span className="text-red-600 font-bold">{t.budgetExceeded}</span>
                        )}
                      </div>
                    </div>
                  );
                })()}
              </div>
            </div>
 
            {/* RIGHT COLUMN: LOGGED FOOD DIARY LIST */}
            <div className="lg:col-span-7 bg-white rounded-2xl border border-[#E5DCC5] p-5 flex flex-col shadow-sm">
              <div className="flex justify-between items-center mb-3.5 pb-2.5 border-b border-[#F8F5F2]">
                <span className="text-[10px] font-extrabold text-[#8C8279] uppercase tracking-wider">
                  {t.todaysMeals} ({diaryItems.length})
                </span>
                {diaryItems.length > 0 && (
                  <button
                    onClick={handleClearLogs}
                    className="text-[10px] text-[#C97D60] hover:underline font-extrabold uppercase tracking-wider cursor-pointer"
                  >
                    {t.clearAll}
                  </button>
                )}
              </div>
 
              {diaryItems.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center text-center p-6 text-slate-400">
                  <BookOpen className="w-10 h-10 text-[#E5DCC5] mb-2" />
                  <p className="text-sm font-bold text-[#2D3033]">{t.diaryEmpty}</p>
                  <p className="text-xs text-[#8C8279] max-w-[200px] mt-1">
                    {currentLang === "fa" 
                      ? "برای اسکن برچسب مواد غذایی و ثبت کالری، به برگه اسکنر بروید." 
                      : "Head over to the scanner tab to scan a food label and register calories."}
                  </p>
                  <button
                    onClick={() => setActiveTab("scan")}
                    className="mt-4 px-4 py-2 bg-[#7D8F69] text-white text-xs font-bold rounded-xl shadow-sm hover:bg-[#6c7c5b] cursor-pointer"
                  >
                    {t.emptyDiaryBtn}
                  </button>
                </div>
              ) : (
                <div className="flex-1 overflow-y-auto space-y-2.5 max-h-[420px] pr-0.5">
                  {diaryItems.map((item) => (
                    <div
                      key={item.id}
                      className="group bg-[#F8F5F2] border border-[#E5DCC5]/60 hover:border-[#7D8F69]/50 p-3 rounded-xl flex items-center justify-between gap-3 transition-all"
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-baseline gap-1.5 flex-wrap">
                          <h4 className="text-xs font-extrabold text-[#2D3033] truncate">
                            {item.productName}
                          </h4>
                          {item.foodType && (
                            <span className="text-[8px] font-bold px-1.5 py-0.2 rounded bg-white border border-[#E5DCC5] text-slate-700">
                              {item.foodType === "dish" ? "🍽️ " + t.dish : item.foodType === "beverage" ? "🥤 " + t.beverage : "📦 " + t.packagedFood}
                            </span>
                          )}
                          <span className="text-[9px] text-[#8C8279] shrink-0 font-medium italic">
                            {item.brand && item.brand !== "Unknown" ? item.brand : ""}
                          </span>
                        </div>
                        <p className="text-[10px] text-[#8C8279] mt-0.5 flex items-center gap-1.5">
                          <span>{t.quantity}: {item.servingsCount} × ({item.servingSizeText})</span>
                          <span>•</span>
                          <span>{item.loggedAt}</span>
                          {formatPrice(item.priceToman, item.priceUSD) && (
                            <>
                              <span>•</span>
                              <span className="font-mono font-bold text-emerald-700 bg-emerald-50 px-1 py-0.2 rounded border border-emerald-200">
                                {formatPrice(item.priceToman, item.priceUSD)}
                              </span>
                            </>
                          )}
                        </p>
                        {/* Compact micro-macro tags */}
                        <div className="flex gap-1.5 mt-1.5 text-[9px] font-mono font-medium text-slate-600">
                          <span className="bg-white border border-[#E5DCC5]/30 px-1 py-0.2 rounded text-emerald-800">{t.proteinAbbr} {item.proteinTotal}{t.gramUnit}</span>
                          <span className="bg-white border border-[#E5DCC5]/30 px-1 py-0.2 rounded text-amber-800">{t.carbsAbbr} {item.carbsTotal}{t.gramUnit}</span>
                          <span className="bg-white border border-[#E5DCC5]/30 px-1 py-0.2 rounded text-rose-800">{t.fatAbbr} {item.fatTotal}{t.gramUnit}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2.5">
                        <div className="text-right">
                          <span className="text-sm font-extrabold text-[#C97D60] block leading-none font-mono">
                            {item.caloriesTotal}
                          </span>
                          <span className="text-[9px] text-[#8C8279] uppercase font-bold tracking-wider">
                            {t.kcalUnit}
                          </span>
                        </div>

                        <button
                          onClick={() => handleDeleteLogItem(item.id)}
                          className="w-7 h-7 bg-white hover:bg-red-50 border border-[#E5DCC5]/40 rounded-lg flex items-center justify-center text-red-500 hover:text-red-700 transition-all active:scale-95"
                          title={t.deleteEntry}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            </div>
          </div>
        )}

        {/* TAB 3: USER PROFILE & NUTRITION GOALS */}
        {activeTab === "profile" && (
          <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 flex-1 flex flex-col animate-[fadeIn_0.25s_ease-out]">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              
              {/* LEFT COLUMN: User Identity, Preferences & Language */}
              <div className="lg:col-span-6 space-y-6">
                {/* User Details Form Card */}
                <div className="bg-white p-5 rounded-2xl border border-[#E5DCC5] shadow-sm">
                  <div className="flex items-center gap-3.5 mb-4 pb-4 border-b border-[#F8F5F2]">
                    <div className="w-11 h-11 bg-[#E5DCC5] rounded-full border-2 border-white shadow-sm overflow-hidden flex items-center justify-center">
                      <User className="w-5 h-5 text-[#8C8279]" />
                    </div>
                    <div>
                      <h3 className="text-sm font-extrabold text-[#2D3033]">
                        {userProfile.name}'s {t.healthProfileTitle}
                      </h3>
                      <p className="text-xs text-[#8C8279]">
                        {t.healthProfileDesc}
                      </p>
                    </div>
                  </div>
     
                  {/* Input for name */}
                  <div className="space-y-3.5">
                    <div>
                      <label className="text-[10px] font-extrabold text-[#8C8279] uppercase tracking-wider block mb-1">
                        {t.yourName}
                      </label>
                      <input
                        type="text"
                        value={userProfile.name}
                        onChange={(e) => saveProfile({ ...userProfile, name: e.target.value })}
                        className="w-full text-xs font-bold text-[#2D3033] bg-[#F8F5F2] border border-[#E5DCC5] rounded-xl px-3 py-2.5 focus:outline-none focus:ring-1 focus:ring-[#7D8F69]"
                      />
                    </div>
     
                    {/* Macro Preset Selectors */}
                    <div>
                      <label className="text-[10px] font-extrabold text-[#8C8279] uppercase tracking-wider block mb-2">
                        {t.quickPresets}
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          onClick={() => applyPreset("balanced")}
                          className="px-3 py-2 bg-[#F8F5F2] border border-[#E5DCC5] hover:border-[#7D8F69] rounded-xl text-[10px] font-bold text-[#2D3033] transition-all text-center cursor-pointer"
                        >
                          {t.presetBalanced}
                        </button>
                        <button
                          onClick={() => applyPreset("weight-loss")}
                          className="px-3 py-2 bg-[#F8F5F2] border border-[#E5DCC5] hover:border-[#7D8F69] rounded-xl text-[10px] font-bold text-[#2D3033] transition-all text-center cursor-pointer"
                        >
                          {t.presetLoss}
                        </button>
                        <button
                          onClick={() => applyPreset("muscle")}
                          className="px-3 py-2 bg-[#F8F5F2] border border-[#E5DCC5] hover:border-[#7D8F69] rounded-xl text-[10px] font-bold text-[#2D3033] transition-all text-center cursor-pointer"
                        >
                          {t.presetMuscle}
                        </button>
                        <button
                          onClick={() => applyPreset("keto")}
                          className="px-3 py-2 bg-[#F8F5F2] border border-[#E5DCC5] hover:border-[#7D8F69] rounded-xl text-[10px] font-bold text-[#2D3033] transition-all text-center cursor-pointer"
                        >
                          {t.presetKeto}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Currency & Food Budget Preferences Card */}
                <div className="bg-white p-5 rounded-2xl border border-[#E5DCC5] shadow-sm space-y-4 animate-[fadeIn_0.2s_ease-out]">
                  <div className="flex items-center gap-2">
                    <Coins className="w-4 h-4 text-[#7D8F69]" />
                    <span className="text-[10px] font-extrabold text-[#8C8279] uppercase tracking-wider block">
                      {t.currencyAndBudget}
                    </span>
                  </div>

                  {/* Currency Selector */}
                  <div>
                    <label className="text-[10px] font-extrabold text-[#8C8279] uppercase tracking-wider block mb-1.5">
                      {t.currencyPreference}
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => saveProfile({ ...userProfile, currency: "IRT" })}
                        className={`px-3 py-2 text-xs font-bold rounded-xl border transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                          userProfile.currency !== "USD"
                            ? "bg-[#7D8F69] text-white border-[#7D8F69] shadow-xs scale-[1.02]"
                            : "bg-[#F8F5F2] text-[#2D3033] border-[#E5DCC5] hover:bg-[#E5DCC5]/40"
                        }`}
                      >
                        <span>تومان (IRT)</span>
                      </button>
                      <button
                        onClick={() => saveProfile({ ...userProfile, currency: "USD" })}
                        className={`px-3 py-2 text-xs font-bold rounded-xl border transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                          userProfile.currency === "USD"
                            ? "bg-[#7D8F69] text-white border-[#7D8F69] shadow-xs scale-[1.02]"
                            : "bg-[#F8F5F2] text-[#2D3033] border-[#E5DCC5] hover:bg-[#E5DCC5]/40"
                        }`}
                      >
                        <span>Dollar ($ USD)</span>
                      </button>
                    </div>
                  </div>

                  {/* Daily Meal Budget Slider */}
                  <div>
                    <div className="flex justify-between text-xs font-bold text-[#2D3033] mb-1">
                      <span>{t.dailyBudget}</span>
                      <span className="font-mono text-emerald-700">
                        {userProfile.currency === "USD"
                          ? `$${(userProfile.dailyBudgetUSD || 7.5).toFixed(2)}`
                          : `${(userProfile.dailyBudgetToman || 400000).toLocaleString("fa-IR")} تومان`}
                      </span>
                    </div>
                    {userProfile.currency === "USD" ? (
                      <input
                        type="range"
                        min="2"
                        max="30"
                        step="0.5"
                        value={userProfile.dailyBudgetUSD || 7.5}
                        onChange={(e) => saveProfile({ ...userProfile, dailyBudgetUSD: Number(e.target.value) })}
                        className="w-full accent-[#7D8F69]"
                      />
                    ) : (
                      <input
                        type="range"
                        min="100000"
                        max="1500000"
                        step="25000"
                        value={userProfile.dailyBudgetToman || 400000}
                        onChange={(e) => saveProfile({ ...userProfile, dailyBudgetToman: Number(e.target.value) })}
                        className="w-full accent-[#7D8F69]"
                      />
                    )}
                    <p className="text-[10px] text-[#8C8279] mt-1">
                      {currentLang === "fa" 
                        ? "سقف بودجه روزانه برای مصرف غذا و ردیابی هزینه‌های وعده‌ها" 
                        : "Target daily food expenditure ceiling used for spending progress tracking"}
                    </p>
                  </div>
                </div>

                {/* Language Settings Card */}
                <div className="bg-white p-5 rounded-2xl border border-[#E5DCC5] shadow-sm space-y-3 animate-[fadeIn_0.2s_ease-out]">
                  <div className="flex items-center gap-2">
                    <Globe className="w-4 h-4 text-[#7D8F69]" />
                    <span className="text-[10px] font-extrabold text-[#8C8279] uppercase tracking-wider block">
                      {t.languageSettings}
                    </span>
                  </div>
                  <p className="text-xs text-[#8C8279] leading-relaxed">
                    {t.selectLanguage}
                  </p>
                  
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { code: "en", name: "English" },
                      { code: "fa", name: "فارسی" },
                    ].map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => saveProfile({ ...userProfile, language: lang.code })}
                        className={`px-2 py-2.5 text-xs font-bold rounded-xl border transition-all cursor-pointer ${
                          currentLang === lang.code
                            ? "bg-[#7D8F69] text-white border-[#7D8F69] shadow-xs scale-[1.02]"
                            : "bg-[#F8F5F2] text-[#2D3033] border-[#E5DCC5] hover:bg-[#E5DCC5]/40"
                        }`}
                      >
                        {lang.name}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* RIGHT COLUMN: Daily Nutrient Target sliders */}
              <div className="lg:col-span-6 space-y-6">
                <div className="bg-white p-5 rounded-2xl border border-[#E5DCC5] shadow-sm space-y-4">
                  <span className="text-[10px] font-extrabold text-[#8C8279] uppercase tracking-wider block">
                    {t.adjustCaps}
                  </span>
     
                  {/* Calories limit */}
                  <div>
                    <div className="flex justify-between text-xs font-bold text-[#2D3033] mb-1">
                      <span>{t.calorieCap}</span>
                      <span className="font-mono text-[#C97D60]">{userProfile.calorieGoal} {t.kcalUnit}</span>
                    </div>
                    <input
                      type="range"
                      min="1000"
                      max="4000"
                      step="50"
                      value={userProfile.calorieGoal}
                      onChange={(e) => saveProfile({ ...userProfile, calorieGoal: Number(e.target.value) })}
                      className="w-full accent-[#7D8F69]"
                    />
                  </div>
     
                  {/* Protein limit */}
                  <div>
                    <div className="flex justify-between text-xs font-bold text-[#2D3033] mb-1">
                      <span>{t.proteinTarget}</span>
                      <span className="font-mono text-emerald-700">{userProfile.proteinGoal} {t.gramUnit}</span>
                    </div>
                    <input
                      type="range"
                      min="30"
                      max="200"
                      step="5"
                      value={userProfile.proteinGoal}
                      onChange={(e) => saveProfile({ ...userProfile, proteinGoal: Number(e.target.value) })}
                      className="w-full accent-[#7D8F69]"
                    />
                  </div>
     
                  {/* Carbs limit */}
                  <div>
                    <div className="flex justify-between text-xs font-bold text-[#2D3033] mb-1">
                      <span>{t.carbsTarget}</span>
                      <span className="font-mono text-[#8C8279]">{userProfile.carbsGoal} {t.gramUnit}</span>
                    </div>
                    <input
                      type="range"
                      min="20"
                      max="400"
                      step="10"
                      value={userProfile.carbsGoal}
                      onChange={(e) => saveProfile({ ...userProfile, carbsGoal: Number(e.target.value) })}
                      className="w-full accent-[#7D8F69]"
                    />
                  </div>
     
                  {/* Fat limit */}
                  <div>
                    <div className="flex justify-between text-xs font-bold text-[#2D3033] mb-1">
                      <span>{t.fatTarget}</span>
                      <span className="font-mono text-amber-700">{userProfile.fatGoal} {t.gramUnit}</span>
                    </div>
                    <input
                      type="range"
                      min="20"
                      max="150"
                      step="5"
                      value={userProfile.fatGoal}
                      onChange={(e) => saveProfile({ ...userProfile, fatGoal: Number(e.target.value) })}
                      className="w-full accent-[#7D8F69]"
                    />
                  </div>

                  {/* Sodium limit */}
                  <div>
                    <div className="flex justify-between text-xs font-bold text-[#2D3033] mb-1">
                      <span>{t.sodiumLimit}</span>
                      <span className="font-mono text-red-700">{userProfile.sodiumGoal} {t.mgUnit}</span>
                    </div>
                    <input
                      type="range"
                      min="1000"
                      max="5000"
                      step="100"
                      value={userProfile.sodiumGoal}
                      onChange={(e) => saveProfile({ ...userProfile, sodiumGoal: Number(e.target.value) })}
                      className="w-full accent-[#7D8F69]"
                    />
                  </div>
                </div>
              </div>

            </div>
          </div>
        )}
      </div>

      {/* EXPANDABLE NUTRITIONAL SCAN DETAILS (Bottom Sheet on Mobile / Centered Modal on Desktop) */}
      {scannedResult && showResultDetail && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex flex-col justify-end md:justify-center md:items-center p-0 md:p-6 transition-all animate-[fadeIn_0.2s_ease-out]">
          <div className="w-full md:max-w-2xl max-h-[88vh] bg-white rounded-t-[32px] md:rounded-3xl border border-[#E5DCC5] flex flex-col shadow-2xl overflow-hidden">
            
            {/* Sheet Handle and Title */}
            <div className="px-5 pt-4 pb-3 flex items-center justify-between border-b border-[#F8F5F2] bg-[#F8F5F2]/50 shrink-0">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 bg-[#7D8F69] rounded-full animate-ping-slow" />
                <span className="text-[10px] font-extrabold text-[#8C8279] uppercase tracking-[0.2em]">
                  {t.detectedFoodLabelResult}
                </span>
              </div>
              <button
                onClick={() => setShowResultDetail(false)}
                className="w-7 h-7 bg-white hover:bg-slate-100 border border-[#E5DCC5] rounded-full flex items-center justify-center text-[#2D3033] transition-all"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Scrollable sheet body */}
            <div className="flex-1 overflow-y-auto p-5 space-y-6">
              
              {scannedResult.apiKeyMissingNotice ? (
                <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-2xl flex items-start gap-2.5 text-xs text-rose-900 leading-relaxed">
                  <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-extrabold text-rose-950 uppercase tracking-wider text-[10px] mb-0.5 font-sans">
                      {currentLang === "fa" ? "کلید API یافت نشد (حالت شبیه‌ساز)" : "API Key Missing (Demo Mode)"}
                    </p>
                    <p className="opacity-90">
                      {currentLang === "fa" 
                        ? "متغیر محیطی GEMINI_API_KEY روی سرور تنظیم نشده است. برنامه با موفقیت به حالت شبیه‌ساز منتقل شد. برای فعال‌سازی اسکن واقعی، GEMINI_API_KEY را در تنظیمات ورسل (Vercel Project Settings > Environment Variables) تعریف کنید." 
                        : "The GEMINI_API_KEY environment variable is not configured on your server (e.g., Vercel). The app has gracefully transitioned to Demo Mode with simulated data. To activate real live scanning, please add your GEMINI_API_KEY to your Vercel project's Environment Variables."}
                    </p>
                  </div>
                </div>
              ) : scannedResult.isDemoFallback ? (
                <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-2xl flex items-start gap-2.5 text-xs text-amber-900 leading-relaxed">
                  <Sparkles className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-extrabold text-amber-950 uppercase tracking-wider text-[10px] mb-0.5 font-sans">
                      {currentLang === "fa" ? "حالت آزمایشی شبیه‌ساز" : "Demo Analysis Mode"}
                    </p>
                    <p className="opacity-90">
                      {currentLang === "fa" 
                        ? "موتور پردازش زنده هوش مصنوعی در حال حاضر پر ترافیک است (۵۰۳). برای آزمایش راحت‌تر، اطلاعات پیش‌فرض تغذیه‌ای بارگذاری شد." 
                        : "The live AI scanner is under heavy load (503). We have loaded a high-fidelity visual approximation for testing. Please try again shortly!"}
                    </p>
                  </div>
                </div>
              ) : null}

              {/* Product Header */}
              <div className="flex justify-between items-start gap-3">
                <div>
                  <div className="flex items-center gap-1.5 flex-wrap mb-1">
                    {scannedResult.foodType && (
                      <span className="text-[9px] font-extrabold px-2 py-0.5 rounded-md bg-[#7D8F69]/15 text-[#4A5D4E] border border-[#7D8F69]/30">
                        {scannedResult.foodType === "dish"
                          ? "🍽️ " + t.dish
                          : scannedResult.foodType === "beverage"
                            ? "🥤 " + t.beverage
                            : "📦 " + t.packagedFood}
                      </span>
                    )}
                    {scannedResult.cuisine && (
                      <span className="text-[9px] font-bold px-2 py-0.5 rounded-md bg-amber-50 text-amber-800 border border-amber-200">
                        🌍 {scannedResult.cuisine}
                      </span>
                    )}
                  </div>
                  <h2 className="text-2xl font-extrabold text-[#2D3033] leading-tight">
                    {scannedResult.productName}
                  </h2>
                  <p className="text-xs text-[#8C8279] font-medium mt-1">
                    {t.brand}: <span className="font-bold text-[#2D3033]">{scannedResult.brand || t.unknownBrand}</span>
                  </p>
                  <p className="text-[11px] text-[#8C8279] italic mt-0.5">
                    {t.servingSize}: {scannedResult.servingSize || t.oneContainer}
                  </p>
                </div>

                {/* Overall Health Nutri-Score indicator */}
                <div className="text-right shrink-0">
                  <div className="inline-flex flex-col items-center justify-center p-2 rounded-2xl border bg-[#F8F5F2] border-[#E5DCC5] min-w-16">
                    <span className="text-[9px] font-extrabold text-[#8C8279] uppercase tracking-wide leading-none mb-1">{t.healthScore}</span>
                    <span className="text-2xl font-extrabold font-mono text-[#7D8F69] leading-none">
                      {scannedResult.healthScore}
                    </span>
                    <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded-full mt-1.5 leading-none ${
                      scannedResult.healthRatingLabel.startsWith("A") || scannedResult.healthRatingLabel.startsWith("B")
                        ? "bg-[#7D8F69]/10 text-[#4A5D4E]"
                        : scannedResult.healthRatingLabel.startsWith("C")
                          ? "bg-amber-100 text-amber-800"
                          : "bg-red-50 text-red-700"
                    }`}>
                      {scannedResult.healthRatingLabel.split(" - ")[0]}
                    </span>
                  </div>
                </div>
              </div>

              {/* Interactive Portion/Serving Adjuster */}
              <div className="bg-[#F8F5F2] p-4 rounded-2xl border border-[#E5DCC5] flex items-center justify-between gap-4">
                <div>
                  <span className="text-[10px] font-extrabold text-[#8C8279] uppercase tracking-wider block mb-0.5">{t.portionMultiplier}</span>
                  <p className="text-xs text-[#2D3033] font-bold">
                    {t.adjustPortionDesc}
                  </p>
                </div>

                <div className="flex items-center gap-1.5 bg-white border border-[#E5DCC5] rounded-xl px-2.5 py-1.5 shadow-sm shrink-0">
                  <button
                    onClick={() => setPortionServings(Math.max(0.25, portionServings - 0.25))}
                    className="w-6 h-6 bg-[#F8F5F2] border border-[#E5DCC5] text-sm font-bold text-[#2D3033] rounded-md active:scale-95 transition-all flex items-center justify-center cursor-pointer"
                  >
                    -
                  </button>
                  <span className="text-xs font-mono font-bold text-[#2D3033] min-w-[36px] text-center">
                    {portionServings}x
                  </span>
                  <button
                    onClick={() => setPortionServings(portionServings + 0.25)}
                    className="w-6 h-6 bg-[#F8F5F2] border border-[#E5DCC5] text-sm font-bold text-[#2D3033] rounded-md active:scale-95 transition-all flex items-center justify-center cursor-pointer"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* ESTIMATED PRICE & DISH PREPARATION COST CARD */}
              {scannedResult.estimatedPrice && (
                <div className="bg-gradient-to-br from-emerald-50/70 to-teal-50/40 p-4 rounded-2xl border border-emerald-200/80 shadow-xs space-y-2.5">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-xs">
                        <Coins className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="text-[10px] font-extrabold text-emerald-800 uppercase tracking-wider block">
                          {t.estimatedPrice}
                        </span>
                        <p className="text-[11px] text-emerald-950 font-medium">
                          {portionServings !== 1 ? `${portionServings}x ${t.servings}` : t.perServingPrice}
                        </p>
                      </div>
                    </div>

                    <div className="text-right">
                      <p className="text-xl font-black font-mono text-emerald-800 leading-tight">
                        {userProfile.currency === "USD"
                          ? `$${((scannedResult.estimatedPrice.amountUSD || 0) * portionServings).toFixed(2)}`
                          : `${Math.round((scannedResult.estimatedPrice.amountToman || 0) * portionServings).toLocaleString("fa-IR")} تومان`}
                      </p>
                      <p className="text-[10px] text-emerald-700 font-mono font-bold mt-0.5">
                        {userProfile.currency === "USD"
                          ? `${Math.round((scannedResult.estimatedPrice.amountToman || 0) * portionServings).toLocaleString("fa-IR")} تومان`
                          : `$${((scannedResult.estimatedPrice.amountUSD || 0) * portionServings).toFixed(2)} USD`}
                      </p>
                    </div>
                  </div>

                  {scannedResult.estimatedPrice.disclaimer && (
                    <div className="pt-2 border-t border-emerald-200/50 flex items-start gap-1.5 text-[10px] text-emerald-800 leading-relaxed opacity-90">
                      <Info className="w-3.5 h-3.5 shrink-0 mt-0.5 text-emerald-600" />
                      <span>{scannedResult.estimatedPrice.disclaimer}</span>
                    </div>
                  )}
                </div>
              )}

              {/* INGREDIENTS & RAW MATERIAL COST BREAKDOWN TABLE */}
              {scannedResult.ingredientCosts && scannedResult.ingredientCosts.length > 0 && (
                <div className="bg-white border border-[#E5DCC5] rounded-2xl p-4 shadow-xs space-y-3">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <Receipt className="w-4 h-4 text-[#7D8F69]" />
                      <span className="text-[10px] font-extrabold text-[#8C8279] uppercase tracking-wider">
                        {t.ingredientCosts}
                      </span>
                    </div>
                    <span className="text-[10px] font-bold text-[#7D8F69]">
                      {scannedResult.ingredientCosts.length} {t.ingredients}
                    </span>
                  </div>

                  <div className="divide-y divide-[#F8F5F2] border-t border-[#F8F5F2]">
                    {scannedResult.ingredientCosts.map((ing, idx) => (
                      <div key={idx} className="py-2 flex items-center justify-between text-xs">
                        <div className="pr-2">
                          <p className="font-bold text-[#2D3033] leading-snug">{ing.name}</p>
                          {ing.amount && (
                            <p className="text-[10px] text-[#8C8279] mt-0.5 font-medium">{ing.amount}</p>
                          )}
                        </div>
                        <div className="text-right shrink-0">
                          <p className="font-extrabold font-mono text-emerald-700 text-xs">
                            {userProfile.currency === "USD"
                              ? `$${((ing.costUSD || 0) * portionServings).toFixed(2)}`
                              : `${Math.round((ing.costToman || 0) * portionServings).toLocaleString("fa-IR")} تومان`}
                          </p>
                          <p className="text-[9px] text-[#8C8279] font-mono">
                            {userProfile.currency === "USD"
                              ? `${Math.round((ing.costToman || 0) * portionServings).toLocaleString("fa-IR")} T`
                              : `$${((ing.costUSD || 0) * portionServings).toFixed(2)}`}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* CULTURAL CONTEXT & HERITAGE CARD */}
              {scannedResult.culturalNotes && (
                <div className="p-4 bg-[#F8F5F2] border border-[#E5DCC5] rounded-2xl space-y-1.5">
                  <div className="flex items-center gap-1.5 text-amber-900 font-bold text-xs">
                    <Globe className="w-4 h-4 text-[#C97D60]" />
                    <span>{t.culturalNotes}</span>
                  </div>
                  <p className="text-xs text-[#4A5D4E] leading-relaxed italic">
                    "{scannedResult.culturalNotes}"
                  </p>
                </div>
              )}

              {/* Main Nutrients Grid */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-[#F8F5F2] p-3.5 rounded-2xl border border-[#E5DCC5] shadow-sm relative overflow-hidden">
                  <div className="absolute right-2 top-2 text-[#C97D60] opacity-20"><Flame className="w-8 h-8" /></div>
                  <p className="text-[9px] font-extrabold text-[#8C8279] uppercase mb-0.5">{t.totalCalories}</p>
                  <p className="text-2xl font-black text-[#C97D60] font-mono leading-none">
                    {Math.round(scannedResult.calories * portionServings)}
                    <span className="text-xs font-normal text-[#2D3033] font-sans ml-1">{t.kcalUnit}</span>
                  </p>
                </div>

                <div className="bg-[#F8F5F2] p-3.5 rounded-2xl border border-[#E5DCC5] shadow-sm relative overflow-hidden">
                  <div className="absolute right-2 top-2 text-[#7D8F69] opacity-20"><Apple className="w-8 h-8" /></div>
                  <p className="text-[9px] font-extrabold text-[#8C8279] uppercase mb-0.5">{t.protein}</p>
                  <p className="text-2xl font-black text-[#7D8F69] font-mono leading-none">
                    {(scannedResult.protein * portionServings).toFixed(1)}
                    <span className="text-xs font-normal text-[#2D3033] font-sans ml-1">{t.gramUnit}</span>
                  </p>
                </div>

                <div className="bg-[#F8F5F2] p-3.5 rounded-2xl border border-[#E5DCC5] shadow-sm">
                  <p className="text-[9px] font-extrabold text-[#8C8279] uppercase mb-0.5">{t.totalFat}</p>
                  <p className="text-xl font-extrabold text-[#2D3033] font-mono leading-none">
                    {(scannedResult.totalFat * portionServings).toFixed(1)}
                    <span className="text-xs font-normal text-[#8C8279] font-sans ml-1">{t.gramUnit}</span>
                  </p>
                  <div className="mt-1.5 flex gap-2 text-[8px] text-[#8C8279]">
                    <span>{t.satAbbr} {((scannedResult.saturatedFat || 0) * portionServings).toFixed(1)}{t.gramUnit}</span>
                    <span>{t.transAbbr} {((scannedResult.transFat || 0) * portionServings).toFixed(1)}{t.gramUnit}</span>
                  </div>
                </div>

                <div className="bg-[#F8F5F2] p-3.5 rounded-2xl border border-[#E5DCC5] shadow-sm">
                  <p className="text-[9px] font-extrabold text-[#8C8279] uppercase mb-0.5">{t.totalCarbs}</p>
                  <p className="text-xl font-extrabold text-[#2D3033] font-mono leading-none">
                    {(scannedResult.totalCarbohydrate * portionServings).toFixed(1)}
                    <span className="text-xs font-normal text-[#8C8279] font-sans ml-1">{t.gramUnit}</span>
                  </p>
                  <div className="mt-1.5 flex gap-2 text-[8px] text-[#8C8279]">
                    <span>{t.sugarsAbbr} {((scannedResult.totalSugars || 0) * portionServings).toFixed(1)}{t.gramUnit}</span>
                    <span>{t.fiberAbbr} {((scannedResult.dietaryFiber || 0) * portionServings).toFixed(1)}{t.gramUnit}</span>
                  </div>
                </div>
              </div>

              {/* Extra micro facts (Sodium / Cholesterol) */}
              <div className="p-3.5 bg-white border border-[#E5DCC5] rounded-2xl space-y-2 text-xs">
                <div className="flex justify-between items-center py-1 border-b border-[#F8F5F2]">
                  <span className="text-[#8C8279] font-medium">{t.sodiumContent}</span>
                  <span className="font-extrabold text-[#2D3033] font-mono">
                    {Math.round(scannedResult.sodium * portionServings)} {t.mgUnit}
                  </span>
                </div>
                {scannedResult.cholesterol !== undefined && (
                  <div className="flex justify-between items-center py-1 border-b border-[#F8F5F2]">
                    <span className="text-[#8C8279] font-medium">{t.cholesterol}</span>
                    <span className="font-extrabold text-[#2D3033] font-mono">
                      {Math.round((scannedResult.cholesterol || 0) * portionServings)} {t.mgUnit}
                    </span>
                  </div>
                )}
                {scannedResult.addedSugars !== undefined && (
                  <div className="flex justify-between items-center py-1">
                    <span className="text-[#8C8279] font-medium">{t.addedSugars}</span>
                    <span className="font-extrabold text-[#C97D60] font-mono">
                      {((scannedResult.addedSugars || 0) * portionServings).toFixed(1)} {t.gramUnit}
                    </span>
                  </div>
                )}
              </div>

              {/* Vitamins & Minerals Array */}
              {scannedResult.vitamins && scannedResult.vitamins.length > 0 && (
                <div className="space-y-2">
                  <span className="text-[10px] font-extrabold text-[#8C8279] uppercase tracking-wider block">
                    {t.vitaminsMicro}
                  </span>
                  <div className="grid grid-cols-2 gap-2">
                    {scannedResult.vitamins.map((vit, idx) => (
                      <div key={idx} className="bg-[#F8F5F2] border border-[#E5DCC5]/40 px-3 py-1.5 rounded-xl flex justify-between items-center text-xs">
                        <span className="font-bold text-[#4A5D4E]">{vit.name}</span>
                        <div className="text-right">
                          <p className="font-extrabold text-[#2D3033] leading-none text-[11px]">{vit.value}</p>
                          {vit.percentDV !== undefined && (
                            <p className="text-[8px] text-[#8C8279] mt-0.5 font-bold leading-none">{vit.percentDV}% {t.dailyValueAbbr}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Smart Insight AI Summary */}
              <div className="bg-[#7D8F69]/10 p-4 rounded-2xl border border-[#7D8F69]/20">
                <div className="flex items-center gap-1.5 text-[#4A5D4E] font-bold text-xs mb-1">
                  <Sparkles className="w-4 h-4 text-[#7D8F69]" />
                  <span>{t.aiLabelAnalysis}</span>
                </div>
                <p className="text-xs text-[#4A5D4E] leading-relaxed">
                  {scannedResult.summary}
                </p>
              </div>

              {/* Pros & Warnings */}
              <div className="space-y-2">
                {scannedResult.nutritionalHighlights.length > 0 && (
                  <div className="space-y-1">
                    <span className="text-[10px] font-extrabold text-[#8C8279] uppercase tracking-wider block">{t.nutritionalHighlights}</span>
                    <div className="space-y-1">
                      {scannedResult.nutritionalHighlights.map((high, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-xs text-slate-700">
                          <CheckCircle2 className="w-4 h-4 text-[#7D8F69] shrink-0" />
                          <span>{high}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {scannedResult.nutritionalWarnings.length > 0 && (
                  <div className="space-y-1 pt-2">
                    <span className="text-[10px] font-extrabold text-[#8C8279] uppercase tracking-wider block">{t.watchOutFor}</span>
                    <div className="space-y-1">
                      {scannedResult.nutritionalWarnings.map((warn, idx) => (
                        <div key={idx} className="flex items-start gap-2 text-xs text-slate-700">
                          <AlertTriangle className="w-4 h-4 text-[#C97D60] shrink-0 mt-0.5" />
                          <span>{warn}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Ingredients Breakdown */}
              {scannedResult.ingredientsList && scannedResult.ingredientsList.length > 0 && (
                <div className="bg-slate-50 border border-slate-200 p-3.5 rounded-2xl">
                  <span className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider block mb-1.5">
                    {t.extractedIngredients}
                  </span>
                  <p className="text-[11px] text-slate-600 leading-relaxed font-sans">
                    {scannedResult.ingredientsList.join(", ")}
                  </p>
                </div>
              )}
            </div>

            {/* Bottom Action Footer for Modal */}
            <div className="p-4 bg-white border-t border-[#F8F5F2] shrink-0">
              <button
                onClick={handleLogToDiary}
                className="w-full py-4 bg-[#2D3033] hover:bg-slate-800 text-white rounded-2xl font-bold text-sm tracking-wide shadow-md transition-all active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>{t.logPortionBtn}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* BOTTOM NAVIGATION BUTTONS (MOBILE ONLY) */}
      <div className="md:hidden bg-white border-t border-[#E5DCC5] py-2 px-5 flex justify-around items-center shrink-0 shadow-[0_-2px_10px_rgba(0,0,0,0.02)] z-40 fixed bottom-0 inset-x-0 select-none">
        {/* Scanner Tab */}
        <button
          onClick={() => setActiveTab("scan")}
          className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition-all cursor-pointer ${
            activeTab === "scan"
              ? "text-[#7D8F69]"
              : "text-[#8C8279] hover:text-[#2D3033]"
          }`}
        >
          <Camera className={`w-5 h-5 ${activeTab === "scan" ? "stroke-[2.5]" : "stroke-[1.5]"}`} />
          <span className="text-[10px] font-extrabold uppercase tracking-wider">{t.scanner}</span>
        </button>

        {/* Diary Tab */}
        <button
          onClick={() => setActiveTab("diary")}
          className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition-all cursor-pointer ${
            activeTab === "diary"
              ? "text-[#7D8F69]"
              : "text-[#8C8279] hover:text-[#2D3033]"
          }`}
        >
          <BookOpen className={`w-5 h-5 ${activeTab === "diary" ? "stroke-[2.5]" : "stroke-[1.5]"}`} />
          <span className="text-[10px] font-extrabold uppercase tracking-wider">{t.diary}</span>
        </button>

        {/* Profile Tab */}
        <button
          onClick={() => setActiveTab("profile")}
          className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition-all cursor-pointer ${
            activeTab === "profile"
              ? "text-[#7D8F69]"
              : "text-[#8C8279] hover:text-[#2D3033]"
          }`}
        >
          <Sliders className={`w-5 h-5 ${activeTab === "profile" ? "stroke-[2.5]" : "stroke-[1.5]"}`} />
          <span className="text-[10px] font-extrabold uppercase tracking-wider">{t.goals}</span>
        </button>
      </div>
      </div>
    </AndroidFrame>
  );
}
