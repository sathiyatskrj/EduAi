"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

const ROUTES = [
  { path: "/dashboard", label: "Dashboard Home", icon: "🏠", desc: "Overview and alerts" },
  { path: "/dashboard/lesson", label: "Lesson Planner", icon: "📚", desc: "AI-generated lesson plans" },
  { path: "/dashboard/test", label: "Test Generator", icon: "🧪", desc: "Create assessments" },
  { path: "/dashboard/stats", label: "Statistics Engine", icon: "📊", desc: "Analyze student performance" },
  { path: "/dashboard/students", label: "Student Profiles", icon: "👤", desc: "Track individual progress" },
  { path: "/dashboard/aids", label: "Teaching Aids", icon: "🎨", desc: "PPT outlines and blackboard drafts" },
  { path: "/dashboard/marks", label: "Marks Entry", icon: "✏️", desc: "Enter or voice-dictate marks" },
  { path: "/dashboard/diagnosis", label: "Diagnosis Engine", icon: "🔍", desc: "Identify class weakness" },
  { path: "/dashboard/remedial", label: "Remedial Planner", icon: "💊", desc: "Corrective action plans" },
  { path: "/dashboard/settings", label: "Settings", icon: "⚙️", desc: "Manage preferences and data" },
];

export default function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef(null);
  const router = useRouter();

  // Handle Ctrl+K shortcut
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
      if (e.key === "Escape") setOpen(false);
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Filter routes based on query
  const filtered = ROUTES.filter(
    (r) => 
      r.label.toLowerCase().includes(query.toLowerCase()) || 
      r.path.toLowerCase().includes(query.toLowerCase()) ||
      r.desc.toLowerCase().includes(query.toLowerCase())
  );

  useEffect(() => {
    setActiveIndex(0); // Reset index on query change
  }, [query]);

  // Handle focus
  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 50);
    else setQuery("");
  }, [open]);

  // Handle arrow keys
  const handleInputKeyDown = (e) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((prev) => (prev < filtered.length - 1 ? prev + 1 : prev));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((prev) => (prev > 0 ? prev - 1 : prev));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (filtered[activeIndex]) {
        router.push(filtered[activeIndex].path);
        setOpen(false);
      }
    }
  };

  if (!open) return null;

  return (
    <>
      <div 
        className="animate-fade-in"
        style={{ position: "fixed", inset: 0, background: "rgba(15,23,42,0.8)", backdropFilter: "blur(4px)", zIndex: 100000 }} 
        onClick={() => setOpen(false)}
      />
      
      <div 
        className="card animate-fade-in"
        style={{
          position: "fixed", top: "20%", left: "50%", transform: "translateX(-50%)",
          width: "90%", maxWidth: 600, padding: 0, overflow: "hidden", zIndex: 100001,
          boxShadow: "0 20px 60px rgba(0,0,0,0.5)"
        }}
      >
        <div style={{ padding: 16, borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", gap: 12 }}>
          <span style={{ fontSize: 20, color: "var(--text-secondary)" }}>🔍</span>
          <input
            ref={inputRef}
            type="text"
            placeholder="Go to page... (e.g. 'Marks' or 'Lesson')"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleInputKeyDown}
            style={{ 
              background: "transparent", border: "none", color: "var(--text-primary)", 
              fontSize: 18, flex: 1, outline: "none" 
            }}
          />
          <kbd style={{ fontSize: 12, padding: "4px 8px", background: "rgba(15,23,42,0.5)", borderRadius: 4, color: "var(--text-secondary)" }}>ESC</kbd>
        </div>

        <div style={{ maxHeight: 350, overflowY: "auto", padding: 8 }}>
          {filtered.length > 0 ? (
            filtered.map((route, i) => (
              <div 
                key={route.path}
                onClick={() => { router.push(route.path); setOpen(false); }}
                style={{
                  display: "flex", gap: 16, alignItems: "center", cursor: "pointer",
                  padding: "12px 16px", borderRadius: 12,
                  background: activeIndex === i ? "rgba(0,150,136,0.1)" : "transparent",
                  borderLeft: activeIndex === i ? "3px solid var(--primary)" : "3px solid transparent",
                }}
                onMouseEnter={() => setActiveIndex(i)}
              >
                <div style={{ fontSize: 24, opacity: activeIndex === i ? 1 : 0.7 }}>{route.icon}</div>
                <div>
                  <div style={{ fontWeight: 600, fontSize: "var(--text-base)", color: activeIndex === i ? "var(--primary)" : "var(--text-primary)" }}>{route.label}</div>
                  <div style={{ fontSize: "var(--text-xs)", color: "var(--text-secondary)" }}>{route.desc}</div>
                </div>
                {activeIndex === i && <span style={{ marginLeft: "auto", fontSize: 12, color: "var(--text-secondary)" }}>⏎ Jump</span>}
              </div>
            ))
          ) : (
            <div style={{ padding: 40, textAlign: "center", color: "var(--text-secondary)" }}>
              <div style={{ fontSize: 32, marginBottom: 8 }}>🤷‍♂️</div>
              <div>No results found for "{query}"</div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
