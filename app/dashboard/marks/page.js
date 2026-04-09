"use client";
import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { Upload, Mic, MicOff, Check, Save, AlertTriangle } from "lucide-react";
import { useApp } from "@/app/components/AppContext";

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

export default function MarksEntry() {
  const { showToast } = useApp();
  const [method, setMethod] = useState("total");
  const [cls, setCls] = useState("VII-A");
  const [subject, setSubject] = useState("Mathematics");
  const [maxMarks, setMaxMarks] = useState(50);
  const [submitted, setSubmitted] = useState(false);
  const [voiceActive, setVoiceActive] = useState(false);
  const [voiceText, setVoiceText] = useState("");
  const [present, setPresent] = useState(() => Object.fromEntries(STUDENTS.map(s => [s.id, true])));
  const [marks, setMarks] = useState(() => Object.fromEntries(STUDENTS.map(s => [s.id, ""])));
  const [qMarks, setQMarks] = useState(() =>
    Object.fromEntries(STUDENTS.map(s => [s.id, { q1: "", q2: "", q3: "", q4: "", q5: "" }]))
  );

  // Auto-save draft every 15s
  useEffect(() => {
    const timer = setInterval(() => {
      const draft = { cls, subject, method, marks, qMarks, present, maxMarks };
      localStorage.setItem("eduai-marks-draft", JSON.stringify(draft));
    }, 15000);
    return () => clearInterval(timer);
  }, [cls, subject, method, marks, qMarks, present, maxMarks]);

  // Load draft on mount
  useEffect(() => {
    const saved = localStorage.getItem("eduai-marks-draft");
    if (saved) {
      try {
        const d = JSON.parse(saved);
        if (d.marks) setMarks(d.marks);
        if (d.qMarks) setQMarks(d.qMarks);
        if (d.present) setPresent(d.present);
        if (d.maxMarks) setMaxMarks(d.maxMarks);
      } catch {}
    }
  }, []);

  const getQTotal = (sid) => {
    const q = qMarks[sid];
    if (!q) return 0;
    return Object.values(q).reduce((sum, v) => sum + (parseFloat(v) || 0), 0);
  };

  const getRowColor = (score) => {
    const pct = (score / maxMarks) * 100;
    if (pct < 40) return "mark-row-danger";
    if (pct < 60) return "mark-row-warning";
    return "";
  };

  // CSV Import
  const handleCSV = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const lines = ev.target.result.split("\n").map(l => l.trim()).filter(Boolean);
      let imported = 0;
      lines.forEach(line => {
        const parts = line.split(",").map(p => p.trim());
        if (parts.length >= 2) {
          const roll = parts[0];
          const score = parts[1];
          const student = STUDENTS.find(s => s.roll === roll);
          if (student && !isNaN(score)) {
            setMarks(prev => ({ ...prev, [student.id]: score }));
            imported++;
          }
        }
      });
      showToast(`Imported ${imported} marks from CSV`);
    };
    reader.readAsText(file);
    e.target.value = "";
  };

  // Voice Entry
  const startVoice = () => {
    if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      showToast("Voice input not supported. Try Chrome.", "error");
      return;
    }
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-IN";
    setVoiceActive(true);
    setVoiceText("");
    recognition.onresult = (event) => {
      let transcript = "";
      for (let i = 0; i < event.results.length; i++) {
        transcript += event.results[i][0].transcript;
      }
      setVoiceText(transcript);
    };
    recognition.onerror = () => setVoiceActive(false);
    recognition.onend = () => setVoiceActive(false);
    recognition.start();
    setTimeout(() => { try { recognition.stop(); } catch {} }, 30000);
  };

  const markAllPresent = () => {
    setPresent(Object.fromEntries(STUDENTS.map(s => [s.id, true])));
    showToast("All students marked present");
  };

  const handleSubmit = () => {
    localStorage.removeItem("eduai-marks-draft");
    setSubmitted(true);
    showToast("Marks submitted & auto-analysis triggered! ✅");
  };

  const saveDraft = () => {
    const draft = { cls, subject, method, marks, qMarks, present, maxMarks };
    localStorage.setItem("eduai-marks-draft", JSON.stringify(draft));
    showToast("Draft saved locally 💾");
  };

  if (submitted) {
    return (
      <div className="animate-fade-in">
        <div className="card" style={{ maxWidth: 600, margin: "0 auto", textAlign: "center", padding: "50px 36px" }}>
          <div style={{ fontSize: 56, marginBottom: 16 }}>✅</div>
          <h2 style={{ fontSize: 22, fontWeight: 800, marginBottom: 10 }}>Marks Submitted Successfully!</h2>
          <p style={{ color: "var(--text-secondary)", marginBottom: 6 }}>
            {STUDENTS.length} students • {cls} {subject} • Unit Test 1
          </p>

          <div style={{ background: "rgba(0,150,136,0.06)", border: "1px solid rgba(0,150,136,0.2)", borderRadius: 14, padding: 20, margin: "20px 0", textAlign: "left" }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: "var(--primary)", marginBottom: 10 }}>⚡ AUTO-ANALYSIS TRIGGERED</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {[
                { icon: "📊", label: "Statistics Engine", status: "Computed", detail: "Mean, Median, SD + 7 more" },
                { icon: "🔍", label: "Diagnostic Engine", status: "Complete", detail: "4 weak concepts identified" },
                { icon: "💊", label: "Remedial Plans", status: "Ready", detail: "3 students flagged for remedial" },
              ].map((item, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", borderRadius: 10, background: "rgba(255,255,255,0.03)" }}>
                  <span style={{ fontSize: 20 }}>{item.icon}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600, fontSize: 13 }}>{item.label}</div>
                    <div style={{ fontSize: 11, color: "var(--text-secondary)" }}>{item.detail}</div>
                  </div>
                  <span className="badge badge-success" style={{ fontSize: 10 }}>{item.status}</span>
                </div>
              ))}
            </div>
          </div>

          <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap", marginTop: 16 }}>
            <Link href="/dashboard/stats"><button className="btn-primary" style={{ padding: "12px 24px", fontSize: 13 }}>📊 View Full Analysis</button></Link>
            <Link href="/dashboard/diagnosis"><button className="btn-secondary" style={{ padding: "12px 24px", fontSize: 13 }}>🔍 View Diagnosis</button></Link>
            <button className="btn-secondary" style={{ padding: "12px 24px", fontSize: 13 }} onClick={() => setSubmitted(false)}>← Enter More</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 4, display: "flex", alignItems: "center", gap: 10 }}>
          <span className="icon-wrap" style={{ fontSize: 20 }}>✏️</span> Marks Entry System
        </h1>
        <p style={{ color: "var(--text-secondary)" }}>Quick-enter marks → auto-triggers Stats + Diagnosis + Remedial.</p>
      </div>

      {/* Config */}
      <div className="card" style={{ marginBottom: 20 }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 14 }}>
          <div>
            <label style={{ fontSize: 12, fontWeight: 600, color: "var(--text-secondary)", marginBottom: 6, display: "block" }}>Class</label>
            <select value={cls} onChange={e => setCls(e.target.value)} className="input-field" style={{ padding: 10 }}>
              {["VII-A", "VII-B", "VIII-A", "IX-A"].map(c => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label style={{ fontSize: 12, fontWeight: 600, color: "var(--text-secondary)", marginBottom: 6, display: "block" }}>Subject</label>
            <select value={subject} onChange={e => setSubject(e.target.value)} className="input-field" style={{ padding: 10 }}>
              {["Mathematics", "Science", "English"].map(s => <option key={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label style={{ fontSize: 12, fontWeight: 600, color: "var(--text-secondary)", marginBottom: 6, display: "block" }}>Test Type</label>
            <select className="input-field" style={{ padding: 10 }}>
              <option>FA 1</option><option>SA 1</option><option>Unit Test 1</option><option>Half Yearly</option><option>Finals</option>
            </select>
          </div>
          <div>
            <label style={{ fontSize: 12, fontWeight: 600, color: "var(--text-secondary)", marginBottom: 6, display: "block" }}>Max Marks</label>
            <input type="number" className="input-field" value={maxMarks} onChange={e => setMaxMarks(parseInt(e.target.value) || 50)} style={{ padding: 10 }} />
          </div>
        </div>
      </div>

      {/* Voice Panel */}
      <div className="card" style={{ marginBottom: 20, background: voiceActive ? "rgba(0,150,136,0.06)" : undefined, border: voiceActive ? "1px solid rgba(0,150,136,0.3)" : undefined, transition: "all 0.3s" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: voiceText ? 14 : 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <button
              onClick={startVoice}
              disabled={voiceActive}
              style={{
                width: 42, height: 42, borderRadius: "50%", border: "none", cursor: "pointer",
                background: voiceActive ? "var(--danger)" : "var(--gradient-1)",
                color: "white", display: "flex", alignItems: "center", justifyContent: "center",
                boxShadow: voiceActive ? "0 0 20px rgba(239,68,68,0.4)" : "0 0 15px rgba(0,150,136,0.3)",
                animation: voiceActive ? "pulse-glow 1.5s ease-in-out infinite" : "none"
              }}
            >
              {voiceActive ? <MicOff size={18} /> : <Mic size={18} />}
            </button>
            <div>
              <div style={{ fontWeight: 600, fontSize: 13 }}>Voice Marks Entry</div>
              <div style={{ fontSize: 11, color: "var(--text-secondary)" }}>
                {voiceActive ? '🔴 Listening... say "Aarav 38, Avni 42..."' : "Click mic and speak marks aloud"}
              </div>
            </div>
          </div>
          {voiceText && <span className="badge badge-success" style={{ fontSize: 10 }}>Transcribed</span>}
        </div>
        {voiceText && (
          <div style={{ padding: 14, background: "rgba(255,255,255,0.04)", borderRadius: 10, fontSize: 13, lineHeight: 1.7, fontFamily: "monospace" }}>
            {voiceText}
          </div>
        )}
      </div>

      {/* Table */}
      <div className="card">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18, flexWrap: "wrap", gap: 12 }}>
          <div style={{ display: "flex", gap: 8, background: "rgba(255,255,255,0.04)", padding: 3, borderRadius: 10 }}>
            {["total", "question"].map(m => (
              <button key={m} onClick={() => setMethod(m)} style={{
                padding: "7px 16px", borderRadius: 8, fontSize: 12, fontWeight: 600,
                background: method === m ? "var(--primary)" : "transparent",
                color: method === m ? "white" : "var(--text-secondary)",
                border: "none", cursor: "pointer", transition: "all 0.2s"
              }}>
                {m === "total" ? "Total Entry" : "Q-wise Entry"}
              </button>
            ))}
          </div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <button className="btn-secondary" style={{ padding: "7px 14px", fontSize: 12 }} onClick={markAllPresent}>
              <Check size={12} /> Mark All Present
            </button>
            <label className="btn-secondary" style={{ padding: "7px 14px", fontSize: 12, cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 4 }}>
              <Upload size={12} /> Import CSV
              <input type="file" accept=".csv" onChange={handleCSV} style={{ display: "none" }} />
            </label>
          </div>
        </div>

        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", minWidth: 550, borderCollapse: "collapse" }}>
            <thead>
              <tr>
                <th style={{ textAlign: "left", padding: "10px 14px", borderBottom: "1px solid var(--border)", color: "var(--text-secondary)", fontSize: 12, fontWeight: 600, width: 70 }}>Roll</th>
                <th style={{ textAlign: "left", padding: "10px 14px", borderBottom: "1px solid var(--border)", color: "var(--text-secondary)", fontSize: 12, fontWeight: 600 }}>Name</th>
                <th style={{ textAlign: "center", padding: "10px 14px", borderBottom: "1px solid var(--border)", color: "var(--text-secondary)", fontSize: 12, fontWeight: 600, width: 70 }}>Present</th>
                {method === "total" ? (
                  <th style={{ textAlign: "right", padding: "10px 14px", borderBottom: "1px solid var(--border)", color: "var(--text-secondary)", fontSize: 12, fontWeight: 600, width: 130 }}>Marks (/{maxMarks})</th>
                ) : (
                  <>
                    {[1,2,3,4,5].map(q => (
                      <th key={q} style={{ textAlign: "center", padding: "10px 6px", borderBottom: "1px solid var(--border)", color: "var(--text-secondary)", fontSize: 12, fontWeight: 600, width: 60 }}>Q{q}</th>
                    ))}
                    <th style={{ textAlign: "right", padding: "10px 14px", borderBottom: "1px solid var(--border)", color: "var(--text-secondary)", fontSize: 12, fontWeight: 600, width: 80 }}>Total</th>
                  </>
                )}
              </tr>
            </thead>
            <tbody>
              {STUDENTS.map((s) => {
                const score = method === "total" ? (parseFloat(marks[s.id]) || 0) : getQTotal(s.id);
                const rowClass = present[s.id] && score > 0 ? getRowColor(score) : "";
                return (
                  <tr key={s.id} className={rowClass} style={{ borderBottom: "1px solid rgba(255,255,255,0.04)", transition: "background 0.3s" }}>
                    <td style={{ padding: "10px 14px", fontSize: 13 }}>{s.roll}</td>
                    <td style={{ padding: "10px 14px", fontSize: 13, fontWeight: 500 }}>{s.name}</td>
                    <td style={{ padding: "10px 14px", textAlign: "center" }}>
                      <input
                        type="checkbox"
                        checked={present[s.id]}
                        onChange={e => setPresent(p => ({ ...p, [s.id]: e.target.checked }))}
                        style={{ width: 16, height: 16, accentColor: "var(--primary)" }}
                      />
                    </td>
                    {method === "total" ? (
                      <td style={{ padding: "6px 14px" }}>
                        <input
                          type="number"
                          className="input-field"
                          style={{ padding: "7px 10px", textAlign: "right", minWidth: 70 }}
                          placeholder="0"
                          value={marks[s.id]}
                          onChange={e => setMarks(prev => ({ ...prev, [s.id]: e.target.value }))}
                          max={maxMarks}
                        />
                      </td>
                    ) : (
                      <>
                        {["q1","q2","q3","q4","q5"].map(q => (
                          <td key={q} style={{ padding: "6px 3px" }}>
                            <input
                              type="number"
                              className="input-field"
                              style={{ padding: "5px", textAlign: "center", width: "100%" }}
                              placeholder="0"
                              value={qMarks[s.id]?.[q] || ""}
                              onChange={e => setQMarks(prev => ({
                                ...prev,
                                [s.id]: { ...prev[s.id], [q]: e.target.value }
                              }))}
                            />
                          </td>
                        ))}
                        <td style={{ padding: "10px 14px", textAlign: "right", fontWeight: 700, color: getQTotal(s.id) > 0 ? "var(--primary)" : "var(--text-secondary)" }}>
                          {getQTotal(s.id)}
                        </td>
                      </>
                    )}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 20, paddingTop: 16, borderTop: "1px solid rgba(255,255,255,0.06)" }}>
          <div style={{ fontSize: 12, color: "var(--text-secondary)" }}>{STUDENTS.length} students</div>
          <div style={{ display: "flex", gap: 10 }}>
            <button className="btn-secondary" style={{ padding: "10px 20px", fontSize: 13, gap: 6 }} onClick={saveDraft}>
              <Save size={13} /> Save Draft
            </button>
            <button className="btn-primary" style={{ padding: "10px 20px", fontSize: 13 }} onClick={handleSubmit}>
              ⚡ Submit & Auto-Analyze
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
