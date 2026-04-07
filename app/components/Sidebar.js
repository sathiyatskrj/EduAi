"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_ITEMS = [
  { href: "/dashboard", icon: "🏠", label: "Dashboard" },
  { href: "/dashboard/lesson", icon: "📚", label: "Lesson Planner" },
  { href: "/dashboard/test", icon: "🧪", label: "Test Generator" },
  { href: "/dashboard/marks", icon: "✏️", label: "Marks Entry" },
  { href: "/dashboard/stats", icon: "📊", label: "Statistics" },
  { href: "/dashboard/diagnosis", icon: "🔍", label: "Diagnosis" },
  { href: "/dashboard/remedial", icon: "💊", label: "Remedial" },
  { href: "/dashboard/students", icon: "👤", label: "Students" },
  { href: "/dashboard/settings", icon: "⚙️", label: "Settings" },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

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
          {NAV_ITEMS.map((item) => (
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
