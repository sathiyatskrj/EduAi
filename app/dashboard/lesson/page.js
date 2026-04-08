"use client";
import { useState } from "react";

export default function LessonPlanner() {
  const [form, setForm] = useState({ cls: "VII", subject: "Mathematics", lesson: "", topic: "", duration: "40", medium: "English", difficulty: "Standard", instructions: "" });
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [sessionPack, setSessionPack] = useState(true);
  const [planMode, setPlanMode] = useState("forward"); // "forward" | "retro"
  const [retroNotes, setRetroNotes] = useState("");

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const generate = async () => {
    setLoading(true);
    setStep(2);
    try {
      const systemPrompt = `You are EduAI, an expert Indian school teacher assistant. Generate detailed lesson plans in structured format for CBSE/State Board schools. Use markdown with proper headings, tables, and numbered lists. Include all sections: Preliminary Info, Instructional Objectives (SIOs), Previous Knowledge, Teaching Aids, Entry Behaviour, Announcement of Topic, Teaching Steps table (Teaching Point | Learning Experience | Behavioural Objective | Teaching Aid | Evaluation), Blackboard Work, Evaluation Questions, Homework, and Summary.`;
      const prompt = `Generate a complete lesson plan:\n- Class: ${form.cls}\n- Subject: ${form.subject}\n- Lesson/Chapter: ${form.lesson}\n- Topic: ${form.topic}\n- Duration: ${form.duration} minutes\n- Teaching Medium: ${form.medium}\n- Difficulty: ${form.difficulty}\n${form.instructions ? `- Special Instructions: ${form.instructions}` : ""}\n\nProvide a comprehensive, detailed lesson plan in the exact B.Ed notebook format.`;
      
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, systemPrompt }),
      });
      const data = await res.json();
      setResult(data.result || data.error || "Error generating lesson plan.");
    } catch (err) {
      setResult("Error: " + err.message);
    }
    setLoading(false);
  };

  return (
    <div className="animate-fade-in">
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 4 }}>📚 AI Lesson Plan Generator</h1>
        <p style={{ color: "var(--text-secondary)" }}>Generate complete NCERT-aligned lesson plans in 60 seconds.</p>
      </div>
      {/* SCAMPER: Reverse — Mode Selector */}
      <div style={{ display: "flex", gap: 10, background: "var(--bg-card)", padding: 4, borderRadius: 12, marginBottom: 24, maxWidth: 500 }}>
        <button onClick={() => { setPlanMode("forward"); setResult(""); setStep(1); }} style={{
          flex: 1, padding: "10px 16px", borderRadius: 8, fontSize: 14, fontWeight: 600, border: "none", cursor: "pointer",
          background: planMode === "forward" ? "var(--primary)" : "transparent",
          color: planMode === "forward" ? "white" : "var(--text-secondary)", transition: "all 0.2s"
        }}>
          📝 Forward Plan
        </button>
        <button onClick={() => { setPlanMode("retro"); setResult(""); setStep(1); }} style={{
          flex: 1, padding: "10px 16px", borderRadius: 8, fontSize: 14, fontWeight: 600, border: "none", cursor: "pointer",
          background: planMode === "retro" ? "var(--accent)" : "transparent",
          color: planMode === "retro" ? "white" : "var(--text-secondary)", transition: "all 0.2s"
        }}>
          🔄 Retrospective
        </button>
      </div>

      {/* Retrospective Mode */}
      {planMode === "retro" && step === 1 && (
        <div className="card" style={{ maxWidth: 700 }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>🔄 Retrospective Lesson Plan</h2>
          <p style={{ color: "var(--text-secondary)", fontSize: 14, marginBottom: 20 }}>Already taught the class? Record what happened and AI will format it into a proper B.Ed notebook-ready lesson plan.</p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
            <div>
              <label style={{ fontSize: 13, fontWeight: 600, color: "var(--text-secondary)", marginBottom: 6, display: "block" }}>Class</label>
              <select name="cls" value={form.cls} onChange={handleChange} className="input-field">
                {["VI","VII","VIII","IX","X","XI","XII"].map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label style={{ fontSize: 13, fontWeight: 600, color: "var(--text-secondary)", marginBottom: 6, display: "block" }}>Subject</label>
              <select name="subject" value={form.subject} onChange={handleChange} className="input-field">
                {["Mathematics","Science","Social Studies","English","Hindi"].map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>
          <div style={{ marginBottom: 16 }}>
            <label style={{ fontSize: 13, fontWeight: 600, color: "var(--text-secondary)", marginBottom: 6, display: "block" }}>Topic Taught</label>
            <input name="topic" value={form.topic} onChange={handleChange} className="input-field" placeholder="e.g., Addition of Fractions" />
          </div>
          <div style={{ marginBottom: 16 }}>
            <label style={{ fontSize: 13, fontWeight: 600, color: "var(--text-secondary)", marginBottom: 6, display: "block" }}>What Actually Happened? (rough notes)</label>
            <textarea
              value={retroNotes}
              onChange={(e) => setRetroNotes(e.target.value)}
              className="input-field"
              rows={6}
              placeholder="I started with a recap of previous class. Asked Ravi about denominators. Used pizza analogy for fractions. Drew circle diagrams on board. Students struggled with unlike denominators. Gave 5 practice problems. Assigned pg 42 as homework."
            />
          </div>
          <button className="btn-primary" onClick={async () => {
            setLoading(true); setStep(2);
            try {
              const res = await fetch("/api/ai", {
                method: "POST", headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  systemPrompt: "You are EduAI. Convert rough teaching notes into a formal B.Ed lesson plan format with all standard sections: Preliminary Info, SIOs, Previous Knowledge, Teaching Aids, Entry Behaviour, Announcement, Teaching Steps table, Blackboard Work, Evaluation, Homework, Summary.",
                  prompt: `Convert these rough teaching notes into a formal B.Ed lesson plan:\nClass: ${form.cls}\nSubject: ${form.subject}\nTopic: ${form.topic}\n\nTeacher's Notes:\n${retroNotes}`
                }),
              });
              const data = await res.json();
              setResult(data.result || data.error);
            } catch (err) { setResult("Error: " + err.message); }
            setLoading(false);
          }} disabled={!form.topic || !retroNotes} style={{ width: "100%", justifyContent: "center", opacity: !form.topic || !retroNotes ? 0.5 : 1 }}>
            ✨ Convert to Formal Lesson Plan
          </button>
        </div>
      )}

      {/* Forward Planning Mode — Progress Steps */}
      {planMode === "forward" && (
        <div style={{ display: "flex", gap: 12, marginBottom: 32 }}>
          {["Configure", "Generated Plan"].map((s, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ width: 32, height: 32, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 700, background: step > i ? "var(--gradient-1)" : "var(--bg-card)", color: step > i ? "white" : "var(--text-secondary)", border: step > i ? "none" : "1px solid var(--border)" }}>{i + 1}</div>
              <span style={{ fontSize: 14, fontWeight: step === i + 1 ? 600 : 400, color: step === i + 1 ? "var(--text-primary)" : "var(--text-secondary)" }}>{s}</span>
              {i < 1 && <span style={{ color: "var(--text-secondary)", margin: "0 8px" }}>→</span>}
            </div>
          ))}
        </div>
      )}

      {planMode === "forward" && step === 1 && (
        <div className="card" style={{ maxWidth: 700 }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 24 }}>Lesson Configuration</h2>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
            <div>
              <label style={{ fontSize: 13, fontWeight: 600, color: "var(--text-secondary)", marginBottom: 6, display: "block" }}>Class</label>
              <select name="cls" value={form.cls} onChange={handleChange} className="input-field">
                {["VI", "VII", "VIII", "IX", "X", "XI", "XII"].map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label style={{ fontSize: 13, fontWeight: 600, color: "var(--text-secondary)", marginBottom: 6, display: "block" }}>Subject</label>
              <select name="subject" value={form.subject} onChange={handleChange} className="input-field">
                {["Mathematics", "Science", "Social Studies", "English", "Hindi", "Kannada", "Physics", "Chemistry", "Biology"].map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div style={{ gridColumn: "1 / -1" }}>
              <label style={{ fontSize: 13, fontWeight: 600, color: "var(--text-secondary)", marginBottom: 6, display: "block" }}>Lesson / Chapter Name</label>
              <input name="lesson" value={form.lesson} onChange={handleChange} className="input-field" placeholder="e.g., Algebraic Expressions" />
            </div>
            <div style={{ gridColumn: "1 / -1" }}>
              <label style={{ fontSize: 13, fontWeight: 600, color: "var(--text-secondary)", marginBottom: 6, display: "block" }}>Specific Topic</label>
              <input name="topic" value={form.topic} onChange={handleChange} className="input-field" placeholder="e.g., Addition and Subtraction of Algebraic Expressions" />
            </div>
            <div>
              <label style={{ fontSize: 13, fontWeight: 600, color: "var(--text-secondary)", marginBottom: 6, display: "block" }}>Duration (min)</label>
              <select name="duration" value={form.duration} onChange={handleChange} className="input-field">
                {["30", "35", "40", "45"].map(d => <option key={d} value={d}>{d} minutes</option>)}
              </select>
            </div>
            <div>
              <label style={{ fontSize: 13, fontWeight: 600, color: "var(--text-secondary)", marginBottom: 6, display: "block" }}>Teaching Medium</label>
              <select name="medium" value={form.medium} onChange={handleChange} className="input-field">
                {["English", "Hindi", "Kannada", "Tamil"].map(m => <option key={m} value={m}>{m}</option>)}
              </select>
            </div>
            <div style={{ gridColumn: "1 / -1" }}>
              <label style={{ fontSize: 13, fontWeight: 600, color: "var(--text-secondary)", marginBottom: 6, display: "block" }}>Difficulty Level</label>
              <div style={{ display: "flex", gap: 12 }}>
                {["Basic", "Standard", "Advanced"].map(d => (
                  <button key={d} onClick={() => setForm({ ...form, difficulty: d })} style={{ flex: 1, padding: "12px", borderRadius: 10, border: form.difficulty === d ? "2px solid var(--primary)" : "1px solid var(--border)", background: form.difficulty === d ? "rgba(0,150,136,0.1)" : "transparent", color: form.difficulty === d ? "var(--primary)" : "var(--text-secondary)", fontWeight: 600, cursor: "pointer", fontSize: 14 }}>{d}</button>
                ))}
              </div>
            </div>
            <div style={{ gridColumn: "1 / -1" }}>
              <label style={{ fontSize: 13, fontWeight: 600, color: "var(--text-secondary)", marginBottom: 6, display: "block" }}>Special Instructions (optional)</label>
              <textarea name="instructions" value={form.instructions} onChange={handleChange} className="input-field" placeholder="Any custom requirements..." rows={3} />
            </div>
          </div>

          {/* SCAMPER: Combine — Session Pack Toggle */}
          <div style={{ marginTop: 20, padding: 16, background: "rgba(0,150,136,0.06)", borderRadius: 12, border: "1px solid rgba(0,150,136,0.15)", display: "flex", alignItems: "center", gap: 12 }}>
            <input type="checkbox" checked={sessionPack} onChange={() => setSessionPack(!sessionPack)} style={{ width: 18, height: 18, accentColor: "var(--primary)" }} />
            <div>
              <div style={{ fontWeight: 600, fontSize: 14, color: "var(--text-primary)" }}>📦 Generate Complete Session Pack</div>
              <div style={{ fontSize: 12, color: "var(--text-secondary)" }}>Also generates PPT Outline + Activity + Blackboard layout for this topic</div>
            </div>
          </div>

          <button className="btn-primary" onClick={generate} disabled={!form.lesson || !form.topic} style={{ marginTop: 20, width: "100%", justifyContent: "center", opacity: !form.lesson || !form.topic ? 0.5 : 1 }}>
            ✨ {sessionPack ? "Generate Session Pack" : "Generate Lesson Plan"}
          </button>
        </div>
      )}

      {step === 2 && (
        <div>
          <button className="btn-secondary" onClick={() => { setStep(1); setResult(""); }} style={{ marginBottom: 20, padding: "8px 20px", fontSize: 13 }}>← Back to Config</button>
          <div className="card">
            {loading ? (
              <div style={{ padding: 20 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 32 }}>
                  <div className="icon-wrap animate-pulse-glow" style={{ fontSize: 24, width: 48, height: 48 }}>🤖</div>
                  <div>
                    <div style={{ fontSize: 18, fontWeight: 700 }}>AI is drafting your lesson...</div>
                    <div style={{ color: "var(--text-secondary)", fontSize: "var(--text-sm)" }}>Analyzing curriculum & aligning with NCERT standards</div>
                  </div>
                </div>
                
                {/* Skeleton Structure matching actual lesson plan layout */}
                <div style={{ display: "flex", flexDirection: "column", gap: 24, opacity: 0.7 }}>
                  <div>
                    <div className="loading-shimmer" style={{ width: "40%", height: 24, marginBottom: 12, borderRadius: 6 }}></div>
                    <div className="loading-shimmer" style={{ width: "100%", height: 12, marginBottom: 8, borderRadius: 4 }}></div>
                    <div className="loading-shimmer" style={{ width: "85%", height: 12, marginBottom: 8, borderRadius: 4 }}></div>
                  </div>
                  <div>
                    <div className="loading-shimmer" style={{ width: "25%", height: 20, marginBottom: 12, borderRadius: 6 }}></div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
                      <div className="loading-shimmer" style={{ width: "100%", height: 40, borderRadius: 8 }}></div>
                      <div className="loading-shimmer" style={{ width: "100%", height: 40, borderRadius: 8 }}></div>
                      <div className="loading-shimmer" style={{ width: "100%", height: 40, borderRadius: 8 }}></div>
                    </div>
                  </div>
                  <div>
                     <div className="loading-shimmer" style={{ width: "30%", height: 20, marginBottom: 12, borderRadius: 6 }}></div>
                     <div className="loading-shimmer" style={{ width: "100%", height: 80, borderRadius: 8 }}></div>
                  </div>
                </div>
              </div>
            ) : (
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
                  <h2 style={{ fontSize: 18, fontWeight: 700 }}>Generated Lesson Plan</h2>
                  <div style={{ display: "flex", gap: 10 }}>
                    <button className="btn-secondary" style={{ padding: "8px 16px", fontSize: 13 }} onClick={() => navigator.clipboard.writeText(result)}>📋 Copy</button>
                    <button className="btn-primary" style={{ padding: "8px 16px", fontSize: 13 }}>📄 Export PDF</button>
                  </div>
                </div>
                <div className="ai-content" style={{ whiteSpace: "pre-wrap", lineHeight: 1.8 }} dangerouslySetInnerHTML={{ __html: result.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>").replace(/^### (.*$)/gm, "<h3>$1</h3>").replace(/^## (.*$)/gm, "<h2>$1</h2>").replace(/^# (.*$)/gm, "<h1>$1</h1>").replace(/^\- (.*$)/gm, "<li>$1</li>").replace(/\n/g, "<br/>") }} />
              </div>
            )}
          </div>

          {/* SCAMPER: Combine — Session Pack Resources */}
          {sessionPack && !loading && result && (
            <div className="card animate-fade-in" style={{ marginTop: 24 }}>
              <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 20 }}>📦 Session Pack Resources</h2>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 16 }}>
                <div style={{ padding: 20, background: "rgba(15,23,42,0.4)", borderRadius: 12, border: "1px solid var(--border)" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                    <span style={{ fontSize: 24 }}>📊</span>
                    <h3 style={{ fontSize: 15, fontWeight: 700 }}>PPT Outline (8 Slides)</h3>
                  </div>
                  <ol style={{ paddingLeft: 20, color: "var(--text-secondary)", fontSize: 13, lineHeight: 1.8 }}>
                    <li>Title: {form.topic}</li>
                    <li>Learning Objectives</li>
                    <li>Core Concept Explanation</li>
                    <li>Worked Examples</li>
                    <li>Interactive Activity</li>
                    <li>Practice Problems</li>
                    <li>Summary & Key Takeaways</li>
                    <li>Homework Assignment</li>
                  </ol>
                </div>
                <div style={{ padding: 20, background: "rgba(15,23,42,0.4)", borderRadius: 12, border: "1px solid var(--border)" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                    <span style={{ fontSize: 24 }}>🎲</span>
                    <h3 style={{ fontSize: 15, fontWeight: 700 }}>Quick Activity (10 min)</h3>
                  </div>
                  <p style={{ color: "var(--text-secondary)", fontSize: 13, lineHeight: 1.7 }}>
                    <strong>Think-Pair-Share:</strong> Students pair up and solve one problem related to {form.topic}. Each pair explains their approach to the class. No materials needed.
                  </p>
                </div>
                <div style={{ padding: 20, background: "#1a362a", borderRadius: 12, border: "4px solid #3e2723", fontFamily: "monospace" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                    <span style={{ fontSize: 24 }}>🖍️</span>
                    <h3 style={{ fontSize: 15, fontWeight: 700, color: "#e0f2f1" }}>Blackboard Layout</h3>
                  </div>
                  <div style={{ color: "#a7f3d0", fontSize: 12, lineHeight: 1.8 }}>
                    [LEFT] Previous Knowledge<br/>
                    [CENTER] {form.topic.toUpperCase()}<br/>
                    — Formula / Diagram —<br/>
                    [RIGHT] Evaluation Q1-Q3
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
