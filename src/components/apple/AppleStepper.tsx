import React from "react";
import { Minus, Plus } from "lucide-react";
import { Button } from "../ui/button";

interface AppleStepperProps {
  value: number;
  min: number;
  max: number;
  step?: number;
  onChange: (val: number) => void;
  isFa?: boolean;
  ariaLabelMinus?: string;
  ariaLabelPlus?: string;
  className?: string;
}

export const AppleStepper: React.FC<AppleStepperProps> = ({
  value,
  min,
  max,
  step = 1,
  onChange,
  isFa = false,
  ariaLabelMinus = isFa ? "کاهش مقدار" : "Decrease value",
  ariaLabelPlus = isFa ? "افزایش مقدار" : "Increase value",
  className = ""
}) => {
  const canDecrease = value > min;
  const canIncrease = value < max;

  const handleMinus = (e: React.MouseEvent) => {
    e.preventDefault();
    if (canDecrease) {
      onChange(Math.max(min, value - step));
    }
  };

  const handlePlus = (e: React.MouseEvent) => {
    e.preventDefault();
    if (canIncrease) {
      onChange(Math.min(max, value + step));
    }
  };

  return (
    <div className={`inline-flex items-center gap-1.5 shrink-0 ${className}`}>
      <Button
        variant="secondary"
        size="icon"
        onClick={handleMinus}
        disabled={!canDecrease}
        aria-label={ariaLabelMinus}
        className="w-8 h-8 rounded-full"
      >
        <Minus className="w-3.5 h-3.5 stroke-[2.2]" />
      </Button>

      <Button
        variant="secondary"
        size="icon"
        onClick={handlePlus}
        disabled={!canIncrease}
        aria-label={ariaLabelPlus}
        className="w-8 h-8 rounded-full"
      >
        <Plus className="w-3.5 h-3.5 stroke-[2.2]" />
      </Button>
    </div>
  );
};
