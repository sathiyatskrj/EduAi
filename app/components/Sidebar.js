"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useApp } from "./AppContext";
import {
  Home, BookOpen, FlaskConical, BarChart2, Users,
  Palette, PenLine, Search, Pill, Settings, FolderOpen,
  ChevronRight, Zap, Sparkles
} from "lucide-react";

const CORE_NAV = [
  { href: "/dashboard", icon: Home, label: "Home" },
  { href: "/dashboard/lesson", icon: BookOpen, label: "Lesson" },
  { href: "/dashboard/test", icon: FlaskConical, label: "Test" },
  { href: "/dashboard/stats", icon: BarChart2, label: "Stats" },
  { href: "/dashboard/students", icon: Users, label: "Students" },
];

const MORE_NAV = [
  { href: "/dashboard/aids", icon: Palette, label: "Teaching Aids" },
  { href: "/dashboard/marks", icon: PenLine, label: "Marks Entry" },
  { href: "/dashboard/diagnosis", icon: Search, label: "Diagnosis" },
  { href: "/dashboard/remedial", icon: Pill, label: "Remedial" },
  { href: "/dashboard/settings", icon: Settings, label: "Settings" },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const { mode, toggleMode, teacherProfile, notificationCount, aiUsageRemaining, aiProvider, AI_DAILY_LIMIT } = useApp();
  const isMoreActive = MORE_NAV.some(item => pathname === item.href);

  const initials = teacherProfile?.name
    ? teacherProfile.name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase()
    : "T";

  const usagePercent = aiProvider === "ollama" ? 100 : Math.round(((AI_DAILY_LIMIT - aiUsageRemaining) / AI_DAILY_LIMIT) * 100);

  return (
    <>
      {/* Mobile Toggle */}
      <button
        className="fixed top-4 left-4 z-[60] p-2 rounded-xl lg:hidden"
        style={{ background: "rgba(15,23,42,0.8)", backdropFilter: "blur(12px)", border: "1px solid rgba(255,255,255,0.1)" }}
        onClick={() => setOpen(!open)}
        id="sidebar-toggle"
        aria-label="Toggle menu"
      >
        <span style={{ fontSize: 20, display: "block", lineHeight: 1 }}>{open ? "✕" : "☰"}</span>
      </button>

      {open && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setOpen(false)} />
      )}

      <aside className={`sidebar ${open ? "open" : ""}`}>
        {/* Logo + Brand */}
        <div style={{ padding: "24px 20px 18px", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
          <Link href="/dashboard" style={{ textDecoration: "none" }} onClick={() => setOpen(false)}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{
                width: 44, height: 44, borderRadius: 12,
                background: "#ffffff", display: "flex", alignItems: "center",
                justifyContent: "center", flexShrink: 0,
                boxShadow: "0 4px 14px rgba(0,0,0,0.2)",
                padding: 4, overflow: "hidden"
              }}>
                <img 
                  src="/logo.png" 
                  alt="EduAI Logo" 
                  style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain" }}
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.parentNode.style.background = 'var(--gradient-1)';
                    e.target.parentNode.innerHTML = '<span style="color:white;font-size:22px">✨</span>';
                  }}
                />
              </div>
              <div>
                <div style={{ fontSize: 20, fontWeight: 800, color: "var(--primary)", letterSpacing: "-0.5px" }}>EduAI</div>
                <div style={{ fontSize: 10, color: "var(--text-secondary)", letterSpacing: 1.5, fontWeight: 500 }}>CLASSROOM INTELLIGENCE</div>
              </div>
            </div>
          </Link>
        </div>

        {/* Teacher Profile Strip */}
        <div style={{ padding: "14px 20px", borderBottom: "1px solid rgba(255,255,255,0.06)", display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{
            width: 36, height: 36, borderRadius: "50%",
            background: "var(--gradient-1)", color: "white",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 14, fontWeight: 700, flexShrink: 0,
            boxShadow: "0 2px 10px rgba(0,150,136,0.3)"
          }}>{initials}</div>
          <div style={{ overflow: "hidden" }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text-primary)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
              {teacherProfile?.name || "Set Your Name"}
            </div>
            <div style={{ fontSize: 11, color: "var(--text-secondary)" }}>
              {teacherProfile?.subject || "Educator"} • {teacherProfile?.classes?.[0] || "EduAI"}
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav style={{ flex: 1, padding: "12px 0", overflowY: "auto" }}>
          {CORE_NAV.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            const isHome = item.href === "/dashboard";
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`sidebar-link ${isActive ? "active" : ""}`}
                onClick={() => setOpen(false)}
                id={`nav-${item.label.toLowerCase()}`}
                data-tooltip={item.label}
              >
                <div style={{ position: "relative" }}>
                  <Icon size={18} />
                  {isHome && notificationCount > 0 && (
                    <span style={{
                      position: "absolute", top: -4, right: -4,
                      background: "var(--danger)", color: "white",
                      fontSize: 9, fontWeight: 700, borderRadius: "50%",
                      width: 14, height: 14, display: "flex", alignItems: "center", justifyContent: "center",
                      border: "1.5px solid var(--bg-dark)"
                    }}>{notificationCount}</span>
                  )}
                </div>
                <span>{item.label}</span>
              </Link>
            );
          })}

          {/* More Tools */}
          <div style={{ marginTop: 4 }}>
            <button
              onClick={() => setMoreOpen(!moreOpen)}
              style={{
                display: "flex", alignItems: "center", gap: 12,
                padding: "12px 20px", margin: "2px 10px", width: "calc(100% - 20px)",
                color: isMoreActive ? "var(--primary)" : "var(--text-secondary)",
                background: isMoreActive ? "rgba(0,150,136,0.1)" : "transparent",
                border: "none", cursor: "pointer", fontSize: 14, fontWeight: 500,
                borderRadius: "var(--radius-md)", transition: "all 0.2s",
              }}
            >
              <FolderOpen size={18} />
              <span style={{ flex: 1, textAlign: "left" }}>More Tools</span>
              <ChevronRight
                size={14}
                style={{
                  transform: moreOpen || isMoreActive ? "rotate(90deg)" : "rotate(0deg)",
                  transition: "transform 0.25s", color: "var(--text-secondary)"
                }}
              />
            </button>

            {(moreOpen || isMoreActive) && (
              <div style={{ paddingLeft: 12, animation: "slideInLeft 0.2s ease-out" }}>
                {MORE_NAV.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`sidebar-link ${pathname === item.href ? "active" : ""}`}
                      onClick={() => setOpen(false)}
                      id={`nav-${item.label.toLowerCase().replace(/\s/g, "-")}`}
                      style={{ fontSize: 13 }}
                    >
                      <Icon size={16} />
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        </nav>

        {/* Footer */}
        <div style={{ padding: "14px 16px", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
          {/* Mode Toggle */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12, padding: "10px 14px", background: "rgba(255,255,255,0.04)", borderRadius: 10 }}>
            <div>
              <div style={{ fontSize: 12, fontWeight: 600 }}>{mode === "simple" ? "Simple" : "Pro"} Mode</div>
              <div style={{ fontSize: 10, color: "var(--text-secondary)" }}>{mode === "simple" ? "Fewer options" : "All controls"}</div>
            </div>
            <button onClick={toggleMode} style={{
              width: 44, height: 24, borderRadius: 12, border: "none", cursor: "pointer", position: "relative",
              background: mode === "pro" ? "var(--primary)" : "rgba(255,255,255,0.1)", transition: "all 0.3s"
            }}>
              <div style={{
                width: 18, height: 18, borderRadius: "50%", background: "white", position: "absolute", top: 3,
                left: mode === "pro" ? 23 : 3, transition: "left 0.3s",
                boxShadow: "0 1px 4px rgba(0,0,0,0.3)"
              }} />
            </button>
          </div>

          {/* AI Usage Bar */}
          {aiProvider === "gemini" && (
            <div style={{ padding: "10px 14px", background: "rgba(0,150,136,0.06)", border: "1px solid rgba(0,150,136,0.2)", borderRadius: 10 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                <div style={{ fontSize: 11, fontWeight: 600, color: "var(--primary)", display: "flex", alignItems: "center", gap: 4 }}>
                  <Zap size={11} /> AI Generations
                </div>
                <div style={{ fontSize: 10, color: "var(--text-secondary)" }}>
                  {AI_DAILY_LIMIT - usagePercent * AI_DAILY_LIMIT / 100 | 0}/{AI_DAILY_LIMIT} left
                </div>
              </div>
              <div style={{ height: 4, background: "rgba(255,255,255,0.1)", borderRadius: 4, overflow: "hidden" }}>
                <div style={{
                  height: "100%", borderRadius: 4,
                  background: usagePercent > 80 ? "var(--danger)" : "var(--gradient-1)",
                  width: `${usagePercent}%`, transition: "width 0.4s"
                }} />
              </div>
              <Link href="/dashboard/settings">
                <button className="btn-primary" style={{ width: "100%", marginTop: 10, padding: "7px 12px", fontSize: 12, borderRadius: 8, justifyContent: "center" }}>
                  ⚡ Upgrade to Pro
                </button>
              </Link>
            </div>
          )}
          {aiProvider === "ollama" && (
            <div style={{ padding: "10px 14px", background: "rgba(16,185,129,0.06)", border: "1px solid rgba(16,185,129,0.2)", borderRadius: 10 }}>
              <div style={{ fontSize: 11, fontWeight: 600, color: "var(--success)" }}>🟢 Local AI — Unlimited</div>
              <div style={{ fontSize: 10, color: "var(--text-secondary)", marginTop: 2 }}>Running offline via Ollama</div>
            </div>
          )}
        </div>
      </aside>

      {/* Mobile Bottom Nav */}
      <nav className="mobile-bottom-nav">
        {CORE_NAV.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={`mob-${item.href}`}
              href={item.href}
              className={`mobile-nav-item ${isActive ? "active" : ""}`}
            >
              <Icon size={22} color={isActive ? "var(--primary)" : "var(--text-secondary)"} />
              <span style={{ fontSize: 10, fontWeight: isActive ? 600 : 500 }}>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </>
  );
}
