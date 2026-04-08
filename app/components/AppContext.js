"use client";
import { createContext, useContext, useState, useEffect } from "react";

const AppContext = createContext();

export function AppProvider({ children }) {
  const [mode, setMode] = useState("simple"); // "simple" | "pro"
  const [offline, setOffline] = useState(false);
  const [aiQueue, setAiQueue] = useState([]); // Offline AI request queue
  
  // P0 UI/UX: Toast Notification System
  const [toasts, setToasts] = useState([]);

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

  const showToast = (message, type = "success") => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3000);
  };

  return (
    <AppContext.Provider value={{ mode, toggleMode, offline, aiQueue, queueAIRequest, flushAIQueue, showToast }}>
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

      {/* Toast Container */}
      <div style={{
        position: "fixed", bottom: 24, right: 24, zIndex: 10000,
        display: "flex", flexDirection: "column", gap: 10, pointerEvents: "none"
      }}>
        {toasts.map(t => (
          <div key={t.id} className="animate-slide-left card" style={{
            padding: "12px 20px", display: "flex", alignItems: "center", gap: 12, minWidth: 250,
            background: "rgba(15, 23, 42, 0.9)", backdropFilter: "blur(20px)",
            borderLeft: `4px solid ${t.type === "success" ? "var(--success)" : t.type === "error" ? "var(--danger)" : "var(--primary)"}`,
            boxShadow: "0 10px 40px rgba(0,0,0,0.5)"
          }}>
            <span style={{ fontSize: 18 }}>
              {t.type === "success" ? "✅" : t.type === "error" ? "❌" : "ℹ️"}
            </span>
            <span style={{ fontSize: 14, fontWeight: 500 }}>{t.message}</span>
          </div>
        ))}
      </div>
    </AppContext.Provider>
  );
}

export function useApp() {
  return useContext(AppContext);
}
