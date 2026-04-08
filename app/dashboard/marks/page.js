"use client";
import { useState } from "react";
import Link from "next/link";

export default function MarksEntry() {
  const [method, setMethod] = useState("total");
  const [cls, setCls] = useState("VII-A");
  const [subject, setSubject] = useState("Mathematics");
  const [submitted, setSubmitted] = useState(false);
  
  const STUDENTS = [
    { id: 1, name: "Aarav Sharma", roll: "01" },
    { id: 2, name: "Avni Patel", roll: "02" },
    { id: 3, name: "Dhruv Singh", roll: "03" },
    { id: 4, name: "Diya Reddy", roll: "04" },
    { id: 5, name: "Ishaan Kumar", roll: "05" },
    { id: 6, name: "Kavya Gupta", roll: "06" },
    { id: 7, name: "Lakshmi Nair", roll: "07" },
    { id: 8, name: "Mohan Rao", roll: "08" },
    { id: 9, name: "Neha Joshi", roll: "09" },
    { id: 10, name: "Om Prakash", roll: "10" },
    { id: 11, name: "Priya Verma", roll: "11" },
  ];

  const handleSubmit = () => {
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="animate-fade-in">
        <div className="card" style={{ maxWidth: 600, margin: "0 auto", textAlign: "center", padding: "60px 40px" }}>
          <div style={{ fontSize: 64, marginBottom: 20 }}>✅</div>
          <h2 style={{ fontSize: 24, fontWeight: 800, marginBottom: 12 }}>Marks Submitted Successfully!</h2>
          <p style={{ color: "var(--text-secondary)", marginBottom: 8 }}>
            {STUDENTS.length} students • {cls} {subject} • Unit Test 1
          </p>
          
          {/* SCAMPER: Combine — Unified Analyze Flow */}
          <div style={{ background: "rgba(0,150,136,0.06)", border: "1px solid rgba(0,150,136,0.2)", borderRadius: 16, padding: 24, margin: "24px 0", textAlign: "left" }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: "var(--primary)", marginBottom: 12 }}>⚡ AUTO-ANALYSIS TRIGGERED</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {[
                { icon: "📊", label: "Statistics Engine", status: "Computed", detail: "Mean, Median, SD, 10 measures" },
                { icon: "🔍", label: "Diagnostic Engine", status: "Complete", detail: "4 weak concepts identified" },
                { icon: "💊", label: "Remedial Plans", status: "Ready", detail: "3 students flagged for remedial" },
              ].map((item, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 14px", borderRadius: 10, background: "rgba(15,23,42,0.4)" }}>
                  <span style={{ fontSize: 22 }}>{item.icon}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600, fontSize: 14 }}>{item.label}</div>
                    <div style={{ fontSize: 12, color: "var(--text-secondary)" }}>{item.detail}</div>
                  </div>
                  <span className="badge badge-success">{item.status}</span>
                </div>
              ))}
            </div>
          </div>

          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            <Link href="/dashboard/stats">
              <button className="btn-primary" style={{ padding: "14px 28px" }}>📊 View Full Analysis</button>
            </Link>
            <Link href="/dashboard/diagnosis">
              <button className="btn-secondary" style={{ padding: "14px 28px" }}>🔍 View Diagnosis</button>
            </Link>
            <button className="btn-secondary" style={{ padding: "14px 28px" }} onClick={() => setSubmitted(false)}>← Enter More Marks</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 4 }}>✏️ Marks Entry System</h1>
        <p style={{ color: "var(--text-secondary)" }}>Quick-enter marks → auto-triggers Stats + Diagnosis + Remedial.</p>
      </div>

      <div className="card" style={{ marginBottom: 24 }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16 }}>
          <div>
            <label style={{ fontSize: 13, fontWeight: 600, color: "var(--text-secondary)", marginBottom: 6, display: "block" }}>Class Section</label>
            <select value={cls} onChange={e => setCls(e.target.value)} className="input-field">
              {["VII-A", "VII-B", "VIII-A", "IX-A"].map(c => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label style={{ fontSize: 13, fontWeight: 600, color: "var(--text-secondary)", marginBottom: 6, display: "block" }}>Subject</label>
            <select value={subject} onChange={e => setSubject(e.target.value)} className="input-field">
              {["Mathematics", "Science", "English"].map(s => <option key={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label style={{ fontSize: 13, fontWeight: 600, color: "var(--text-secondary)", marginBottom: 6, display: "block" }}>Test Name</label>
            <input type="text" className="input-field" placeholder="e.g. Unit Test 1" defaultValue="Unit Test 1" />
          </div>
          <div>
            <label style={{ fontSize: 13, fontWeight: 600, color: "var(--text-secondary)", marginBottom: 6, display: "block" }}>Max Marks</label>
            <input type="number" className="input-field" defaultValue={50} />
          </div>
        </div>
      </div>

      <div className="card">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20, flexWrap: "wrap", gap: 16 }}>
          <div style={{ display: "flex", gap: 10, background: "rgba(15,23,42,0.5)", padding: 4, borderRadius: 12 }}>
            <button
              onClick={() => setMethod("total")}
              style={{ padding: "8px 16px", borderRadius: 8, fontSize: 13, fontWeight: 600, background: method === "total" ? "var(--primary)" : "transparent", color: method === "total" ? "white" : "var(--text-secondary)", border: "none", cursor: "pointer", transition: "all 0.2s" }}
            >
              Total Marks Entry
            </button>
            <button
              onClick={() => setMethod("question")}
              style={{ padding: "8px 16px", borderRadius: 8, fontSize: 13, fontWeight: 600, background: method === "question" ? "var(--primary)" : "transparent", color: method === "question" ? "white" : "var(--text-secondary)", border: "none", cursor: "pointer", transition: "all 0.2s" }}
            >
              Question-wise Entry
            </button>
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <button className="btn-secondary" style={{ padding: "8px 16px", fontSize: 13 }}>📥 Upload CSV</button>
            <button className="btn-secondary" style={{ padding: "8px 16px", fontSize: 13 }} disabled>📸 Scan Sheets (V2)</button>
          </div>
        </div>

        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", minWidth: 600, borderCollapse: "collapse" }}>
            <thead>
              <tr>
                <th style={{ textAlign: "left", padding: "12px 16px", borderBottom: "1px solid var(--border)", color: "var(--text-secondary)", fontSize: 13, fontWeight: 600, width: "80px" }}>Roll No</th>
                <th style={{ textAlign: "left", padding: "12px 16px", borderBottom: "1px solid var(--border)", color: "var(--text-secondary)", fontSize: 13, fontWeight: 600 }}>Student Name</th>
                <th style={{ textAlign: "center", padding: "12px 16px", borderBottom: "1px solid var(--border)", color: "var(--text-secondary)", fontSize: 13, fontWeight: 600, width: "100px" }}>Present</th>
                {method === "total" ? (
                  <th style={{ textAlign: "right", padding: "12px 16px", borderBottom: "1px solid var(--border)", color: "var(--text-secondary)", fontSize: 13, fontWeight: 600, width: "150px" }}>Marks Obtained</th>
                ) : (
                  <>
                    {[1,2,3,4,5].map(q => (
                      <th key={q} style={{ textAlign: "center", padding: "12px 8px", borderBottom: "1px solid var(--border)", color: "var(--text-secondary)", fontSize: 13, fontWeight: 600, width: "60px" }}>Q{q}</th>
                    ))}
                    <th style={{ textAlign: "right", padding: "12px 16px", borderBottom: "1px solid var(--border)", color: "var(--text-secondary)", fontSize: 13, fontWeight: 600, width: "100px" }}>Total</th>
                  </>
                )}
              </tr>
            </thead>
            <tbody>
              {STUDENTS.map((s) => (
                <tr key={s.id} style={{ borderBottom: "1px solid rgba(51, 65, 85, 0.4)" }}>
                  <td style={{ padding: "12px 16px", fontSize: 14 }}>{s.roll}</td>
                  <td style={{ padding: "12px 16px", fontSize: 14, fontWeight: 500 }}>{s.name}</td>
                  <td style={{ padding: "12px 16px", textAlign: "center" }}>
                    <input type="checkbox" defaultChecked style={{ width: 16, height: 16, accentColor: "var(--primary)" }} />
                  </td>
                  {method === "total" ? (
                    <td style={{ padding: "8px 16px" }}>
                      <input type="number" className="input-field" style={{ padding: "8px 12px", textAlign: "right", minWidth: 80 }} placeholder="0" />
                    </td>
                  ) : (
                    <>
                      {[1,2,3,4,5].map(q => (
                        <td key={q} style={{ padding: "8px 4px" }}>
                          <input type="number" className="input-field" style={{ padding: "6px", textAlign: "center", width: "100%" }} placeholder="0" />
                        </td>
                      ))}
                      <td style={{ padding: "12px 16px", textAlign: "right", fontWeight: 700 }}>0</td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 24, paddingTop: 20, borderTop: "1px solid var(--border)" }}>
          <div style={{ fontSize: 13, color: "var(--text-secondary)" }}>Showing {STUDENTS.length} students</div>
          <div style={{ display: "flex", gap: 12 }}>
            <button className="btn-secondary" style={{ padding: "10px 24px", fontSize: 14 }}>Save Draft</button>
            <button className="btn-primary" style={{ padding: "10px 24px", fontSize: 14 }} onClick={handleSubmit}>
              ⚡ Submit &amp; Auto-Analyze
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
