import React from "react";
import { Plus, Utensils } from "lucide-react";
import { FoodLogItem } from "../../types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription
} from "../ui/dialog";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

interface MealDrawerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
  isFa: boolean;
  manualDate: string;
  setManualDate: (v: string) => void;
  manualTime: string;
  setManualTime: (v: string) => void;
  manualProductName: string;
  setManualProductName: (v: string) => void;
  manualBrand: string;
  setManualBrand: (v: string) => void;
  manualCalories: string;
  setManualCalories: (v: string) => void;
  manualProtein: string;
  setManualProtein: (v: string) => void;
  manualCarbs: string;
  setManualCarbs: (v: string) => void;
  manualFat: string;
  setManualFat: (v: string) => void;
  manualSodium: string;
  setManualSodium: (v: string) => void;
  manualServingSize: string;
  setManualServingSize: (v: string) => void;
  manualPriceToman: string;
  setManualPriceToman: (v: string) => void;
}

export const MealDrawerModal: React.FC<MealDrawerModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  isFa,
  manualDate,
  setManualDate,
  manualTime,
  setManualTime,
  manualProductName,
  setManualProductName,
  manualBrand,
  setManualBrand,
  manualCalories,
  setManualCalories,
  manualProtein,
  setManualProtein,
  manualCarbs,
  setManualCarbs,
  manualFat,
  setManualFat,
  manualSodium,
  setManualSodium,
  manualServingSize,
  setManualServingSize,
  manualPriceToman,
  setManualPriceToman
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => { if (!open) onClose(); }}>
      <DialogContent className="max-w-xl max-h-[90dvh] p-0 overflow-hidden flex flex-col rounded-t-[32px] sm:rounded-[28px] border-[var(--apple-border)]">
        {/* Mobile Drag Handle */}
        <div className="w-10 h-1 bg-black/15 dark:bg-white/20 rounded-full mx-auto mt-3 sm:hidden" />

        {/* Modal Header */}
        <DialogHeader className="p-5 sm:p-6 border-b border-[var(--apple-border)] text-start">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-[#ff6947] to-[#ff3b30] flex items-center justify-center text-white shadow-xs">
              <Utensils className="w-4 h-4 stroke-[2.2]" />
            </div>
            <div>
              <DialogTitle className="font-bold text-base sm:text-lg text-[var(--apple-text-primary)]">
                {isFa ? "ثبت وعده در تاریخ دلخواه" : "Record Meal on Custom Date"}
              </DialogTitle>
              <DialogDescription className="text-xs text-[var(--apple-text-secondary)] mt-0.5">
                {isFa ? "ثبت دستی وعده غذایی در تقویم" : "Manually log a past or planned meal"}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {/* Modal Form */}
        <form onSubmit={onSubmit} className="p-5 sm:p-6 overflow-y-auto space-y-4 text-xs">
          {/* Date & Time */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="font-medium text-[var(--apple-text-secondary)] mb-1 block">
                {isFa ? "تاریخ ثبت وعده" : "Date"}
              </label>
              <Input
                type="date"
                required
                value={manualDate}
                onChange={(e) => setManualDate(e.target.value)}
                className="h-11 px-3.5 text-base sm:text-xs rounded-xl"
              />
            </div>
            <div>
              <label className="font-medium text-[var(--apple-text-secondary)] mb-1 block">
                {isFa ? "ساعت مصرف" : "Time"}
              </label>
              <Input
                type="time"
                required
                value={manualTime}
                onChange={(e) => setManualTime(e.target.value)}
                className="h-11 px-3.5 text-base sm:text-xs rounded-xl"
              />
            </div>
          </div>

          {/* Dish Name & Brand */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="font-medium text-[var(--apple-text-secondary)] mb-1 block">
                {isFa ? "نام وعده غذایی *" : "Meal Name *"}
              </label>
              <Input
                type="text"
                required
                value={manualProductName}
                onChange={(e) => setManualProductName(e.target.value)}
                placeholder={isFa ? "مثال: چلو جوجه کباب زعفرانی" : "e.g. Grilled Chicken & Rice"}
                className="h-11 px-3.5 text-base sm:text-xs rounded-xl"
              />
            </div>
            <div>
              <label className="font-medium text-[var(--apple-text-secondary)] mb-1 block">
                {isFa ? "برند یا رستوران" : "Brand / Origin"}
              </label>
              <Input
                type="text"
                value={manualBrand}
                onChange={(e) => setManualBrand(e.target.value)}
                placeholder={isFa ? "مثال: خانگی / رستورانی" : "e.g. Homemade / Restaurant"}
                className="h-11 px-3.5 text-base sm:text-xs rounded-xl"
              />
            </div>
          </div>

          {/* Macros Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            <div>
              <label className="font-medium text-[var(--apple-text-secondary)] mb-1 block">
                {isFa ? "کالری کل *" : "Calories *"}
              </label>
              <Input
                type="number"
                required
                min="0"
                value={manualCalories}
                onChange={(e) => setManualCalories(e.target.value)}
                className="h-11 px-3.5 text-base sm:text-xs font-bold text-[#ff3b30] rounded-xl tabular-nums"
              />
            </div>
            <div>
              <label className="font-medium text-[var(--apple-text-secondary)] mb-1 block">
                {isFa ? "پروتئین (g)" : "Protein (g)"}
              </label>
              <Input
                type="number"
                min="0"
                step="0.1"
                value={manualProtein}
                onChange={(e) => setManualProtein(e.target.value)}
                className="h-11 px-3.5 text-base sm:text-xs font-semibold text-[#0a84ff] rounded-xl tabular-nums"
              />
            </div>
            <div>
              <label className="font-medium text-[var(--apple-text-secondary)] mb-1 block">
                {isFa ? "کربوهیدرات (g)" : "Carbs (g)"}
              </label>
              <Input
                type="number"
                min="0"
                step="0.1"
                value={manualCarbs}
                onChange={(e) => setManualCarbs(e.target.value)}
                className="h-11 px-3.5 text-base sm:text-xs font-semibold text-[#ff9f0a] rounded-xl tabular-nums"
              />
            </div>
            <div>
              <label className="font-medium text-[var(--apple-text-secondary)] mb-1 block">
                {isFa ? "چربی (g)" : "Fat (g)"}
              </label>
              <Input
                type="number"
                min="0"
                step="0.1"
                value={manualFat}
                onChange={(e) => setManualFat(e.target.value)}
                className="h-11 px-3.5 text-base sm:text-xs font-semibold text-[#ff375f] rounded-xl tabular-nums"
              />
            </div>
          </div>

          {/* Secondary Details: Serving Size & Price */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="font-medium text-[var(--apple-text-secondary)] mb-1 block">
                {isFa ? "اندازه سهم" : "Serving Size"}
              </label>
              <Input
                type="text"
                value={manualServingSize}
                onChange={(e) => setManualServingSize(e.target.value)}
                placeholder={isFa ? "مثال: ۱ بشقاب (۳۵۰ گرم)" : "1 plate (350g)"}
                className="h-11 px-3.5 text-base sm:text-xs rounded-xl"
              />
            </div>
            <div>
              <label className="font-medium text-[var(--apple-text-secondary)] mb-1 block">
                {isFa ? "برآورد هزینه (تومان)" : "Estimated Price (Toman)"}
              </label>
              <Input
                type="number"
                min="0"
                step="1000"
                value={manualPriceToman}
                onChange={(e) => setManualPriceToman(e.target.value)}
                className="h-11 px-3.5 text-base sm:text-xs rounded-xl tabular-nums"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="pt-3 border-t border-[var(--apple-border)] flex items-center justify-between gap-3">
            <Button
              variant="secondary"
              type="button"
              onClick={onClose}
              className="px-5 py-3 text-xs sm:text-sm font-medium rounded-full"
            >
              {isFa ? "انصراف" : "Cancel"}
            </Button>
            <Button
              type="submit"
              className="flex-1 py-3 text-xs sm:text-sm font-semibold shadow-md rounded-full"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>{isFa ? "ثبت این وعده در یادداشت" : "Save Meal to Diary"}</span>
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
