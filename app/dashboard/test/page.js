"use client";
import { useState } from "react";

export default function TestGenerator() {
  const [form, setForm] = useState({ cls: "VIII", subject: "Mathematics", topics: "", totalMarks: "50", mcq: 20, fill: 10, short: 30, long: 30, problem: 10, easy: 30, medium: 50, hard: 20, sections: "3", bloom: true });
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const generate = async () => {
    setLoading(true);
    try {
      const systemPrompt = `You are EduAI, an expert question paper generator for Indian CBSE/State Board exams. Generate complete, print-ready question papers with: school header, general instructions, sections (A/B/C), question numbers with marks in brackets, answer key with solutions, marking scheme, and a blueprint table showing topic vs Bloom's taxonomy distribution.`;
      const prompt = `Generate a complete question paper:\n- Class: ${form.cls}\n- Subject: ${form.subject}\n- Topics: ${form.topics}\n- Total Marks: ${form.totalMarks}\n- Question Mix: MCQ ${form.mcq}%, Fill-in-blanks ${form.fill}%, Short Answer ${form.short}%, Long Answer ${form.long}%, Problem-solving ${form.problem}%\n- Difficulty: Easy ${form.easy}%, Medium ${form.medium}%, Hard ${form.hard}%\n- Number of Sections: ${form.sections}\n- Include Bloom's Taxonomy mapping: ${form.bloom ? "Yes" : "No"}\n\nGenerate: (1) Complete Question Paper (2) Blueprint Table (3) Answer Key with step-by-step solutions (4) Marking Scheme`;
      
      const res = await fetch("/api/ai", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ prompt, systemPrompt }) });
      const data = await res.json();
      setResult(data.result || data.error);
    } catch (err) { setResult("Error: " + err.message); }
    setLoading(false);
  };

  return (
    <div className="animate-fade-in">
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 4 }}>🧪 AI Test / Question Paper Generator</h1>
        <p style={{ color: "var(--text-secondary)" }}>Create blueprint-based test papers with answer keys in 90 seconds.</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: result ? "380px 1fr" : "1fr", gap: 24 }}>
        <div className="card" style={{ alignSelf: "start" }}>
          <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 20 }}>Test Configuration</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: "var(--text-secondary)", marginBottom: 4, display: "block" }}>Class</label>
                <select name="cls" value={form.cls} onChange={handleChange} className="input-field" style={{ padding: 10, fontSize: 14 }}>
                  {["VI","VII","VIII","IX","X","XI","XII"].map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: "var(--text-secondary)", marginBottom: 4, display: "block" }}>Total Marks</label>
                <select name="totalMarks" value={form.totalMarks} onChange={handleChange} className="input-field" style={{ padding: 10, fontSize: 14 }}>
                  {["10","20","25","50","100"].map(m => <option key={m}>{m}</option>)}
                </select>
              </div>
            </div>
            <div>
              <label style={{ fontSize: 12, fontWeight: 600, color: "var(--text-secondary)", marginBottom: 4, display: "block" }}>Subject</label>
              <select name="subject" value={form.subject} onChange={handleChange} className="input-field" style={{ padding: 10, fontSize: 14 }}>
                {["Mathematics","Science","Social Studies","English","Hindi","Physics","Chemistry","Biology"].map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label style={{ fontSize: 12, fontWeight: 600, color: "var(--text-secondary)", marginBottom: 4, display: "block" }}>Topics (comma separated)</label>
              <textarea name="topics" value={form.topics} onChange={handleChange} className="input-field" placeholder="e.g., Algebraic Expressions, Linear Equations, Triangles" rows={2} style={{ padding: 10, fontSize: 14, minHeight: 60 }} />
            </div>
            <div>
              <label style={{ fontSize: 12, fontWeight: 600, color: "var(--text-secondary)", marginBottom: 8, display: "block" }}>Difficulty Split</label>
              <div style={{ display: "flex", gap: 8 }}>
                {[["easy","Easy","#10B981"],["medium","Medium","#F59E0B"],["hard","Hard","#EF4444"]].map(([k,l,c]) => (
                  <div key={k} style={{ flex: 1, textAlign: "center" }}>
                    <div style={{ fontSize: 11, color: c, fontWeight: 600, marginBottom: 4 }}>{l}</div>
                    <input type="number" name={k} value={form[k]} onChange={handleChange} className="input-field" style={{ padding: 8, textAlign: "center", fontSize: 14 }} />
                    <div style={{ fontSize: 10, color: "var(--text-secondary)" }}>%</div>
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
          <div className="card">
            {loading ? (
              <div style={{ textAlign: "center", padding: 60 }}>
                <div className="animate-float" style={{ fontSize: 48, marginBottom: 16 }}>📝</div>
                <div style={{ fontSize: 18, fontWeight: 600 }}>Generating your test paper...</div>
                <div style={{ color: "var(--text-secondary)", marginTop: 8 }}>Creating questions, blueprint, and answer key</div>
              </div>
            ) : (
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 20 }}>
                  <h2 style={{ fontSize: 16, fontWeight: 700 }}>Generated Test Paper</h2>
                  <div style={{ display: "flex", gap: 8 }}>
                    <button className="btn-secondary" style={{ padding: "6px 14px", fontSize: 12 }} onClick={() => navigator.clipboard.writeText(result)}>📋 Copy</button>
                    <button className="btn-primary" style={{ padding: "6px 14px", fontSize: 12 }}>📄 PDF</button>
                  </div>
                </div>
                <div className="ai-content" style={{ whiteSpace: "pre-wrap", lineHeight: 1.8 }} dangerouslySetInnerHTML={{ __html: result.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>").replace(/^### (.*$)/gm, "<h3>$1</h3>").replace(/^## (.*$)/gm, "<h2>$1</h2>").replace(/^# (.*$)/gm, "<h1>$1</h1>").replace(/\n/g, "<br/>") }} />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
