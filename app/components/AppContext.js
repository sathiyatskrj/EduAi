"use client";
import { createContext, useContext, useState, useEffect } from "react";

const AppContext = createContext();

export function AppProvider({ children }) {
  const [mode, setMode] = useState("simple"); // "simple" | "pro"
  const [offline, setOffline] = useState(false);
  const [aiQueue, setAiQueue] = useState([]); // Offline AI request queue

  // TRIZ: Adaptive UI — load preference from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("eduai-mode");
    if (saved) setMode(saved);

    // TRIZ: Offline detection
    const handleOnline = () => setOffline(false);
    const handleOffline = () => setOffline(true);
    setOffline(!navigator.onLine);
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  const toggleMode = () => {
    const next = mode === "simple" ? "pro" : "simple";
    setMode(next);
    localStorage.setItem("eduai-mode", next);
  };

  // Offline AI Queue: store requests when offline, flush when online
  const queueAIRequest = (payload) => {
    const updated = [...aiQueue, { ...payload, timestamp: Date.now() }];
    setAiQueue(updated);
    localStorage.setItem("eduai-ai-queue", JSON.stringify(updated));
  };

  const flushAIQueue = () => {
    setAiQueue([]);
    localStorage.removeItem("eduai-ai-queue");
  };

  return (
    <AppContext.Provider value={{ mode, toggleMode, offline, aiQueue, queueAIRequest, flushAIQueue }}>
      {/* Offline Banner */}
      {offline && (
        <div style={{
          position: "fixed", top: 0, left: 0, right: 0, zIndex: 9999, padding: "8px 24px",
          background: "linear-gradient(90deg, #EF4444, #F59E0B)", color: "white",
          textAlign: "center", fontSize: 13, fontWeight: 600,
        }}>
          📡 You are offline — Marks entry & saved lesson plans still work. AI features queued for reconnection.
        </div>
      )}
      <div style={{ paddingTop: offline ? 36 : 0 }}>
        {children}
      </div>
    </AppContext.Provider>
  );
}

export function useApp() {
  return useContext(AppContext);
}
