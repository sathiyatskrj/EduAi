"use client";
import { useState } from "react";
import { exportToCSV, exportToJSON } from "@/app/utils/exports";
import { useApp } from "@/app/components/AppContext";
import { Save, Trash2, Info } from "lucide-react";

export default function Settings() {
  const {
    aiProvider, updateAiProvider,
    ollamaModel, updateOllamaModel,
    theme, updateTheme,
    board, updateBoard,
    language, updateLanguage,
    teacherProfile, updateTeacherProfile,
    showToast, clearAllData,
    localModels, scanLocalModels, isScanning,
  } = useApp();

  const [name, setName] = useState(teacherProfile?.name || "");
  const [school, setSchool] = useState(teacherProfile?.school || "");
  const [subject, setSubject] = useState(teacherProfile?.subject || "Mathematics");
  const [classes, setClasses] = useState(teacherProfile?.classes?.join(", ") || "VII-A");

  const saveProfile = () => {
    updateTeacherProfile({
      name: name.trim(),
      school: school.trim(),
      subject,
      classes: classes.split(",").map(c => c.trim()).filter(Boolean),
    });
    showToast("Profile saved! ✅");
  };

  return (
    <div className="animate-fade-in">
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 4, display: "flex", alignItems: "center", gap: 10 }}>
          <span className="icon-wrap" style={{ fontSize: 20 }}>⚙️</span> Settings
        </h1>
        <p style={{ color: "var(--text-secondary)" }}>Configure your EduAI experience.</p>
      </div>

      <div style={{ maxWidth: 820, display: "flex", flexDirection: "column", gap: 24 }}>

        {/* Teacher Profile */}
        <div className="card">
          <h2 style={{ fontSize: 17, fontWeight: 700, marginBottom: 18 }}>👤 Teacher Profile</h2>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            <div>
              <label style={{ fontSize: 12, fontWeight: 600, color: "var(--text-secondary)", marginBottom: 6, display: "block" }}>Your Name</label>
              <input className="input-field" value={name} onChange={e => setName(e.target.value)} placeholder="e.g., Ms. Sharma" style={{ padding: 10 }} />
            </div>
            <div>
              <label style={{ fontSize: 12, fontWeight: 600, color: "var(--text-secondary)", marginBottom: 6, display: "block" }}>School / Institution</label>
              <input className="input-field" value={school} onChange={e => setSchool(e.target.value)} placeholder="e.g., Delhi Public School" style={{ padding: 10 }} />
            </div>
            <div>
              <label style={{ fontSize: 12, fontWeight: 600, color: "var(--text-secondary)", marginBottom: 6, display: "block" }}>Primary Subject</label>
              <select className="input-field" value={subject} onChange={e => setSubject(e.target.value)} style={{ padding: 10 }}>
                {["Mathematics", "Science", "Social Studies", "English", "Hindi", "Physics", "Chemistry", "Biology"].map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label style={{ fontSize: 12, fontWeight: 600, color: "var(--text-secondary)", marginBottom: 6, display: "block" }}>Classes (comma separated)</label>
              <input className="input-field" value={classes} onChange={e => setClasses(e.target.value)} placeholder="e.g., VII-A, VIII-B" style={{ padding: 10 }} />
            </div>
          </div>
          <button className="btn-primary" style={{ marginTop: 16, padding: "10px 24px", fontSize: 13 }} onClick={saveProfile}>
            <Save size={14} /> Save Profile
          </button>
        </div>

        {/* AI Engine */}
        <div className="card">
          <h2 style={{ fontSize: 17, fontWeight: 700, marginBottom: 18 }}>🤖 AI Engine</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 16 }}>
            {/* Gemini */}
            <div
              style={{
                padding: 18, borderRadius: 12, cursor: "pointer", transition: "all 0.3s",
                border: aiProvider === "gemini" ? "2px solid var(--primary)" : "1px solid rgba(255,255,255,0.08)",
                background: aiProvider === "gemini" ? "rgba(0,150,136,0.08)" : "rgba(255,255,255,0.02)",
              }}
              onClick={() => { updateAiProvider("gemini"); showToast("Gemini 3.1 Flash Lite Activated ☁️"); }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
                <div style={{ fontWeight: 700, fontSize: 15 }}>Gemini 3.1 Flash Lite <span style={{ fontSize: 11, fontWeight: 400, color: "var(--text-secondary)" }}>(Cloud)</span></div>
                {aiProvider === "gemini" && <span style={{ color: "var(--primary)", fontWeight: 700 }}>✓</span>}
              </div>
              <p style={{ fontSize: 12, color: "var(--text-secondary)", margin: 0 }}>Fast cloud generation via Google AI. Requires GEMINI_API_KEY in environment.</p>
            </div>

            {/* Ollama */}
            <div
              style={{
                padding: 18, borderRadius: 12, cursor: "pointer", transition: "all 0.3s",
                border: aiProvider === "ollama" ? "2px solid var(--primary)" : "1px solid rgba(255,255,255,0.08)",
                background: aiProvider === "ollama" ? "rgba(0,150,136,0.08)" : "rgba(255,255,255,0.02)",
              }}
              onClick={() => { updateAiProvider("ollama"); showToast("Offline AI (Ollama/Gemma2) Activated 🟢"); }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
                <div style={{ fontWeight: 700, fontSize: 15 }}>Ollama <span style={{ fontSize: 11, fontWeight: 400, color: "var(--text-secondary)" }}>(Offline)</span></div>
                {aiProvider === "ollama" && <span style={{ color: "var(--primary)", fontWeight: 700 }}>✓</span>}
              </div>
              <p style={{ fontSize: 12, color: "var(--text-secondary)", marginBottom: 14 }}>Run AI locally. Default: Gemma2. No internet needed.</p>
              {aiProvider === "ollama" && (
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }} onClick={e => e.stopPropagation()}>
                  <div style={{ display: "flex", gap: 8 }}>
                    {localModels.length > 0 ? (
                      <select className="input-field" value={ollamaModel} onChange={e => updateOllamaModel(e.target.value)} style={{ flex: 1, padding: "8px 12px", fontSize: 12 }}>
                        {localModels.map(m => <option key={m.name} value={m.name}>{m.name} ({m.size})</option>)}
                      </select>
                    ) : (
                      <input className="input-field" placeholder="e.g. gemma2" value={ollamaModel} onChange={e => updateOllamaModel(e.target.value)} style={{ flex: 1, padding: "8px 12px", fontSize: 12 }} />
                    )}
                    <button className="btn-secondary" onClick={scanLocalModels} disabled={isScanning} style={{ padding: "8px 14px", fontSize: 11 }}>
                      {isScanning ? "..." : "Scan"}
                    </button>
                  </div>
                  {localModels.length === 0 && !isScanning && (
                    <div style={{ fontSize: 10, color: "var(--text-secondary)" }}>
                      Run <span style={{ fontFamily: "monospace", color: "var(--primary)" }}>ollama pull gemma2</span> first.
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Localization */}
        <div className="card">
          <h2 style={{ fontSize: 17, fontWeight: 700, marginBottom: 18 }}>🌍 Localization & Format</h2>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            <div>
              <label style={{ fontSize: 12, fontWeight: 600, color: "var(--text-secondary)", marginBottom: 6, display: "block" }}>Platform Language</label>
              <select className="input-field" value={language} onChange={e => updateLanguage(e.target.value)} style={{ padding: 10 }}>
                <option>English (IN)</option><option>Hindi (हिन्दी)</option><option>Tamil (தமிழ்)</option>
              </select>
            </div>
            <div>
              <label style={{ fontSize: 12, fontWeight: 600, color: "var(--text-secondary)", marginBottom: 6, display: "block" }}>Board Format</label>
              <select className="input-field" value={board} onChange={e => updateBoard(e.target.value)} style={{ padding: 10 }}>
                <option>CBSE (NCERT)</option><option>State Board</option><option>ICSE</option>
              </select>
            </div>
          </div>
        </div>

        {/* Appearance */}
        <div className="card">
          <h2 style={{ fontSize: 17, fontWeight: 700, marginBottom: 18 }}>🎨 Appearance</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))", gap: 12 }}>
            {[
              { id: "ocean", emoji: "🌊", name: "Deep Ocean", sub: "Default", accent: "#009688" },
              { id: "nebula", emoji: "✨", name: "Nebula", sub: "Purple / Pink", accent: "#9333ea" },
              { id: "terra", emoji: "🏜️", name: "Terra", sub: "Earthy / Rust", accent: "#d97706" },
              { id: "midnight", emoji: "🌑", name: "Midnight", sub: "Indigo / Mono", accent: "#6366f1" },
            ].map(t => (
              <div
                key={t.id}
                style={{
                  padding: 14, textAlign: "center", cursor: "pointer", transition: "all 0.3s", borderRadius: 12,
                  border: theme === t.id ? `2px solid ${t.accent}` : "1px solid rgba(255,255,255,0.08)",
                  background: theme === t.id ? `${t.accent}15` : "rgba(255,255,255,0.02)",
                }}
                onClick={() => updateTheme(t.id)}
              >
                <div style={{ fontSize: 26, marginBottom: 6 }}>{t.emoji}</div>
                <div style={{ fontWeight: 600, fontSize: 13, color: theme === t.id ? t.accent : "var(--text-primary)" }}>{t.name}</div>
                <div style={{ fontSize: 10, color: "var(--text-secondary)", marginTop: 3 }}>{t.sub}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Data Management */}
        <div className="card">
          <h2 style={{ fontSize: 17, fontWeight: 700, marginBottom: 18 }}>💾 Data Management</h2>
          <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", padding: 18, borderRadius: 12, marginBottom: 16 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 14 }}>
              <div>
                <div style={{ fontWeight: 600, fontSize: 15, marginBottom: 3 }}>Export Classroom Data</div>
                <div style={{ fontSize: 12, color: "var(--text-secondary)" }}>Download all student records and test scores.</div>
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <button className="btn-secondary" style={{ padding: "8px 14px", fontSize: 12 }} onClick={() => { exportToCSV("classroom-data", [{ name: "Aarav", marks: 85 }, { name: "Avni", marks: 92 }]); showToast("CSV exported"); }}>CSV</button>
                <button className="btn-secondary" style={{ padding: "8px 14px", fontSize: 12 }} onClick={() => { exportToJSON("classroom-data", [{ name: "Aarav", marks: 85 }, { name: "Avni", marks: 92 }]); showToast("JSON exported"); }}>JSON</button>
              </div>
            </div>
          </div>

          {/* Danger Zone */}
          <div style={{ background: "rgba(239,68,68,0.04)", border: "1px solid rgba(239,68,68,0.15)", padding: 18, borderRadius: 12 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 14 }}>
              <div>
                <div style={{ fontWeight: 600, fontSize: 15, marginBottom: 3, color: "var(--danger)" }}>Clear All Local Data</div>
                <div style={{ fontSize: 12, color: "var(--text-secondary)" }}>This will delete all saved preferences, drafts, and profile info.</div>
              </div>
              <button
                className="btn-secondary"
                style={{ padding: "8px 16px", fontSize: 12, color: "var(--danger)", borderColor: "var(--danger)" }}
                onClick={() => { if (window.confirm("Are you sure? This will erase all local data.")) clearAllData(); }}
              >
                <Trash2 size={13} /> Clear All Data
              </button>
            </div>
          </div>
        </div>

        {/* About */}
        <div className="card" style={{ padding: 18 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <Info size={16} color="var(--text-secondary)" />
            <div>
              <div style={{ fontSize: 13, fontWeight: 600 }}>EduAI v2.0</div>
              <div style={{ fontSize: 11, color: "var(--text-secondary)" }}>AI-Powered Classroom Intelligence • Built for B.Ed Interns & Teachers</div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
