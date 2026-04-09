"use client";
import { useState } from "react";
import { exportToPDF } from "@/app/utils/exports";
import { useApp } from "@/app/components/AppContext";
import { consumeStream } from "@/app/utils/ai-stream";
import { parseMarkdown } from "@/app/utils/markdown";
import { Copy, FileText, Printer, RotateCcw, BookOpen, Clock } from "lucide-react";

export default function TestGenerator() {
  const [form, setForm] = useState({ cls: "VIII", subject: "Mathematics", topics: "", totalMarks: "50", sections: "3", bloom: true, easy: 30, medium: 50, hard: 20 });
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [versions, setVersions] = useState([]);
  const { aiProvider, ollamaModel, incrementAiUsage, showToast } = useApp();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const wordCount = result ? result.split(/\s+/).filter(Boolean).length : 0;

  const generate = async () => {
    setLoading(true);
    setResult("");
    incrementAiUsage();
    try {
      const systemPrompt = `You are EduAI, an expert question paper generator for Indian CBSE/State Board exams. Generate complete, print-ready question papers with: school header, general instructions, sections (A/B/C), question numbers with marks in brackets, answer key with solutions, marking scheme, and a blueprint table showing topic vs Bloom's taxonomy distribution.`;
      const prompt = `Generate a complete question paper:\n- Class: ${form.cls}\n- Subject: ${form.subject}\n- Topics: ${form.topics}\n- Total Marks: ${form.totalMarks}\n- Difficulty: Easy ${form.easy}%, Medium ${form.medium}%, Hard ${form.hard}%\n- Number of Sections: ${form.sections}\n- Include Bloom's Taxonomy mapping: ${form.bloom ? "Yes" : "No"}\n\nGenerate: (1) Complete Question Paper (2) Blueprint Table (3) Answer Key with solutions (4) Marking Scheme`;
      const res = await fetch("/api/ai", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ prompt, systemPrompt, provider: aiProvider, model: ollamaModel }) });
      setLoading(false);
      let finalText = "";
      await consumeStream(res, (text) => { setResult(text); finalText = text; }, null, (err) => setResult("Error: " + err));
      if (finalText && !finalText.startsWith("Error")) {
        setVersions(prev => [finalText, ...prev].slice(0, 3));
      }
    } catch (err) { setResult("Error: " + err.message); setLoading(false); }
  };

  const renderAI = (text) => parseMarkdown(text);

  return (
    <div className="animate-fade-in">
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 4, display: "flex", alignItems: "center", gap: 10 }}>
          <span className="icon-wrap" style={{ fontSize: 20 }}>🧪</span> AI Test Paper Generator
        </h1>
        <p style={{ color: "var(--text-secondary)" }}>Create blueprint-based test papers with answer keys in 90 seconds.</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: result ? "360px 1fr" : "1fr", gap: 22 }}>
        <div className="card" style={{ alignSelf: "start" }}>
          <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 18 }}>Test Configuration</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <div>
                <label style={{ fontSize: 11, fontWeight: 600, color: "var(--text-secondary)", marginBottom: 4, display: "block" }}>Class</label>
                <select name="cls" value={form.cls} onChange={handleChange} className="input-field" style={{ padding: 9, fontSize: 13 }}>
                  {["VI","VII","VIII","IX","X","XI","XII"].map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label style={{ fontSize: 11, fontWeight: 600, color: "var(--text-secondary)", marginBottom: 4, display: "block" }}>Total Marks</label>
                <select name="totalMarks" value={form.totalMarks} onChange={handleChange} className="input-field" style={{ padding: 9, fontSize: 13 }}>
                  {["10","20","25","50","100"].map(m => <option key={m}>{m}</option>)}
                </select>
              </div>
            </div>
            <div>
              <label style={{ fontSize: 11, fontWeight: 600, color: "var(--text-secondary)", marginBottom: 4, display: "block" }}>Subject</label>
              <select name="subject" value={form.subject} onChange={handleChange} className="input-field" style={{ padding: 9, fontSize: 13 }}>
                {["Mathematics","Science","Social Studies","English","Hindi","Physics","Chemistry","Biology"].map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label style={{ fontSize: 11, fontWeight: 600, color: "var(--text-secondary)", marginBottom: 4, display: "block" }}>Topics (comma separated)</label>
              <textarea name="topics" value={form.topics} onChange={handleChange} className="input-field" placeholder="e.g., Algebraic Expressions, Linear Equations" rows={2} style={{ padding: 9, fontSize: 13, minHeight: 50 }} />
            </div>
            <div>
              <label style={{ fontSize: 11, fontWeight: 600, color: "var(--text-secondary)", marginBottom: 8, display: "block" }}>Difficulty Split</label>
              <div style={{ display: "flex", gap: 8 }}>
                {[["easy","Easy","#10B981"],["medium","Medium","#F59E0B"],["hard","Hard","#EF4444"]].map(([k,l,c]) => (
                  <div key={k} style={{ flex: 1, textAlign: "center" }}>
                    <div style={{ fontSize: 10, color: c, fontWeight: 600, marginBottom: 4 }}>{l}</div>
                    <input type="number" name={k} value={form[k]} onChange={handleChange} className="input-field" style={{ padding: 7, textAlign: "center", fontSize: 13 }} />
                    <div style={{ fontSize: 9, color: "var(--text-secondary)" }}>%</div>
                    {/* Mini bar */}
                    <div style={{ height: 3, borderRadius: 2, background: "rgba(255,255,255,0.06)", marginTop: 4, overflow: "hidden" }}>
                      <div className="progress-bar-fill" style={{ width: `${form[k]}%`, background: c }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <button className="btn-primary" onClick={generate} disabled={!form.topics || loading} style={{ width: "100%", justifyContent: "center", opacity: !form.topics ? 0.5 : 1 }}>
              {loading ? "⏳ Generating..." : "✨ Generate Test Paper"}
            </button>
          </div>
        </div>

        {(result || loading) && (
          <div className="card animate-fade-in" style={{ minWidth: 0 }}>
            {loading ? (
              <div style={{ textAlign: "center", padding: 50 }}>
                <div className="animate-float" style={{ fontSize: 44, marginBottom: 14 }}>📝</div>
                <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 8 }}>Generating test paper...</div>
                <div className="skeleton" style={{ width: "60%", height: 6, margin: "0 auto" }} />
              </div>
            ) : result ? (
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16, flexWrap: "wrap", gap: 10 }}>
                  <div>
                    <h2 style={{ fontSize: 16, fontWeight: 700 }}>Generated Test Paper</h2>
                    <span style={{ fontSize: 11, color: "var(--text-secondary)" }}><BookOpen size={11} style={{ display: "inline" }} /> {wordCount} words</span>
                  </div>
                  <div className="no-print" style={{ display: "flex", gap: 6 }}>
                    <button className="btn-secondary" style={{ padding: "5px 10px", fontSize: 11 }} onClick={() => { navigator.clipboard.writeText(result); showToast("Copied!"); }}>
                      <Copy size={11} /> Copy
                    </button>
                    <button className="btn-secondary" style={{ padding: "5px 10px", fontSize: 11 }} onClick={() => window.print()}>
                      <Printer size={11} /> Print
                    </button>
                    <button className="btn-primary" style={{ padding: "5px 10px", fontSize: 11 }} onClick={() => exportToPDF("test-paper.pdf", "EduAI Test Paper", result)}>
                      <FileText size={11} /> PDF
                    </button>
                    <button className="btn-secondary" style={{ padding: "5px 10px", fontSize: 11 }} onClick={generate}>
                      <RotateCcw size={11} />
                    </button>
                  </div>
                </div>
                {versions.length > 1 && (
                  <div className="no-print" style={{ display: "flex", gap: 6, marginBottom: 12 }}>
                    {versions.map((v, i) => (
                      <button key={i} onClick={() => setResult(v)} style={{
                        padding: "4px 10px", borderRadius: 6, fontSize: 10, fontWeight: 600, border: "none", cursor: "pointer",
                        background: result === v ? "var(--primary)" : "rgba(255,255,255,0.06)",
                        color: result === v ? "white" : "var(--text-secondary)"
                      }}>v{versions.length - i}</button>
                    ))}
                  </div>
                )}
                <div className={`ai-content ${loading ? "ai-cursor" : ""}`} style={{ whiteSpace: "pre-wrap", lineHeight: 1.8 }} dangerouslySetInnerHTML={{ __html: renderAI(result) }} />
              </div>
            ) : null}
          </div>
        )}
      </div>
    </div>
  );
}
