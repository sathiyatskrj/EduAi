"use client";
import { useState } from "react";
import { exportToPDF } from "@/app/utils/exports";
import { useApp } from "@/app/components/AppContext";
import { consumeStream } from "@/app/utils/ai-stream";
import { parseMarkdown } from "@/app/utils/markdown";
import { Copy, FileText, Printer, RotateCcw, Clock, BookOpen } from "lucide-react";

export default function LessonPlanner() {
  const [form, setForm] = useState({ cls: "VII", subject: "Mathematics", lesson: "", topic: "", duration: "40", medium: "English", difficulty: "Standard", instructions: "" });
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [planMode, setPlanMode] = useState("forward");
  const [retroNotes, setRetroNotes] = useState("");
  const [versions, setVersions] = useState([]);
  const { aiProvider, ollamaModel, incrementAiUsage, showToast } = useApp();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const wordCount = result ? result.split(/\s+/).filter(Boolean).length : 0;
  const readTime = Math.max(1, Math.round(wordCount / 200));

  const generate = async () => {
    setLoading(true);
    setStep(2);
    setResult("");
    incrementAiUsage();
    try {
      const systemPrompt = `You are EduAI, an expert Indian school teacher assistant. Generate detailed lesson plans in structured format for CBSE/State Board schools. Use markdown with proper headings, tables, and numbered lists. Include all sections: Preliminary Info, Instructional Objectives (SIOs), Previous Knowledge, Teaching Aids, Entry Behaviour, Announcement of Topic, Teaching Steps table (Teaching Point | Learning Experience | Behavioural Objective | Teaching Aid | Evaluation), Blackboard Work, Evaluation Questions, Homework, and Summary.`;
      const prompt = `Generate a complete lesson plan:\n- Class: ${form.cls}\n- Subject: ${form.subject}\n- Lesson/Chapter: ${form.lesson}\n- Topic: ${form.topic}\n- Duration: ${form.duration} minutes\n- Teaching Medium: ${form.medium}\n- Difficulty: ${form.difficulty}\n${form.instructions ? `- Special Instructions: ${form.instructions}` : ""}\n\nProvide a comprehensive, detailed lesson plan in the exact B.Ed notebook format.`;
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, systemPrompt, provider: aiProvider, model: ollamaModel }),
      });
      setLoading(false);
      let finalText = "";
      await consumeStream(res, (text) => { setResult(text); finalText = text; }, null, (err) => setResult("Error: " + err));
      if (finalText && !finalText.startsWith("Error")) {
        setVersions(prev => [finalText, ...prev].slice(0, 3));
      }
    } catch (err) {
      setResult("Error: " + err.message);
      setLoading(false);
    }
  };

  const generateRetro = async () => {
    setLoading(true);
    setStep(2);
    setResult("");
    incrementAiUsage();
    try {
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          systemPrompt: "You are EduAI. Convert rough teaching notes into a formal B.Ed lesson plan format with all standard sections.",
          prompt: `Convert the following rough teaching notes into a formal lesson plan for Class ${form.cls}, Subject ${form.subject}, Topic: ${form.topic}:\n\n${retroNotes}`,
          provider: aiProvider,
          model: ollamaModel
        }),
      });
      setLoading(false);
      await consumeStream(res, (text) => setResult(text), null, (err) => setResult("Error: " + err));
    } catch (err) {
      setResult("Error: " + err.message);
      setLoading(false);
    }
  };

  const renderAI = (text) => {
    return parseMarkdown(text);
  };

  return (
    <div className="animate-fade-in">
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 4, display: "flex", alignItems: "center", gap: 10 }}>
          <span className="icon-wrap" style={{ fontSize: 20 }}>📚</span> AI Lesson Plan Generator
        </h1>
        <p style={{ color: "var(--text-secondary)" }}>Generate complete NCERT-aligned lesson plans in 60 seconds.</p>
      </div>

      {/* Mode Tabs */}
      <div style={{ display: "flex", gap: 8, background: "rgba(255,255,255,0.04)", padding: 4, borderRadius: 12, marginBottom: 22, maxWidth: 460 }}>
        {[["forward", "📝 Forward Plan", "var(--primary)"], ["retro", "🔄 Retrospective", "var(--accent)"]].map(([m, label, color]) => (
          <button key={m} onClick={() => { setPlanMode(m); setResult(""); setStep(1); }} style={{
            flex: 1, padding: "10px 14px", borderRadius: 8, fontSize: 13, fontWeight: 600, border: "none", cursor: "pointer",
            background: planMode === m ? color : "transparent",
            color: planMode === m ? "white" : "var(--text-secondary)", transition: "all 0.2s"
          }}>{label}</button>
        ))}
      </div>

      {/* Retrospective Form */}
      {planMode === "retro" && step === 1 && (
        <div className="card animate-scale-in" style={{ maxWidth: 680 }}>
          <h2 style={{ fontSize: 17, fontWeight: 700, marginBottom: 6 }}>🔄 Retrospective Lesson Plan</h2>
          <p style={{ color: "var(--text-secondary)", fontSize: 13, marginBottom: 18 }}>Already taught? Record what happened and AI formats it into B.Ed format.</p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 14 }}>
            <div>
              <label style={{ fontSize: 12, fontWeight: 600, color: "var(--text-secondary)", marginBottom: 6, display: "block" }}>Class</label>
              <select name="cls" value={form.cls} onChange={handleChange} className="input-field" style={{ padding: 10 }}>
                {["VI","VII","VIII","IX","X","XI","XII"].map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label style={{ fontSize: 12, fontWeight: 600, color: "var(--text-secondary)", marginBottom: 6, display: "block" }}>Subject</label>
              <select name="subject" value={form.subject} onChange={handleChange} className="input-field" style={{ padding: 10 }}>
                {["Mathematics","Science","Social Studies","English","Hindi"].map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>
          <div style={{ marginBottom: 14 }}>
            <label style={{ fontSize: 12, fontWeight: 600, color: "var(--text-secondary)", marginBottom: 6, display: "block" }}>Topic Taught</label>
            <input name="topic" value={form.topic} onChange={handleChange} className="input-field" placeholder="e.g., Addition of Fractions" style={{ padding: 10 }} />
          </div>
          <div style={{ marginBottom: 14 }}>
            <label style={{ fontSize: 12, fontWeight: 600, color: "var(--text-secondary)", marginBottom: 6, display: "block" }}>What Actually Happened?</label>
            <textarea value={retroNotes} onChange={e => setRetroNotes(e.target.value)} className="input-field" rows={5} placeholder="Write rough notes about the class..." style={{ padding: 10 }} />
          </div>
          <button className="btn-primary" onClick={generateRetro} disabled={!form.topic || !retroNotes} style={{ width: "100%", justifyContent: "center" }}>
            ✨ Convert to Formal Lesson Plan
          </button>
        </div>
      )}

      {/* Forward Form */}
      {planMode === "forward" && step === 1 && (
        <div className="card animate-scale-in" style={{ maxWidth: 680 }}>
          <h2 style={{ fontSize: 17, fontWeight: 700, marginBottom: 20 }}>Lesson Configuration</h2>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <div>
              <label style={{ fontSize: 12, fontWeight: 600, color: "var(--text-secondary)", marginBottom: 6, display: "block" }}>Class</label>
              <select name="cls" value={form.cls} onChange={handleChange} className="input-field" style={{ padding: 10 }}>
                {["VI","VII","VIII","IX","X","XI","XII"].map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label style={{ fontSize: 12, fontWeight: 600, color: "var(--text-secondary)", marginBottom: 6, display: "block" }}>Subject</label>
              <select name="subject" value={form.subject} onChange={handleChange} className="input-field" style={{ padding: 10 }}>
                {["Mathematics","Science","Social Studies","English","Hindi"].map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div style={{ gridColumn: "1 / -1" }}>
              <label style={{ fontSize: 12, fontWeight: 600, color: "var(--text-secondary)", marginBottom: 6, display: "block" }}>Chapter Name</label>
              <input name="lesson" value={form.lesson} onChange={handleChange} className="input-field" placeholder="e.g., Algebraic Expressions" style={{ padding: 10 }} />
            </div>
            <div style={{ gridColumn: "1 / -1" }}>
              <label style={{ fontSize: 12, fontWeight: 600, color: "var(--text-secondary)", marginBottom: 6, display: "block" }}>Specific Topic</label>
              <input name="topic" value={form.topic} onChange={handleChange} className="input-field" placeholder="e.g., Addition of like terms" style={{ padding: 10 }} />
            </div>
          </div>
          <button className="btn-primary" onClick={generate} disabled={!form.lesson || !form.topic} style={{ marginTop: 18, width: "100%", justifyContent: "center" }}>
            ✨ Generate Lesson Plan
          </button>
        </div>
      )}

      {/* Result */}
      {step === 2 && (
        <div className="animate-fade-in">
          <button className="btn-secondary no-print" onClick={() => { setStep(1); setResult(""); }} style={{ marginBottom: 16, padding: "7px 18px", fontSize: 12 }}>← Back</button>
          <div className="card">
            {loading ? (
              <div style={{ padding: 40, textAlign: "center" }}>
                <div className="animate-pulse-glow" style={{ fontSize: 32, marginBottom: 14 }}>🤖</div>
                <div style={{ fontWeight: 700, marginBottom: 8 }}>AI is drafting your lesson...</div>
                <div className="skeleton" style={{ width: "70%", height: 6, margin: "0 auto", marginTop: 10 }} />
              </div>
            ) : result ? (
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18, flexWrap: "wrap", gap: 10 }}>
                  <div>
                    <h2 style={{ fontSize: 17, fontWeight: 700 }}>Generated Lesson Plan</h2>
                    <div style={{ fontSize: 11, color: "var(--text-secondary)", marginTop: 4, display: "flex", gap: 12 }}>
                      <span><BookOpen size={11} style={{ display: "inline" }} /> {wordCount} words</span>
                      <span><Clock size={11} style={{ display: "inline" }} /> ~{readTime} min read</span>
                    </div>
                  </div>
                  <div className="no-print" style={{ display: "flex", gap: 8 }}>
                    <button className="btn-secondary" style={{ padding: "6px 12px", fontSize: 12 }} onClick={() => { navigator.clipboard.writeText(result); showToast("Copied!"); }}>
                      <Copy size={12} /> Copy
                    </button>
                    <button className="btn-secondary" style={{ padding: "6px 12px", fontSize: 12 }} onClick={() => window.print()}>
                      <Printer size={12} /> Print
                    </button>
                    <button className="btn-primary" style={{ padding: "6px 12px", fontSize: 12 }} onClick={() => exportToPDF("lesson-plan.pdf", "EduAI Lesson Plan", result)}>
                      <FileText size={12} /> PDF
                    </button>
                    <button className="btn-secondary" style={{ padding: "6px 12px", fontSize: 12 }} onClick={generate}>
                      <RotateCcw size={12} /> Regenerate
                    </button>
                  </div>
                </div>

                {/* Version tabs */}
                {versions.length > 1 && (
                  <div className="no-print" style={{ display: "flex", gap: 6, marginBottom: 14 }}>
                    {versions.map((v, i) => (
                      <button key={i} onClick={() => setResult(v)} style={{
                        padding: "5px 12px", borderRadius: 8, fontSize: 11, fontWeight: 600, border: "none", cursor: "pointer",
                        background: result === v ? "var(--primary)" : "rgba(255,255,255,0.06)",
                        color: result === v ? "white" : "var(--text-secondary)"
                      }}>v{versions.length - i}</button>
                    ))}
                  </div>
                )}

                <div className={`ai-content ${loading ? "ai-cursor" : ""}`} style={{ whiteSpace: "pre-wrap", lineHeight: 1.8 }} dangerouslySetInnerHTML={{ __html: renderAI(result) }} />
              </div>
            ) : (
              <div style={{ padding: 40, textAlign: "center", color: "var(--text-secondary)" }}>
                <div className="skeleton" style={{ width: "60%", height: 6, margin: "0 auto" }} />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
