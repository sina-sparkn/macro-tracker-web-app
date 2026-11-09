import React, { useState, useRef, useEffect } from "react";
import { formatNumber } from "../../utils/formatters";
import { Edit2 } from "lucide-react";
import { Input } from "../ui/input";

interface AppleEditableValueProps {
  value: number;
  min: number;
  max: number;
  onChange: (val: number) => void;
  isFa?: boolean;
  unit?: string;
  prefix?: string;
  className?: string;
}

export const AppleEditableValue: React.FC<AppleEditableValueProps> = ({
  value,
  min,
  max,
  onChange,
  isFa = false,
  unit = "",
  prefix = "",
  className = ""
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState(String(value));
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isEditing) {
      setDraft(String(value));
    }
  }, [value, isEditing]);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const commit = () => {
    const parsed = Number(draft.replace(/[^0-9.-]/g, ""));
    if (!isNaN(parsed)) {
      const clamped = Math.min(Math.max(parsed, min), max);
      onChange(clamped);
    }
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      commit();
    } else if (e.key === "Escape") {
      setDraft(String(value));
      setIsEditing(false);
    }
  };

  if (isEditing) {
    return (
      <div className={`inline-flex items-center gap-1.5 ${className}`}>
        {prefix && (
          <span className="text-sm font-semibold text-[var(--apple-text-secondary)]">{prefix}</span>
        )}
        <Input
          ref={inputRef}
          type="number"
          inputMode="numeric"
          min={min}
          max={max}
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onBlur={commit}
          onKeyDown={handleKeyDown}
          className="w-24 sm:w-28 h-9 px-2.5 rounded-xl border-2 border-[var(--apple-accent)] text-base font-bold text-center tabular-nums shadow-xs"
        />
        {unit && (
          <span className="text-xs font-medium text-[var(--apple-text-secondary)]">{unit}</span>
        )}
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={() => setIsEditing(true)}
      title={isFa ? "برای ویرایش مستقیم کلیک کنید" : "Click to edit directly"}
      className={`group inline-flex items-baseline gap-1.5 px-2 py-1 -mx-2 -my-1 rounded-xl hover:bg-black/[0.04] dark:hover:bg-white/[0.06] transition-colors cursor-pointer text-start ${className}`}
    >
      {prefix && (
        <span className="text-sm sm:text-base font-semibold text-[var(--apple-text-secondary)]">
          {prefix}
        </span>
      )}
      <span className="text-base sm:text-lg font-bold text-[var(--apple-text-primary)] tabular-nums group-hover:text-[var(--apple-accent)] transition-colors">
        {formatNumber(value, isFa)}
      </span>
      {unit && (
        <span className="text-xs sm:text-sm font-normal text-[var(--apple-text-secondary)]">
          {unit}
        </span>
      )}
      <Edit2 className="w-3 h-3 text-[var(--apple-text-tertiary)] opacity-0 group-hover:opacity-100 transition-opacity self-center ml-0.5" />
    </button>
  );
};
