"use client";
import { useState } from "react";
import Link from "next/link";

export default function Students() {
  const [search, setSearch] = useState("");
  const [remedialDialog, setRemedialDialog] = useState(null); // student id for modal

  const students = [
    { name: "Aarav Sharma", id: "S001", cls: "VII-A", perf: 85, trend: "up", status: "Good", phone: "9876543210", parent: "Mr. Sharma", weakTopics: [] },
    { name: "Avni Patel", id: "S002", cls: "VII-A", perf: 92, trend: "up", status: "Excellent", phone: "9876543211", parent: "Mrs. Patel", weakTopics: [] },
    { name: "Dhruv Singh", id: "S003", cls: "VII-A", perf: 64, trend: "down", status: "Average", phone: "9876543212", parent: "Mr. Singh", weakTopics: ["Fractions"] },
    { name: "Diya Reddy", id: "S004", cls: "VII-A", perf: 38, trend: "down", status: "Needs Help", phone: "9876543213", parent: "Mrs. Reddy", weakTopics: ["Fractions", "Algebra"] },
    { name: "Ishaan Kumar", id: "S005", cls: "VII-A", perf: 78, trend: "flat", status: "Good", phone: "9876543214", parent: "Mr. Kumar", weakTopics: [] },
    { name: "Kavya Gupta", id: "S006", cls: "VII-A", perf: 42, trend: "down", status: "Needs Help", phone: "9876543215", parent: "Mrs. Gupta", weakTopics: ["Algebraic Identities", "Word Problems"] },
    { name: "Lakshmi Nair", id: "S007", cls: "VII-A", perf: 71, trend: "up", status: "Good", phone: "9876543216", parent: "Mrs. Nair", weakTopics: [] },
    { name: "Mohan Rao", id: "S008", cls: "VII-A", perf: 55, trend: "down", status: "Average", phone: "9876543217", parent: "Mr. Rao", weakTopics: ["Geometry"] },
    { name: "Neha Joshi", id: "S009", cls: "VII-A", perf: 88, trend: "up", status: "Excellent", phone: "9876543218", parent: "Mrs. Joshi", weakTopics: [] },
    { name: "Om Prakash", id: "S010", cls: "VII-A", perf: 33, trend: "down", status: "Needs Help", phone: "9876543219", parent: "Mr. Prakash", weakTopics: ["Fractions", "Decimals", "Algebra"] },
    { name: "Priya Verma", id: "S011", cls: "VII-A", perf: 76, trend: "flat", status: "Good", phone: "9876543220", parent: "Mr. Verma", weakTopics: [] },
  ];

  const filtered = students.filter(s =>
    s.name.toLowerCase().includes(search.toLowerCase()) || s.id.toLowerCase().includes(search.toLowerCase())
  );

  // SCAMPER: Combine — Generate WhatsApp message for parent
  const sendWhatsApp = (student) => {
    const msg = encodeURIComponent(
      `Dear ${student.parent},\n\nThis is a progress update for ${student.name} (${student.cls}).\n\n` +
      `📊 Current Average: ${student.perf}%\n` +
      `📈 Trend: ${student.trend === "up" ? "Improving ↑" : student.trend === "down" ? "Declining ↓" : "Stable →"}\n` +
      `${student.weakTopics.length > 0 ? `⚠️ Weak Topics: ${student.weakTopics.join(", ")}\n` : "✅ No weak topics identified.\n"}` +
      `\nPlease ensure regular practice at home. Contact us for any queries.\n\n— Sent via EduAI`
    );
    window.open(`https://wa.me/91${student.phone}?text=${msg}`, "_blank");
  };

  // SCAMPER: Combine — Auto-Remedial for a student
  const triggerRemedial = (student) => {
    setRemedialDialog(student.id);
    // In production, this would call the AI API
    setTimeout(() => setRemedialDialog(null), 3000);
  };

  return (
    <div className="animate-fade-in">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 32, flexWrap: "wrap", gap: 16 }}>
        <div>
          <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 4 }}>👤 Student Profiles</h1>
          <p style={{ color: "var(--text-secondary)" }}>Individual performance tracking and diagnostic cards.</p>
        </div>
        <div style={{ display: "flex", gap: 12 }}>
          <input
            type="text"
            placeholder="Search student..."
            className="input-field"
            style={{ width: 250, padding: "10px 16px" }}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button className="btn-primary" style={{ padding: "10px 20px" }}>+ Add Student</button>
        </div>
      </div>

      {/* At-Risk Summary Banner */}
      {(() => {
        const atRisk = students.filter(s => s.perf < 50);
        return atRisk.length > 0 && (
          <div style={{ background: "rgba(239,68,68,0.06)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: 16, padding: "16px 24px", marginBottom: 24, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
            <div>
              <span style={{ fontWeight: 700, color: "var(--danger)" }}>⚠️ {atRisk.length} students at-risk</span>
              <span style={{ color: "var(--text-secondary)", marginLeft: 12, fontSize: 13 }}>
                {atRisk.map(s => s.name).join(", ")}
              </span>
            </div>
            <button className="btn-primary" style={{ padding: "8px 20px", fontSize: 13, background: "var(--danger)" }} onClick={() => atRisk.forEach(s => triggerRemedial(s))}>
              ⚡ Auto-Generate All Remedials
            </button>
          </div>
        );
      })()}

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 20 }}>
        {filtered.map((s, i) => (
          <div key={i} className={`card stagger-${(i % 5) + 1}`} style={{ display: "flex", flexDirection: "column", gap: 16, position: "relative" }}>
            {/* Auto-Remedial Generating Overlay */}
            {remedialDialog === s.id && (
              <div style={{ position: "absolute", inset: 0, background: "rgba(15,23,42,0.92)", borderRadius: 16, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", zIndex: 10 }}>
                <div className="icon-wrap animate-pulse-glow" style={{ fontSize: 32, width: 64, height: 64, marginBottom: 12 }}>🧠</div>
                <div style={{ fontWeight: 700, fontSize: 16, color: "var(--text-primary)" }}>Generating Remedial...</div>
                <div className="loading-shimmer" style={{ width: "60%", height: 6, borderRadius: 4, marginTop: 12 }}></div>
              </div>
            )}

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                <div style={{ width: 48, height: 48, borderRadius: "50%", background: "rgba(0,150,136,0.1)", color: "var(--primary)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, fontWeight: 700 }}>
                  {s.name.charAt(0)}
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 16 }}>{s.name}</div>
                  <div style={{ fontSize: "var(--text-sm)", color: "var(--text-secondary)" }}>{s.id} • {s.cls}</div>
                </div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: 20, fontWeight: 800, color: s.perf < 50 ? "var(--danger)" : s.perf > 80 ? "var(--success)" : "var(--primary)" }}>{s.perf}%</div>
                <div style={{ fontSize: 12, color: "var(--text-secondary)" }}>Avg Score</div>
              </div>
            </div>

            {/* Weak topics */}
            {s.weakTopics.length > 0 && (
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                {s.weakTopics.map((t, j) => (
                  <span key={j} className="badge badge-warning" style={{ fontSize: 11 }}>{t}</span>
                ))}
              </div>
            )}

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: "rgba(15,23,42,0.5)", padding: "10px 14px", borderRadius: 8 }}>
              <span style={{ fontSize: 13, fontWeight: 600, color: "var(--text-secondary)" }}>Status</span>
              <span className={`badge badge-${s.perf < 50 ? "danger" : s.perf > 80 ? "success" : "info"}`}>{s.status}</span>
            </div>

            <div style={{ display: "flex", gap: 8 }}>
              <Link href="/dashboard/diagnosis" style={{ flex: 1 }}>
                <button className="btn-secondary" style={{ width: "100%", padding: "8px", fontSize: 13 }}>View Card</button>
              </Link>

              {/* Feature 8: WhatsApp Alert */}
              <button
                className="btn-secondary"
                style={{ padding: "8px 12px", fontSize: 13, color: "#25D366", borderColor: "#25D366" }}
                onClick={() => sendWhatsApp(s)}
                title="Send progress report to parent via WhatsApp"
              >
                💬
              </button>

              {/* Feature 9: Auto-Remedial */}
              {s.perf < 50 && (
                <button
                  className="btn-primary"
                  style={{ flex: 1, padding: "8px", fontSize: 13, background: "var(--danger)", boxShadow: "none" }}
                  onClick={() => triggerRemedial(s)}
                >
                  ⚡ Remedial
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="card animate-fade-in" style={{ textAlign: "center", padding: "60px 20px" }}>
          <div className="icon-wrap" style={{ width: 80, height: 80, fontSize: 36, margin: "0 auto 20px" }}>🕵️‍♂️</div>
          <h3 style={{ fontSize: 20, fontWeight: 700, marginBottom: 8 }}>No students found</h3>
          <p style={{ color: "var(--text-secondary)" }}>We couldn&apos;t find any students matching &quot;{search}&quot;. Try adjusting your search.</p>
          <button className="btn-secondary" onClick={() => setSearch("")} style={{ marginTop: 20 }}>Clear Search</button>
        </div>
      )}
    </div>
  );
}
