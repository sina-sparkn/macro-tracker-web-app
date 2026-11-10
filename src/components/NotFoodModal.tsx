import React from "react";
import { UtensilsCrossed, Camera, Info } from "lucide-react";
import { NotFoodState, UserProfile } from "../types";
import { TRANSLATIONS } from "../translations";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription
} from "./ui/dialog";
import { Button } from "./ui/button";

interface NotFoodModalProps {
  isOpen: boolean;
  notFoodState: NotFoodState | null;
  userProfile: UserProfile;
  onClose: () => void;
  onScanAgain?: () => void;
}

export const NotFoodModal: React.FC<NotFoodModalProps> = ({
  isOpen,
  notFoodState,
  userProfile,
  onClose,
  onScanAgain
}) => {
  if (!notFoodState) return null;

  const currentLang = userProfile.language || "fa";
  const isFa = currentLang === "fa";
  const t = TRANSLATIONS[currentLang] || TRANSLATIONS.fa || TRANSLATIONS.en;

  const detectedName = notFoodState.detectedObject &&
    notFoodState.detectedObject !== "Not Food" &&
    notFoodState.detectedObject !== "غیرخوراکی" &&
    notFoodState.detectedObject !== "Not a food item"
      ? notFoodState.detectedObject
      : null;

  const handleScanAgain = () => {
    onClose();
    if (onScanAgain) {
      onScanAgain();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => { if (!open) onClose(); }}>
      <DialogContent
        dir={isFa ? "rtl" : "ltr"}
        className="max-w-md w-[92vw] sm:w-full p-0 overflow-hidden rounded-[28px] border-[var(--apple-border)] bg-[var(--apple-surface)]/95 backdrop-blur-2xl shadow-2xl transition-all"
      >
        <div className="p-6 sm:p-7 flex flex-col items-center text-center gap-4">
          {/* MINIMALIST HERO ICON */}
          <div className="relative flex items-center justify-center">
            <div className="w-14 h-14 rounded-2xl bg-rose-500/10 text-rose-500 dark:text-rose-400 flex items-center justify-center border border-rose-500/20 shadow-xs">
              <UtensilsCrossed className="w-6 h-6 stroke-[2]" />
            </div>
            <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-white flex items-center justify-center text-[10px] font-bold shadow-xs">
              ✕
            </span>
          </div>

          {/* HEADER & BADGE */}
          <DialogHeader className="flex flex-col items-center gap-1.5 p-0 text-center">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
              <span>{t.notFoodBadge || (isFa ? "شیء غیرخوراکی" : "Non-Food Item")}</span>
            </div>

            <DialogTitle className="text-lg sm:text-xl font-bold tracking-tight text-[var(--apple-text-primary)]">
              {isFa ? "ماده غذایی شناسایی نشد" : "No Food Detected"}
            </DialogTitle>

            <DialogDescription className="text-xs sm:text-sm text-[var(--apple-text-secondary)] leading-relaxed max-w-sm mt-0.5">
              {notFoodState.reason || t.notFoodTitle}
            </DialogDescription>
          </DialogHeader>

          {/* MINIMALIST PREVIEW CARD (IF IMAGE AVAILABLE) */}
          {notFoodState.preview && (
            <div className="relative w-full rounded-2xl overflow-hidden border border-[var(--apple-border)] bg-[var(--apple-surface-secondary)]/50 aspect-[16/10] max-h-48 group shadow-inner">
              <img
                src={notFoodState.preview}
                alt={detectedName || "Non-food item"}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent pointer-events-none" />

              {detectedName && (
                <div className="absolute bottom-3 inset-x-3 flex items-center justify-between gap-2 px-3 py-1.5 rounded-xl bg-black/60 backdrop-blur-md border border-white/15 text-white text-xs">
                  <span className="text-white/70 text-[11px] font-normal">
                    {t.detectedObject || (isFa ? "تشخیص:" : "Identified:")}
                  </span>
                  <span className="font-semibold truncate">
                    {detectedName}
                  </span>
                </div>
              )}
            </div>
          )}

          {/* DETECTED OBJECT CHIP (IF NO PREVIEW AVAILABLE) */}
          {!notFoodState.preview && detectedName && (
            <div className="w-full px-3.5 py-2 rounded-xl bg-[var(--apple-surface-secondary)] border border-[var(--apple-border)] flex items-center justify-between text-xs">
              <span className="text-[var(--apple-text-secondary)]">
                {t.detectedObject || (isFa ? "مورد مشاهده‌شده:" : "Detected:")}
              </span>
              <span className="font-semibold text-rose-500 dark:text-rose-400">
                {detectedName}
              </span>
            </div>
          )}

          {/* SUBTLE GUIDANCE MICRO-CARD */}
          <div className="w-full p-3 rounded-2xl bg-[var(--apple-surface-secondary)]/70 border border-[var(--apple-border)] flex items-start gap-2.5 text-[11px] text-[var(--apple-text-secondary)] text-start leading-relaxed">
            <Info className="w-4 h-4 text-[var(--apple-text-tertiary)] shrink-0 mt-0.5" />
            <span>
              {isFa
                ? "نوتریکن برای محاسبه تغذیه غذاها، نوشیدنی‌ها و جداول ارزش غذایی طراحی شده است. لطفاً عکسی از یک ماده خوراکی ثبت کنید."
                : "NutriScan is designed to analyze meals, beverages, edible foods, and nutrition labels. Please photograph an edible item."}
            </span>
          </div>

          {/* ACTIONS */}
          <div className="w-full flex flex-col gap-2 pt-1">
            <Button
              onClick={handleScanAgain}
              className="w-full h-11 rounded-2xl text-xs sm:text-sm font-semibold bg-[var(--apple-text-primary)] text-[var(--apple-surface)] hover:opacity-90 active:scale-[0.98] transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer"
            >
              <Camera className="w-4 h-4 stroke-[2.2]" />
              <span>{isFa ? "ثبت تصویر جدید" : "Take Another Photo"}</span>
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="w-full h-9 rounded-xl text-xs text-[var(--apple-text-secondary)] hover:text-[var(--apple-text-primary)] hover:bg-[var(--apple-surface-secondary)] cursor-pointer"
            >
              <span>{isFa ? "متوجه شدم" : "Dismiss"}</span>
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default NotFoodModal;
