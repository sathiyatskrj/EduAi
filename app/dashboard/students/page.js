"use client";
import { useState } from "react";
import Link from "next/link";
import { Search, UserPlus, Filter, ArrowUpDown, MessageCircle, Zap, TrendingUp, TrendingDown, Minus } from "lucide-react";
import AddStudentModal from "@/app/components/AddStudentModal";

const INITIAL_STUDENTS = [
  { name: "Aarav Sharma",  id: "S001", cls: "VII-A", perf: 85, trend: "up",   status: "Good",       phone: "9876543210", parent: "Mr. Sharma",  weakTopics: [] },
  { name: "Avni Patel",    id: "S002", cls: "VII-A", perf: 92, trend: "up",   status: "Excellent",  phone: "9876543211", parent: "Mrs. Patel",  weakTopics: [] },
  { name: "Dhruv Singh",   id: "S003", cls: "VII-A", perf: 64, trend: "down", status: "Average",    phone: "9876543212", parent: "Mr. Singh",   weakTopics: ["Fractions"] },
  { name: "Diya Reddy",    id: "S004", cls: "VII-A", perf: 38, trend: "down", status: "Needs Help", phone: "9876543213", parent: "Mrs. Reddy",  weakTopics: ["Fractions", "Algebra"] },
  { name: "Ishaan Kumar",  id: "S005", cls: "VII-A", perf: 78, trend: "flat", status: "Good",       phone: "9876543214", parent: "Mr. Kumar",   weakTopics: [] },
  { name: "Kavya Gupta",   id: "S006", cls: "VII-A", perf: 42, trend: "down", status: "Needs Help", phone: "9876543215", parent: "Mrs. Gupta",  weakTopics: ["Algebraic Identities", "Word Problems"] },
  { name: "Lakshmi Nair",  id: "S007", cls: "VII-A", perf: 71, trend: "up",   status: "Good",       phone: "9876543216", parent: "Mrs. Nair",   weakTopics: [] },
  { name: "Mohan Rao",     id: "S008", cls: "VII-A", perf: 55, trend: "down", status: "Average",    phone: "9876543217", parent: "Mr. Rao",     weakTopics: ["Geometry"] },
  { name: "Neha Joshi",    id: "S009", cls: "VII-A", perf: 88, trend: "up",   status: "Excellent",  phone: "9876543218", parent: "Mrs. Joshi",  weakTopics: [] },
  { name: "Om Prakash",    id: "S010", cls: "VII-A", perf: 33, trend: "down", status: "Needs Help", phone: "9876543219", parent: "Mr. Prakash", weakTopics: ["Fractions", "Decimals", "Algebra"] },
  { name: "Priya Verma",   id: "S011", cls: "VII-A", perf: 76, trend: "flat", status: "Good",       phone: "9876543220", parent: "Mr. Verma",   weakTopics: [] },
];

// Tiny sparkline SVG from an array of 3 values
function Sparkline({ perf }) {
  const pts = [perf - 8, perf - 3, perf]; // mock past 3 scores
  const max = Math.max(...pts), min = Math.min(...pts);
  const norm = (v) => 24 - ((v - min) / (max - min || 1)) * 20;
  const color = perf < 50 ? "#EF4444" : perf > 80 ? "#10B981" : "#009688";
  const d = pts.map((v, i) => `${i === 0 ? "M" : "L"}${i * 22},${norm(v)}`).join(" ");
  return (
    <svg width="48" height="26" viewBox="0 0 48 26" style={{ overflow: "visible" }}>
      <path d={d} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={44} cy={norm(pts[2])} r="3" fill={color} />
    </svg>
  );
}

export default function Students() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [sort, setSort] = useState("perf-desc");
  const [remedialDialog, setRemedialDialog] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [studentsList, setStudentsList] = useState(INITIAL_STUDENTS);

  const STATUS_FILTERS = ["All", "Excellent", "Good", "Average", "Needs Help"];

  const addStudent = (student) => {
    setStudentsList(prev => [student, ...prev]);
  };

  const sendWhatsApp = (student) => {
    const msg = encodeURIComponent(
      `Dear ${student.parent},\n\nProgress update for ${student.name} (${student.cls}).\n\n` +
      `📊 Average: ${student.perf}%\n` +
      `📈 Trend: ${student.trend === "up" ? "Improving ↑" : student.trend === "down" ? "Declining ↓" : "Stable →"}\n` +
      `${student.weakTopics.length > 0 ? `⚠️ Weak Topics: ${student.weakTopics.join(", ")}\n` : "✅ No weak topics.\n"}` +
      `\nPlease encourage regular practice at home.\n\n— Sent via EduAI`
    );
    window.open(`https://wa.me/91${student.phone}?text=${msg}`, "_blank");
  };

  const triggerRemedial = (student) => {
    setRemedialDialog(student.id);
    setTimeout(() => setRemedialDialog(null), 2500);
  };

  let filtered = studentsList.filter(s => {
    const matchSearch = s.name.toLowerCase().includes(search.toLowerCase()) || s.id.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === "All" || s.status === filter;
    return matchSearch && matchFilter;
  });

  // Sort
  if (sort === "perf-desc") filtered = [...filtered].sort((a, b) => b.perf - a.perf);
  if (sort === "perf-asc")  filtered = [...filtered].sort((a, b) => a.perf - b.perf);
  if (sort === "name-asc")  filtered = [...filtered].sort((a, b) => a.name.localeCompare(b.name));

  const atRisk = studentsList.filter(s => s.perf < 50);

  return (
    <div className="animate-fade-in">
      {showModal && <AddStudentModal onAdd={addStudent} onClose={() => setShowModal(false)} />}

      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 28, flexWrap: "wrap", gap: 16 }}>
        <div>
          <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 4, display: "flex", alignItems: "center", gap: 10 }}>
            <span className="icon-wrap" style={{ fontSize: 20 }}>👤</span> Student Profiles
          </h1>
          <p style={{ color: "var(--text-secondary)" }}>Individual performance tracking and diagnostic cards.</p>
        </div>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <div style={{ position: "relative" }}>
            <Search size={15} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "var(--text-secondary)", pointerEvents: "none" }} />
            <input
              type="text"
              placeholder="Search student..."
              className="input-field"
              style={{ width: 220, padding: "10px 14px 10px 36px" }}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <button className="btn-primary" style={{ padding: "10px 18px", gap: 6 }} onClick={() => setShowModal(true)}>
            <UserPlus size={15} /> Add Student
          </button>
        </div>
      </div>

      {/* Filter + Sort Bar */}
      <div style={{ display: "flex", gap: 12, marginBottom: 20, alignItems: "center", flexWrap: "wrap" }}>
        <div style={{ display: "flex", gap: 6, background: "rgba(255,255,255,0.04)", padding: 4, borderRadius: 12 }}>
          {STATUS_FILTERS.map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              style={{
                padding: "6px 14px", borderRadius: 8, fontSize: 12, fontWeight: 600, border: "none", cursor: "pointer",
                background: filter === f ? "var(--primary)" : "transparent",
                color: filter === f ? "white" : "var(--text-secondary)", transition: "all 0.2s"
              }}
            >{f}</button>
          ))}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <ArrowUpDown size={13} color="var(--text-secondary)" />
          <select
            value={sort}
            onChange={e => setSort(e.target.value)}
            className="input-field"
            style={{ padding: "7px 32px 7px 12px", fontSize: 12, width: "auto" }}
          >
            <option value="perf-desc">Highest Score</option>
            <option value="perf-asc">Lowest Score</option>
            <option value="name-asc">Name A–Z</option>
          </select>
        </div>
        <span style={{ fontSize: 12, color: "var(--text-secondary)", marginLeft: "auto" }}>{filtered.length} students</span>
      </div>

      {/* At-Risk Banner */}
      {atRisk.length > 0 && filter === "All" && !search && (
        <div style={{
          background: "rgba(239,68,68,0.07)", border: "1px solid rgba(239,68,68,0.25)",
          borderRadius: 14, padding: "14px 20px", marginBottom: 20,
          display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12
        }}>
          <div>
            <span style={{ fontWeight: 700, color: "var(--danger)" }}>⚠️ {atRisk.length} students at-risk (&lt;50%)</span>
            <span style={{ color: "var(--text-secondary)", marginLeft: 10, fontSize: 13 }}>
              {atRisk.map(s => s.name.split(" ")[0]).join(", ")}
            </span>
          </div>
          <button
            className="btn-primary"
            style={{ padding: "8px 18px", fontSize: 13, background: "var(--danger)", boxShadow: "none" }}
            onClick={() => atRisk.forEach(s => triggerRemedial(s))}
          >
            <Zap size={13} /> Auto-Generate All Remedials
          </button>
        </div>
      )}

      {/* Student Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 18 }}>
        {filtered.map((s, i) => (
          <div key={s.id} className={`card animate-fade-in stagger-${(i % 6) + 1}`} style={{ display: "flex", flexDirection: "column", gap: 14, position: "relative" }}>
            {/* Remedial overlay */}
            {remedialDialog === s.id && (
              <div style={{ position: "absolute", inset: 0, background: "rgba(15,23,42,0.92)", borderRadius: 18, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", zIndex: 10, gap: 12 }}>
                <div className="icon-wrap animate-pulse-glow" style={{ fontSize: 28, width: 60, height: 60 }}>🧠</div>
                <div style={{ fontWeight: 700, fontSize: 15 }}>Generating Remedial...</div>
                <div className="skeleton" style={{ width: "60%", height: 6, marginTop: 4 }} />
              </div>
            )}

            {/* Top row */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                <div style={{
                  width: 46, height: 46, borderRadius: "50%",
                  background: s.perf < 50 ? "rgba(239,68,68,0.15)" : s.perf > 80 ? "rgba(16,185,129,0.15)" : "rgba(0,150,136,0.12)",
                  color: s.perf < 50 ? "var(--danger)" : s.perf > 80 ? "var(--success)" : "var(--primary)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 17, fontWeight: 800, flexShrink: 0,
                }}>
                  {s.name.charAt(0)}
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 15 }}>{s.name}</div>
                  <div style={{ fontSize: 12, color: "var(--text-secondary)" }}>{s.id} • {s.cls}</div>
                </div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: 22, fontWeight: 800, color: s.perf < 50 ? "var(--danger)" : s.perf > 80 ? "var(--success)" : "var(--primary)" }}>
                  {s.perf}%
                </div>
                <Sparkline perf={s.perf} />
              </div>
            </div>

            {/* Trend + Status */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "var(--text-secondary)" }}>
                {s.trend === "up" ? <TrendingUp size={14} color="var(--success)" /> : s.trend === "down" ? <TrendingDown size={14} color="var(--danger)" /> : <Minus size={14} color="var(--text-secondary)" />}
                {s.trend === "up" ? "Improving" : s.trend === "down" ? "Declining" : "Stable"}
              </div>
              <span className={`badge badge-${s.perf < 50 ? "danger" : s.perf > 80 ? "success" : "info"}`} style={{ fontSize: 11 }}>{s.status}</span>
            </div>

            {/* Performance Bar */}
            <div>
              <div style={{ height: 4, background: "rgba(255,255,255,0.06)", borderRadius: 4, overflow: "hidden" }}>
                <div className="progress-bar-fill" style={{
                  width: `${s.perf}%`,
                  background: s.perf < 50 ? "var(--danger)" : s.perf > 80 ? "var(--success)" : "var(--gradient-1)"
                }} />
              </div>
            </div>

            {/* Weak Topics */}
            {s.weakTopics.length > 0 && (
              <div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>
                {s.weakTopics.map((t, j) => (
                  <span key={j} className="badge badge-warning" style={{ fontSize: 10 }}>{t}</span>
                ))}
              </div>
            )}

            {/* Actions */}
            <div style={{ display: "flex", gap: 8, marginTop: 2 }}>
              <Link href="/dashboard/diagnosis" style={{ flex: 1 }}>
                <button className="btn-secondary" style={{ width: "100%", padding: "8px", fontSize: 12 }}>View Card</button>
              </Link>
              <button
                className="btn-secondary"
                style={{ padding: "8px 12px", fontSize: 12, color: "#25D366", borderColor: "#25D366" }}
                onClick={() => sendWhatsApp(s)}
                title="Send progress to parent"
              >
                <MessageCircle size={14} />
              </button>
              {s.perf < 50 && (
                <button
                  className="btn-primary"
                  style={{ flex: 1, padding: "8px", fontSize: 12, background: "var(--danger)", boxShadow: "none", justifyContent: "center" }}
                  onClick={() => triggerRemedial(s)}
                >
                  <Zap size={12} /> Remedial
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="card animate-fade-in" style={{ textAlign: "center", padding: "60px 20px" }}>
          <div className="icon-wrap" style={{ width: 72, height: 72, fontSize: 32, margin: "0 auto 16px" }}>🕵️</div>
          <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>No students found</h3>
          <p style={{ color: "var(--text-secondary)" }}>
            {search ? `No match for "${search}".` : `No students with status "${filter}".`}
          </p>
          <button className="btn-secondary" onClick={() => { setSearch(""); setFilter("All"); }} style={{ marginTop: 20 }}>
            Clear Filters
          </button>
        </div>
      )}
    </div>
  );
}
