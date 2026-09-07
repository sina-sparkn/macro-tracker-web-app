import React from "react";

interface AndroidFrameProps {
  children: React.ReactNode;
  dir?: "rtl" | "ltr";
}

export default function AndroidFrame({ children, dir = "ltr" }: AndroidFrameProps) {
  return (
    <div dir={dir} className="min-h-screen w-full bg-[#08090a] text-[#e0e0e0] console-grid-bg flex flex-col font-sans selection:bg-[#ff3e00] selection:text-[#08090a]">
      {children}
    </div>
  );
}

