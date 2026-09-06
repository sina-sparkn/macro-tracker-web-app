import React from "react";

interface AndroidFrameProps {
  children: React.ReactNode;
  dir?: "rtl" | "ltr";
}

export default function AndroidFrame({ children, dir = "ltr" }: AndroidFrameProps) {
  return (
    <div dir={dir} className="min-h-screen w-full bg-[#111113] text-[#f2efeb] dot-bg flex flex-col font-sans selection:bg-[#d4ff33] selection:text-[#111113]">
      {children}
    </div>
  );
}

