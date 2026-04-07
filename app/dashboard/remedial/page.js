"use client";
import { useState } from "react";

export default function Remedial() {
  const [topic, setTopic] = useState("Multiplying Fractions");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  const generate = async () => {
    setLoading(true);
    try {
      const systemPrompt = `You are EduAI Remedial Engine. Generate remedial content for students who failed to grasp a specific concept. Provide: 1) A simplified real-world analogy to explain it. 2) Step-by-step breakdown. 3) 3 very simple practice questions. 4) A clear visual description for the blackboard.`;
      const prompt = `Generate remedial teaching content for weak students on the topic: ${topic}. Focus on breaking down the concept into the simplest possible form to fix foundational gaps.`;
      
      const res = await fetch("/api/ai", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ prompt, systemPrompt }) });
      const data = await res.json();
      setResult(data.result || data.error);
    } catch (err) { setResult("Error"); }
    setLoading(false);
  };

  return (
    <div className="animate-fade-in">
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 4 }}>💊 Remedial Action Plan</h1>
        <p style={{ color: "var(--text-secondary)" }}>AI-generated simplified content for students needing extra help.</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: result ? "350px 1fr" : "1fr", gap: 24 }}>
        <div className="card" style={{ alignSelf: "start" }}>
          <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 20 }}>Generate Remedial Plan</h2>
          
          <div style={{ background: "rgba(239,68,68,0.05)", border: "1px solid rgba(239,68,68,0.2)", padding: 16, borderRadius: 12, marginBottom: 20 }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: "var(--danger)", marginBottom: 4 }}>AI SUGGESTION</div>
            <div style={{ fontSize: 14, color: "var(--text-primary)" }}>Based on recent test, <strong>Multiplying Fractions</strong> is the weakest topic in VII-A.</div>
          </div>

          <div style={{ marginBottom: 20 }}>
            <label style={{ fontSize: 13, fontWeight: 600, color: "var(--text-secondary)", marginBottom: 6, display: "block" }}>Topic to Simplify</label>
            <input type="text" value={topic} onChange={e => setTopic(e.target.value)} className="input-field" />
          </div>

          <button className="btn-primary" onClick={generate} disabled={loading} style={{ width: "100%", justifyContent: "center" }}>
            {loading ? "⏳ Generating..." : "⚡ Generate Remedial Plan"}
          </button>
        </div>

        {(result || loading) && (
          <div className="card">
            {loading ? (
              <div style={{ textAlign: "center", padding: 60 }}>
                <div className="animate-float" style={{ fontSize: 48, marginBottom: 16 }}>🧠</div>
                <div style={{ fontSize: 18, fontWeight: 600 }}>Simplifying Concept...</div>
                <div style={{ color: "var(--text-secondary)", marginTop: 8 }}>Finding analogies and creating step-by-step breakdowns</div>
              </div>
            ) : (
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 20 }}>
                  <h2 style={{ fontSize: 18, fontWeight: 700 }}>Remedial Material: {topic}</h2>
                  <button className="btn-secondary" style={{ padding: "6px 14px", fontSize: 12 }} onClick={() => navigator.clipboard.writeText(result)}>📋 Copy</button>
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
