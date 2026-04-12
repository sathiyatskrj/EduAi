"use client";
import { useEffect, useState } from "react";
import { useApp } from "./AppContext";

export default function AuraBackground() {
  const { theme } = useApp();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  // Colors are dynamic based on the active theme
  const getColors = () => {
    switch (theme) {
      case "nebula":
        return { c1: "rgba(147, 51, 234, 0.4)", c2: "rgba(236, 72, 153, 0.3)", c3: "rgba(79, 70, 229, 0.3)" };
      case "terra":
        return { c1: "rgba(217, 119, 6, 0.4)", c2: "rgba(180, 83, 9, 0.3)", c3: "rgba(153, 27, 27, 0.3)" };
      case "ocean":
      default:
        return { c1: "rgba(13, 148, 136, 0.4)", c2: "rgba(2, 132, 199, 0.3)", c3: "rgba(15, 23, 42, 0.3)" };
    }
  };

  const colors = getColors();

  return (
    <div style={{
      position: "fixed",
      top: 0, left: 0, right: 0, bottom: 0,
      zIndex: -1,
      overflow: "hidden",
      background: "var(--bg-main)",
      transition: "background 0.5s ease"
    }}>
      <div style={{
        position: "absolute",
        top: "-20%", left: "-10%",
        width: "60vw", height: "60vw",
        background: `radial-gradient(circle, ${colors.c1} 0%, transparent 60%)`,
        filter: "blur(80px)",
        animation: "float 15s ease-in-out infinite",
        transition: "all 1s ease"
      }} />
      <div style={{
        position: "absolute",
        bottom: "-20%", right: "-10%",
        width: "70vw", height: "70vw",
        background: `radial-gradient(circle, ${colors.c2} 0%, transparent 60%)`,
        filter: "blur(90px)",
        animation: "float 20s ease-in-out infinite reverse",
        transition: "all 1s ease"
      }} />
      <div style={{
        position: "absolute",
        top: "40%", left: "30%",
        width: "50vw", height: "50vw",
        background: `radial-gradient(circle, ${colors.c3} 0%, transparent 50%)`,
        filter: "blur(100px)",
        animation: "pulseGlow 10s ease-in-out infinite alternate",
        transition: "all 1s ease"
      }} />
    </div>
  );
}
