"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useApp } from "@/app/components/AppContext";
import { TrendingUp, TrendingDown, Minus, Bell, Calendar, Zap, ChevronRight } from "lucide-react";

const SCHEDULE = [
  { period: "Period 1", cls: "VII-A", subject: "Mathematics", topic: "Algebraic Expressions", time: "9:00 AM", status: "completed" },
  { period: "Period 3", cls: "VIII-B", subject: "Mathematics", topic: "Linear Equations", time: "10:30 AM", status: "current" },
  { period: "Period 5", cls: "IX-A", subject: "Mathematics", topic: "Quadratic Equations", time: "12:00 PM", status: "upcoming" },
  { period: "Period 7", cls: "VII-B", subject: "Mathematics", topic: "Algebraic Expressions", time: "2:00 PM", status: "upcoming" },
];

const ALERTS = [
  { type: "danger", priority: 92, msg: "Ravi Kumar scored below 40% in 3 consecutive tests — remedial recommended", action: "View Diagnosis", href: "/dashboard/diagnosis" },
  { type: "danger", priority: 85, msg: "Fractions (Multiplication) — 72% class failure rate on Q4 in Unit Test 1", action: "Run Remedial", href: "/dashboard/remedial" },
  { type: "warning", priority: 68, msg: "VII-A class average dropped by 8% — concept: Fractions", action: "Run Analysis", href: "/dashboard/stats" },
  { type: "warning", priority: 54, msg: "Diya Reddy & Kavya Gupta at-risk: declining scores for 2+ tests", action: "View Students", href: "/dashboard/students" },
  { type: "info", priority: 30, msg: "3 new lesson plans ready for review from AI generation", action: "Review", href: "/dashboard/lesson" },
].sort((a, b) => b.priority - a.priority);

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

function getGreeting(name) {
  const h = new Date().getHours();
  const salutation = h < 12 ? "Good Morning" : h < 17 ? "Good Afternoon" : "Good Evening";
  const emoji = h < 12 ? "☀️" : h < 17 ? "🌤️" : "🌙";
  const displayName = name ? `, ${name.split(" ")[0]}` : "";
  return { text: `${salutation}${displayName}!`, emoji };
}

// Animated counter hook
function useCountUp(target, duration = 800) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    let start = 0;
    const step = target / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) { setValue(target); clearInterval(timer); }
      else setValue(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [target, duration]);
  return value;
}

function StatCard({ stat, delay }) {
  // Strip % and parse
  const raw = parseFloat(stat.value.replace(/[^0-9.]/g, "")) || 0;
  const suffix = stat.value.match(/[^0-9.]+/)?.[0] || "";
  const counted = useCountUp(raw, 900);

  return (
    <div className={`card animate-fade-in stagger-${delay}`} style={{ position: "relative", overflow: "hidden" }}>
      {/* Subtle gradient accent */}
      <div style={{ position: "absolute", top: 0, right: 0, width: 80, height: 80, borderRadius: "0 18px 0 80%", background: `${stat.color}15`, pointerEvents: "none" }} />
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16, position: "relative" }}>
        <div className="icon-wrap" style={{ background: `${stat.color}18`, fontSize: 20 }}>{stat.icon}</div>
        <span className="badge badge-success" style={{ fontSize: "var(--text-xs)" }}>{stat.change}</span>
      </div>
      <div style={{ fontSize: 36, fontWeight: 800, background: "var(--gradient-1)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text", lineHeight: 1 }}>
        {counted}{suffix}
      </div>
      <div style={{ color: "var(--text-secondary)", fontSize: "var(--text-sm)", marginTop: 6 }}>{stat.label}</div>
    </div>
  );
}

export default function Dashboard() {
  const { teacherProfile } = useApp();
  const { text: greetText, emoji } = getGreeting(teacherProfile?.name);
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const STATS = [
    { label: "Class Average", value: "72%", icon: "📊", change: "+3.2%", color: "#10B981" },
    { label: "Lesson Plans", value: "24", icon: "📚", change: "+5 this week", color: "#009688" },
    { label: "Tests Created", value: "12", icon: "🧪", change: "+2 this week", color: "#8B5CF6" },
    { label: "Students Tracked", value: "156", icon: "👤", change: "4 sections", color: "#F59E0B" },
  ];

  const timeStr = time.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });
  const dateStr = time.toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long" });

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 36, flexWrap: "wrap", gap: 16 }}>
        <div className="animate-slide-left">
          <h1 style={{ fontSize: 38, fontWeight: 900, marginBottom: 6, letterSpacing: "-1px", lineHeight: 1.1 }}>
            {greetText} <span style={{ background: "var(--gradient-1)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>{emoji}</span>
          </h1>
          <p style={{ color: "var(--text-secondary)", fontSize: 15 }}>
            Here&apos;s your real-time classroom intelligence overview.
          </p>
        </div>
        {/* Live Clock */}
        <div className="card animate-slide-right" style={{ padding: "14px 22px", textAlign: "right", minWidth: 160 }}>
          <div style={{ fontSize: 28, fontWeight: 800, fontVariantNumeric: "tabular-nums", lineHeight: 1, background: "var(--gradient-1)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            {timeStr}
          </div>
          <div style={{ fontSize: 11, color: "var(--text-secondary)", marginTop: 4 }}>{dateStr}</div>
        </div>
      </div>

      {/* Stats Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))", gap: 18, marginBottom: 28 }}>
        {STATS.map((s, i) => <StatCard key={i} stat={s} delay={i + 1} />)}
      </div>

      {/* Quick Actions */}
      <div className="animate-fade-in stagger-2" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))", gap: 14, marginBottom: 28 }}>
        {ACTIONS.map((a, i) => (
          <Link key={i} href={a.href} style={{ textDecoration: "none" }}>
            <div className="card" style={{ textAlign: "center", cursor: "pointer", padding: 18, display: "flex", flexDirection: "column", alignItems: "center", gap: 10, transition: "all 0.3s" }}>
              <div className="icon-wrap" style={{ background: `${a.color}18`, fontSize: 22 }}>{a.icon}</div>
              <div style={{ fontWeight: 600, fontSize: "var(--text-sm)", color: "var(--text-primary)", lineHeight: 1.3 }}>{a.label}</div>
            </div>
          </Link>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "minmax(0,1fr) minmax(0,1fr)", gap: 22, marginBottom: 28 }}>
        {/* Today's Schedule */}
        <div className="card animate-fade-in stagger-3">
          <h2 style={{ fontSize: 17, fontWeight: 700, marginBottom: 18, display: "flex", alignItems: "center", gap: 10 }}>
            <span className="icon-wrap" style={{ width: 32, height: 32, fontSize: 15 }}><Calendar size={15} /></span>
            Today&apos;s Schedule
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {SCHEDULE.map((item, i) => (
              <div key={i} style={{
                display: "flex", alignItems: "center", gap: 14, padding: "12px 14px",
                borderRadius: 12,
                background: item.status === "current" ? "rgba(0,150,136,0.08)" : "rgba(255,255,255,0.025)",
                border: item.status === "current" ? "1px solid rgba(0,150,136,0.3)" : "1px solid transparent",
              }}>
                <div style={{
                  width: 8, height: 8, borderRadius: "50%", flexShrink: 0,
                  background: item.status === "completed" ? "#10B981" : item.status === "current" ? "#009688" : "#475569",
                  boxShadow: item.status === "current" ? "0 0 10px rgba(0,150,136,0.7)" : "none",
                }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 600, fontSize: "var(--text-sm)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {item.period} — {item.cls}
                  </div>
                  <div style={{ fontSize: "var(--text-xs)", color: "var(--text-secondary)" }}>{item.topic}</div>
                </div>
                <div style={{ fontSize: "var(--text-xs)", color: "var(--text-secondary)", fontWeight: 500, flexShrink: 0 }}>{item.time}</div>
                {item.status === "current" && (
                  <span className="badge badge-info" style={{ fontSize: 10, padding: "2px 8px" }}>
                    <span className="pulse-dot" style={{ width: 5, height: 5, marginRight: 4, background: "var(--primary)" }} />
                    LIVE
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Prioritized Alerts */}
        <div className="card animate-fade-in stagger-4">
          <h2 style={{ fontSize: 17, fontWeight: 700, marginBottom: 18, display: "flex", alignItems: "center", gap: 10 }}>
            <span className="icon-wrap" style={{ width: 32, height: 32, fontSize: 15 }}><Bell size={15} /></span>
            Prioritized Alerts
            <span className="badge badge-danger" style={{ fontSize: 10 }}>{ALERTS.length}</span>
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {ALERTS.map((a, i) => {
              const badge = getPriorityBadge(a.priority);
              return (
                <div key={i} style={{
                  padding: "12px 14px", borderRadius: 12,
                  background: a.type === "danger" ? "rgba(239,68,68,0.06)" : a.type === "warning" ? "rgba(245,158,11,0.06)" : "rgba(0,150,136,0.06)",
                  borderLeft: `3px solid ${a.type === "danger" ? "#EF4444" : a.type === "warning" ? "#F59E0B" : "#009688"}`,
                }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <span className="badge" style={{ background: badge.bg, color: badge.color, fontSize: 9, padding: "2px 7px" }}>{badge.label}</span>
                      <span style={{ fontSize: 10, color: "var(--text-secondary)" }}>Priority {a.priority}/100</span>
                    </div>
                  </div>
                  <div style={{ fontSize: 13, marginBottom: 8, lineHeight: 1.5 }}>{a.msg}</div>
                  <div style={{ display: "flex", gap: 8 }}>
                    <Link href={a.href}>
                      <button className="btn-secondary" style={{ padding: "5px 12px", fontSize: 12 }}>
                        {a.action} <ChevronRight size={11} style={{ marginLeft: 2, display: "inline" }} />
                      </button>
                    </Link>
                    <button
                      className="btn-secondary"
                      style={{ padding: "5px 12px", fontSize: 12, color: "#25D366", borderColor: "#25D366" }}
                      onClick={() => {
                        const msg = encodeURIComponent(`Dear Parent,\n\n⚠️ EduAI Alert:\n${a.msg}\n\nPlease ensure extra practice at home.\n\n— Sent via EduAI`);
                        window.open(`https://wa.me/?text=${msg}`, "_blank");
                      }}
                    >💬 Notify</button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* AI Quick-Start Banner */}
      <div className="card animate-fade-in stagger-5" style={{
        background: "linear-gradient(135deg, rgba(0,150,136,0.12), rgba(0,188,212,0.08))",
        border: "1px solid rgba(0,150,136,0.25)",
        display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 16
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div className="icon-wrap animate-float" style={{ width: 52, height: 52, fontSize: 26 }}>🤖</div>
          <div>
            <div style={{ fontWeight: 700, fontSize: 17, marginBottom: 3 }}>AI is ready for today</div>
            <div style={{ fontSize: 13, color: "var(--text-secondary)" }}>
              Generate a lesson plan, test paper, or remedial content in under 60 seconds.
            </div>
          </div>
        </div>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <Link href="/dashboard/lesson">
            <button className="btn-primary" style={{ padding: "10px 20px", fontSize: 13 }}>
              <Zap size={14} /> Start Lesson Plan
            </button>
          </Link>
          <Link href="/dashboard/test">
            <button className="btn-secondary" style={{ padding: "10px 20px", fontSize: 13 }}>
              Create Test Paper
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
