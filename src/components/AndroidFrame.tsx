import React, { useState, useEffect } from "react";
import { Wifi, Battery, Signal, ShieldCheck, Moon, Sun } from "lucide-react";

interface AndroidFrameProps {
  children: React.ReactNode;
}

export default function AndroidFrame({ children }: AndroidFrameProps) {
  const [time, setTime] = useState("");

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      let hours = now.getHours();
      const minutes = String(now.getMinutes()).padStart(2, "0");
      const ampm = hours >= 12 ? "PM" : "AM";
      hours = hours % 12;
      hours = hours ? hours : 12; // the hour '0' should be '12'
      setTime(`${hours}:${minutes} ${ampm}`);
    };

    updateClock();
    const interval = setInterval(updateClock, 30000); // update every 30s
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-0 md:p-6 font-sans">
      {/* Outer Glow Effect */}
      <div className="absolute inset-0 bg-radial-gradient from-emerald-950/20 via-transparent to-transparent pointer-events-none" />

      {/* Android Device Shell (Simulated Pixel / Galaxy Frame) */}
      <div className="w-full max-w-[430px] h-screen md:h-[880px] bg-slate-900 md:rounded-[48px] md:border-[10px] md:border-slate-800 md:shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9)] flex flex-col overflow-hidden relative md:ring-1 md:ring-slate-700/50">
        
        {/* Android Notch / Punch Hole Camera */}
        <div className="hidden md:block absolute top-3 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-black rounded-full z-50 ring-2 ring-slate-800/80" />

        {/* Status Bar */}
        <div className="bg-slate-950 text-slate-300 px-6 pt-3 pb-2 flex justify-between items-center text-xs font-semibold select-none z-40 relative">
          {/* Time */}
          <div className="flex items-center gap-1.5">
            <span className="font-mono text-[11px] tracking-tight">{time || "10:00 AM"}</span>
          </div>

          {/* Notch Spacer for desktop */}
          <div className="hidden md:block w-12" />

          {/* System Icons */}
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <Signal className="w-3.5 h-3.5" />
            <Wifi className="w-3.5 h-3.5 text-slate-300" />
            <div className="flex items-center gap-1 bg-slate-800 px-1.5 py-0.5 rounded text-[9px] font-mono font-bold text-slate-200">
              <span>85%</span>
              <Battery className="w-3.5 h-3.5 text-emerald-400 fill-emerald-400/20" />
            </div>
          </div>
        </div>

        {/* Main Phone Content Window */}
        <div className="flex-1 overflow-hidden bg-slate-900 flex flex-col relative">
          {children}
        </div>

        {/* Android Virtual Gesture Bottom Bar */}
        <div className="bg-slate-950 py-3 flex justify-center items-center z-40 relative select-none">
          <div className="w-28 h-1 bg-slate-700 rounded-full hover:bg-slate-500 transition-colors cursor-pointer" />
        </div>
      </div>
    </div>
  );
}
