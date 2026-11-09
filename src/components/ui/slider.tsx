import * as React from "react";
import * as SliderPrimitive from "@radix-ui/react-slider";
import { cn } from "../../lib/utils";

export type SliderColor = "default" | "calorie" | "protein" | "carbs" | "fat" | "budget";

interface SliderProps
  extends React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root> {
  color?: SliderColor;
}

const Slider = React.forwardRef<
  React.ComponentRef<typeof SliderPrimitive.Root>,
  SliderProps
>(({ className, color = "default", ...props }, ref) => {
  const getRangeColor = () => {
    switch (color) {
      case "protein":
        return "bg-[#0a84ff]";
      case "carbs":
        return "bg-[#ff9f0a]";
      case "fat":
        return "bg-[#ff375f]";
      case "budget":
        return "bg-[#30d158]";
      case "calorie":
      default:
        return "bg-gradient-to-r from-[#ff6947] to-[#ff3b30]";
    }
  };

  return (
    <SliderPrimitive.Root
      ref={ref}
      className={cn(
        "relative flex w-full touch-none select-none items-center py-3",
        className
      )}
      {...props}
    >
      <SliderPrimitive.Track className="relative h-1.5 w-full grow overflow-hidden rounded-full bg-black/[0.06] dark:bg-white/[0.08]">
        <SliderPrimitive.Range className={cn("absolute h-full rounded-full transition-all duration-150", getRangeColor())} />
      </SliderPrimitive.Track>
      <SliderPrimitive.Thumb className="block h-7 w-7 rounded-full border border-black/[0.08] dark:border-white/[0.2] bg-white dark:bg-[#f5f5f7] shadow-[0_2px_8px_rgba(0,0,0,0.16),0_1px_2px_rgba(0,0,0,0.1)] transition-transform duration-150 hover:scale-105 active:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--apple-accent)] focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 cursor-grab active:cursor-grabbing" />
    </SliderPrimitive.Root>
  );
});
Slider.displayName = SliderPrimitive.Root.displayName;

export { Slider };
