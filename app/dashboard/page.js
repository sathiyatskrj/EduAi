"use client";
import Link from "next/link";

const STATS = [
  { label: "Class Average", value: "72.4%", icon: "📊", change: "+3.2%", color: "#10B981" },
  { label: "Lesson Plans", value: "24", icon: "📚", change: "+5 this week", color: "#009688" },
  { label: "Tests Created", value: "12", icon: "🧪", change: "+2 this week", color: "#8B5CF6" },
  { label: "Students Tracked", value: "156", icon: "👤", change: "4 sections", color: "#F59E0B" },
];

const SCHEDULE = [
  { period: "Period 1", cls: "VII-A", subject: "Mathematics", topic: "Algebraic Expressions", time: "9:00 AM", status: "completed" },
  { period: "Period 3", cls: "VIII-B", subject: "Mathematics", topic: "Linear Equations", time: "10:30 AM", status: "current" },
  { period: "Period 5", cls: "IX-A", subject: "Mathematics", topic: "Quadratic Equations", time: "12:00 PM", status: "upcoming" },
  { period: "Period 7", cls: "VII-B", subject: "Mathematics", topic: "Algebraic Expressions", time: "2:00 PM", status: "upcoming" },
];

// SCAMPER: Modify/Magnify — Priority Score (0-100) on each alert so teacher knows what to fix first
const ALERTS = [
  { type: "danger", priority: 92, msg: "Ravi Kumar scored below 40% in 3 consecutive tests — remedial recommended", action: "View Diagnosis", href: "/dashboard/diagnosis" },
  { type: "danger", priority: 85, msg: "Fractions (Multiplication) — 72% class failure rate on Q4 in Unit Test 1", action: "Run Remedial", href: "/dashboard/remedial" },
  { type: "warning", priority: 68, msg: "VII-A class average dropped by 8% in last test — concept: Fractions", action: "Run Analysis", href: "/dashboard/stats" },
  { type: "warning", priority: 54, msg: "Diya Reddy & Kavya Gupta at-risk: declining scores for 2+ tests", action: "View Students", href: "/dashboard/students" },
  { type: "info", priority: 30, msg: "3 new lesson plans ready for review from AI generation", action: "Review", href: "/dashboard/lesson" },
].sort((a, b) => b.priority - a.priority); // Auto-sort by urgency

const ACTIONS = [
  { icon: "📚", label: "New Lesson Plan", href: "/dashboard/lesson", color: "#009688" },
  { icon: "🧪", label: "Create Test", href: "/dashboard/test", color: "#8B5CF6" },
  { icon: "✏️", label: "Enter Marks", href: "/dashboard/marks", color: "#F59E0B" },
  { icon: "📊", label: "View Stats", href: "/dashboard/stats", color: "#10B981" },
  { icon: "🎨", label: "Teaching Aids", href: "/dashboard/aids", color: "#00BCD4" },
];

function getPriorityBadge(priority) {
  if (priority >= 80) return { label: "URGENT", bg: "rgba(239,68,68,0.15)", color: "#EF4444" };
  if (priority >= 50) return { label: "MEDIUM", bg: "rgba(245,158,11,0.15)", color: "#F59E0B" };
  return { label: "LOW", bg: "rgba(0,150,136,0.15)", color: "#009688" };
}

export default function Dashboard() {
  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 4 }}>Good Morning, Teacher! 👋</h1>
        <p style={{ color: "var(--text-secondary)", fontSize: 15 }}>Here&apos;s your classroom intelligence overview for today.</p>
      </div>

      {/* Stats Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 20, marginBottom: 32 }}>
        {STATS.map((s, i) => (
          <div key={i} className="card" style={{ animationDelay: `${i * 0.1}s` }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
              <span style={{ fontSize: 32 }}>{s.icon}</span>
              <span className="badge badge-success" style={{ fontSize: 11 }}>{s.change}</span>
            </div>
            <div className="stat-number">{s.value}</div>
            <div style={{ color: "var(--text-secondary)", fontSize: 14, marginTop: 4 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: 16, marginBottom: 32 }}>
        {ACTIONS.map((a, i) => (
          <Link key={i} href={a.href} style={{ textDecoration: "none" }}>
            <div className="card" style={{ textAlign: "center", cursor: "pointer", padding: 20 }}>
              <div style={{ fontSize: 36, marginBottom: 10 }}>{a.icon}</div>
              <div style={{ fontWeight: 600, fontSize: 14, color: "var(--text-primary)" }}>{a.label}</div>
            </div>
          </Link>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, marginBottom: 32 }}>
        {/* Today's Schedule */}
        <div className="card">
          <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 20, display: "flex", alignItems: "center", gap: 10 }}>
            📅 Today&apos;s Schedule
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {SCHEDULE.map((item, i) => (
              <div key={i} style={{
                display: "flex", alignItems: "center", gap: 16, padding: "14px 16px",
                borderRadius: 12, background: item.status === "current" ? "rgba(0,150,136,0.08)" : "rgba(15,23,42,0.5)",
                border: item.status === "current" ? "1px solid rgba(0,150,136,0.3)" : "1px solid transparent",
              }}>
                <div style={{
                  width: 8, height: 8, borderRadius: "50%",
                  background: item.status === "completed" ? "#10B981" : item.status === "current" ? "#009688" : "#475569",
                  boxShadow: item.status === "current" ? "0 0 10px rgba(0,150,136,0.5)" : "none",
                }} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, fontSize: 14 }}>{item.period} — {item.cls} {item.subject}</div>
                  <div style={{ fontSize: 13, color: "var(--text-secondary)" }}>{item.topic}</div>
                </div>
                <div style={{ fontSize: 13, color: "var(--text-secondary)", fontWeight: 500 }}>{item.time}</div>
                {item.status === "current" && <span className="badge badge-info">LIVE</span>}
              </div>
            ))}
          </div>
        </div>

        {/* SCAMPER: Modify — Priority-Scored Alerts */}
        <div className="card">
          <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 20, display: "flex", alignItems: "center", gap: 10 }}>
            🔔 Prioritized Alerts
            <span className="badge badge-danger" style={{ fontSize: 11 }}>{ALERTS.length}</span>
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {ALERTS.map((a, i) => {
              const badge = getPriorityBadge(a.priority);
              return (
                <div key={i} style={{
                  padding: "14px 16px", borderRadius: 12,
                  background: a.type === "danger" ? "rgba(239,68,68,0.06)" : a.type === "warning" ? "rgba(245,158,11,0.06)" : "rgba(0,150,136,0.06)",
                  borderLeft: `3px solid ${a.type === "danger" ? "#EF4444" : a.type === "warning" ? "#F59E0B" : "#009688"}`,
                }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <span className="badge" style={{ background: badge.bg, color: badge.color, fontSize: 10, padding: "2px 8px" }}>
                        {badge.label}
                      </span>
                      <span style={{ fontSize: 11, color: "var(--text-secondary)" }}>Priority: {a.priority}/100</span>
                    </div>
                  </div>
                  <div style={{ fontSize: 14, marginBottom: 10, lineHeight: 1.5 }}>{a.msg}</div>
                  <Link href={a.href}>
                    <button className="btn-secondary" style={{ padding: "6px 14px", fontSize: 12 }}>{a.action} →</button>
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
