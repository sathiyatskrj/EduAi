"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

// SCAMPER: Eliminate — Simplified to 5 core tabs + collapsible "More"
const CORE_NAV = [
  { href: "/dashboard", icon: "🏠", label: "Home" },
  { href: "/dashboard/lesson", icon: "📚", label: "Lesson" },
  { href: "/dashboard/test", icon: "🧪", label: "Test" },
  { href: "/dashboard/stats", icon: "📊", label: "Stats" },
  { href: "/dashboard/students", icon: "👤", label: "Students" },
];

const MORE_NAV = [
  { href: "/dashboard/aids", icon: "🎨", label: "Teaching Aids" },
  { href: "/dashboard/marks", icon: "✏️", label: "Marks Entry" },
  { href: "/dashboard/diagnosis", icon: "🔍", label: "Diagnosis" },
  { href: "/dashboard/remedial", icon: "💊", label: "Remedial" },
  { href: "/dashboard/settings", icon: "⚙️", label: "Settings" },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);

  // Auto-expand "More" if current path is inside it
  const isMoreActive = MORE_NAV.some(item => pathname === item.href);

  return (
    <>
      <button
        className="fixed top-4 left-4 z-[60] p-2 rounded-lg bg-[var(--bg-card)] border border-[var(--border)] lg:hidden"
        onClick={() => setOpen(!open)}
        id="sidebar-toggle"
      >
        <span style={{ fontSize: 22 }}>{open ? "✕" : "☰"}</span>
      </button>

      {open && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setOpen(false)} />
      )}

      <aside className={`sidebar ${open ? "open" : ""}`}>
        <div style={{ padding: "28px 24px 20px", borderBottom: "1px solid var(--border)" }}>
          <Link href="/dashboard" style={{ textDecoration: "none" }} onClick={() => setOpen(false)}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{
                width: 42, height: 42, borderRadius: 12,
                background: "var(--gradient-1)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 20, fontWeight: 800, color: "white"
              }}>E</div>
              <div>
                <div style={{ fontSize: 22, fontWeight: 800, color: "var(--primary)" }}>EduAI</div>
                <div style={{ fontSize: 11, color: "var(--text-secondary)", letterSpacing: 1 }}>CLASSROOM INTELLIGENCE</div>
              </div>
            </div>
          </Link>
        </div>

        <nav style={{ flex: 1, padding: "16px 0", overflowY: "auto" }}>
          {/* Core 5 Tabs */}
          {CORE_NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`sidebar-link ${pathname === item.href ? "active" : ""}`}
              onClick={() => setOpen(false)}
              id={`nav-${item.label.toLowerCase().replace(/\s/g, "-")}`}
            >
              <span style={{ fontSize: 20 }}>{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          ))}

          {/* Collapsible "More" Section */}
          <div style={{ marginTop: 8 }}>
            <button
              onClick={() => setMoreOpen(!moreOpen)}
              style={{
                display: "flex", alignItems: "center", gap: 14, padding: "14px 24px", width: "100%",
                color: isMoreActive ? "var(--primary)" : "var(--text-secondary)",
                background: isMoreActive ? "rgba(0, 150, 136, 0.05)" : "transparent",
                border: "none", cursor: "pointer", fontSize: 15, fontWeight: 500,
                borderLeft: isMoreActive ? "3px solid var(--primary)" : "3px solid transparent",
                transition: "all 0.2s"
              }}
            >
              <span style={{ fontSize: 20 }}>📁</span>
              <span style={{ flex: 1, textAlign: "left" }}>More Tools</span>
              <span style={{ fontSize: 12, transform: moreOpen || isMoreActive ? "rotate(90deg)" : "rotate(0deg)", transition: "transform 0.2s" }}>▶</span>
            </button>

            {(moreOpen || isMoreActive) && (
              <div style={{ paddingLeft: 16 }}>
                {MORE_NAV.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`sidebar-link ${pathname === item.href ? "active" : ""}`}
                    onClick={() => setOpen(false)}
                    id={`nav-${item.label.toLowerCase().replace(/\s/g, "-")}`}
                    style={{ paddingLeft: 24, fontSize: 14 }}
                  >
                    <span style={{ fontSize: 17 }}>{item.icon}</span>
                    <span>{item.label}</span>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </nav>

        <div style={{ padding: "16px 24px", borderTop: "1px solid var(--border)" }}>
          <div className="card" style={{ padding: 16, background: "rgba(0,150,136,0.06)", border: "1px solid rgba(0,150,136,0.2)" }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: "var(--primary)", marginBottom: 4 }}>Free Plan</div>
            <div style={{ fontSize: 12, color: "var(--text-secondary)" }}>5 AI generations / day</div>
            <button className="btn-primary" style={{ width: "100%", marginTop: 10, padding: "8px 16px", fontSize: 13, borderRadius: 8 }}>
              Upgrade to Pro
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
