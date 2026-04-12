"use client";
import { createContext, useContext, useState, useEffect, useCallback } from "react";

const AppContext = createContext();

export function AppProvider({ children }) {
  const [mode, setMode] = useState("simple");
  const [offline, setOffline] = useState(false);
  const [aiQueue, setAiQueue] = useState([]);

  // AI Settings
  const [aiProvider, setAiProvider] = useState("gemini");
  const [ollamaModel, setOllamaModel] = useState("gemma2");
  const [localModels, setLocalModels] = useState([]);
  const [isScanning, setIsScanning] = useState(false);

  // Theme
  const [theme, setTheme] = useState("ocean");

  // Board & Language
  const [board, setBoard] = useState("CBSE (NCERT)");
  const [language, setLanguage] = useState("English (IN)");

  // Teacher Profile
  const [teacherProfile, setTeacherProfile] = useState({
    name: "",
    school: "",
    subject: "Mathematics",
    classes: ["VII-A"],
  });

  // AI Usage Counter (daily)
  const [aiUsageCount, setAiUsageCount] = useState(0);
  const [aiUsageDate, setAiUsageDate] = useState("");
  const AI_DAILY_LIMIT = 5;

  // Toast
  const [toasts, setToasts] = useState([]);

  // Notification count (alerts shown on dashboard)
  const [notificationCount] = useState(5);

  // Lesson Persistence
  const [savedLessons, setSavedLessons] = useState([]);

  // ── Load from localStorage ──────────────────────────────
  useEffect(() => {
    // Mode
    const savedMode = localStorage.getItem("eduai-mode");
    if (savedMode) setMode(savedMode);

    // AI
    const savedProvider = localStorage.getItem("eduai-ai-provider");
    if (savedProvider) setAiProvider(savedProvider);
    const savedModel = localStorage.getItem("eduai-ollama-model");
    if (savedModel) setOllamaModel(savedModel);

    // Theme
    const savedTheme = localStorage.getItem("eduai-theme");
    const t = savedTheme || "ocean";
    setTheme(t);
    document.documentElement.setAttribute("data-theme", t);

    // Board & Language
    const savedBoard = localStorage.getItem("eduai-board");
    if (savedBoard) setBoard(savedBoard);
    const savedLang = localStorage.getItem("eduai-language");
    if (savedLang) setLanguage(savedLang);

    // Teacher Profile
    const savedProfile = localStorage.getItem("eduai-teacher-profile");
    if (savedProfile) {
      try { setTeacherProfile(JSON.parse(savedProfile)); } catch {}
    }

    // AI Usage
    const savedUsageDate = localStorage.getItem("eduai-usage-date");
    const today = new Date().toDateString();
    if (savedUsageDate === today) {
      const savedCount = parseInt(localStorage.getItem("eduai-usage-count") || "0");
      setAiUsageCount(savedCount);
    } else {
      localStorage.setItem("eduai-usage-date", today);
      localStorage.setItem("eduai-usage-count", "0");
      setAiUsageCount(0);
    }
    setAiUsageDate(today);

    // Saved Lessons
    const savedPlans = localStorage.getItem("eduai-saved-lessons");
    if (savedPlans) {
      try { setSavedLessons(JSON.parse(savedPlans)); } catch {}
    }

    // Offline
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

  // ── Setters ─────────────────────────────────────────────
  const toggleMode = () => {
    const next = mode === "simple" ? "pro" : "simple";
    setMode(next);
    localStorage.setItem("eduai-mode", next);
  };

  const updateAiProvider = (provider) => {
    setAiProvider(provider);
    localStorage.setItem("eduai-ai-provider", provider);
  };

  const updateOllamaModel = (model) => {
    setOllamaModel(model);
    localStorage.setItem("eduai-ollama-model", model);
  };

  const updateTheme = (newTheme) => {
    setTheme(newTheme);
    localStorage.setItem("eduai-theme", newTheme);
    document.documentElement.setAttribute("data-theme", newTheme);
  };

  const updateBoard = (b) => {
    setBoard(b);
    localStorage.setItem("eduai-board", b);
  };

  const updateLanguage = (l) => {
    setLanguage(l);
    localStorage.setItem("eduai-language", l);
  };

  const updateTeacherProfile = (profile) => {
    setTeacherProfile(profile);
    localStorage.setItem("eduai-teacher-profile", JSON.stringify(profile));
  };

  // ── AI Usage ────────────────────────────────────────────
  const incrementAiUsage = useCallback(() => {
    const today = new Date().toDateString();
    let count = aiUsageCount;
    if (aiUsageDate !== today) {
      count = 0;
      setAiUsageDate(today);
      localStorage.setItem("eduai-usage-date", today);
    }
    const next = count + 1;
    setAiUsageCount(next);
    localStorage.setItem("eduai-usage-count", String(next));
    return next;
  }, [aiUsageCount, aiUsageDate]);

  const canUseAI = aiProvider === "ollama" || aiUsageCount < AI_DAILY_LIMIT;
  const aiUsageRemaining = Math.max(0, AI_DAILY_LIMIT - aiUsageCount);

  // ── Local Model Scan ────────────────────────────────────
  const scanLocalModels = async () => {
    setIsScanning(true);
    try {
      const res = await fetch("/api/models");
      const data = await res.json();
      if (data.models) {
        setLocalModels(data.models);
        if (data.models.length > 0 && !data.models.find(m => m.name === ollamaModel)) {
          updateOllamaModel(data.models[0].name);
        }
        showToast(`Found ${data.models.length} local model${data.models.length !== 1 ? "s" : ""}`);
      } else if (data.error) {
        showToast(data.error, "error");
      }
    } catch {
      showToast("Could not connect to Ollama", "error");
    }
    setIsScanning(false);
  };

  // ── Offline AI Queue ────────────────────────────────────
  const queueAIRequest = (payload) => {
    const updated = [...aiQueue, { ...payload, timestamp: Date.now() }];
    setAiQueue(updated);
    localStorage.setItem("eduai-ai-queue", JSON.stringify(updated));
  };
  const flushAIQueue = () => {
    setAiQueue([]);
    localStorage.removeItem("eduai-ai-queue");
  };

  // ── Toast ───────────────────────────────────────────────
  const showToast = (message, type = "success") => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3500);
  };

  // ── Clear All Data ──────────────────────────────────────
  const clearAllData = () => {
    localStorage.clear();
    showToast("All local data cleared", "info");
    setTimeout(() => window.location.reload(), 1000);
  };

  // ── Lesson Persistence ──────────────────────────────────
  const saveLesson = (lesson) => {
    const updated = [{ ...lesson, id: Date.now(), date: new Date().toLocaleDateString() }, ...savedLessons];
    setSavedLessons(updated);
    localStorage.setItem("eduai-saved-lessons", JSON.stringify(updated));
    showToast("Lesson plan saved to library!");
  };

  const deleteLesson = (id) => {
    const updated = savedLessons.filter(l => l.id !== id);
    setSavedLessons(updated);
    localStorage.setItem("eduai-saved-lessons", JSON.stringify(updated));
    showToast("Lesson deleted from library");
  };

  return (
    <AppContext.Provider value={{
      mode, toggleMode,
      theme, updateTheme,
      board, updateBoard,
      language, updateLanguage,
      teacherProfile, updateTeacherProfile,
      aiProvider, updateAiProvider,
      ollamaModel, updateOllamaModel,
      localModels, scanLocalModels, isScanning,
      offline, aiQueue, queueAIRequest, flushAIQueue,
      aiUsageCount, aiUsageRemaining, canUseAI, incrementAiUsage, AI_DAILY_LIMIT,
      notificationCount,
      showToast,
      clearAllData,
      savedLessons, saveLesson, deleteLesson,
    }}>
      {/* Animated Mesh Background */}
      <div className="mesh-bg" aria-hidden="true">
        <div className="blob blob-1" />
        <div className="blob blob-2" />
        <div className="blob blob-3" />
        <div className="blob blob-4" />
      </div>

      {/* Offline Banner */}
      {offline && (
        <div style={{
          position: "fixed", top: 0, left: 0, right: 0, zIndex: 9999, padding: "10px 24px",
          background: "linear-gradient(90deg, #EF4444, #F59E0B)", color: "white",
          textAlign: "center", fontSize: 13, fontWeight: 600,
          display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
        }}>
          <span className="pulse-dot" style={{ background: "white" }} />
          📡 Offline — Marks entry & saved plans work. AI features queued for reconnection.
        </div>
      )}
      <div style={{ paddingTop: offline ? 40 : 0, position: "relative", zIndex: 1 }}>
        {children}
      </div>

      {/* Toast Container */}
      <div style={{
        position: "fixed", top: 24, left: "50%", transform: "translateX(-50%)", zIndex: 10000,
        display: "flex", flexDirection: "column", gap: 10, pointerEvents: "none",
        alignItems: "center",
      }}>
        {toasts.map(t => (
          <div key={t.id} className="card animate-slide-up" style={{
            padding: "14px 24px", display: "flex", alignItems: "center", gap: 12, minWidth: 320,
            background: "rgba(15, 23, 42, 0.92)", backdropFilter: "blur(30px)",
            border: `1px solid rgba(255,255,255,0.1)`,
            borderBottom: `2px solid ${t.type === "success" ? "var(--success)" : t.type === "error" ? "var(--danger)" : "var(--primary)"}`,
            boxShadow: "0 20px 50px rgba(0,0,0,0.5)",
            borderRadius: 16, cursor: "default",
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
