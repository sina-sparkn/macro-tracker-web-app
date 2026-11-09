import React from "react";

interface AndroidFrameProps {
  children: React.ReactNode;
  dir?: "rtl" | "ltr";
}

export default function AndroidFrame({ children, dir = "ltr" }: AndroidFrameProps) {
  return (
    <div
      dir={dir}
      lang={dir === "rtl" ? "fa" : "en"}
      className="min-h-screen w-full bg-[var(--apple-bg)] text-[var(--apple-text-primary)] flex flex-col font-sans transition-colors"
    >
      {children}
    </div>
  );
}
